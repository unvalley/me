"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/* ===================== Types ===================== */

type ParsedAddress = {
  postal?: string;
  prefectureKanji?: string;
  prefectureEn?: string;
  municipality?: string;
  area?: string;
  chome?: number;
  ban?: number;
  go?: number;
  building?: string;
};

type ZipRome = {
  zipcode: string; // "1000001"
  prefecture: string; // "TOKYO" | "AKITA KEN" ...
  city: string; // "CHIYODA" | "OGACHI GUN ..." ...
  town?: string | null; // "CHIYODA" | "IKANIKEISAIGANAIBAAI" | null
};

type ZipRomeMapFile = Record<string, ZipRome[]>;

/* ===================== Const ===================== */

const PREF_MAP: Record<string, string> = {
  北海道: "Hokkaido",
  青森県: "Aomori",
  岩手県: "Iwate",
  宮城県: "Miyagi",
  秋田県: "Akita",
  山形県: "Yamagata",
  福島県: "Fukushima",
  茨城県: "Ibaraki",
  栃木県: "Tochigi",
  群馬県: "Gunma",
  埼玉県: "Saitama",
  千葉県: "Chiba",
  東京都: "Tokyo",
  神奈川県: "Kanagawa",
  新潟県: "Niigata",
  富山県: "Toyama",
  石川県: "Ishikawa",
  福井県: "Fukui",
  山梨県: "Yamanashi",
  長野県: "Nagano",
  岐阜県: "Gifu",
  静岡県: "Shizuoka",
  愛知県: "Aichi",
  三重県: "Mie",
  滋賀県: "Shiga",
  京都府: "Kyoto",
  大阪府: "Osaka",
  兵庫県: "Hyogo",
  奈良県: "Nara",
  和歌山県: "Wakayama",
  鳥取県: "Tottori",
  島根県: "Shimane",
  岡山県: "Okayama",
  広島県: "Hiroshima",
  山口県: "Yamaguchi",
  徳島県: "Tokushima",
  香川県: "Kagawa",
  愛媛県: "Ehime",
  高知県: "Kochi",
  福岡県: "Fukuoka",
  佐賀県: "Saga",
  長崎県: "Nagasaki",
  熊本県: "Kumamoto",
  大分県: "Oita",
  宮崎県: "Miyazaki",
  鹿児島県: "Kagoshima",
  沖縄県: "Okinawa",
};

const FW_NUM = "０１２３４５６７８９";
const HW_NUM = "0123456789";
const HAS_HAN = /\p{Script=Han}/u;

/* ===================== Zip Index (lazy, map->pick best) ===================== */

const selectBestRome = (
  arr: ZipRome[] | undefined | null
): ZipRome | undefined => {
  if (!arr || arr.length === 0) return undefined;
  const nonIk = arr.find((e) => e.town && e.town !== "IKANIKEISAIGANAIBAAI");
  return nonIk ?? arr[0];
};

let ZIP_INDEX: Record<string, ZipRome> | null = null;

const loadZipIndex = async (): Promise<Record<string, ZipRome>> => {
  if (ZIP_INDEX) return ZIP_INDEX;
  const data = (await import("../../../data/postal/ken_all_rome.min.json"))
    .default as unknown as ZipRomeMapFile;

  const index: Record<string, ZipRome> = Object.create(null);
  for (const [zip, list] of Object.entries(data)) {
    const best = selectBestRome(list);
    if (best) index[zip.replace(/\D/g, "")] = best;
  }
  ZIP_INDEX = index;
  return ZIP_INDEX;
};

const PREF_EN_TO_KANJI: Record<string, string> = Object.fromEntries(
  Object.entries(PREF_MAP).map(([kan, en]) => [en.toLowerCase(), kan])
);

const asZip7 = (v?: string) => (v ? v.replace(/\D/g, "") : "");

/* ===================== Utils ===================== */

