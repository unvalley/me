import type { Metadata } from "next";
import Script from "next/script";
import Client from "./Client";

export const metadata: Metadata = {
  title: "日本語住所を英語（ローマ字）表記に変換 | 住所 英語・住所 海外 | Tools - unvalley",
  description:
    "日本語の住所を英語（ローマ字）表記に自動変換。丁目・番・号の並び替え、都道府県の英語化、数字の半角化・漢数字の変換、かなローマ字化に対応。海外配送・海外のフォーム入力にも便利。",
  keywords: [
    "住所 英語",
    "日本語 住所 英語",
    "住所 海外",
    "住所 英訳",
    "英語の住所 表記",
    "ローマ字 住所",
    "海外 フォーム 住所",
  ],
  openGraph: {
    title: "日本語住所を英語（ローマ字）表記に変換 | 住所 英語・住所 海外",
    description:
      "日本語の住所を英語（ローマ字）表記に自動変換。丁目・番・号の並び替えや都道府県の英語化に対応。海外配送や海外のフォーム入力に便利。",
    url: "/tools/jp-address",
    type: "website",
  },
  alternates: {
    canonical: "/tools/jp-address",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "住所を英語で書く順番は？",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "英語表記では『部屋番号・建物名, 番地（丁目-番-号）, 町名, 市区町村, 都道府県, 郵便番号, Japan』の順が一般的です。本ツールはこの順に並び替えます。",
        },
      },
      {
        "@type": "Question",
        name: "丁目・番・号は英語でどう書く？",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "『丁目』は『x-chome』として表記し、残りは『番-号』のようにハイフンで繋げます（例：1-chome 2-3）。本ツールは自動で変換・並び替えします。",
        },
      },
      {
        "@type": "Question",
        name: "海外のフォームに住所をどう入力する？",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "City欄に市区町村、State/Province欄に都道府県（Tokyo, Osakaなど）、Address欄に番地・建物名を入力し、Postal Code欄に郵便番号（123-4567）を入力します。",
        },
      },
      {
        "@type": "Question",
        name: "郵便番号はどこに書く？",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "英語表記では都道府県の後か、国名の前に『123-4567』のように表記します。本ツールの結果にも含まれます。",
        },
      },
      {
        "@type": "Question",
        name: "英語とローマ字の違いは？",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "英語表記はTokyoなどの英名を用い、ローマ字表記はShibuya, Jinnanのように日本語の音をAlphabetに写します。本ツールは両方を併記します。",
        },
      },
    ],
  } as const;

  return (
    <>
      <Script
        id="jp-address-faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Client />
      <section className="prose dark:prose-invert mt-10">
        <h2>使い方（住所を英語・海外表記に）</h2>
        <p>
          日本語の住所を入力すると、英語（ローマ字）表記に自動変換し、海外のフォーム入力や配送ラベルに使いやすい順序へ並び替えます。
          『住所 英語』や『住所 海外』でお探しのケースに対応します。
        </p>
        <h3>よくある質問</h3>
        <ul>
          <li>住所を英語で書く順番は？ → 部屋番号・建物名 → 番地 → 町名 → 市区町村 → 都道府県 → 郵便番号 → Japan</li>
          <li>丁目・番・号は？ → 1-chome 2-3 のように表記します</li>
          <li>海外フォームでは？ → Cityに市区町村、State/Provinceに都道府県、Postal Codeに郵便番号</li>
        </ul>
      </section>
    </>
  );
}
