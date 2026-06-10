import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

export const requiredWebEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

export function parseEnv(text) {
  return Object.fromEntries(text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), unquote(line.slice(index + 1))];
    }));
}

function unquote(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export async function readWebEnv(codeRoot) {
  const envUrl = new URL(".env", codeRoot);
  if (!existsSync(envUrl)) {
    return { exists: false, env: {}, missing: [...requiredWebEnv] };
  }

  const env = parseEnv(await readFile(envUrl, "utf8"));
  return {
    exists: true,
    env,
    missing: requiredWebEnv.filter((name) => !env[name] || env[name].includes("YOUR_")),
  };
}

export async function readFirebaserc(codeRoot) {
  const firebasercUrl = new URL(".firebaserc", codeRoot);
  if (!existsSync(firebasercUrl)) {
    return { exists: false, projectId: undefined, raw: null };
  }

  const raw = JSON.parse(await readFile(firebasercUrl, "utf8"));
  const projectId = raw.projects?.default;
  return {
    exists: true,
    projectId: projectId && projectId !== "YOUR_FIREBASE_PROJECT_ID" ? projectId : undefined,
    raw,
  };
}

export async function readServiceAccountFromEnv() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return validateServiceAccount(serviceAccount, "FIREBASE_SERVICE_ACCOUNT_JSON");
    } catch (error) {
      return {
        ok: false,
        source: "FIREBASE_SERVICE_ACCOUNT_JSON",
        detail: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credentialsUrl = new URL(process.env.GOOGLE_APPLICATION_CREDENTIALS, "file:///");
    if (!existsSync(credentialsUrl)) {
      return {
        ok: false,
        source: "GOOGLE_APPLICATION_CREDENTIALS",
        detail: `File not found: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      };
    }

    try {
      const serviceAccount = JSON.parse(await readFile(credentialsUrl, "utf8"));
      return validateServiceAccount(serviceAccount, "GOOGLE_APPLICATION_CREDENTIALS");
    } catch (error) {
      return {
        ok: false,
        source: "GOOGLE_APPLICATION_CREDENTIALS",
        detail: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  }

  return {
    ok: false,
    source: null,
    detail: "Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON before live import/seed",
  };
}

function validateServiceAccount(serviceAccount, source) {
  const required = ["project_id", "client_email", "private_key"];
  const missing = required.filter((field) => !serviceAccount[field]);

  return {
    ok: missing.length === 0,
    source,
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    detail: missing.length ? `Missing: ${missing.join(", ")}` : `Project ${serviceAccount.project_id}`,
  };
}

export async function resolveProjectId({ codeRoot, emulator = false } = {}) {
  if (emulator) return process.env.FIREBASE_PROJECT_ID || "ikorodu-west-lcda-local";
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;

  const serviceAccount = await readServiceAccountFromEnv();
  if (serviceAccount.ok && serviceAccount.projectId) return serviceAccount.projectId;

  if (codeRoot) {
    const firebaserc = await readFirebaserc(codeRoot);
    if (firebaserc.projectId) return firebaserc.projectId;
  }

  return undefined;
}

export async function assertLiveProjectConsistency({ codeRoot, projectId }) {
  const mismatches = [];

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== projectId) {
    mismatches.push(`FIREBASE_PROJECT_ID=${process.env.FIREBASE_PROJECT_ID}`);
  }

  if (codeRoot) {
    const firebaserc = await readFirebaserc(codeRoot);
    if (firebaserc.projectId && firebaserc.projectId !== projectId) {
      mismatches.push(`code/.firebaserc=${firebaserc.projectId}`);
    }
  }

  const serviceAccount = await readServiceAccountFromEnv();
  if (serviceAccount.ok && serviceAccount.projectId && serviceAccount.projectId !== projectId) {
    mismatches.push(`${serviceAccount.source}=${serviceAccount.projectId}`);
  }

  if (mismatches.length > 0) {
    throw new Error(`Firebase project mismatch. Resolved project is ${projectId}, but found ${mismatches.join(", ")}.`);
  }
}