const toHalfWidthDigits = (input: string): string =>
  input.replace(/[０-９]/g, (s) => HW_NUM.charAt(FW_NUM.indexOf(s)));

const KANJI_DIGITS: Record<string, number> = {
  〇: 0,
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};
const UNITS: Record<string, number> = { 十: 10, 百: 100, 千: 1000 };

const kanjiToNumber = (kan: string): number | undefined => {
  if (!kan) return undefined;
  if (/^[0-9]+$/.test(kan)) return Number(kan);
  let total = 0;
  let current = 0;
  for (const ch of kan) {
    if (ch in KANJI_DIGITS) {
      current = (current || 0) + KANJI_DIGITS[ch];
    } else if (ch in UNITS) {
      const unit = UNITS[ch];
      if (current === 0) current = 1;
      total += current * unit;
      current = 0;
    } else {
      return undefined;
    }
  }
  return total + current;
};

const kanaMap: Record<string, string> = {
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  わ: "wa",
  を: "o",
  ん: "n",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  ぁ: "a",
  ぃ: "i",
  ぅ: "u",
  ぇ: "e",
  ぉ: "o",
  ゃ: "ya",
  ゅ: "yu",
  ょ: "yo",
  っ: "",
  "・": " ",
  ー: "-",
};
for (const [k, v] of Object.entries(kanaMap)) {
  const kata = k.replace(/[ぁ-ん]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  );
  kanaMap[kata] = v;
}

const digraphs: Record<string, string> = {
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
};
for (const [k, v] of Object.entries(digraphs)) {
  const kata = k.replace(/[ぁ-ん]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) + 0x60)
  );
  digraphs[kata] = v;
}

const kanaToRomaji = (input: string): string => {
  if (!input) return "";
  input = input.normalize("NFKC");
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const a = input[i];
    const b = input[i + 1] ?? "";
    const pair = a + b;
    if (pair in digraphs) {
      out += digraphs[pair];
      i++;
      continue;
    }
    if (a === "っ" || a === "ッ") {
      const next = input[i + 1] ?? "";
      const base = kanaMap[next] ?? "";
      out += base.charAt(0);
      continue;
    }
    if (a === "ー") {
      const m = out.match(/[aiueo]$/);
      if (m) out += m[0];
      continue;
    }
    if (a in kanaMap) {
      out += kanaMap[a];
    } else {
      out += a;
    }
  }
  out = out.replace(/n([bmp])/g, "m$1");
  out = out.replace(/-+/g, "-");
  return out;
};

const municipalityToRomaji = (muni?: string): string => {
  if (!muni) return "";
  let s = muni.normalize("NFKC");
  s = s
    .replace(/(市|シ)$/u, "-shi")
    .replace(/(区|ク)$/u, "-ku")
    .replace(/(郡|グン)$/u, "-gun")
    .replace(/(町|チョウ|ﾁｮｳ|マチ|ﾏﾁ)$/u, "-cho")
    .replace(/(村|ムラ)$/u, "-mura");
  return kanaToRomaji(s);
};

const areaToRomaji = (area?: string): string => {
  if (!area) return "";
  return kanaToRomaji(area);
};

const properCase = (s: string): string =>
  s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(No|Of|And|To|In|On|At|By|For|Or)\b/g, (m) => m.toLowerCase());

const normalizePrefEn = (s?: string): string | undefined => {
  if (!s) return undefined;
  const up = s.trim();
  const cleaned = up.replace(/\s+(TO|FU|KEN)$/i, "");
  return properCase(cleaned);
};

const normalizeCityEn = (s?: string): string | undefined => {
  if (!s) return undefined;
  const parts = s.trim().split(/\s+/);
  const mapped = parts
    .map((w) => w.toUpperCase())
    .map((w) =>
      w === "SHI"
        ? "-shi"
        : w === "KU"
        ? "-ku"
        : w === "GUN"
        ? "-gun"
        : w === "CHO" || w === "MACHI"
        ? "-cho"
        : w === "MURA"
        ? "-mura"
        : properCase(w)
    );
  const out: string[] = [];
  for (const w of mapped) {
    if (w.startsWith("-")) {
      const prev = out.pop() ?? "";
      out.push(prev + w);
    } else {
      out.push(w);
    }
  }
  return out.join(" ");
};

