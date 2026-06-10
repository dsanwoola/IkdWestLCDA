import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../code/package.json", import.meta.url));
const projectId = process.env.FIREBASE_PROJECT_ID || "ikorodu-west-lcda-local";

process.env.FIREBASE_PROJECT_ID = projectId;
process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";

function runNodeScript(script, args = []) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url)), ...args], {
    cwd: fileURLToPath(new URL("../code/", import.meta.url)),
    env: process.env,
    shell: false,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runNodeScript("./import-mocha-users.mjs", ["--emulator"]);
runNodeScript("./seed-firestore.mjs", ["--emulator"]);

const { initializeApp, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

if (getApps().length === 0) {
  initializeApp({ projectId });
}

const auth = getAuth();
const db = getFirestore();

const authUsers = await auth.listUsers(1000);
const staffSnapshot = await db.collection("staff_users").get();
const mirrorSnapshot = await db.collection("staff_by_uid").get();
const departmentsSnapshot = await db.collection("departments").get();

const counts = {
  authUsers: authUsers.users.length,
  staffUsers: staffSnapshot.size,
  staffRoleMirrors: mirrorSnapshot.size,
  departments: departmentsSnapshot.size,
};

console.log(JSON.stringify(counts, null, 2));

if (counts.authUsers !== 4 || counts.staffUsers !== 4 || counts.staffRoleMirrors !== 4 || counts.departments !== 8) {
  console.error("Emulator smoke test counts did not match expected imported data.");
  process.exit(1);
}

console.log("Firebase emulator smoke test passed.");
