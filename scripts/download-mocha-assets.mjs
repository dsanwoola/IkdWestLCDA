import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const linksUrl = new URL("public_asset_links.json", root);
const outDir = new URL("code/public/assets/mocha/", root);
const manifestUrl = new URL("code/public/assets/mocha/manifest.json", root);

const links = JSON.parse(await readFile(linksUrl, "utf8"));
const manifest = {};

await mkdir(outDir, { recursive: true });

for (const link of links) {
  const url = new URL(link);
  const filename = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() || "asset");
  const localUrl = `/assets/mocha/${filename}`;
  const fileUrl = new URL(filename, outDir);
  manifest[link] = localUrl;

  if (existsSync(fileUrl)) {
    continue;
  }

  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`Skipped ${link}: ${response.status} ${response.statusText}`);
    continue;
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(fileUrl, bytes);
  console.log(`Downloaded ${filename}`);
}

await writeFile(manifestUrl, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${manifestUrl.pathname}`);
