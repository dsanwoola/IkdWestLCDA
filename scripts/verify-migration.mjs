import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const codeRoot = new URL("code/", root);

const checks = [];

function check(name, ok, detail = "") {
  checks.push({ name, ok, detail });
}

async function listFiles(dirUrl, predicate = () => true) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, dirUrl);
    if (entry.isDirectory()) {
      if (["node_modules", "dist"].includes(entry.name)) continue;
      files.push(...await listFiles(url, predicate));
    } else if (predicate(entry.name)) {
      files.push(url);
    }
  }

  return files;
}

const sourceFiles = await listFiles(new URL("src/", codeRoot), (name) => /\.(ts|tsx|js|jsx|json)$/.test(name));
const forbiddenRuntimePatterns = [
  /@getmocha/,
  /MOCHA_USERS_SERVICE/,
  /MOCHA_SESSION_TOKEN/,
  /D1Database/,
  /wrangler/i,
  /mochausercontent\.com/,
  /cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet/,
  /unpkg\.com\/leaflet/,
];

const forbiddenHits = [];
for (const fileUrl of sourceFiles) {
  const text = await readFile(fileUrl, "utf8");
  for (const pattern of forbiddenRuntimePatterns) {
    if (pattern.test(text)) {
      forbiddenHits.push(`${fileUrl.pathname}: ${pattern}`);
    }
  }
}
check("Active source has no Mocha/Cloudflare runtime references", forbiddenHits.length === 0, forbiddenHits.slice(0, 5).join("; "));

for (const relative of [
  "public/assets/leaflet/marker-icon.png",
  "public/assets/leaflet/marker-icon-2x.png",
  "public/assets/leaflet/marker-shadow.png",
]) {
  check(relative, existsSync(new URL(relative, codeRoot)), existsSync(new URL(relative, codeRoot)) ? "Present" : "Missing");
}

const mochaAssetsDir = new URL("public/assets/mocha/", codeRoot);
if (existsSync(mochaAssetsDir)) {
  const files = await readdir(mochaAssetsDir);
  check("Downloaded Mocha assets", files.length > 0, `${files.length} files`);
} else {
  check("Downloaded Mocha assets", false, "Missing code/public/assets/mocha");
}

let firestoreSeed = null;
let authSeed = null;
let mochaUsers = null;

for (const relative of ["firebase-seed/firestore-data.json", "firebase-seed/firebase-auth-users.json", "users.json"]) {
  const fileUrl = new URL(relative, root);
  if (!existsSync(fileUrl)) {
    check(relative, false, "Missing");
    continue;
  }

  try {
    const parsed = JSON.parse(await readFile(fileUrl, "utf8"));
    check(relative, Boolean(parsed && typeof parsed === "object"), "Valid JSON");
    if (relative === "firebase-seed/firestore-data.json") firestoreSeed = parsed;
    if (relative === "firebase-seed/firebase-auth-users.json") authSeed = parsed;
    if (relative === "users.json") mochaUsers = parsed;
  } catch (error) {
    check(relative, false, error instanceof Error ? error.message : "Invalid JSON");
  }
}

if (Array.isArray(mochaUsers) && authSeed?.users && Array.isArray(authSeed.users)) {
  const mochaIds = new Set(mochaUsers.map((user) => user.id));
  const authIds = new Set(authSeed.users.map((user) => user.localId));
  const missingAuthIds = [...mochaIds].filter((id) => !authIds.has(id));
  const missingMochaIds = [...authIds].filter((id) => !mochaIds.has(id));
  check(
    "Firebase Auth seed preserves Mocha user IDs",
    missingAuthIds.length === 0 && missingMochaIds.length === 0,
    [...missingAuthIds, ...missingMochaIds].slice(0, 5).join(", "),
  );
  check(
    "Firebase Auth seed preserves Google providers",
    authSeed.users.every((user) => Array.isArray(user.providerUserInfo) && user.providerUserInfo.some((provider) => provider.providerId === "google.com")),
  );
}

