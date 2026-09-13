# InferaNotes

Turn public YouTube lectures into private study notes in English, Hindi, Hinglish or Marathi. All features are free for now. There are no payments, subscriptions or paid tiers.

## Run locally

Use Node.js 22 or newer. Install with `npm ci`. Copy `.env.example` to `.env.local` and fill in your own configuration, then run `npm run dev`. The landing page builds without credentials; sign-in and generation require valid credentials.

## Backend and deployment

The backend is included in the Next.js application and deploys to the existing Vercel project along with the frontend. Firebase provides automatic anonymous guest sessions and Firestore persistence. There is no login screen. A separate backend host is not needed.

Set these variables in Vercel for Production and Preview, then redeploy:

| Variable | Source |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app config |
| `FIREBASE_PROJECT_ID` | Firebase project |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin service account |
| `FIREBASE_PRIVATE_KEY` | Service account private key; escaped newlines are supported |
| `GEMINI_API_KEY` | Google AI Studio |
| `GEMINI_MODEL` | Available free-tier model, default `gemini-3.5-flash-lite` |
| `GROQ_API_KEY`, `GROQ_MODEL` | Optional short-transcript fallback |
| `DAILY_GENERATION_LIMIT` | Optional, defaults to 10 attempts per user per UTC day |

Do not commit `.env.local` or service-account JSON. Do not prefix admin credentials or AI keys with `NEXT_PUBLIC_`.

Enable the Anonymous provider in Firebase Authentication and authorize the actual Vercel production domain. Guest sessions start automatically when opening the workspace; no account or popup is required. Notes remain tied to that browser's persisted session: clearing site data or switching devices loses access. Existing authenticated sessions retain their notes. Daily limits are per guest identity, not per person, and can be bypassed by resetting browser data; Firebase's anonymous signup throttling is not a substitute for broader abuse controls. Create Firestore, then deploy the supplied rules and indexes:

```sh
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project YOUR_FIREBASE_PROJECT_ID
```

Wait for the notes index to finish building. Deploy the API and Firestore rules together: the old client SDK data access is replaced by server-only Admin SDK access. The new rules deny direct browser access to all database collections. Server code verifies Firebase ID tokens and checks ownership for every note. Existing note IDs and Firestore Timestamp values remain supported.

The existing GitHub integration can deploy pushes to `main` to Vercel. Alternatively, authenticate Vercel CLI, link the existing `inferanotes` project and run `vercel --prod`. Verify one short captioned video in a guest workspace, reload to verify persistence, and check that a second browser cannot open the first browser's notes after credentials and rules are configured.

## Behavior

- A single authenticated `POST /api/generate` validates the source, reserves an attempt transactionally, retrieves captions, generates directly in the selected language and saves notes.
- Identical requests for an existing note return that note without consuming an attempt. One active generation per account. Failures count toward the daily attempt limit to limit retry abuse. Interrupted leases expire after four minutes.
- Public caption extraction is best effort. Paste a transcript of 100 to 90,000 characters when extraction is blocked. Inputs are never silently truncated.
- Notes use safe Markdown with raw HTML disabled. Timestamp links open the source lecture. Copy and Markdown downloads are available; Save PDF uses the browser print dialog and supports Indic scripts.
- Notes are private, paginated and deletable. Search filters the notes loaded in the current notebook view.
- Free provider capacity is shared across all users and can be exhausted. No paid fallback is enabled by this code. Keep provider accounts on free plans to avoid charges. Model availability must be verified in your provider account.
- Transcripts are sent to the configured AI provider. Do not submit sensitive material. Automatic fallback, when enabled, sends the same content to Groq. Raw transcripts and video files are not persisted.

## API

Send a Firebase ID token as `Authorization: Bearer <token>`. Client-supplied user IDs are never trusted.

| Endpoint | Purpose |
| --- | --- |
| `POST /api/generate` | `{url, language, detail, transcript?}` -> `{noteId, cached}` |
| `GET /api/notes?cursor=...` | Current user's paginated note metadata |
| `GET /api/notes/:id` | Owned note |
| `DELETE /api/notes/:id` | Delete owned note |
| `GET /api/usage` | Current user's daily attempt allowance |

The old public transcript, translation and usage-mutation endpoints are removed. `/pricing` redirects to the workspace for old bookmarks.

## Verification

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser checks use the production build and verify desktop/mobile layouts, language previews, direct workspace access, legacy redirects and unauthenticated API denial. Live Firebase guest sessions, database authorization and AI generation need the real service configuration and are not simulated by those checks.
