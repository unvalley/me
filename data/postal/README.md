Offline dataset for JP address autofill

Files
- `ken_all.sample.json`: Small sample map for a couple of ZIP codes (for demo).
- `ken_all.min.json`: Full dataset generated from Japan Post KEN_ALL (UTF-8).
 - `ken_all_rome.min.json`: Romanized dataset generated from `app/tools/jp-address/KEN_ALL_ROME.tsv`.

Build full dataset
1) Download Japan Post KEN_ALL CSV and convert to UTF-8 as `data/postal/KEN_ALL_UTF8.CSV`.
   - The official CSV is Shift_JIS. Convert with your tool of choice (e.g. iconv, nkf, VS Code).
2) Generate JSON map:
   - `pnpm tsx scripts/build-ken-all.mts`
   - Outputs `data/postal/ken_all.min.json` with a zipcode -> entries map.

Build romanized dataset
- `pnpm run build:rome`
- Outputs `data/postal/ken_all_rome.min.json` with zipcode -> entries map of `{ zipcode, prefecture, city, town }` in uppercase roman letters.

Runtime
- `GET /api/postal?zipcode=XXXXXXX` loads `data/postal/ken_all.min.json` (falls back to the bundled sample file if missing).
- `GET /tools/jp-address/rome?zipcode=XXXXXXX` loads `data/postal/ken_all_rome.min.json`.
- No external APIs are called; both endpoints read local JSON files.
