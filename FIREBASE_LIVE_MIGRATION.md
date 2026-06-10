# Firebase Live Migration Checklist

Use this checklist after the Firebase project and service account details are available.

Current live project:

- Project ID: `ikorodu-west-lcda`
- Project number: `447225953983`
- Web App ID: `1:447225953983:web:323e3a6ee2bd042a8d500a`
- Hosting URL: `https://ikorodu-west-lcda.web.app`
- Firestore database: `(default)`, Native mode, Standard edition, location `eur3`
- Authentication: Email/password and Google sign-in are enabled.

## Required Firebase Project Settings

- Authentication is enabled.
- Google is enabled as a sign-in provider.
- Cloud Firestore is enabled in Native mode.
- Firebase Hosting is enabled.

## Required Local Files

Create `code/.env` from `code/.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_FIREBASE_EMULATORS=false
```

Create `code/.firebaserc` from `code/.firebaserc.example`:

```json
{
  "projects": {
    "default": "YOUR_REAL_FIREBASE_PROJECT_ID"
  }
}
```

Provide service-account credentials through one of these:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
```

or:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT_JSON = '<full service account json>'
$env:FIREBASE_PROJECT_ID = 'YOUR_REAL_FIREBASE_PROJECT_ID'
```

## Preflight

From `code/`:

```powershell
npm run setup:validate
npm run lint
npm run build
npm run migration:report
npm run migration:verify
npm run api:verify
npm run firebase:import-auth:dry-run
npm run firebase:seed:dry-run
```

`setup:validate` checks that the Firebase web config and `.firebaserc` point at the same project. If a service account is provided, it also checks the JSON shape and verifies the service-account project matches `.firebaserc`.

The live import and seed commands also refuse to run if `FIREBASE_PROJECT_ID`, `code/.firebaserc`, or the provided service-account JSON resolve to different project IDs.

## Live Import And Deploy

From `code/`:

```powershell
npm run firebase:deploy:auth
npm run firebase:import-auth
npm run firebase:seed
npm run firebase:deploy:rules
npm run firebase:deploy:hosting
```

For a logged-in Firebase CLI session, the project also supports:

```powershell
npm run firebase:import-auth:cli-auth
npm run firebase:seed:cli-auth
npm run firebase:verify-live
```

`firebase:deploy:auth` deploys the Email/password and Google sign-in provider configuration from `code/firebase.json`.

`firebase:import-auth` is idempotent. It skips Mocha users that already exist in Firebase Auth and imports only missing users.

`firebase:seed` uses Firestore merges, so rerunning it updates seed records and mirrors without deleting live records.

`firebase:deploy` and `firebase:deploy:hosting` run `validate-hosting-deploy.mjs` and rebuild `dist` before deploying. The preflight refuses emulator config and catches mismatched project IDs between `code/.env` and `code/.firebaserc`.

## Post-Deploy Checks

- Open the Firebase Hosting URL.
- Confirm public pages load images from `/assets/mocha/...`.
- Sign in with Google using one imported staff email.
- Visit `/staff` and confirm the imported staff role is recognized.
- Check Firestore collections:
  - `staff_users`
  - `staff_by_uid`
  - `departments`
  - `public_marriage_tracking`
  - `public_service_tracking`
- Submit a test service request and verify `/track?id=...` can read the public tracking mirror.
