use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use serde_json::to_vec_pretty;
use tracing::info;

use crate::model::Snapshot;

pub fn ensure_dir(path: &Path) -> Result<()> {
    if !path.exists() {
        fs::create_dir_all(path).with_context(|| format!("failed to create directory {path:?}"))?;
    }
    Ok(())
}

pub fn write_snapshot(snapshot: &Snapshot, dir: &Path, pretty: bool) -> Result<PathBuf> {
    ensure_dir(dir)?;
    let timestamp = snapshot.fetched_at.format("%Y%m%dT%H%M%SZ");
    let filename = format!("{}-{}.json", snapshot.brand, timestamp);
    let path = dir.join(filename);
    let json = if pretty {
        to_vec_pretty(snapshot)?
    } else {
        serde_json::to_vec(snapshot)?
    };
    fs::write(&path, json).with_context(|| format!("failed to write snapshot to {path:?}"))?;
    info!(?path, "wrote snapshot file");
    Ok(path)
}
