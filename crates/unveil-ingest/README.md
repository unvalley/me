# Unveil Ingest (Rust)

`unveil-ingest` は Arc'teryx などのブランド名をキーワードに、メルカリ / Yahoo!フリマ / 楽天市場の出品情報を取得し JSON スナップショットまたは Netlify で配信しやすい静的データセットを生成する CLI です。Netlify Functions やバッチ環境から呼び出せるよう、Rust + `reqwest` + async で実装しています。

## 使い方（単一ブランドのスナップショット）

```bash
# 実行ビルド
export RAKUTEN_APP_ID="xxxxxxxxxxxxxxxxxxxxxxxx"
cargo run -p unveil-ingest -- \
  --brand "Arc'teryx" \
  --limit 120 \
  --snapshot-dir data/unveil/snapshots \
  --pretty
```

オプション:

- `--brand`: 検索キーワード (デフォルト `arcteryx`)
- `--limit`: マーケットプレイスごとの最大取得件数
- `--updated-after`: `2025-10-05T04:00:00Z` のような ISO8601 文字列。提供されるとクライアント側でフィルタ
- `--snapshot-dir`: 時刻付きファイル名で JSON を保存するディレクトリ
- `--output`: 明示的なファイル出力先 (snapshot-dir より優先)
- `--stdout`: ファイルを書かず標準出力のみ
- `--insecure`: 社内プロキシなどで TLS チェックを無効化する場合
- `--request-timeout-secs`: マーケットプレイスごとの取得タイムアウト (デフォルト 30 秒)
- `--rakuten-app-id`: 楽天市場APIのアプリID。省略時は `RAKUTEN_APP_ID` 環境変数を参照
- `--rakuten-affiliate-id`: （任意）楽天アフィリエイトID。省略時は `RAKUTEN_AFFILIATE_ID`

## マニフェスト駆動で静的データを生成する

複数ブランド／複数クエリをまとめて実行し、`public/unveil/<slug>.json` に Netlify からそのまま配信できるデータを出力するモードを追加しました。

```bash
export RAKUTEN_APP_ID="xxxxxxxxxxxxxxxxxxxxxxxx"
cargo run -p unveil-ingest -- \
  --manifest crates/unveil-ingest/manifest.example.json \
  --static-dir public/unveil \
  --limit 120 \
  --pretty
```

`manifest.example.json` のフォーマット:

```jsonc
{
  "defaultSlug": "arcteryx",
  "datasets": [
    {
      "slug": "arcteryx",
      "brand": "Arc'teryx",
      "summary": "Arc'teryx の二次流通品ログ",
      "marketplaces": ["mercari", "yahoo_flea", "rakuten"],
      "sources": ["メルカリ", "ヤフオク! フリマ", "楽天市場"],
      "queries": [
        { "term": "Arc'teryx", "limit": 120 },
        { "term": "Arc'teryx Veilance", "marketplaces": ["mercari"], "updatedAfter": "2025-09-01T00:00:00Z" }
      ]
    }
  ]
}
```

- `marketplaces` / `queries[*].marketplaces` は `mercari` / `yahoo_flea` / `rakuten` を指定可能。省略時は全マーケットプレイスを走査します。
- `queries` を省略すると `brand` をキーワードに 1 クエリのみ実行します。
- `--static-dir` で指定したディレクトリには `<slug>.json` と `manifest.json` が出力され、Next.js 側はファイルを直接読み込むだけで利用できます。

## 実装メモ

- それぞれのマーケットプレイスに対して `MarketplaceClient` トレイトを実装。メルカリ／Yahoo!フリマは HTML 内の `__NEXT_DATA__` / `__NUXT__` を解析、楽天ラクマは [楽天市場商品の検索API](https://webservice.rakuten.co.jp/documentation/ichiba-item-search) を利用しています。
- HTML 内に埋め込まれる `__NEXT_DATA__` / `__NUXT__` の JSON を解析し、`Listing` 構造体へマッピングします。
- 取得した Listing は重複排除済 (`id` + marketplace)。

## Netlify 連携

1. `netlify.toml` でスケジュール関数を定義し、Netlify Functions から `command = "cargo run -p unveil-ingest -- --snapshot-dir ..."` を呼び出す。
2. Functions から Rust CLI を呼ぶ場合、ビルドフックで `cargo build --release -p unveil-ingest` を走らせ、生成したバイナリを `netlify/functions` ディレクトリへ配置するか、[Netlify scheduled function + background functions](https://docs.netlify.com/functions/overview/) 内で `Child::spawn` する。
3. 静的サイトとして配信する場合は、上記マニフェストモードで `public/unveil` を定期的に更新し、Netlify のビルド & デプロイで反映させるのがおすすめです。従来通り時刻付きスナップショットを残したい場合は `--snapshot-dir` も併用できます。

## 今後の拡張

- 各マーケットプレイス特有の API が判明次第、HTML 解析ではなく JSON API へ差し替え。
- 取得結果を S3 / Supabase などにアップロードするバックエンドを追加。
- `brand` ごとにクエリパラメータを調整できる YAML/JSON 設定ファイル対応。

> ⚠️ 注意: 商用サイトのスクレイピングは利用規約を確認のうえ自己責任で実行してください。アクセス頻度の制御 (`tokio::time::sleep`) や `robots.txt` の遵守を推奨します。
