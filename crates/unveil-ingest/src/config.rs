use std::fs;
use std::path::Path;

use anyhow::{Context, Result};
use serde::Deserialize;

use crate::model::Marketplace;

#[derive(Debug, Deserialize)]
pub struct Manifest {
    #[serde(default)]
    pub default_slug: Option<String>,
    pub datasets: Vec<DatasetConfig>,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DatasetConfig {
    pub slug: String,
    pub brand: String,
    #[serde(default)]
    pub summary: Option<String>,
    #[serde(default)]
    pub scope_note: Option<String>,
    #[serde(default)]
    pub sources: Vec<String>,
    #[serde(default)]
    pub marketplaces: Vec<String>,
    #[serde(default)]
    pub queries: Vec<QueryConfig>,
    #[serde(default)]
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QueryConfig {
    pub term: String,
    #[serde(default)]
    pub marketplaces: Vec<String>,
    #[serde(default)]
    pub limit: Option<usize>,
    #[serde(default)]
    pub updated_after: Option<String>,
}

impl Default for QueryConfig {
    fn default() -> Self {
        Self {
            term: String::new(),
            marketplaces: Vec::new(),
            limit: None,
            updated_after: None,
        }
    }
}

pub fn load_manifest(path: &Path) -> Result<Manifest> {
    let contents =
        fs::read_to_string(path).with_context(|| format!("failed to read manifest at {path:?}"))?;
    let manifest: Manifest =
        serde_json::from_str(&contents).with_context(|| "failed to parse manifest json")?;

    Ok(manifest)
}

pub fn resolve_marketplaces(
    dataset: &DatasetConfig,
    query: &QueryConfig,
) -> Result<Vec<Marketplace>> {
    let key_iter: Box<dyn Iterator<Item = &str>> = if !query.marketplaces.is_empty() {
        Box::new(query.marketplaces.iter().map(|s| s.as_str()))
    } else if !dataset.marketplaces.is_empty() {
        Box::new(dataset.marketplaces.iter().map(|s| s.as_str()))
    } else {
        Box::new(["mercari", "yahoo_flea", "rakuten"].into_iter())
    };

    let mut result = Vec::new();
    for key in key_iter {
        let marketplace = Marketplace::from_key(key).with_context(|| {
            format!(
                "unknown marketplace {key:?} referenced in manifest for {}",
                dataset.slug
            )
        })?;
        if !result.contains(&marketplace) {
            result.push(marketplace);
        }
    }
    Ok(result)
}

pub fn resolve_limit(
    dataset: &DatasetConfig,
    query: &QueryConfig,
    cli_limit: Option<usize>,
) -> Option<usize> {
    query
        .limit
        .or(dataset.limit)
        .or(cli_limit)
        .map(|value| value.clamp(1, 200))
}
