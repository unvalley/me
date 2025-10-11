use anyhow::{anyhow, Context, Result};
use async_trait::async_trait;
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use reqwest::Client;
use serde_json::Value;
use tracing::{debug, instrument, warn};
use url::Url;

use super::MarketplaceClient;
use crate::model::{Listing, Marketplace, MarketplaceQuery};

const ENDPOINT: &str = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601";
const MAX_PAGE_SIZE: usize = 30;

pub struct RakutenClient {
    http: Client,
    application_id: String,
    affiliate_id: Option<String>,
}

impl RakutenClient {
    pub fn new(http: Client, application_id: String, affiliate_id: Option<String>) -> Self {
        Self {
            http,
            application_id,
            affiliate_id,
        }
    }

    fn build_url(&self, query: &MarketplaceQuery) -> Result<Url> {
        let mut url = Url::parse(ENDPOINT)?;
        let mut pairs = url.query_pairs_mut();
        pairs.append_pair("applicationId", &self.application_id);
        if let Some(affiliate_id) = &self.affiliate_id {
            if !affiliate_id.trim().is_empty() {
                pairs.append_pair("affiliateId", affiliate_id.trim());
            }
        }
        pairs.append_pair("format", "json");
        pairs.append_pair("formatVersion", "2");
        pairs.append_pair("keyword", &query.brand);
        pairs.append_pair("sort", "-updateTimestamp");
        pairs.append_pair("imageFlag", "1");
        if let Some(limit) = query.limit {
            let hits = limit.clamp(1, MAX_PAGE_SIZE);
            pairs.append_pair("hits", &hits.to_string());
        } else {
            pairs.append_pair("hits", &MAX_PAGE_SIZE.to_string());
        }
        // Drop pairs to finalize mutation
        drop(pairs);
        Ok(url)
    }

    fn convert_item(&self, item: &Value) -> Option<(Listing, Option<DateTime<Utc>>)> {
        let id = item.get("itemCode")?.as_str()?.trim().to_owned();
        let title = item
            .get("itemName")
            .and_then(Value::as_str)
            .unwrap_or_default()
            .trim()
            .to_owned();
        if title.is_empty() {
            return None;
        }

        let listing_url = item
            .get("itemUrl")
            .and_then(Value::as_str)
            .map(|s| s.to_owned())
            .unwrap_or_default();

        let image_url = item
            .get("mediumImageUrls")
            .and_then(Value::as_array)
            .and_then(|arr| arr.first())
            .and_then(|entry| {
                if let Some(url) = entry.get("imageUrl") {
                    url.as_str()
                } else {
                    entry.as_str()
                }
            })
            .map(|s| s.to_owned())
            .or_else(|| {
                item.get("smallImageUrls")
                    .and_then(Value::as_array)
                    .and_then(|arr| arr.first())
                    .and_then(|entry| {
                        if let Some(url) = entry.get("imageUrl") {
                            url.as_str()
                        } else {
                            entry.as_str()
                        }
                    })
                    .map(|s| s.to_owned())
            });

        let price_jpy = item.get("itemPrice").and_then(Value::as_i64);

        let currency = Some("JPY".to_string());

        let condition = item
            .get("itemCondition")
            .and_then(Value::as_str)
            .map(|s| s.to_owned());

        let updated_at = item
            .get("updateTimestamp")
            .and_then(Value::as_str)
            .and_then(|s| NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S").ok())
            .map(|naive| Utc.from_utc_datetime(&naive));

        let listing = Listing {
            id,
            title,
            listing_url,
            image_url,
            price_jpy,
            currency,
            condition,
            size: None,
            color: None,
            marketplace: Marketplace::Rakuten,
            scraped_at: Utc::now(),
            raw: Some(item.clone()),
        };

        Some((listing, updated_at))
    }
}

#[async_trait]
impl MarketplaceClient for RakutenClient {
    fn marketplace(&self) -> Marketplace {
        Marketplace::Rakuten
    }

    #[instrument(skip(self, query))]
    async fn fetch(&self, query: &MarketplaceQuery) -> Result<Vec<Listing>> {
        if self.application_id.trim().is_empty() {
            return Err(anyhow!("Rakuten application ID is empty"));
        }

        let url = self.build_url(query)?;
        let res = self
            .http
            .get(url)
            .header(
                reqwest::header::USER_AGENT,
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            )
            .send()
            .await
            .context("failed to request Rakuten API")?;

        let status = res.status();
        if !status.is_success() {
            let body = res.text().await.unwrap_or_default();
            warn!(?status, body, "Rakuten API returned non-success status");
            return Ok(Vec::new());
        }

        let body: Value = res
            .json()
            .await
            .context("failed to parse Rakuten API response")?;
        let mut items: Vec<&Value> = Vec::new();
        if let Some(arr) = body.get("items").and_then(Value::as_array) {
            items.extend(arr);
        } else if let Some(arr) = body.get("Items").and_then(Value::as_array) {
            for wrapper in arr {
                if let Some(item) = wrapper.get("item").or_else(|| wrapper.get("Item")) {
                    items.push(item);
                }
            }
        }

        let mut listings = Vec::new();
        for item in items {
            if let Some((listing, updated_at)) = self.convert_item(item) {
                if let Some(updated_after) = query.updated_after {
                    if let Some(updated_at) = updated_at {
                        if updated_at < updated_after {
                            continue;
                        }
                    }
                }
                listings.push(listing);
            }
        }

        if let Some(limit) = query.limit {
            listings.truncate(limit);
        }

        debug!(count = listings.len(), "Rakuten listings parsed");
        Ok(listings)
    }
}
