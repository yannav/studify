# Cramly: AI study assistant

A dark, neon-green landing page for an AI study assistant, plus a working demo
app: a library of uploaded files, a tutor chat that cites page numbers,
spaced-repetition flashcards and practice quizzes. No model is called; answers
come from hand-written study packs, so it runs offline and costs nothing.

```sh
bun install
bun run dev        # http://localhost:5333
bun run typecheck
bun run build
```

## Screens

| Route | What it is |
| --- | --- |
| `/` | Landing: hero with the fanned file stack and upload, features, how it works, stats, testimonials, pricing, FAQ, call to action, newsletter |
| `/pricing` | Plans with a monthly/yearly switch, comparison table, FAQ |
| `/about` | Story, numbers, values, contact form |
| `/login`, `/signup` | Sign-in and account creation (demo: validated by the Worker, kept in localStorage) |
| `/app` | Library: streak, cards due, quiz average, search and subject filter, delete with confirm |
| `/app/chat` | Ask Cramly: scripted tutor with citations, suggestions, streamed replies, retry on error |
| `/app/flashcards` | Flip cards (Space), grade Again/Hard/Good/Easy (1 to 4), due-only or whole deck |
| `/app/quiz` | One question at a time, explanations, score ring, review, history |
| `/styleguide` | Every token and component in every state, rendered by the real code |
| anything else | 404 |

## Where things live

- Copy, plans, FAQ and image paths: `src/content.ts`. Every photo and render goes through `IMAGES`, so swap in your own files in `public/images/` from one place.
- Study packs (summaries, flashcards, quiz questions, tutor answers): `src/shared/packs.ts`. `packForFile` picks a pack for an upload; `answer` is the scripted tutor.
- Form rules shared by the page and the Worker: `src/shared/validate.ts`.
- Tokens (colours, radii, shadows, motion): `src/styles.css`. Components: `src/components/`. Sections of the landing page: `src/sections/`. Pages: `src/pages/` (app screens in `src/pages/app/`).
- App state (library, card progress, quiz history, chats, user, streak days): `src/lib/library.ts`, saved in localStorage under `cramly:`. The account menu in the app has "Reset demo data".

## Worker routes

All in `src/worker/index.ts`. Each validates its input and answers JSON; nothing is stored server-side.

| Route | Body | Answers |
| --- | --- | --- |
| `GET /api/health` | | `{ ok: true }` |
| `POST /api/upload` | `{ name, size }` | 200 with a document and its pack id, 422 for a wrong type or size |
| `POST /api/chat` | `{ packId, message }` | 200 with `{ reply: { text, cite, suggestions } }`, 404 unknown pack, 422 empty question |
| `POST /api/signup` | `{ name, email, password, level, terms }` | 200 with the user, 422 with field errors |
| `POST /api/login` | `{ email, password }` | 200 with the user, 422 with field errors |
| `POST /api/subscribe` | `{ email }` | 200 or 422 |
| `POST /api/contact` | `{ name, email, message }` | 200 or 422 |
| anything else under `/api/` | | 404 JSON |

## Making it real

- Read the uploaded file and build a pack with a model in `/api/upload` (store files in R2, packs in D1).
- Replace `answer` in `/api/chat` with a model call grounded in the stored pack.
- Swap `/api/login` and `/api/signup` for Sign in with Freebuff and move the library from localStorage to D1.

Images were generated for this template; replace them with your own product art.