const normalizeRomePref = (s: string | undefined) => normalizePrefEn(s);
const normalizeRomeCity = (s: string | undefined) => normalizeCityEn(s);

/* ===================== Build Address ===================== */

const buildEnglishAddress = (
  a: ParsedAddress,
  hints?: {
    municipalityKana?: string;
    areaKana?: string;
    municipalityEn?: string;
    areaEn?: string;
    prefectureEnStrict?: string;
  }
): { english: string; romaji: string } => {
  const partsEn: string[] = [];
  const partsRo: string[] = [];

  const blockHyphen = [a.chome, a.ban, a.go]
    .filter((x) => typeof x === "number")
    .join("-");

  if (a.building) {
    const bRo = kanaToRomaji(a.building);
    if (!HAS_HAN.test(bRo)) {
      partsEn.push(bRo);
    }
    partsRo.push(bRo);
  }

  if (blockHyphen) {
    if (a.chome) {
      const block = `${a.chome}-chome ${[a.ban, a.go]
        .filter(Boolean)
        .join("-")}`.trim();
      partsEn.push(block);
      partsRo.push(block);
    } else {
      partsEn.push(blockHyphen);
      partsRo.push(blockHyphen);
    }
  }

  if (a.area) {
    const areaSource =
      hints?.areaKana && hints.areaKana.trim().length > 0
        ? hints.areaKana
        : a.area;
    const areaRo =
      HAS_HAN.test(areaSource) && hints?.areaEn
        ? properCase(hints.areaEn)
        : areaToRomaji(areaSource);
    const areaEn = hints?.areaEn ? properCase(hints.areaEn) : areaRo;
    if (areaEn) partsEn.push(areaEn);
    if (areaRo) partsRo.push(areaRo);
  }

  if (a.municipality) {
    const muniSource =
      hints?.municipalityKana && hints.municipalityKana.trim().length > 0
        ? hints.municipalityKana
        : a.municipality;
    const muniRo =
      HAS_HAN.test(muniSource) && hints?.municipalityEn
        ? normalizeRomeCity(hints.municipalityEn) || ""
        : municipalityToRomaji(muniSource);
    const muniEn = hints?.municipalityEn
      ? normalizeRomeCity(hints.municipalityEn) || ""
      : muniRo;
    if (muniEn) partsEn.push(muniEn);
    if (muniRo) partsRo.push(muniRo);
  }

  const prefName = hints?.prefectureEnStrict
    ? normalizeRomePref(hints.prefectureEnStrict)
    : a.prefectureEn ||
      (a.prefectureKanji ? PREF_MAP[a.prefectureKanji] : undefined);
  if (prefName) {
    const normalizedPref = normalizePrefEn(prefName) ?? prefName;
    partsEn.push(normalizedPref);
    partsRo.push(normalizedPref);
  }

  if (a.postal) {
    partsEn.push(a.postal);
    partsRo.push(a.postal);
  }
  partsEn.push("Japan");
  partsRo.push("Japan");

  return {
    english: partsEn.filter(Boolean).join(", "),
    romaji: partsRo.filter(Boolean).join(", "),
  };
};

/* ===================== UI Helpers ===================== */

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }, [text]);
  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded border px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

/* ===================== Hooks ===================== */

