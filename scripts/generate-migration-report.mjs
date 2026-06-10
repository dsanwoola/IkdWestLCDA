import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const outDir = new URL("firebase-seed/", root);
const firestoreData = JSON.parse(await readFile(new URL("firebase-seed/firestore-data.json", root), "utf8"));
const authData = JSON.parse(await readFile(new URL("firebase-seed/firebase-auth-users.json", root), "utf8"));
const mochaUsers = JSON.parse(await readFile(new URL("users.json", root), "utf8"));

const staffUsers = firestoreData.staff_users || [];
const roleCounts = countBy(staffUsers, "role");
const collectionCounts = Object.fromEntries(
  Object.entries(firestoreData).map(([collectionName, rows]) => [collectionName, Array.isArray(rows) ? rows.length : 0]),
);
const mirrorCounts = {
  staff_by_uid: staffUsers.filter((staff) => staff.mocha_user_id).length,
  public_marriage_tracking: (firestoreData.marriage_applications || []).filter((item) => item.application_number).length,
  public_service_tracking: (firestoreData.service_requests || []).filter((item) => item.tracking_number).length,
};
const importedUidSet = new Set((authData.users || []).map((user) => user.localId));
const adminStaff = staffUsers.filter((staff) => staff.is_active !== 0 && staff.is_active !== false && ["super_admin", "chairman", "lcda_secretary"].includes(staff.role));

const report = {
  generated_at: new Date().toISOString(),
  auth: {
    mocha_user_count: mochaUsers.length,
    firebase_auth_user_count: authData.users?.length || 0,
    google_provider_user_count: (authData.users || []).filter((user) => (user.providerUserInfo || []).some((provider) => provider.providerId === "google.com")).length,
    preserved_uid_count: mochaUsers.filter((user) => importedUidSet.has(user.id)).length,
  },
  firestore: {
    collection_counts: collectionCounts,
    mirror_counts: mirrorCounts,
    staff_role_counts: roleCounts,
    active_admin_staff: adminStaff.map((staff) => ({
      id: staff.id,
      uid: staff.mocha_user_id,
      email: staff.email,
      full_name: staff.full_name,
      role: staff.role,
    })),
  },
  live_import_notes: [
    "firebase:import-auth skips Firebase Auth users that already exist by UID.",
    "firebase:seed writes Firestore documents with merge semantics.",
    "staff_by_uid mirrors are generated from staff_users and are required by Firestore rules.",
    "public tracking mirrors intentionally expose limited tracking data only.",
  ],
};

await mkdir(outDir, { recursive: true });
await writeFile(new URL("migration-report.json", outDir), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(new URL("migration-report.md", outDir), markdown(report));

console.log("Wrote firebase-seed/migration-report.json");
console.log("Wrote firebase-seed/migration-report.md");

function countBy(rows, field) {
  return rows.reduce((counts, row) => {
    const key = String(row[field] || "unknown");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function markdown(data) {
  const lines = [
    "# Firebase Migration Report",
    "",
    `Generated: ${data.generated_at}`,
    "",
    "## Auth",
    "",
    `- Mocha users: ${data.auth.mocha_user_count}`,
    `- Firebase Auth users prepared: ${data.auth.firebase_auth_user_count}`,
    `- Google provider users: ${data.auth.google_provider_user_count}`,
    `- Preserved UID matches: ${data.auth.preserved_uid_count}`,
    "",
    "## Firestore Collections",
    "",
    ...Object.entries(data.firestore.collection_counts).map(([name, count]) => `- ${name}: ${count}`),
    "",
    "## Generated Mirror Collections",
    "",
    ...Object.entries(data.firestore.mirror_counts).map(([name, count]) => `- ${name}: ${count}`),
    "",
    "## Staff Roles",
    "",
    ...Object.entries(data.firestore.staff_role_counts).map(([role, count]) => `- ${role}: ${count}`),
    "",
    "## Active Admin Staff",
    "",
    ...data.firestore.active_admin_staff.map((staff) => `- ${staff.full_name} <${staff.email}> (${staff.role}) UID: ${staff.uid}`),
    "",
    "## Live Import Notes",
    "",
    ...data.live_import_notes.map((note) => `- ${note}`),
    "",
  ];

  return `${lines.join("\n")}\n`;
}
