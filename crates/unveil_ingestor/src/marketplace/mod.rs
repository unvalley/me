use anyhow::Result;
use async_trait::async_trait;
use chrono::Utc;
use once_cell::sync::Lazy;
use regex::Regex;
use reqwest::Client;
use scraper::{Html, Selector};
use serde_json::Value;
use tracing::{debug, instrument, warn};

use crate::model::{Listing, Marketplace, MarketplaceQuery};

pub mod mercari;
pub mod rakuten;
pub mod yahoo_flea;

#[async_trait]
pub trait MarketplaceClient: Send + Sync {
    fn marketplace(&self) -> Marketplace;

    async fn fetch(&self, query: &MarketplaceQuery) -> Result<Vec<Listing>>;
}

pub struct Clients {
    pub mercari: mercari::MercariClient,
    pub yahoo_flea: yahoo_flea::YahooFleaClient,
    pub rakuten: rakuten::RakutenClient,
}

impl Clients {
    pub fn new(http: Client, rakuten_app_id: String, rakuten_affiliate_id: Option<String>) -> Self {
        Self {
            mercari: mercari::MercariClient::new(http.clone()),
            yahoo_flea: yahoo_flea::YahooFleaClient::new(http.clone()),
            rakuten: rakuten::RakutenClient::new(http, rakuten_app_id, rakuten_affiliate_id),
        }
    }

    pub fn all(&self) -> Vec<&dyn MarketplaceClient> {
        vec![
            &self.mercari as &dyn MarketplaceClient,
            &self.yahoo_flea as &dyn MarketplaceClient,
            &self.rakuten as &dyn MarketplaceClient,
        ]
    }

    pub fn get(&self, marketplace: Marketplace) -> Option<&dyn MarketplaceClient> {
        match marketplace {
            Marketplace::Mercari => Some(&self.mercari),
            Marketplace::YahooFlea => Some(&self.yahoo_flea),
            Marketplace::Rakuten => Some(&self.rakuten),
        }
    }
}

fn parse_next_data(html: &str) -> Option<Value> {
    let document = Html::parse_document(html);
    if let Ok(selector) = Selector::parse("script#__NEXT_DATA__") {
        if let Some(script) = document.select(&selector).next() {
            let raw = script.inner_html();
            if let Ok(value) = serde_json::from_str::<Value>(&raw) {
                return Some(value);
            }
        }
    }
    None
}

fn parse_nuxt_state(html: &str) -> Option<Value> {
    static NUXT_REGEX: Lazy<Regex> = Lazy::new(|| {
        Regex::new(r"window\.__NUXT__\s*=\s*(\{.*?\})\s*;?").expect("failed to compile nuxt regex")
    });

    NUXT_REGEX
        .captures(html)
        .and_then(|caps| caps.get(1))
        .and_then(|m| serde_json::from_str::<Value>(m.as_str()).ok())
}

fn find_item_candidates<'a>(value: &'a Value) -> Vec<&'a Value> {
    let mut stack = vec![value];
    let mut results = Vec::new();

    while let Some(node) = stack.pop() {
        match node {
            Value::Array(arr) => {
                if arr
                    .iter()
                    .all(|v| v.get("id").is_some() || v.get("itemId").is_some())
                    && !arr.is_empty()
                {
                    results.push(node);
                } else {
                    for child in arr {
                        stack.push(child);
                    }
                }
            }
            Value::Object(map) => {
                for child in map.values() {
                    stack.push(child);
                }
            }
            _ => {}
        }
    }

    results
}

fn value_to_listing(
    marketplace: Marketplace,
    item: &Value,
    default_url_prefix: &str,
) -> Option<Listing> {
    let id = item
        .get("id")
        .and_then(Value::as_str)
        .or_else(|| item.get("itemId").and_then(Value::as_str))
        .or_else(|| item.get("productId").and_then(Value::as_str))?
        .trim()
        .to_owned();

    let title = item
        .get("name")
        .and_then(Value::as_str)
        .or_else(|| item.get("title").and_then(Value::as_str))
        .or_else(|| item.get("productName").and_then(Value::as_str))
        .unwrap_or("")
        .trim()
        .to_owned();

    if title.is_empty() {
        return None;
    }

    let price = item
        .get("price")
        .and_then(Value::as_i64)
        .or_else(|| item.get("itemPrice").and_then(Value::as_i64));

    let currency = item
        .get("currency")
        .and_then(Value::as_str)
        .map(|s| s.to_owned())
        .or_else(|| Some("JPY".to_string()));

    let image_url = item
        .get("thumbnails")
        .and_then(Value::as_array)
        .and_then(|arr| arr.first())
        .and_then(Value::as_str)
        .map(|s| s.to_owned())
        .or_else(|| {
            item.get("imageUrl")
                .and_then(Value::as_str)
                .map(|s| s.to_owned())
        })
        .or_else(|| {
            item.get("photoUrls")
                .and_then(Value::as_array)
                .and_then(|arr| arr.first())
                .and_then(Value::as_str)
                .map(|s| s.to_owned())
        });

    let href = item
        .get("url")
        .and_then(Value::as_str)
        .or_else(|| item.get("itemUrl").and_then(Value::as_str))
        .or_else(|| item.get("pageUrl").and_then(Value::as_str))
        .map(|s| s.to_owned())
        .unwrap_or_else(|| format!("{default_url_prefix}{id}"));

    let condition = item
        .get("condition")
        .and_then(Value::as_str)
        .or_else(|| item.get("status").and_then(Value::as_str))
        .map(|s| s.to_owned());

    let size = item
        .get("size")
        .and_then(Value::as_str)
        .map(|s| s.to_owned());

    let color = item
        .get("color")
        .and_then(Value::as_str)
        .map(|s| s.to_owned());

    Some(Listing {
        id,
        title,
        listing_url: href,
        image_url,
        price_jpy: price,
        currency,
        condition,
        size,
        color,
        marketplace,
        scraped_at: Utc::now(),
        raw: Some(item.clone()),
    })
}

#[instrument(skip(html, marketplace, default_url_prefix))]
pub(crate) fn extract_listings_from_html(
    marketplace: Marketplace,
    html: &str,
    default_url_prefix: &str,
) -> Vec<Listing> {
    if let Some(value) = parse_next_data(html) {
        if let Some(listings) = extract_from_value(marketplace, &value, default_url_prefix) {
            debug!(
                count = listings.len(),
                ?marketplace,
                "extracted listings from __NEXT_DATA__"
            );
            return listings;
        }
    }

    if let Some(value) = parse_nuxt_state(html) {
        if let Some(listings) = extract_from_value(marketplace, &value, default_url_prefix) {
            debug!(
                count = listings.len(),
                ?marketplace,
                "extracted listings from __NUXT__"
            );
            return listings;
        }
    }

    warn!(?marketplace, "failed to find structured data in response");
    Vec::new()
}

fn extract_from_value(
    marketplace: Marketplace,
    value: &Value,
    default_url_prefix: &str,
) -> Option<Vec<Listing>> {
    let candidates = find_item_candidates(value);
    if candidates.is_empty() {
        return None;
    }

    for array_value in candidates {
        if let Value::Array(items) = array_value {
            let mut listings = Vec::new();
            for item in items {
                if let Some(listing) = value_to_listing(marketplace, item, default_url_prefix) {
                    listings.push(listing);
                }
            }
            if !listings.is_empty() {
                return Some(listings);
            }
        }
    }

    None
}
