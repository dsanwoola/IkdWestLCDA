# Ikorodu West LCDA Government Portal

This is the standalone Firebase migration of the exported Mocha app for the Ikorodu West LCDA official government portal.

Live Firebase deployment:

- Project ID: `ikorodu-west-lcda`
- Project number: `447225953983`
- Hosting URL: `https://ikorodu-west-lcda.web.app`
- Firestore: default Native mode database in `eur3`
- Auth providers: Email/password and Google sign-in

## Project Layout

- `code/` - Vite, React, Firebase Hosting app.
- `d1_dump.sql` - original Cloudflare D1/SQLite database export.
- `users.json` - original Mocha auth users.
- `firebase-seed/` - generated Firestore and Firebase Auth import data.
- `scripts/` - migration, seed, Firebase CLI wrapper, asset download, and validation scripts.
- `public_asset_links.json` - original Mocha asset URLs kept as migration evidence.
- `code/public/assets/mocha/` - downloaded static assets served locally by the app.
- `PROJECT_NOTES.md` - detailed migration notes and latest verification status.
- `FIREBASE_LIVE_MIGRATION.md` - live import/deploy checklist for the real Firebase project.

## Requirements

- Node.js and npm.
- A Firebase project with Authentication, Firestore Native mode, and Hosting enabled.
- Google sign-in enabled in Firebase Authentication.
- A Firebase service account for live imports and seeding.
- Java on PATH only if you want to run Firebase emulator smoke tests locally.

## Local Setup

From `code/`:

```powershell
npm install
copy .env.example .env
copy .firebaserc.example .firebaserc
```

Fill `code/.env` with the Firebase web app config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_FIREBASE_EMULATORS=false
```

Replace `YOUR_FIREBASE_PROJECT_ID` in `code/.firebaserc`.

## Migration Commands

From `code/`:

```powershell
npm run firebase:export-d1
npm run firebase:prepare-auth
npm run firebase:seed:dry-run
npm run firebase:import-auth:dry-run
```

For live Firebase import/seed, set either `GOOGLE_APPLICATION_CREDENTIALS` to a service-account JSON path or set `FIREBASE_SERVICE_ACCOUNT_JSON` plus `FIREBASE_PROJECT_ID`, then run:

```powershell
npm run firebase:import-auth
npm run firebase:seed
```

If Firebase CLI is already logged in, these commands can be used instead:

```powershell
npm run firebase:import-auth:cli-auth
npm run firebase:seed:cli-auth
npm run firebase:verify-live
```

See `FIREBASE_LIVE_MIGRATION.md` for the full live migration checklist.

`npm run setup:validate` validates the Firebase web config, `.firebaserc`, seed files, downloaded assets, service-account JSON shape, and project-ID consistency before live import/deploy.

## Build And Deploy

From `code/`:

```powershell
npm run lint
npm run build
npm run migration:report
npm run migration:verify
npm run api:verify
npm run firebase:deploy:auth
npm run firebase:deploy
```

You can deploy only one target when needed:

```powershell
npm run firebase:deploy:auth
npm run firebase:deploy:rules
npm run firebase:deploy:hosting
```

The hosting/full deploy scripts run a preflight check and rebuild `dist` before deploying, so the hosted bundle uses the real Firebase web config from `code/.env`.

## Local Firebase Emulators

From `code/`:

```powershell
copy .env.emulator.example .env
npm run firebase:emulators
```

In another terminal:

```powershell
npm run firebase:import-auth:emulator
npm run firebase:seed:emulator
npm run dev
```

To run the automated emulator smoke test:

```powershell
npm run firebase:emulator:smoke
```

The Firestore emulator requires Java on PATH.
