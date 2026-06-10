import { createRequire } from "node:module";

const require = createRequire(new URL("../code/package.json", import.meta.url));
const api = require("firebase-tools/lib/api");
const { Client } = require("firebase-tools/lib/apiv2");
const { getGlobalDefaultAccount, setActiveAccount } = require("firebase-tools/lib/auth");
const { requireAuth } = require("firebase-tools/lib/requireAuth");

const projectId = process.argv[2];
const serviceName = process.argv[3];
const mode = process.argv[4] || "enable";

if (!projectId || !serviceName) {
  console.error("Usage: node ../scripts/enable-google-api.mjs <project-id> <service-name>");
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

const serviceUsage = new Client({
  urlPrefix: api.serviceUsageOrigin(),
  apiVersion: "v1",
});

const result = mode === "get"
  ? await serviceUsage.get(`/projects/${projectId}/services/${serviceName}`)
  : await serviceUsage.post(`/projects/${projectId}/services/${serviceName}:enable`, {});
console.log(JSON.stringify({
  serviceName,
  state: result.body?.state || null,
  operation: result.body?.name || null,
  done: result.body?.done || false,
}, null, 2));