const usePostalLookup = () => {
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "notfound" | "error"
  >("idle");
  const [lookupData, setLookupData] = useState<{
    prefectureKanji?: string;
    prefectureEn?: string;
    municipality?: string;
    area?: string;
    municipalityEn?: string;
    areaEn?: string;
    prefectureEnStrict?: string;
  }>({});

  const lookupPostal = useCallback(async (postal: string) => {
    const digits = asZip7(postal);
    if (digits.length !== 7) {
      setLookupStatus("idle");
      setLookupData({});
      return;
    }

    setLookupStatus("loading");
    try {
      const idx = await loadZipIndex();
      const hit = idx[digits];
      if (!hit) {
        setLookupStatus("notfound");
        setLookupData({});
        return;
      }

      // 英語（厳格）は ROME
      const prefectureEnStrict = hit.prefecture;
      const municipalityEn = hit.city;
      const areaEn =
        hit.town && hit.town !== "IKANIKEISAIGANAIBAAI" ? hit.town : undefined;

      // 都道府県（日本語）は逆引き可能
      const prefTitle = normalizeRomePref(hit.prefecture) || "";
      const prefectureKanji = PREF_EN_TO_KANJI[prefTitle.toLowerCase()];
      const prefectureEn = prefectureKanji
        ? PREF_MAP[prefectureKanji]
        : undefined;

      // 市区町村・町名を日本語でも推定（簡易的な逆変換）
      const municipality = municipalityEn
        ? romajiToKanji(municipalityEn)
        : undefined;
      const area = areaEn ? romajiToKanji(areaEn) : undefined;

      setLookupData({
        prefectureKanji,
        prefectureEn,
        municipality,
        area,
        municipalityEn,
        areaEn,
        prefectureEnStrict,
      });
      setLookupStatus("idle");
    } catch {
      setLookupStatus("error");
      setLookupData({});
    }
  }, []);

  return { lookupStatus, lookupData, lookupPostal };
};

// 簡易的なローマ字→日本語変換（市区町村名用）
const romajiToKanji = (romaji: string): string => {
  if (!romaji) return "";

  // 基本的な置換パターン
  let result = romaji
    .replace(/-shi$/i, "市")
    .replace(/-ku$/i, "区")
    .replace(/-gun$/i, "郡")
    .replace(/-cho$/i, "町")
    .replace(/-machi$/i, "町")
    .replace(/-mura$/i, "村");

  // 基本的なローマ字→ひらがな変換（簡易版）
  const romajiToHiragana: Record<string, string> = {
    ka: "か",
    ki: "き",
    ku: "く",
    ke: "け",
    ko: "こ",
    sa: "さ",
    shi: "し",
    su: "す",
    se: "せ",
    so: "そ",
    ta: "た",
    chi: "ち",
    tsu: "つ",
    te: "て",
    to: "と",
    na: "な",
    ni: "に",
    nu: "ぬ",
    ne: "ね",
    no: "の",
    ha: "は",
    hi: "ひ",
    fu: "ふ",
    he: "へ",
    ho: "ほ",
    ma: "ま",
    mi: "み",
    mu: "む",
    me: "め",
    mo: "も",
    ya: "や",
    yu: "ゆ",
    yo: "よ",
    ra: "ら",
    ri: "り",
    ru: "る",
    re: "れ",
    ro: "ろ",
    wa: "わ",
    wo: "を",
    n: "ん",
    ga: "が",
    gi: "ぎ",
    gu: "ぐ",
    ge: "げ",
    go: "ご",
    za: "ざ",
    ji: "じ",
    zu: "ず",
    ze: "ぜ",
    zo: "ぞ",
    da: "だ",
    de: "で",
    do: "ど",
    ba: "ば",
    bi: "び",
    bu: "ぶ",
    be: "べ",
    bo: "ぼ",
    pa: "ぱ",
    pi: "ぴ",
    pu: "ぷ",
    pe: "ぺ",
    po: "ぽ",
    a: "あ",
    i: "い",
    u: "う",
    e: "え",
    o: "お",
  };

  // 長い音素から順に変換
  const sortedKeys = Object.keys(romajiToHiragana).sort(
    (a, b) => b.length - a.length
  );
  for (const key of sortedKeys) {
    const regex = new RegExp(key, "gi");
    result = result.replace(regex, romajiToHiragana[key]);
  }

  return result;
};

