import fs from "node:fs";
import path from "node:path";

type Entry = {
  zipcode: string;
  address1: string; // Prefecture (kanji)
  address2: string; // Municipality (kanji)
  address3: string; // Area/town (kanji)
  kana1?: string; // Pref (kana)
  kana2?: string; // Municipality (kana)
  kana3?: string; // Area (kana)
};

let DATA: Record<string, Entry[]> | null = null;

function loadData(): Record<string, Entry[]> | null {
  if (DATA) return DATA;
  const base = process.cwd();
  const primary = path.join(base, "data", "postal", "ken_all.min.json");
  const fallback = path.join(base, "data", "postal", "ken_all.sample.json");
  let file = "";
  if (fs.existsSync(primary)) file = primary;
  else if (fs.existsSync(fallback)) file = fallback;
  else return null;
  try {
    const raw = fs.readFileSync(file, "utf8");
    DATA = JSON.parse(raw) as Record<string, Entry[]>;
    return DATA;
  } catch {
    return null;
  }
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("zipcode") || "";
  const zipcode = raw.replace(/[^0-9]/g, "");

  if (zipcode.length !== 7) {
    return new Response(
      JSON.stringify({ status: 400, message: "invalid zipcode" }),
      { status: 400, headers: { "content-type": "application/json", "cache-control": "no-store" } }
    );
  }

  const dict = loadData();
  if (!dict) {
    return new Response(
      JSON.stringify({ status: 501, message: "no_local_dataset" }),
      { status: 501, headers: { "content-type": "application/json", "cache-control": "no-store" } }
    );
  }

  const entries = dict[zipcode] || [];
  const results = entries.map((e) => ({
    zipcode: e.zipcode,
    address1: e.address1,
    address2: e.address2,
    address3: e.address3,
    kana1: e.kana1,
    kana2: e.kana2,
    kana3: e.kana3,
  }));

  return new Response(
    JSON.stringify({ message: null, results, status: 200 }),
    { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } }
  );
}

