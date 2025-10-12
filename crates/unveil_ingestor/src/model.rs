use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Marketplace {
    Mercari,
    YahooFlea,
    Rakuten,
}

impl Marketplace {
    pub fn as_str(&self) -> &'static str {
        match self {
            Marketplace::Mercari => "mercari",
            Marketplace::YahooFlea => "yahoo_flea",
            Marketplace::Rakuten => "rakuten",
        }
    }

    pub fn as_slug(&self) -> &'static str {
        match self {
            Marketplace::Mercari => "mercari",
            Marketplace::YahooFlea => "yahoo-flea-market",
            Marketplace::Rakuten => "rakuten",
        }
    }

    pub fn display_label(&self) -> &'static str {
        match self {
            Marketplace::Mercari => "メルカリ",
            Marketplace::YahooFlea => "ヤフオク! フリマ",
            Marketplace::Rakuten => "楽天市場",
        }
    }

    pub fn from_key(key: &str) -> Option<Self> {
        let normalized = key.trim().to_ascii_lowercase();
        match normalized.as_str() {
            "mercari" => Some(Marketplace::Mercari),
            "yahoo_flea" | "yahoo-flea" | "yahoo-flea-market" | "yahoo" => {
                Some(Marketplace::YahooFlea)
            }
            "rakuten" => Some(Marketplace::Rakuten),
            _ => None,
        }
    }
}

impl std::fmt::Display for Marketplace {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Listing {
    pub id: String,
    pub title: String,
    pub listing_url: String,
    pub image_url: Option<String>,
    pub price_jpy: Option<i64>,
    pub currency: Option<String>,
    pub condition: Option<String>,
    pub size: Option<String>,
    pub color: Option<String>,
    pub marketplace: Marketplace,
    pub scraped_at: DateTime<Utc>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub raw: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Snapshot {
    pub brand: String,
    pub fetched_at: DateTime<Utc>,
    pub listings: Vec<Listing>,
}

#[derive(Debug, Clone)]
pub struct MarketplaceQuery {
    pub brand: String,
    pub updated_after: Option<DateTime<Utc>>,
    pub limit: Option<usize>,
}

impl MarketplaceQuery {
    pub fn new(brand: impl Into<String>) -> Self {
        Self {
            brand: brand.into(),
            updated_after: None,
            limit: None,
        }
    }

    pub fn with_limit(mut self, limit: Option<usize>) -> Self {
        self.limit = limit;
        self
    }

    pub fn with_updated_after(mut self, updated_after: Option<DateTime<Utc>>) -> Self {
        self.updated_after = updated_after;
        self
    }
}
