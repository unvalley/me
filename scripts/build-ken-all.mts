#!/usr/bin/env -S node --enable-source-maps
import fs from "node:fs";
import path from "node:path";

// Build a minimal offline dataset from Japan Post KEN_ALL CSV (UTF-8 converted)
// Input (default): data/postal/KEN_ALL_UTF8.CSV
// Output: data/postal/ken_all.min.json (zipcode -> entries)

function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        // Escaped double-quote
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === ',') {
        out.push(cur);
        cur = "";
      } else if (ch === '"') {
        inQuotes = true;
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out;
}

function build(inputPath: string, outputPath: string) {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input CSV not found: ${inputPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(inputPath, "utf8");
  const lines = content.split(/\r?\n/).filter(Boolean);
  const map: Record<string, any[]> = {};
  for (const line of lines) {
    const cols = parseCSVLine(line);
    // KEN_ALL spec (first 9 columns used):
    // 0: 全国地方公共団体コード, 1: 旧郵便番号, 2: 郵便番号, 3: 都道府県名カナ, 4: 市区町村名カナ, 5: 町域名カナ,
    // 6: 都道府県名, 7: 市区町村名, 8: 町域名, ...
    if (cols.length < 9) continue;
    const zipcode = (cols[2] || "").replace(/[^0-9]/g, "");
    if (zipcode.length !== 7) continue;
    const entry = {
      zipcode,
      kana1: cols[3] || "",
      kana2: cols[4] || "",
      kana3: cols[5] || "",
      address1: cols[6] || "",
      address2: cols[7] || "",
      address3: cols[8] || "",
    };
    (map[zipcode] ||= []).push(entry);
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(map));
  console.log(`Wrote ${outputPath} with ${Object.keys(map).length} zipcodes`);
}

const input = process.argv[2] || path.join(process.cwd(), "data", "postal", "KEN_ALL_UTF8.CSV");
const output = process.argv[3] || path.join(process.cwd(), "data", "postal", "ken_all.min.json");
build(input, output);

