import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFirebaserc, readServiceAccountFromEnv, readWebEnv } from "./firebase-config.mjs";

const root = new URL("../", import.meta.url);
const codeRoot = new URL("code/", root);

const checks = [];
const warnings = [];

function check(name, ok, detail = "") {
  checks.push({ name, ok, detail });
}

function warn(name, ok, detail = "") {
  warnings.push({ name, ok, detail });
}

const webEnv = await readWebEnv(codeRoot);
if (webEnv.exists) {
  check("Firebase web .env", webEnv.missing.length === 0, webEnv.missing.length ? `Missing: ${webEnv.missing.join(", ")}` : "Complete");
} else {
  check("Firebase web .env", false, "Copy .env.example to .env and fill Firebase web config");
}

const firebaserc = await readFirebaserc(codeRoot);
if (firebaserc.exists) {
  check(".firebaserc default project", Boolean(firebaserc.projectId), firebaserc.projectId || "Missing");
} else {
  check(".firebaserc default project", false, "Copy .firebaserc.example to .firebaserc");
}

if (webEnv.env.VITE_FIREBASE_PROJECT_ID && firebaserc.projectId) {
  check(
    "Firebase web/project match",
    webEnv.env.VITE_FIREBASE_PROJECT_ID === firebaserc.projectId,
    webEnv.env.VITE_FIREBASE_PROJECT_ID === firebaserc.projectId
      ? firebaserc.projectId
      : `.env=${webEnv.env.VITE_FIREBASE_PROJECT_ID}, .firebaserc=${firebaserc.projectId}`,
  );
}

for (const relative of ["firebase-seed/firestore-data.json", "firebase-seed/firebase-auth-users.json"]) {
  const fileUrl = new URL(relative, root);
  check(relative, existsSync(fileUrl), existsSync(fileUrl) ? "Present" : "Missing");
}

const assetDir = new URL("public/assets/mocha/", codeRoot);
if (existsSync(assetDir)) {
  const files = await readdir(assetDir);
  check("Downloaded assets", files.length > 0, `${files.length} files`);
} else {
  check("Downloaded assets", false, "Run npm run assets:download");
}

const serviceAccount = await readServiceAccountFromEnv();
const firebaseCliAccount = getFirebaseCliAccount();
warn(
  "Firebase live credentials",
  serviceAccount.ok || Boolean(firebaseCliAccount),
  serviceAccount.ok
    ? serviceAccount.detail
    : firebaseCliAccount
      ? `Firebase CLI logged in as ${firebaseCliAccount.user.email}`
      : "No service account visible in this sandbox. Live CLI-auth commands can still use your Firebase CLI login when run with approval.",
);
if (serviceAccount.ok && firebaserc.projectId) {
  check(
    "Service account/project match",
    serviceAccount.projectId === firebaserc.projectId,
    serviceAccount.projectId === firebaserc.projectId
      ? firebaserc.projectId
      : `service-account=${serviceAccount.projectId}, .firebaserc=${firebaserc.projectId}`,
  );
}

const javaCheck = spawnSync("java", ["-version"], { stdio: "ignore", shell: false });
warn("Java for Firestore emulator", javaCheck.status === 0, javaCheck.status === 0 ? "Available" : "Install Java and add it to PATH only if you need npm run firebase:emulator:smoke");

for (const result of checks) {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
}
for (const result of warnings) {
  console.log(`${result.ok ? "PASS" : "WARN"} ${result.name}${result.detail ? ` - ${result.detail}` : ""}`);
}

if (checks.some((result) => !result.ok)) {
  process.exitCode = 1;
}

function getFirebaseCliAccount() {
  const firebaseCliScript = fileURLToPath(new URL("firebase-cli.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [firebaseCliScript, "login:list"], {
    encoding: "utf8",
    cwd: fileURLToPath(codeRoot),
  });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  const match = output.match(/Logged in as ([^\s]+)/);
  return match ? { user: { email: match[1] } } : null;
}
