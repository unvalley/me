use std::collections::HashSet;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use serde::Serialize;

use crate::config::DatasetConfig;
use crate::model::{Listing, Marketplace, Snapshot};
use crate::output::ensure_dir;

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StaticDatasetMeta {
    pub slug: String,
    pub brand: String,
    pub updated_at: String,
    pub record_count: usize,
    pub sources: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope_note: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StaticListing {
    pub id: String,
    pub title: String,
    pub marketplace: String,
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price_jpy: Option<i64>,
    pub price_currency: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price_label: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub condition: Option<String>,
    pub sold: bool,
    pub last_seen: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub listed_at: Option<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
}

#[derive(Debug, Serialize, Clone)]
pub struct StaticDataset {
    pub meta: StaticDatasetMeta,
    pub listings: Vec<StaticListing>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StaticManifest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_slug: Option<String>,
    pub datasets: Vec<StaticDatasetMeta>,
}

pub fn build_static_dataset(
    config: &DatasetConfig,
    snapshot: &Snapshot,
    sources_override: Option<Vec<String>>,
) -> StaticDataset {
    let mut listings: Vec<StaticListing> =
        snapshot.listings.iter().map(to_static_listing).collect();
    listings.sort_by(|a, b| b.last_seen.cmp(&a.last_seen));

    let meta = StaticDatasetMeta {
        slug: config.slug.clone(),
        brand: config.brand.clone(),
        updated_at: snapshot.fetched_at.to_rfc3339(),
        record_count: listings.len(),
        sources: sources_override.unwrap_or_else(|| {
            unique_marketplace_labels(snapshot.listings.iter().map(|listing| listing.marketplace))
        }),
        summary: config.summary.clone(),
        scope_note: config.scope_note.clone(),
    };

    StaticDataset { meta, listings }
}

pub fn write_dataset(dataset: &StaticDataset, dir: &Path, pretty: bool) -> Result<PathBuf> {
    ensure_dir(dir)?;
    let path = dir.join(format!("{}.json", dataset.meta.slug));
    let json = if pretty {
        serde_json::to_vec_pretty(dataset)?
    } else {
        serde_json::to_vec(dataset)?
    };
    std::fs::write(&path, json).with_context(|| {
        format!(
            "failed to write dataset for {} to {path:?}",
            dataset.meta.slug
        )
    })?;
    Ok(path)
}

pub fn write_manifest(manifest: &StaticManifest, dir: &Path, pretty: bool) -> Result<PathBuf> {
    ensure_dir(dir)?;
    let path = dir.join("manifest.json");
    let json = if pretty {
        serde_json::to_vec_pretty(manifest)?
    } else {
        serde_json::to_vec(manifest)?
    };
    std::fs::write(&path, json)
        .with_context(|| format!("failed to write dataset manifest to {path:?}"))?;
    Ok(path)
}

fn unique_marketplace_labels<I>(iter: I) -> Vec<String>
where
    I: Iterator<Item = Marketplace>,
{
    let mut seen = HashSet::new();
    let mut labels = Vec::new();
    for marketplace in iter {
        if seen.insert(marketplace) {
            labels.push(marketplace.display_label().to_string());
        }
    }
    labels
}

fn to_static_listing(listing: &Listing) -> StaticListing {
    let marketplace = listing.marketplace.as_slug().to_string();
    let price_currency = listing
        .currency
        .as_deref()
        .unwrap_or("JPY")
        .to_ascii_uppercase();
    let price_label = listing
        .price_jpy
        .map(|value| format_price_label(value, price_currency.as_str()));

    StaticListing {
        id: listing.id.clone(),
        title: listing.title.clone(),
        marketplace,
        url: listing.listing_url.clone(),
        price_jpy: listing.price_jpy,
        price_currency,
        price_label,
        size: listing.size.clone(),
        color: listing.color.clone(),
        condition: listing
            .condition
            .as_ref()
            .and_then(|value| normalize_condition(value)),
        sold: false,
        last_seen: listing.scraped_at.date_naive().to_string(),
        listed_at: None,
        tags: Vec::new(),
        notes: None,
        thumbnail: listing.image_url.clone(),
    }
}

fn format_price_label(value: i64, currency: &str) -> String {
    match currency {
        "JPY" => format!("¥{}", format_number(value)),
        "USD" => format!("US${}", format_number(value)),
        _ => format!("{} {}", currency, format_number(value)),
    }
}

fn format_number(value: i64) -> String {
    let negative = value < 0;
    let mut digits: Vec<char> = value.abs().to_string().chars().collect();
    let mut result = Vec::new();
    while digits.len() > 3 {
        let chunk: Vec<char> = digits.split_off(digits.len() - 3);
        result.insert(0, chunk);
    }
    result.insert(0, digits);
    let formatted: String = result
        .into_iter()
        .map(|chunk| chunk.into_iter().collect::<String>())
        .collect::<Vec<_>>()
        .join(",");
    if negative {
        format!("-{formatted}")
    } else {
        formatted
    }
}

fn normalize_condition(value: &str) -> Option<String> {
    let normalized = value.to_ascii_lowercase();
    if normalized.contains("new") || normalized.contains("新品") {
        Some("new".to_string())
    } else if normalized.contains("like") || normalized.contains("美品") {
        Some("used-like-new".to_string())
    } else if normalized.contains("fair") || normalized.contains("傷") {
        Some("used-fair".to_string())
    } else if normalized.contains("used") || normalized.contains("中古") {
        Some("used-good".to_string())
    } else {
        None
    }
}