if (firestoreSeed?.staff_users && Array.isArray(firestoreSeed.staff_users)) {
  const staff = firestoreSeed.staff_users;
  const authIds = new Set(authSeed?.users?.map((user) => user.localId) || []);
  const missingAuthStaff = staff
    .filter((user) => user.mocha_user_id)
    .filter((user) => !authIds.has(user.mocha_user_id));
  check(
    "Staff records point at imported Firebase Auth UIDs",
    missingAuthStaff.length === 0,
    missingAuthStaff.map((user) => user.email || user.id).slice(0, 5).join(", "),
  );
  check(
    "Seed contains an active non-citizen staff admin",
    staff.some((user) => user.is_active !== 0 && user.is_active !== false && ["super_admin", "chairman", "lcda_secretary"].includes(user.role)),
  );
}

const packageJson = JSON.parse(await readFile(new URL("package.json", codeRoot), "utf8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
check("No Mocha/Cloudflare packages", !Object.keys(dependencies).some((name) => /getmocha|wrangler|cloudflare/i.test(name)));
check("Firebase client dependency", Boolean(packageJson.dependencies?.firebase));
check("Firebase admin dependency", Boolean(packageJson.dependencies?.["firebase-admin"]));
check("Firebase tooling dependency", Boolean(packageJson.devDependencies?.["firebase-tools"]));

const rulesText = await readFile(new URL("firestore.rules", codeRoot), "utf8");
check(
  "Firestore rules exclude citizen from active staff",
  /staffProfile\(\)\.data\.role != 'citizen'/.test(rulesText),
);
check(
  "Firestore rules protect service request processing",
  /function canProcessServiceRequests\(\)/.test(rulesText)
    && /allow read, update: if canProcessServiceRequests\(\);/.test(rulesText),
);
check(
  "Firestore rules constrain public marriage submissions",
  /function isPublicMarriageApplicationCreate\(\)/.test(rulesText)
    && /allow create: if isPublicMarriageApplicationCreate\(\);/.test(rulesText)
    && /request\.resource\.data\.status == 'submitted'/.test(rulesText),
);
check(
  "Firestore rules constrain public service submissions",
  /function isPublicServiceRequestCreate\(\)/.test(rulesText)
    && /allow create: if isPublicServiceRequestCreate\(\);/.test(rulesText)
    && /request\.resource\.data\.status == 'pending'/.test(rulesText),
);
check(
  "Firestore rules constrain public tracking mirrors",
  /function isPublicMarriageTrackingCreate\(applicationNumber\)/.test(rulesText)
    && /function isPublicServiceTrackingCreate\(trackingNumber\)/.test(rulesText)
    && /allow create: if isPublicMarriageTrackingCreate\(applicationNumber\);/.test(rulesText)
    && /allow create: if isPublicServiceTrackingCreate\(trackingNumber\);/.test(rulesText),
);

const scripts = packageJson.scripts || {};
for (const scriptName of [
  "firebase:import-auth",
  "firebase:import-auth:cli-auth",
  "firebase:seed",
  "firebase:seed:cli-auth",
  "firebase:verify-live",
  "firebase:deploy",
  "firebase:deploy:auth",
  "firebase:deploy:hosting",
  "firebase:deploy:rules",
  "setup:validate",
]) {
  check(`npm script ${scriptName}`, Boolean(scripts[scriptName]));
}

const firebaseJson = JSON.parse(await readFile(new URL("firebase.json", codeRoot), "utf8"));
check(
  "Firebase Auth providers configured",
  firebaseJson.auth?.providers?.emailPassword === true
    && Boolean(firebaseJson.auth?.providers?.googleSignIn?.supportEmail),
);

const firebaseConfigScript = await readFile(new URL("scripts/firebase-config.mjs", root), "utf8");
const importScript = await readFile(new URL("scripts/import-mocha-users.mjs", root), "utf8");
const seedScript = await readFile(new URL("scripts/seed-firestore.mjs", root), "utf8");
check(
  "Live import/seed guard against Firebase project mismatches",
  /function assertLiveProjectConsistency/.test(firebaseConfigScript)
    && /assertLiveProjectConsistency\(\{ codeRoot, projectId \}\)/.test(importScript)
    && /assertLiveProjectConsistency\(\{ codeRoot, projectId \}\)/.test(seedScript),
);

for (const result of checks) {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
}

if (checks.some((result) => !result.ok)) {
  process.exitCode = 1;
}
