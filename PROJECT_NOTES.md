# Ikorodu West LCDA Government Portal

This project was imported from a Mocha export and migrated to Firebase.

## Current Project Layout

- `code/`: Vite/React app configured for Firebase Hosting.
- `d1_dump.sql`: original Cloudflare D1/SQLite production database dump.
- `users.json`: original Mocha auth users.
- `firebase-seed/firestore-data.json`: generated Firestore seed data.
- `firebase-seed/firebase-auth-users.json`: generated Firebase Auth import preview.
- `firebase-seed/migration-report.json`: generated machine-readable import summary.
- `firebase-seed/migration-report.md`: generated human-readable import summary.
- `scripts/`: migration scripts for Firestore and Auth.
- `public_asset_links.json`: original Mocha-hosted asset URL list.
- `code/public/assets/mocha/`: downloaded static assets now served by Vite/Firebase Hosting.
- `code/public/assets/leaflet/`: local Leaflet marker assets used by map pages.
- `FIREBASE_LIVE_MIGRATION.md`: checklist for the real Firebase import, seed, deploy, and smoke checks.

## What Changed

- Removed the Mocha and Cloudflare Vite runtime plugins.
- Replaced Mocha frontend auth with Firebase Auth and Google sign-in.
- Added Email/password sign-in alongside Google on the staff login screen.
- Added a browser-side compatibility API layer so existing `/api/...` calls use Firestore.
- Added Firebase Hosting config and Firestore rules.
- Added scripts to export the D1 dump and import/seed Firebase data.
- Downloaded Mocha-hosted image/assets and rewired source code to local `/assets/mocha/...` paths.
- Localized Leaflet marker icons to `/assets/leaflet/...` so map markers do not depend on CDN marker image URLs.
- Added `staff_by_uid` role mirrors for Firestore security rules.
- Added limited public tracking mirrors so public tracking does not expose full application/request records.
- Added Firebase CLI, emulator, and deploy scripts.
- Added `firebase:deploy:auth` to deploy Email/password and Google sign-in provider configuration.
- Added route aliases for legacy/staff navigation links so existing sidebar/footer/header links land on working screens after deployment.
- Removed the obsolete Cloudflare Worker source, Wrangler config, and worker TypeScript config from the active project.
- Replaced the raw Mocha export README with a Firebase-focused project README.
- Added a live Firebase migration checklist and made the Auth import script idempotent by skipping users that already exist in Firebase Auth.
- Live import/seed scripts now resolve the Firebase project ID from `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_JSON.project_id`, or `code/.firebaserc` before touching a non-emulator project.
- Live import/seed scripts now refuse to run when `FIREBASE_PROJECT_ID`, `code/.firebaserc`, and service-account credentials point at different Firebase projects.
- Added a Hosting deploy preflight that refuses missing Firebase web config, emulator config, or mismatched project IDs, then rebuilds before deploying Hosting.
- Installed the Firebase `/api` fetch shim during auth module initialization so route-level effects cannot call the old `/api` paths before the shim is active.
- Added `npm run migration:verify` to check active runtime source, local assets, seed files, Firebase dependencies, and Firebase scripts.
- Tightened the staff/citizen authorization boundary so self-registered `citizen` profiles cannot read or process staff service-request data.
- Added an awaiting-approval screen for signed-in users whose profile exists but still has the `citizen` role.
- Strengthened `npm run migration:verify` to prove Mocha user IDs are preserved in Firebase Auth seed data, staff records point at imported UIDs, Google providers are present, and the seed contains an active admin-level staff user.
- Added shared Firebase config helpers for `.env`, `.firebaserc`, service-account validation, and project-ID resolution.
- Strengthened setup validation to catch malformed service-account JSON and project-ID mismatches before live import/deploy.
- Added `npm run api:verify` to ensure frontend `/api/...` calls are covered by Firebase shim route patterns.
- Added `npm run migration:report` to generate auditable JSON and Markdown summaries of prepared Auth users, Firestore collections, mirror collections, staff roles, and active admin staff.
- Registered Firebase Web App `1:447225953983:web:323e3a6ee2bd042a8d500a` in project `ikorodu-west-lcda`.
- Enabled Email/password and Google sign-in in live Firebase Authentication.
- Enabled Cloud Firestore API, created the default Native mode Firestore database in `eur3`, and deployed Firestore rules.
- Imported the 4 Mocha Google users into live Firebase Auth and seeded 16 Firestore documents into the live database.
- Deployed Firebase Hosting to `https://ikorodu-west-lcda.web.app`.

## Local Commands

Run these from `code/`:

```powershell
npm install
npm run firebase:export-d1
npm run firebase:prepare-auth
npm run firebase:import-auth:dry-run
npm run firebase:seed:dry-run
npm run firebase:import-auth:emulator
npm run firebase:seed:emulator
npm run assets:download
npm run setup:validate
npm run build
```

The build and lint currently pass.

