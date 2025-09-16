#!/usr/bin/env -S node --no-warnings
// Runtime: Node.js 20+ (recommended), also works on Bun/Deno
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";

const booksJsonPath = join(process.cwd(), "app/books/_data/books.json");
const outDir = join(process.cwd(), "public/covers");

async function ensureDir(p: string) {
  try { await mkdir(p, { recursive: true }); } catch {}
}

async function fetchToFile(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return false;
    const arr = new Uint8Array(await res.arrayBuffer());
    await ensureDir(dirname(dest));
    await writeFile(dest, arr);
    return true;
  } catch {
    return false;
  }
}

async function fileExists(p: string) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  const raw = await readFile(booksJsonPath, "utf8");
  const books: Array<{ isbn: string; title: string } & Record<string, any>> = JSON.parse(raw);
  await ensureDir(outDir);

  for (const b of books) {
    const isbn = String(b.isbn || "").replace(/[^0-9]/g, "");
    if (!isbn) continue;
    const outJpg = join(outDir, `${isbn}.jpg`);
    const outPng = join(outDir, `${isbn}.png`);
    if (await fileExists(outJpg) || await fileExists(outPng)) {
      console.log(`skip ${isbn} (exists)`);
      continue;
    }
    const candidates = [
      { url: `https://cover.openbd.jp/${isbn}.jpg`, dest: outJpg },
      { url: `https://www.hanmoto.com/bd/img/${isbn}.jpg`, dest: outJpg },
      { url: `https://www.hanmoto.com/bd/img/${isbn}.png`, dest: outPng },
    ];
    let ok = false;
    for (const c of candidates) {
      process.stdout.write(`fetch ${isbn} <- ${c.url}\n`);
      // biome-ignore lint/suspicious/noAssignInExpressions: simple fallthrough
      if ((ok = await fetchToFile(c.url, c.dest))) break;
    }
    if (!ok) console.warn(`!! not found: ${isbn}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
