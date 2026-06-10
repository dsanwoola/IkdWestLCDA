import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { assertLiveProjectConsistency, resolveProjectId } from "./firebase-config.mjs";

const root = new URL("../", import.meta.url);
const dataUrl = new URL("firebase-seed/firestore-data.json", root);
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

const data = JSON.parse(await readFile(dataUrl, "utf8"));
const mirrorCounts = {
  staff_by_uid: (data.staff_users || []).filter((staff) => staff.mocha_user_id).length,
  public_marriage_tracking: (data.marriage_applications || []).filter((item) => item.application_number).length,
  public_service_tracking: (data.service_requests || []).filter((item) => item.tracking_number).length,
};

if (dryRun) {
  const sourceCounts = Object.fromEntries(Object.entries(data).map(([collectionName, rows]) => [collectionName, rows.length]));
  console.log(JSON.stringify({ sourceCounts, mirrorCounts }, null, 2));
  process.exit(0);
}

const { applicationDefault, cert, getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (emulator) {
  process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
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

const db = getFirestore();
let written = 0;

for (const [collectionName, rows] of Object.entries(data)) {
  for (const row of rows) {
    const id = row.id == null ? undefined : String(row.id);
    const ref = id ? db.collection(collectionName).doc(id) : db.collection(collectionName).doc();
    await ref.set(row, { merge: true });
    written += 1;
  }
}

for (const staff of data.staff_users || []) {
  if (!staff.mocha_user_id) continue;
  await db.collection("staff_by_uid").doc(staff.mocha_user_id).set({
    staff_user_id: staff.id,
    email: staff.email || "",
    full_name: staff.full_name || "",
    role: staff.role || "citizen",
    department_id: staff.department_id || null,
    job_title: staff.job_title || "",
    is_active: staff.is_active !== 0 && staff.is_active !== false,
    updated_at: new Date().toISOString(),
  }, { merge: true });
  written += 1;
}

for (const application of data.marriage_applications || []) {
  if (!application.application_number) continue;
  await db.collection("public_marriage_tracking").doc(application.application_number).set(pick(application, [
    "application_number", "status", "groom_first_name", "groom_surname", "bride_first_name", "bride_surname",
    "proposed_marriage_date", "fee_amount", "fee_paid", "submitted_at", "reviewed_at", "approved_at",
    "certificate_number", "certificate_issued_at", "rejection_reason",
  ]), { merge: true });
  written += 1;
}

const staffById = new Map((data.staff_users || []).map((staff) => [staff.id, staff]));
for (const request of data.service_requests || []) {
  if (!request.tracking_number) continue;
  const history = (data.status_history || [])
    .filter((item) => item.tracking_number === request.tracking_number)
    .sort((left, right) => String(left.created_at || "").localeCompare(String(right.created_at || "")))
    .map((item) => ({
      ...item,
      changed_by_name: staffById.get(item.changed_by)?.full_name || null,
    }));

  await db.collection("public_service_tracking").doc(request.tracking_number).set({
    request: pick(request, ["tracking_number", "service_type", "status", "priority", "submitted_at", "resolved_at"]),
    history,
    updated_at: new Date().toISOString(),
  }, { merge: true });
  written += 1;
}

console.log(`Seeded ${written} Firestore documents${emulator ? " into the local emulator" : ""}.`);

function pick(row, fields) {
  return Object.fromEntries(fields.map((field) => [field, row[field] ?? null]));
}
