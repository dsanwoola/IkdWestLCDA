import { readFile, readdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const appRoot = new URL("code/src/react-app/", root);

const routePatterns = [
  /^\/api\/logout$/,
  /^\/api\/users\/me$/,
  /^\/api\/staff\/register$/,
  /^\/api\/staff$/,
  /^\/api\/staff\/:id\/role$/,
  /^\/api\/departments$/,
  /^\/api\/cms\/articles$/,
  /^\/api\/cms\/articles\/:id$/,
  /^\/api\/cms\/announcements$/,
  /^\/api\/cms\/announcements\/:id$/,
  /^\/api\/cms\/projects$/,
  /^\/api\/cms\/projects\/:id$/,
  /^\/api\/cms\/:id$/,
  /^\/api\/cms\/:id\/:id$/,
  /^\/api\/public\/articles$/,
  /^\/api\/public\/announcements$/,
  /^\/api\/public\/projects$/,
  /^\/api\/public\/marriage-applications$/,
  /^\/api\/public\/marriage-applications\/:id$/,
  /^\/api\/marriage-applications$/,
  /^\/api\/marriage-applications\/:id$/,
  /^\/api\/service-requests$/,
  /^\/api\/service-requests\/track\/:id$/,
  /^\/api\/service-requests\/:id$/,
];

const knownDynamicSegments = [
  "${trackingNumber.trim()}",
  "${encodeURIComponent(trackingNumber.trim())}",
  "${encodeURIComponent(idToTrack)}",
  "${id}",
  "${activeTab}",
  "${deleteDialog.type}",
  "${deleteDialog.id}",
  "${selectedUser.id}",
  "${projectToDelete.id}",
];

async function listFiles(dirUrl) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dirUrl);
    if (entry.isDirectory()) {
      files.push(...await listFiles(url));
    } else if (/\.(ts|tsx)$/.test(entry.name) && !url.pathname.endsWith("/lib/firebaseApi.ts")) {
      files.push(url);
    }
  }

  return files;
}

function extractApiPaths(text) {
  const paths = new Set();
  for (const match of text.matchAll(/['"`](\/api\/[^'"`\s]*)['"`]/g)) {
    paths.add(normalizePath(match[1]));
  }
  return [...paths];
}

function normalizePath(path) {
  let normalized = path;
  for (const segment of knownDynamicSegments) {
    normalized = normalized.replaceAll(segment, ":id");
  }

  normalized = normalized.replace(/\$\{[^}]+\}/g, ":id");
  normalized = normalized.replace(/\/:id\/:id$/, "/:id/:id");
  return normalized;
}

function isCovered(path) {
  return routePatterns.some((pattern) => pattern.test(path));
}

const files = await listFiles(appRoot);
const uncovered = [];
const covered = [];

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const path of extractApiPaths(text)) {
    if (isCovered(path)) {
      covered.push(path);
    } else {
      uncovered.push(`${file.pathname}: ${path}`);
    }
  }
}

for (const path of [...new Set(covered)].sort()) {
  console.log(`PASS ${path}`);
}

if (uncovered.length > 0) {
  for (const item of uncovered) {
    console.error(`FAIL ${item}`);
  }
  process.exit(1);
}

console.log(`Verified ${new Set(covered).size} frontend API route patterns.`);