For a local browser check:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

The current dev server has been verified at `http://127.0.0.1:5173`.

## Firebase Setup Needed

Create or select a Firebase project with:

- Authentication enabled with Google as a sign-in provider.
- Cloud Firestore enabled in Native mode.
- Firebase Hosting enabled.

Then create `code/.env` from `code/.env.example` and fill in the Firebase Web App config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

To seed Firebase from this export, provide either:

- a Firebase service-account JSON file path through `GOOGLE_APPLICATION_CREDENTIALS`, or
- the service-account JSON as `FIREBASE_SERVICE_ACCOUNT_JSON`, plus `FIREBASE_PROJECT_ID`.

Then run from `code/`:

```powershell
npm run firebase:import-auth
npm run firebase:seed
npm run firebase:deploy
```

## Notes

- Mocha user IDs are preserved as Firebase Auth UIDs during import so existing `staff_users.mocha_user_id` role assignments continue to work.
- `staff_by_uid` is generated during seeding and is used by Firestore rules to check staff roles.
- The seeded Mocha staff data contains the initial `super_admin`. New sign-ins can self-register only as `citizen`; admin access should come from the imported staff records or later role changes by a seeded super admin.
- `public_marriage_tracking` and `public_service_tracking` hold limited public tracking responses. The full `marriage_applications` and `service_requests` collections remain staff-only for reads.
- The original Cloudflare Worker, Wrangler config, and worker TypeScript config have been removed from the active project.
- Firestore rules are role-aware and should be deployed with `npm run firebase:deploy:rules`.
- Mocha asset URLs have been downloaded into `code/public/assets/mocha/`; rerun `npm run assets:download` if `public_asset_links.json` changes.

## Firebase Commands

From `code/`:

```powershell
npm run firebase:deploy:rules
npm run firebase:deploy:hosting
npm run firebase:emulators
npm run setup:validate
```

Copy `.firebaserc.example` to `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` before deploying.

## Local Emulator Flow

For local Firebase testing:

```powershell
copy .env.emulator.example .env
npm run firebase:emulators
```

In a second terminal from `code/`:

```powershell
npm run firebase:import-auth:emulator
npm run firebase:seed:emulator
npm run dev
```

The emulator project ID defaults to `ikorodu-west-lcda-local`, and the app uses `VITE_USE_FIREBASE_EMULATORS=true` from `.env`.

To run the automated local import smoke test:

```powershell
npm run firebase:emulator:smoke
```

The Firestore emulator requires Java on PATH. Use `npm run setup:validate` to check this before running the smoke test.

## Latest Verification

Last checked in `code/`:

```powershell
npm run lint
npm run build
npm run firebase:seed:dry-run
npm run firebase:import-auth:dry-run
npm run migration:report
npm run migration:verify
npm run api:verify
npm run knip
node ../scripts/validate-hosting-deploy.mjs
```

Results:

- ESLint passes with no warnings.
- Production Vite/TypeScript build passes.
- Migration verifier passes, including checks for local Leaflet/Mocha assets, Firebase migration scripts, and no active Mocha/Cloudflare runtime references.
- Migration verifier also checks that Firestore rules exclude `citizen` from active staff access and protect service-request processing.
- Migration verifier confirms the Firebase Auth seed preserves all Mocha user IDs and Google providers, every staff record points at an imported Auth UID, and at least one active admin-level staff record exists.
- API coverage verifier passes and confirms 20 frontend `/api/...` route patterns are covered by the Firebase shim.
- Knip dependency/entry audit passes.
- Firestore dry-run seed reads 4 staff users, 8 departments, and generates 4 `staff_by_uid` mirrors.
- Firebase Auth dry-run import reads 4 Google-auth Mocha users.
- Migration report generation writes `firebase-seed/migration-report.json` and `firebase-seed/migration-report.md`.
- The current report shows 4 Mocha users, 4 Firebase Auth users prepared, 4 preserved UID matches, 4 `staff_by_uid` mirrors, 8 departments, and 1 active `super_admin`.
- Active source/package scan has no Mocha Users Service, Wrangler, Worker, or D1 runtime references.
- `npm run setup:validate` passes seed/assets checks and currently fails only for missing real `code/.env`, `.firebaserc`, service-account credentials, and Java on PATH for local emulator smoke tests.
- `npm run setup:validate` now passes live app config checks for project `ikorodu-west-lcda`; it warns only when no service account is visible in the sandbox and Java is unavailable for optional emulator smoke tests.
- `node ../scripts/validate-hosting-deploy.mjs` passes for project `ikorodu-west-lcda`.
- Live Firebase Auth export confirms 4 imported users.
- Live Firestore verification confirms 4 `staff_users`, 4 `staff_by_uid` mirrors, and 8 `departments`.
- Deployed Hosting URL and a deployed Mocha static asset both return HTTP 200.
- Local app serving has been verified with HTTP 200 at `http://127.0.0.1:5173`.
