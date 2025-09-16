"use client";

import { useCallback, useMemo, useState } from "react";

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
    String.fromCharCode(c.charCodeAt(0) + 0x60),
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
    String.fromCharCode(c.charCodeAt(0) + 0x60),
  );
  digraphs[kata] = v;
}

const kanaToRomaji = (input: string): string => {
  if (!input) return "";
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

const extractPostal = (input: string): { postal?: string; rest: string } => {
  const m = input.match(/〒?\s*(\d{3})-?(\d{4})/);
  if (!m) return { rest: input };
  const postal = `${m[1]}-${m[2]}`;
  const rest = input.replace(m[0], "").trim();
  return { postal, rest };
};

const parseAddress = (raw: string): ParsedAddress => {
  let text = raw.trim();
  text = toHalfWidthDigits(text);
  const postalRes = extractPostal(text);
  text = postalRes.rest;

  let prefectureKanji: string | undefined;
  let prefectureEn: string | undefined;
  for (const k of Object.keys(PREF_MAP)) {
    if (text.startsWith(k)) {
      prefectureKanji = k;
      prefectureEn = PREF_MAP[k];
      text = text.slice(k.length);
      break;
    }
  }

  let municipality: string | undefined;
  if (text) {
    const idx = text.search(/[市区郡]/);
    if (idx !== -1) {
      const ch = text[idx];
      if (ch === "郡") {
        const rest = text.slice(idx + 1);
        const m2 = rest.match(/^[^町村]*[町村]/);
        if (m2) {
          municipality = text.slice(0, idx + 1 + m2[0].length);
          text = text.slice(municipality?.length ?? 0);
        } else {
          municipality = text.slice(0, idx + 1);
          text = text.slice(idx + 1);
        }
      } else {
        municipality = text.slice(0, idx + 1);
        text = text.slice(idx + 1);
      }
    }
  }

  let area = text.trim();
  let chome: number | undefined;
  let ban: number | undefined;
  let go: number | undefined;
  let building: string | undefined;

  const chomeMatch = area.match(/(\d+|[〇零一二三四五六七八九十百千]+)丁目/);
  if (chomeMatch) {
    chome = kanjiToNumber(chomeMatch[1]);
    area = area.replace(chomeMatch[0], "");
  }
  const banGoMatch = area.match(
    /(\d+|[〇零一二三四五六七八九十百千]+)番(\d+|[〇零一二三四五六七八九十百千]+)号?/,
  );
  if (banGoMatch) {
    ban = kanjiToNumber(banGoMatch[1]);
    go = kanjiToNumber(banGoMatch[2]);
    area = area.replace(banGoMatch[0], "");
  }

  const hyphenMatch = area.match(
    /([\d]+)\s*[-−ｰー－]\s*([\d]+)(?:\s*[-−ｰー－]\s*([\d]+))?/,
  );
  if (hyphenMatch) {
    const n1 = Number(hyphenMatch[1]);
    const n2 = Number(hyphenMatch[2]);
    const n3 = hyphenMatch[3] ? Number(hyphenMatch[3]) : undefined;
    if (chome === undefined && n3 !== undefined) {
      chome = n1;
      ban = n2;
      go = n3;
    } else if (ban === undefined) {
      ban = n1;
      go = n2;
    }
    area = area.replace(hyphenMatch[0], "");
  }

  building = area.trim();
  let areaName = "";
  if (building) {
    const parts = building.split(/\s+/);
    if (parts.length > 1) {
      areaName = parts[0];
      building = building.slice(areaName.length).trim();
    } else {
      areaName = building;
      building = "";
    }
  }

  return {
    postal: postalRes.postal,
    prefectureKanji,
    prefectureEn,
    municipality,
    area: areaName,
    chome,
    ban,
    go,
    building: building || undefined,
  };
};

const municipalityToRomaji = (muni?: string): string => {
  if (!muni) return "";
  const repl = muni
    .replace(/市$/, "-shi")
    .replace(/区$/, "-ku")
    .replace(/郡$/, "-gun")
    .replace(/町$/, "-cho")
    .replace(/村$/, "-mura");
  return kanaToRomaji(repl);
};

const areaToRomaji = (area?: string): string => {
  if (!area) return "";
  return kanaToRomaji(area);
};

const buildEnglishAddress = (
  a: ParsedAddress,
): { english: string; romaji: string } => {
  const partsEn: string[] = [];
  const partsRo: string[] = [];

  const blockHyphen = [a.chome, a.ban, a.go]
    .filter((x) => typeof x === "number")
    .join("-");
  if (a.building) {
    partsEn.push(a.building);
    partsRo.push(kanaToRomaji(a.building));
  }
  if (blockHyphen) {
    if (a.chome) {
      partsEn.push(
        `${a.chome}-chome ${[a.ban, a.go].filter(Boolean).join("-")}`.trim(),
      );
      partsRo.push(
        `${a.chome}-chome ${[a.ban, a.go].filter(Boolean).join("-")}`.trim(),
      );
    } else {
      partsEn.push(blockHyphen);
      partsRo.push(blockHyphen);
    }
  }

  if (a.area) {
    partsEn.push(a.area);
    partsRo.push(areaToRomaji(a.area));
  }
  if (a.municipality) {
    partsEn.push(a.municipality);
    partsRo.push(municipalityToRomaji(a.municipality));
  }
  if (a.prefectureEn) {
    partsEn.push(a.prefectureEn);
    partsRo.push(a.prefectureEn);
  } else if (a.prefectureKanji) {
    partsEn.push(a.prefectureKanji);
    partsRo.push(a.prefectureKanji);
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

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="grid grid-cols-3 gap-2 items-center">
    <div className="text-gray-600 dark:text-gray-400">{label}</div>
    <input
      readOnly
      value={value ?? ""}
      className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
    />
  </div>
);

const Client = () => {
  const [mode, setMode] = useState<"paste" | "separated">("separated");

  // Paste mode state
  const [input, setInput] = useState("");
  const parsed = useMemo(() => parseAddress(input), [input]);
  const result = useMemo(() => buildEnglishAddress(parsed), [parsed]);

  // Separated mode state
  const [sepPostal, setSepPostal] = useState("");
  const [sepPrefKanji, setSepPrefKanji] = useState<string | undefined>(
    undefined,
  );
  const [sepPrefEn, setSepPrefEn] = useState<string | undefined>(undefined);
  const [sepMunicipality, setSepMunicipality] = useState("");
  const [sepArea, setSepArea] = useState("");
  const [sepChome, setSepChome] = useState("");
  const [sepBan, setSepBan] = useState("");
  const [sepGo, setSepGo] = useState("");
  const [sepBuilding, setSepBuilding] = useState("");

  const sepParsed = useMemo<ParsedAddress>(() => {
    const digits = sepPostal.replace(/[^0-9]/g, "");
    const postal =
      digits.length >= 7
        ? `${digits.slice(0, 3)}-${digits.slice(3, 7)}`
        : digits || undefined;
    const toNum = (v: string) =>
      kanjiToNumber(toHalfWidthDigits(v)) ?? undefined;
    return {
      postal,
      prefectureKanji: sepPrefKanji,
      prefectureEn: sepPrefEn,
      municipality: sepMunicipality.trim() || undefined,
      area: sepArea.trim() || undefined,
      chome: sepChome ? toNum(sepChome) : undefined,
      ban: sepBan ? toNum(sepBan) : undefined,
      go: sepGo ? toNum(sepGo) : undefined,
      building: sepBuilding.trim() || undefined,
    };
  }, [
    sepPostal,
    sepPrefKanji,
    sepPrefEn,
    sepMunicipality,
    sepArea,
    sepChome,
    sepBan,
    sepGo,
    sepBuilding,
  ]);
  const sepResult = useMemo(() => buildEnglishAddress(sepParsed), [sepParsed]);

  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-2 pt-4 md:space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">
          日本語住所を英語（ローマ字）表記に変換｜海外フォーム対応
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          住所を自動変換します（オフライン・辞書なし）。市区町村名など漢字のローマ字化は完全ではないため、結果は必要に応じて編集してください。
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`rounded px-3 py-1 text-sm border ${
            mode === "paste"
              ? "bg-gray-100 dark:bg-gray-800"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          ペースト入力
        </button>
        <button
          type="button"
          onClick={() => setMode("separated")}
          className={`rounded px-3 py-1 text-sm border ${
            mode === "separated"
              ? "bg-gray-100 dark:bg-gray-800"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          分割入力
        </button>
      </div>

      {mode === "paste" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="block text-sm font-medium"
              htmlFor="address-input"
            >
              日本語の住所を入力
            </label>
            {/** biome-ignore lint/correctness/useUniqueElementIds: <explanation> */}
            <textarea
              id="address-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="例）〒150-0041 東京都渋谷区神南1丁目2-3 パークビル201"
              className="w-full h-36 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
            />

            <div className="text-xs text-gray-500 dark:text-gray-400">
              ヒント:
              「丁目・番・号」「ハイフン区切り」「郵便番号」に対応。都道府県は英語表記に変換します。
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="block text-sm font-medium">
                  英語表記（並び替え）
                </div>
                <CopyButton text={result.english} />
              </div>
              <div className="mt-1 rounded-md border p-3 text-sm break-words min-h-12">
                {result.english || (
                  <span className="text-gray-400">
                    ここに結果が表示されます
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="block text-sm font-medium">
                  ローマ字表記（ベストエフォート）
                </div>
                <CopyButton text={result.romaji} />
              </div>
              <div className="mt-1 rounded-md border p-3 text-sm break-words min-h-12">
                {result.romaji || (
                  <span className="text-gray-400">
                    ここに結果が表示されます
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="postcode-input">
                  郵便番号
                </label>
                <input
                  id="postcode-input"
                  value={sepPostal}
                  onChange={(e) => setSepPostal(e.target.value)}
                  placeholder="1500041 または 150-0041"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label
                  className="text-sm font-medium"
                  htmlFor="prefecture-input"
                >
                  都道府県
                </label>
                <select
                  id="prefecture-input"
                  value={sepPrefKanji ?? ""}
                  onChange={(e) => {
                    const kan = e.target.value || undefined;
                    setSepPrefKanji(kan);
                    setSepPrefEn(kan ? PREF_MAP[kan] : undefined);
                  }}
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
              <div className="grid grid-cols-3 gap-2 items-center">
                <label
                  className="text-sm font-medium"
                  htmlFor="municipality-input"
                >
                  市区町村
                </label>
                <input
                  id="municipality-input"
                  value={sepMunicipality}
                  onChange={(e) => setSepMunicipality(e.target.value)}
                  placeholder="例）渋谷区"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="area-input">
                  町名・字
                </label>
                <input
                  id="area-input"
                  value={sepArea}
                  onChange={(e) => setSepArea(e.target.value)}
                  placeholder="例）神南"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="chome-input">
                  丁目
                </label>
                <input
                  id="chome-input"
                  value={sepChome}
                  onChange={(e) => setSepChome(e.target.value)}
                  placeholder="例）1（漢数字可）"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="ban-input">
                  番
                </label>
                <input
                  id="ban-input"
                  value={sepBan}
                  onChange={(e) => setSepBan(e.target.value)}
                  placeholder="例）2（漢数字可）"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="go-input">
                  号
                </label>
                <input
                  id="go-input"
                  value={sepGo}
                  onChange={(e) => setSepGo(e.target.value)}
                  placeholder="例）3（漢数字可）"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                  inputMode="numeric"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="building-input">
                  建物名・部屋番号
                </label>
                <input
                  id="building-input"
                  value={sepBuilding}
                  onChange={(e) => setSepBuilding(e.target.value)}
                  placeholder="例）パークビル201"
                  className="col-span-2 w-full rounded-md border px-2 py-1 bg-transparent"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              数字は全角/半角・漢数字いずれも対応。未入力項目は省略されます。
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="block text-sm font-medium">
                  英語表記（並び替え）
                </div>
                <CopyButton text={sepResult.english} />
              </div>
              <div className="mt-1 rounded-md border p-3 text-sm break-words min-h-12">
                {sepResult.english || (
                  <span className="text-gray-400">
                    ここに結果が表示されます
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="block text-sm font-medium">
                  ローマ字表記（ベストエフォート）
                </div>
                <CopyButton text={sepResult.romaji} />
              </div>
              <div className="mt-1 rounded-md border p-3 text-sm break-words min-h-12">
                {sepResult.romaji || (
                  <span className="text-gray-400">
                    ここに結果が表示されます
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "paste" && (
        <details className="rounded-md border p-3">
          <summary className="cursor-pointer select-none text-sm font-medium">
            解析結果（編集補助）
          </summary>
          <div className="grid gap-3 md:grid-cols-2 mt-3 text-sm">
            <Field label="郵便番号" value={parsed.postal} />
            <Field label="都道府県 (EN)" value={parsed.prefectureEn ?? ""} />
            <Field label="市区町村" value={parsed.municipality ?? ""} />
            <Field label="町名・字" value={parsed.area ?? ""} />
            <Field label="丁目" value={parsed.chome?.toString() ?? ""} />
            <Field label="番" value={parsed.ban?.toString() ?? ""} />
            <Field label="号" value={parsed.go?.toString() ?? ""} />
            <Field label="建物名・部屋番号" value={parsed.building ?? ""} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            解析がうまくいかない場合は、手動で並び替えてご利用ください。
          </p>
        </details>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        注意:
        本ツールは学習用途の簡易変換です。公式な書類や郵便では、自治体・郵便局の推奨表記を確認してください。
      </div>
    </div>
  );
};

export default Client;