/* ===================== Input Components ===================== */

const PostalInput = ({
  value,
  onChange,
  onLookup,
  lookupStatus,
}: {
  value: string;
  onChange: (value: string) => void;
  onLookup: (postal: string) => void;
  lookupStatus: "idle" | "loading" | "notfound" | "error";
}) => {
  useEffect(() => {
    onLookup(value);
  }, [value, onLookup]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 items-center">
        <label className="text-sm font-medium" htmlFor="postcode-input">
          郵便番号
        </label>
        <input
          id="postcode-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="1500041 または 150-0041"
          className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
          inputMode="numeric"
        />
      </div>
      {lookupStatus !== "idle" && (
        <div className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          {lookupStatus === "loading" && "郵便番号から住所を検索中…"}
          {lookupStatus === "notfound" &&
            "郵便番号に該当する住所が見つかりませんでした"}
          {lookupStatus === "error" &&
            "住所情報の取得に失敗しました。時間をおいて再試行してください"}
        </div>
      )}
    </>
  );
};

const PrefectureSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value?: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-2 items-center">
    <label className="text-sm font-medium" htmlFor="prefecture-input">
      都道府県
    </label>
    <select
      id="prefecture-input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
    >
      <option value="">選択しない</option>
      {Object.entries(PREF_MAP).map(([kan, en]) => (
        <option key={kan} value={kan}>
          {kan} / {en}
        </option>
      ))}
    </select>
  </div>
);

const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "text" | "numeric";
}) => (
  <div className="grid grid-cols-3 gap-2 items-center">
    <label className="text-sm font-medium" htmlFor={id}>
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
      inputMode={inputMode}
    />
  </div>
);

const ResultDisplay = ({
  title,
  result,
  description,
}: {
  title: string;
  result: string;
  description: string;
}) => (
  <div>
    <div className="flex items-center justify-between">
      <div className="block text-sm font-medium">{title}</div>
      <CopyButton text={result} />
    </div>
    <div className="mt-1 rounded-md border p-3 text-sm break-words min-h-12">
      {result || (
        <span className="text-gray-400">ここに結果が表示されます</span>
      )}
    </div>
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </div>
);

/* ===================== Component ===================== */

