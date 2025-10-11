mod config;
mod marketplace;
mod model;
mod output;
mod static_dataset;

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::time::Duration;

use anyhow::{anyhow, Context, Result};
use clap::Parser;
use marketplace::Clients;
use model::{MarketplaceQuery, Snapshot};
use output::write_snapshot;
use reqwest::Client;
use tokio::signal;
use tracing::{error, info, warn};
use tracing_subscriber::EnvFilter;

use crate::config::{DatasetConfig, QueryConfig};
use crate::static_dataset::{build_static_dataset, write_dataset, write_manifest, StaticManifest};

#[derive(Debug, Parser)]
#[command(author, version, about = "Arc'teryx resale listings ingester", long_about = None)]
struct Cli {
    /// Brand keyword to search for (default: arcteryx)
    #[arg(long, default_value = "arcteryx")]
    brand: String,

    /// Maximum number of listings to retain per marketplace
    #[arg(long)]
    limit: Option<usize>,

    /// Only return listings updated after this ISO 8601 timestamp
    #[arg(long)]
    updated_after: Option<String>,

    /// Directory to write timestamped snapshots (e.g. data/unveil/snapshots)
    #[arg(long)]
    snapshot_dir: Option<PathBuf>,

    /// Explicit output file path (overrides snapshot_dir)
    #[arg(long)]
    output: Option<PathBuf>,

    /// Pretty print JSON when writing to stdout or files
    #[arg(long, default_value_t = true)]
    pretty: bool,

    /// Only print to stdout rather than writing files
    #[arg(long, default_value_t = false)]
    stdout: bool,

    /// Allow insecure TLS certificates (useful for debugging via mitmproxy)
    #[arg(long, default_value_t = false)]
    insecure: bool,

    /// Path to dataset manifest for batch exports
    #[arg(long)]
    manifest: Option<PathBuf>,

    /// Directory to write static dataset JSON files (required for manifest mode)
    #[arg(long)]
    static_dir: Option<PathBuf>,

    /// Timeout in seconds for each marketplace request
    #[arg(long, default_value_t = 30)]
    request_timeout_secs: u64,

    /// Rakuten Ichiba API application ID (env: RAKUTEN_APP_ID)
    #[arg(long)]
    rakuten_app_id: Option<String>,

    /// Rakuten affiliate ID (optional, env: RAKUTEN_AFFILIATE_ID)
    #[arg(long)]
    rakuten_affiliate_id: Option<String>,
}

#[tokio::main]
async fn main() -> Result<()> {
    init_tracing();
    let cli = Cli::parse();

    let updated_after = cli
        .updated_after
        .as_deref()
        .map(parse_datetime)
        .transpose()
        .context("failed to parse --updated-after timestamp")?;

    let http = build_http_client(cli.insecure)?;

    let rakuten_app_id = cli
        .rakuten_app_id
        .clone()
        .or_else(|| std::env::var("RAKUTEN_APP_ID").ok())
        .context(
            "Rakuten application ID is required. Provide --rakuten-app-id or set RAKUTEN_APP_ID",
        )?;
    let rakuten_affiliate_id = cli
        .rakuten_affiliate_id
        .clone()
        .or_else(|| std::env::var("RAKUTEN_AFFILIATE_ID").ok());

    let clients = Clients::new(http, rakuten_app_id, rakuten_affiliate_id);
    let timeout = Duration::from_secs(cli.request_timeout_secs.max(1));

    if let Some(manifest_path) = cli.manifest.as_ref() {
        run_manifest_mode(manifest_path, &cli, &clients, updated_after, timeout).await?;
        return Ok(());
    }

    let query = MarketplaceQuery::new(cli.brand.clone())
        .with_limit(cli.limit)
        .with_updated_after(updated_after);

    info!(brand = %cli.brand, "starting ingestion run");

    let mut all_listings = Vec::new();
    for client in clients.all() {
        match client.fetch(&query).await {
            Ok(mut listings) => {
                info!(marketplace = %client.marketplace(), count = listings.len(), "fetched listings");
                all_listings.append(&mut listings);
            }
            Err(err) => {
                error!(marketplace = %client.marketplace(), error = ?err, "failed to fetch listings");
            }
        }
    }

    dedupe_in_place(&mut all_listings);

    let snapshot = Snapshot {
        brand: cli.brand.clone(),
        fetched_at: chrono::Utc::now(),
        listings: all_listings,
    };

    if snapshot.listings.is_empty() {
        warn!("no listings collected");
    }

    if cli.stdout || (cli.output.is_none() && cli.snapshot_dir.is_none()) {
        if cli.pretty {
            println!("{}", serde_json::to_string_pretty(&snapshot)?);
        } else {
            println!("{}", serde_json::to_string(&snapshot)?);
        }
    }

    if let Some(path) = cli.output.as_ref() {
        let json = if cli.pretty {
            serde_json::to_vec_pretty(&snapshot)?
        } else {
            serde_json::to_vec(&snapshot)?
        };
        std::fs::write(path, json)
            .with_context(|| format!("failed to write output to {path:?}"))?;
        info!(?path, "snapshot written");
    } else if let Some(dir) = cli.snapshot_dir.as_ref() {
        let file = write_snapshot(&snapshot, dir, cli.pretty)?;
        info!(?file, "snapshot saved");
    }

    if let Ok(()) = signal::ctrl_c().await {
        info!("received ctrl_c, shutting down");
    }

    Ok(())
}

