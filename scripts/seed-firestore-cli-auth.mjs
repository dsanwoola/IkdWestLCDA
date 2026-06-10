import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { readFirebaserc } from "./firebase-config.mjs";

const root = new URL("../", import.meta.url);
const codeRoot = new URL("code/", root);
const dataUrl = new URL("firebase-seed/firestore-data.json", root);
const require = createRequire(new URL("../code/package.json", import.meta.url));

const api = require("firebase-tools/lib/api");
const { Client } = require("firebase-tools/lib/apiv2");
const { getGlobalDefaultAccount, setActiveAccount } = require("firebase-tools/lib/auth");
const { requireAuth } = require("firebase-tools/lib/requireAuth");

const explicitProjectId = process.argv.find((arg) => arg.startsWith("--project="))?.slice("--project=".length);
const projectId = explicitProjectId || (await readFirebaserc(codeRoot)).projectId;

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

const data = JSON.parse(await readFile(dataUrl, "utf8"));
const documents = [];

for (const [collectionName, rows] of Object.entries(data)) {
  for (const row of rows) {
    const id = row.id == null ? randomUUID() : String(row.id);
    documents.push({ collectionName, id, row });
  }
}

for (const staff of data.staff_users || []) {
  if (!staff.mocha_user_id) continue;
  documents.push({
    collectionName: "staff_by_uid",
    id: staff.mocha_user_id,
    row: {
      staff_user_id: staff.id,
      email: staff.email || "",
      full_name: staff.full_name || "",
      role: staff.role || "citizen",
      department_id: staff.department_id || null,
      job_title: staff.job_title || "",
      is_active: staff.is_active !== 0 && staff.is_active !== false,
      updated_at: new Date().toISOString(),
    },
  });
}

for (const application of data.marriage_applications || []) {
  if (!application.application_number) continue;
  documents.push({
    collectionName: "public_marriage_tracking",
    id: application.application_number,
    row: pick(application, [
      "application_number", "status", "groom_first_name", "groom_surname", "bride_first_name", "bride_surname",
      "proposed_marriage_date", "fee_amount", "fee_paid", "submitted_at", "reviewed_at", "approved_at",
      "certificate_number", "certificate_issued_at", "rejection_reason",
    ]),
  });
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

  documents.push({
    collectionName: "public_service_tracking",
    id: request.tracking_number,
    row: {
      request: pick(request, ["tracking_number", "service_type", "status", "priority", "submitted_at", "resolved_at"]),
      history,
      updated_at: new Date().toISOString(),
    },
  });
}

for (const chunk of chunks(documents, 450)) {
  await firestore.post(`/projects/${projectId}/databases/(default)/documents:batchWrite`, {
    writes: chunk.map(({ collectionName, id, row }) => ({
      update: {
        name: documentName(projectId, collectionName, id),
        fields: toFields(row),
      },
    })),
  });
}

console.log(`Seeded ${documents.length} Firestore documents using Firebase CLI auth.`);

function documentName(projectId, collectionName, id) {
  return `projects/${projectId}/databases/(default)/documents/${encodePathSegment(collectionName)}/${encodePathSegment(id)}`;
}

function encodePathSegment(value) {
  return encodeURIComponent(String(value)).replace(/%2F/gi, "%252F");
}

function chunks(items, size) {
  const output = [];
  for (let index = 0; index < items.length; index += size) {
    output.push(items.slice(index, index + size));
  }
  return output;
}

function pick(row, fields) {
  return Object.fromEntries(fields.map((field) => [field, row[field] ?? null]));
}

function toFields(row) {
  return Object.fromEntries(
    Object.entries(row)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, toFirestoreValue(value)]),
  );
}

function toFirestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (typeof value === "string") return { stringValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === "object") return { mapValue: { fields: toFields(value) } };
  return { stringValue: String(value) };
}