const Client = () => {
  const [mode, setMode] = useState<"separated">("separated");
  const { lookupStatus, lookupData, lookupPostal } = usePostalLookup();

  /* ------- Form State ------- */
  const [postal, setPostal] = useState("");
  const [prefKanji, setPrefKanji] = useState<string | undefined>(undefined);
  const [prefEn, setPrefEn] = useState<string | undefined>(undefined);
  const [municipality, setMunicipality] = useState("");
  const [area, setArea] = useState("");
  const [municipalityKana, setMunicipalityKana] = useState("");
  const [areaKana, setAreaKana] = useState("");
  const [municipalityEn, setMunicipalityEn] = useState<string | undefined>(
    undefined
  );
  const [areaEn, setAreaEn] = useState<string | undefined>(undefined);
  const [prefEnStrict, setPrefEnStrict] = useState<string | undefined>(
    undefined
  );
  const [chome, setChome] = useState("");
  const [ban, setBan] = useState("");
  const [go, setGo] = useState("");
  const [building, setBuilding] = useState("");

  // 郵便番号検索結果を自動入力
  useEffect(() => {
    if (lookupData.prefectureKanji) {
      setPrefKanji((prev) =>
        prev?.trim() ? prev : lookupData.prefectureKanji
      );
      setPrefEn((prev) => (prev?.trim() ? prev : lookupData.prefectureEn));
    }
    if (lookupData.municipality) {
      setMunicipality((prev) =>
        prev.trim() ? prev : lookupData.municipality || ""
      );
    }
    if (lookupData.area) {
      setArea((prev) => (prev.trim() ? prev : lookupData.area || ""));
    }
    if (lookupData.municipalityEn) {
      setMunicipalityEn((prev) =>
        prev?.trim() ? prev : lookupData.municipalityEn
      );
    }
    if (lookupData.areaEn) {
      setAreaEn((prev) => (prev?.trim() ? prev : lookupData.areaEn));
    }
    if (lookupData.prefectureEnStrict) {
      setPrefEnStrict((prev) =>
        prev?.trim() ? prev : lookupData.prefectureEnStrict
      );
    }
  }, [lookupData]);

  const parsed = useMemo<ParsedAddress>(() => {
    const digits = postal.replace(/[^0-9]/g, "");
    const postalFormatted =
      digits.length >= 7
        ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}`
        : digits || undefined;

    const toNum = (v: string) =>
      kanjiToNumber(toHalfWidthDigits(v)) ?? undefined;

    return {
      postal: postalFormatted,
      prefectureKanji: prefKanji,
      prefectureEn: prefEn,
      municipality: municipality.trim() || undefined,
      area: area.trim() || undefined,
      chome: chome ? toNum(chome) : undefined,
      ban: ban ? toNum(ban) : undefined,
      go: go ? toNum(go) : undefined,
      building: building.trim() || undefined,
    };
  }, [postal, prefKanji, prefEn, municipality, area, chome, ban, go, building]);

  const result = useMemo(
    () =>
      buildEnglishAddress(parsed, {
        municipalityKana,
        areaKana,
        municipalityEn,
        areaEn,
        prefectureEnStrict: prefEnStrict,
      }),
    [parsed, municipalityKana, areaKana, municipalityEn, areaEn, prefEnStrict]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-2 pt-4 md:space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">
          日本語住所を英語（ローマ字）表記に変換｜海外フォーム対応
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          住所を自動変換します（オフライン辞書対応）。市区町村・町名は郵便データ由来の英語表記/読みを用いて変換します。
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("separated")}
          className="rounded px-3 py-1 text-sm border bg-gray-100 dark:bg-gray-800"
        >
          分割入力
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid gap-3">
            <PostalInput
              value={postal}
              onChange={setPostal}
              onLookup={lookupPostal}
              lookupStatus={lookupStatus}
            />

            <PrefectureSelect
              value={prefKanji}
              onChange={(value) => {
                setPrefKanji(value);
                setPrefEn(value ? PREF_MAP[value] : undefined);
              }}
            />

            <TextInput
              id="municipality-input"
              label="市区町村"
              value={municipality}
              onChange={setMunicipality}
              placeholder="例）渋谷区"
            />

            <TextInput
              id="area-input"
              label="町名・字"
              value={area}
              onChange={setArea}
              placeholder="例）神南"
            />

            <TextInput
              id="chome-input"
              label="丁目"
              value={chome}
              onChange={setChome}
              placeholder="例）1（漢数字可）"
              inputMode="numeric"
            />

            <TextInput
              id="ban-input"
              label="番"
              value={ban}
              onChange={setBan}
              placeholder="例）2（漢数字可）"
              inputMode="numeric"
            />

            <TextInput
              id="go-input"
              label="号"
              value={go}
              onChange={setGo}
              placeholder="例）3（漢数字可）"
              inputMode="numeric"
            />

            <TextInput
              id="building-input"
              label="建物名・部屋番号"
              value={building}
              onChange={setBuilding}
              placeholder="例）パークビル201"
            />
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            郵便番号を入力すると市区町村・町名が自動入力されます。数字は全角/半角・漢数字いずれも対応。
          </div>
        </div>

        <div className="space-y-3">
          <ResultDisplay
            title="英語表記（並び替え）"
            result={result.english}
            description="英語表記は順序の並び替え＋英語/ローマ字化（都道府県は英名, 市区町村・町名はローマ字）。郵便番号の読み（かな）を利用してローマ字化します。"
          />
        </div>
      </div>
    </div>
  );
};

export default Client;