async fn run_manifest_mode(
    manifest_path: &Path,
    cli: &Cli,
    clients: &Clients,
    cli_updated_after: Option<chrono::DateTime<chrono::Utc>>,
    timeout: Duration,
) -> Result<()> {
    let manifest = config::load_manifest(manifest_path)?;
    let static_dir = cli
        .static_dir
        .as_ref()
        .cloned()
        .context("manifest mode requires --static-dir to be specified")?;

    info!(
        path = ?manifest_path,
        dir = ?static_dir,
        "starting manifest export run"
    );

    let mut exported_meta = Vec::new();
    for dataset in &manifest.datasets {
        let snapshot =
            run_dataset_from_config(dataset, clients, cli.limit, cli_updated_after, timeout)
                .await?;
        let static_dataset = build_static_dataset(
            dataset,
            &snapshot,
            if dataset.sources.is_empty() {
                None
            } else {
                Some(dataset.sources.clone())
            },
        );
        let path = write_dataset(&static_dataset, static_dir.as_path(), cli.pretty)?;
        info!(
            slug = %dataset.slug,
            brand = %dataset.brand,
            count = static_dataset.listings.len(),
            ?path,
            "dataset written"
        );
        exported_meta.push(static_dataset.meta.clone());
    }

    let manifest_output = StaticManifest {
        default_slug: manifest.default_slug.clone().or_else(|| {
            manifest
                .datasets
                .first()
                .map(|dataset| dataset.slug.clone())
        }),
        datasets: exported_meta,
    };
    let manifest_path = write_manifest(&manifest_output, static_dir.as_path(), cli.pretty)?;
    info!(?manifest_path, "dataset manifest written");

    Ok(())
}

async fn run_dataset_from_config(
    dataset: &DatasetConfig,
    clients: &Clients,
    cli_limit: Option<usize>,
    cli_updated_after: Option<chrono::DateTime<chrono::Utc>>,
    timeout: Duration,
) -> Result<Snapshot> {
    let queries = if dataset.queries.is_empty() {
        vec![QueryConfig {
            term: dataset.brand.clone(),
            ..QueryConfig::default()
        }]
    } else {
        dataset.queries.clone()
    };

    let mut all_listings = Vec::new();
    for query in &queries {
        let limit = config::resolve_limit(dataset, query, cli_limit);
        let updated_after = match query.updated_after.as_deref() {
            Some(value) => Some(parse_datetime(value).with_context(|| {
                format!(
                    "failed to parse updated_after {:?} for dataset {}",
                    value, dataset.slug
                )
            })?),
            None => cli_updated_after,
        };
        let marketplace_query = MarketplaceQuery::new(query.term.clone())
            .with_limit(limit)
            .with_updated_after(updated_after);

        let marketplaces = config::resolve_marketplaces(dataset, query)?;
        for marketplace in marketplaces {
            let Some(client) = clients.get(marketplace) else {
                warn!(
                    slug = %dataset.slug,
                    marketplace = %marketplace.as_str(),
                    "no client configured for marketplace; skipping"
                );
                continue;
            };

            match fetch_with_timeout(client, &marketplace_query, timeout).await {
                Ok(mut listings) => {
                    info!(
                        slug = %dataset.slug,
                        query = %query.term,
                        marketplace = %marketplace.as_str(),
                        count = listings.len(),
                        "fetched listings"
                    );
                    all_listings.append(&mut listings);
                }
                Err(err) => {
                    warn!(
                        slug = %dataset.slug,
                        query = %query.term,
                        marketplace = %marketplace.as_str(),
                        error = ?err,
                        "failed to fetch listings"
                    );
                }
            }
        }
    }

    dedupe_in_place(&mut all_listings);

    let snapshot = Snapshot {
        brand: dataset.brand.clone(),
        fetched_at: chrono::Utc::now(),
        listings: all_listings,
    };

    if snapshot.listings.is_empty() {
        warn!(slug = %dataset.slug, "dataset produced zero listings");
    }

    Ok(snapshot)
}

async fn fetch_with_timeout(
    client: &dyn marketplace::MarketplaceClient,
    query: &MarketplaceQuery,
    timeout: Duration,
) -> Result<Vec<model::Listing>> {
    match tokio::time::timeout(timeout, client.fetch(query)).await {
        Ok(result) => result,
        Err(_) => Err(anyhow!("request timed out after {:?}", timeout)),
    }
}

fn init_tracing() {
    let filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    tracing_subscriber::fmt().with_env_filter(filter).init();
}

fn parse_datetime(input: &str) -> Result<chrono::DateTime<chrono::Utc>> {
    let dt = chrono::DateTime::parse_from_rfc3339(input)?;
    Ok(dt.with_timezone(&chrono::Utc))
}

fn build_http_client(insecure: bool) -> Result<Client> {
    let mut builder = Client::builder().user_agent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    );
    if insecure {
        builder = builder.danger_accept_invalid_certs(true);
    }
    builder.build().context("failed to construct HTTP client")
}

fn dedupe_in_place(listings: &mut Vec<model::Listing>) {
    let mut seen = HashMap::new();
    listings.retain(|listing| match seen.get(&listing.id) {
        Some(existing_marketplace) if existing_marketplace == &listing.marketplace => false,
        _ => {
            seen.insert(listing.id.clone(), listing.marketplace);
            true
        }
    });
}
