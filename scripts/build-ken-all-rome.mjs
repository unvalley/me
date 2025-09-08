#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

// Build a minimal offline dataset from Japan Post ROMANIZED TSV
// Input (default): app/tools/jp-address/KEN_ALL_ROME.tsv
// Output: data/postal/ken_all_rome.min.json (zipcode -> entries)

function to7(zip) {
  const z = String(zip || "").replace(/[^0-9]/g, "");
  if (z.length === 7) return z;
  if (z.length === 6) return `0${z}`; // dataset may drop leading zero
  return null;
}

function build(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input TSV not found: ${inputPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(inputPath, "utf8");
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  const map = Object.create(null);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (i === 0 && line.toLowerCase().startsWith("postcode")) continue; // header
    const cols = line.split("\t");
    if (cols.length < 4) continue;
    const zip = to7(cols[0]);
    if (!zip) continue;
    const row = {
      zipcode: zip,
      prefecture: (cols[1] || "").trim(),
      city: (cols[2] || "").trim(),
      town: (cols[3] || "").trim(),
    };
    if (!map[zip]) map[zip] = [];
    map[zip].push(row);
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(map));
  console.log(`Wrote ${outputPath} with ${Object.keys(map).length} zipcodes`);
}

const input = process.argv[2] || path.join(process.cwd(), "app", "tools", "jp-address", "KEN_ALL_ROME.tsv");
const output = process.argv[3] || path.join(process.cwd(), "data", "postal", "ken_all_rome.min.json");
build(input, output);

