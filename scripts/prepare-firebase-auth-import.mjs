import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const usersUrl = new URL("users.json", root);
const outDir = new URL("firebase-seed/", root);
const outUrl = new URL("firebase-auth-users.json", outDir);

const mochaUsers = JSON.parse(await readFile(usersUrl, "utf8"));
const users = mochaUsers.map((user) => ({
  localId: user.id,
  email: user.email,
  displayName: user.google_user_data?.name,
  photoUrl: user.google_user_data?.picture,
  emailVerified: Boolean(user.google_user_data?.email_verified),
  providerUserInfo: user.google_sub ? [{
    providerId: "google.com",
    rawId: user.google_sub,
    email: user.email,
    displayName: user.google_user_data?.name,
    photoUrl: user.google_user_data?.picture,
  }] : [],
}));

await mkdir(outDir, { recursive: true });
await writeFile(outUrl, JSON.stringify({ users }, null, 2));
console.log(`Wrote ${outUrl.pathname}`);
