import fs from "node:fs";
import path from "node:path";

type RomeRow = {
  zipcode: string;
  prefecture: string; // EN uppercase (e.g., TOKYO TO)
  city: string; // EN uppercase (e.g., SHIBUYA KU)
  town: string; // EN uppercase (e.g., JINNAN)
};

let ROMEDB: Record<string, RomeRow[]> | null = null;

function to7(zip: string): string | null {
  const z = zip.replace(/[^0-9]/g, "");
  if (z.length === 7) return z;
  if (z.length === 6) return `0${z}`; // dataset may drop leading zero
  return null;
}

// Load prebuilt JSON dataset (data/postal/ken_all_rome.min.json)
function loadRome(): Record<string, RomeRow[]> | null {
  if (ROMEDB) return ROMEDB;
  const file = path.join(
    process.cwd(),
    "data",
    "postal",
    "ken_all_rome.min.json"
  );
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, "utf8");
    ROMEDB = JSON.parse(raw) as Record<string, RomeRow[]>;
    return ROMEDB;
  } catch {
    return null;
  }
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("zipcode") || "";
  const zip7 = to7(raw);
  if (!zip7) {
    return new Response(
      JSON.stringify({ status: 400, message: "invalid zipcode" }),
      { status: 400, headers: { "content-type": "application/json", "cache-control": "no-store" } }
    );
  }
  const db = loadRome();
  if (!db) {
    return new Response(
      JSON.stringify({ status: 501, message: "rome_dataset_missing" }),
      { status: 501, headers: { "content-type": "application/json", "cache-control": "no-store" } }
    );
  }
  const results = db[zip7] || [];
  return new Response(
    JSON.stringify({ status: 200, results }),
    { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } }
  );
}
