use anyhow::{Context, Result};
use async_trait::async_trait;
use reqwest::Client;
use tracing::{instrument, warn};
use url::Url;

use super::{extract_listings_from_html, MarketplaceClient};
use crate::model::{Listing, Marketplace, MarketplaceQuery};

const DEFAULT_URL_PREFIX: &str = "https://paypayfleamarket.yahoo.co.jp/item/";

pub struct YahooFleaClient {
    http: Client,
}

impl YahooFleaClient {
    pub fn new(http: Client) -> Self {
        Self { http }
    }

    fn build_search_url(&self, query: &MarketplaceQuery) -> Result<Url> {
        let encoded = urlencoding::encode(&query.brand);
        let url = format!(
            "https://paypayfleamarket.yahoo.co.jp/search/{encoded}?sort=START_TIME&order=desc"
        );
        Url::parse(&url).context("invalid Yahoo!フリマ search url")
    }
}

#[async_trait]
impl MarketplaceClient for YahooFleaClient {
    fn marketplace(&self) -> Marketplace {
        Marketplace::YahooFlea
    }

    #[instrument(skip(self, query))]
    async fn fetch(&self, query: &MarketplaceQuery) -> Result<Vec<Listing>> {
        let url = self.build_search_url(query)?;
        let res = self
            .http
            .get(url)
            .header(
                reqwest::header::USER_AGENT,
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            )
            .send()
            .await
            .context("failed to request Yahoo!フリマ search page")?;

        let status = res.status();
        let body = res
            .text()
            .await
            .context("failed to read Yahoo!フリマ response")?;
        if !status.is_success() {
            warn!(?status, "Yahoo!フリマ returned non-success status");
            return Ok(Vec::new());
        }

        let mut listings =
            extract_listings_from_html(self.marketplace(), &body, DEFAULT_URL_PREFIX);
        if let Some(limit) = query.limit {
            listings.truncate(limit);
        }
        Ok(listings)
    }
}
