# Ikorodu West LCDA Portal Handoff

## Source of Truth

- GitHub: https://github.com/dsanwoola/IkdWestLCDA
- Branch: `main`
- Local path on VPS: `/root/projects/IkdWestLCDA`
- App root: `code/`
- App type: Vite + React single-page app
- Firebase target: Firebase Hosting + Firestore rules

## Firebase

- Project ID: `ikorodu-west-lcda`
- Project number: `447225953983`
- Web App ID: `1:447225953983:web:323e3a6ee2bd042a8d500a`
- Hosting URL: https://ikorodu-west-lcda.web.app
- Firestore database: `(default)`, Native mode, Standard edition

## Local Setup

From `code/`:

```bash
npm ci
cp .env.example .env
cp .firebaserc.example .firebaserc
```

Fill `code/.env` with the Firebase Web App API key from Firebase Console or:

```bash
npx -y firebase-tools@latest apps:sdkconfig WEB 1:447225953983:web:323e3a6ee2bd042a8d500a --project ikorodu-west-lcda
```

Do not commit `code/.env`, service-account JSON files, or Firebase private keys.

## Verification Commands

From `code/`:

```bash
npm run lint
npm run build
npm run api:verify
node ../scripts/validate-hosting-deploy.mjs
npm run firebase:verify-live
```

`npm run migration:report`, `npm run migration:verify`, and seed dry-runs require the private ignored `firebase-seed/` source files. A fresh Git clone will not have those files unless they are restored separately.

## Deployment Commands

From `code/`:

```bash
npm run firebase:deploy:rules
npm run firebase:deploy:hosting
```

## Latest VPS Verification

- Firebase CLI auth: logged in as `dsanwoola@gmail.com`.
- `npm ci`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run api:verify`: passed.
- `npm run firebase:verify-live`: passed; live Firestore has 4 `staff_users`, 4 `staff_by_uid`, and 8 `departments`.
- Firebase Auth providers: Email/password and Google sign-in deployed/enabled.
- Firebase Auth authorized domains: `ikorodu-west-lcda.firebaseapp.com`, `ikorodu-west-lcda.web.app`, `ikoroduwestlcda.com`, and `www.ikoroduwestlcda.com`.
- Staff Portal Google sign-in UI includes visible loading/error handling and Google account selection prompt.
- Firestore rules deploy: complete.
- Hosting deploy: complete.
- Live URL smoke checks: `/`, `/about`, `/services`, `/staff`, `/staff/login`, and `/contact` return HTTP 200; `/staff/login` renders the Staff Portal login with Google button in headless Chrome.

## Live Smoke Checklist

- Open https://ikorodu-west-lcda.web.app
- Confirm home/about/services/contact pages load.
- Confirm `/staff` opens the staff login route.
- Confirm Firebase Auth Google/email sign-in with an authorized imported staff account.
- Confirm public tracking mirrors remain limited and staff-only data stays protected by Firestore rules.
