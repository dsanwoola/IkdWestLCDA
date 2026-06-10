import { readFirebaserc, readWebEnv } from "./firebase-config.mjs";

const root = new URL("../", import.meta.url);
const codeRoot = new URL("code/", root);

function fail(message) {
  console.error(message);
  process.exit(1);
}

const webEnv = await readWebEnv(codeRoot);
if (!webEnv.exists) {
  fail("Missing code/.env. Copy code/.env.example to code/.env and fill the Firebase web app config before deploying Hosting.");
}

if (webEnv.missing.length > 0) {
  fail(`Missing Firebase web config values in code/.env: ${webEnv.missing.join(", ")}`);
}

if (webEnv.env.VITE_USE_FIREBASE_EMULATORS === "true") {
  fail("Refusing to deploy Hosting with VITE_USE_FIREBASE_EMULATORS=true. Use the real Firebase web config for deployment.");
}

const firebaserc = await readFirebaserc(codeRoot);
if (!firebaserc.exists) {
  fail("Missing code/.firebaserc. Copy code/.firebaserc.example to code/.firebaserc and set the default project.");
}

if (!firebaserc.projectId) {
  fail("code/.firebaserc does not contain a real default Firebase project ID.");
}

if (webEnv.env.VITE_FIREBASE_PROJECT_ID !== firebaserc.projectId) {
  fail(`Firebase project mismatch: code/.env has ${webEnv.env.VITE_FIREBASE_PROJECT_ID}, but code/.firebaserc default is ${firebaserc.projectId}.`);
}

console.log(`Hosting deploy preflight passed for Firebase project ${firebaserc.projectId}.`);
