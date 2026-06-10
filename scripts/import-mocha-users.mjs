import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { assertLiveProjectConsistency, resolveProjectId } from "./firebase-config.mjs";

const root = new URL("../", import.meta.url);
const usersUrl = new URL("users.json", root);
const codeRoot = new URL("code/", root);
const dryRun = process.argv.includes("--dry-run");
const emulator = process.argv.includes("--emulator");
const require = createRequire(new URL("../code/package.json", import.meta.url));

function credential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }
  return applicationDefault();
}

const mochaUsers = JSON.parse(await readFile(usersUrl, "utf8"));
const users = mochaUsers.map((user) => ({
  uid: user.id,
  email: user.email,
  displayName: user.google_user_data?.name,
  photoURL: user.google_user_data?.picture,
  emailVerified: Boolean(user.google_user_data?.email_verified),
  providerData: user.google_sub ? [{
    providerId: "google.com",
    uid: user.google_sub,
    email: user.email,
    displayName: user.google_user_data?.name,
    photoURL: user.google_user_data?.picture,
  }] : [],
}));

if (dryRun) {
  console.log(JSON.stringify({
    userCount: users.length,
    users: users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerIds: user.providerData.map((provider) => provider.providerId),
    })),
  }, null, 2));
  process.exit(0);
}

const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

if (emulator) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "127.0.0.1:9099";
  process.env.FIREBASE_PROJECT_ID ||= "ikorodu-west-lcda-local";
}

const projectId = await resolveProjectId({ codeRoot, emulator });
if (!emulator && !projectId) {
  console.error("Missing Firebase project ID. Set FIREBASE_PROJECT_ID, provide code/.firebaserc, or use a service-account JSON with project_id.");
  process.exit(1);
}
if (!emulator) {
  await assertLiveProjectConsistency({ codeRoot, projectId });
}

if (getApps().length === 0) {
  initializeApp(emulator ? {
    projectId,
  } : {
    credential: credential(),
    projectId,
  });
}

const auth = getAuth();
const missingUsers = [];
const skippedUsers = [];

for (const user of users) {
  try {
    await auth.getUser(user.uid);
    skippedUsers.push(user);
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      missingUsers.push(user);
      continue;
    }
    throw error;
  }
}

if (missingUsers.length === 0) {
  console.log(`All ${users.length} Firebase Auth users already exist${emulator ? " in the local emulator" : ""}; skipped import.`);
  process.exit(0);
}

const result = await auth.importUsers(missingUsers);

console.log(`Imported ${result.successCount} Firebase Auth users${emulator ? " into the local emulator" : ""}.`);
if (skippedUsers.length > 0) {
  console.log(`Skipped ${skippedUsers.length} existing Firebase Auth users.`);
}
if (result.failureCount > 0) {
  console.error(`Failed to import ${result.failureCount} users:`);
  for (const error of result.errors) {
    const user = missingUsers[error.index];
    console.error(`- ${user?.email || `index ${error.index}`}: ${error.error.message}`);
  }
  process.exitCode = 1;
}
