import { createRequire } from "node:module";
import { readFirebaserc } from "./firebase-config.mjs";

const root = new URL("../", import.meta.url);
const codeRoot = new URL("code/", root);
const require = createRequire(new URL("../code/package.json", import.meta.url));

const api = require("firebase-tools/lib/api");
const { Client } = require("firebase-tools/lib/apiv2");
const { getGlobalDefaultAccount, setActiveAccount } = require("firebase-tools/lib/auth");
const { requireAuth } = require("firebase-tools/lib/requireAuth");

const projectId = process.argv.find((arg) => arg.startsWith("--project="))?.slice("--project=".length)
  || (await readFirebaserc(codeRoot)).projectId;

if (!projectId) {
  console.error("Missing project ID. Pass --project=<project-id> or set code/.firebaserc.");
  process.exit(1);
}

const account = getGlobalDefaultAccount();
if (!account) {
  console.error("Firebase CLI is not logged in. Run `npx -y firebase-tools@latest login` first.");
  process.exit(1);
}

const options = { project: projectId };
setActiveAccount(options, account);
await requireAuth(options);

const firestore = new Client({
  urlPrefix: api.firestoreOrigin(),
  apiVersion: "v1",
});

const collections = [
  "staff_users",
  "staff_by_uid",
  "departments",
  "service_requests",
  "audit_logs",
  "cms_articles",
  "cms_announcements",
  "cms_projects",
  "marriage_applications",
  "status_history",
  "public_marriage_tracking",
  "public_service_tracking",
];

const counts = {};
for (const collectionName of collections) {
  counts[collectionName] = await countCollection(projectId, collectionName);
}

console.log(JSON.stringify(counts, null, 2));

const required = {
  staff_users: 4,
  staff_by_uid: 4,
  departments: 8,
};

let failed = false;
for (const [collectionName, expected] of Object.entries(required)) {
  if (counts[collectionName] !== expected) {
    console.error(`Expected ${expected} documents in ${collectionName}, found ${counts[collectionName]}.`);
    failed = true;
  }
}

if (failed) process.exit(1);

async function countCollection(projectId, collectionName) {
  let pageToken = undefined;
  let count = 0;

  do {
    const result = await firestore.get(
      `/projects/${projectId}/databases/(default)/documents/${collectionName}`,
      {
        queryParams: {
          pageSize: "300",
          ...(pageToken ? { pageToken } : {}),
        },
        resolveOnHTTPError: true,
      },
    );

    if (result.status === 404) return 0;
    if (result.status >= 400) {
      throw new Error(`Failed to list ${collectionName}: ${result.status} ${JSON.stringify(result.body)}`);
    }

    count += result.body?.documents?.length || 0;
    pageToken = result.body?.nextPageToken;
  } while (pageToken);

  return count;
}
