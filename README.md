# AI Security Academy — self-hosted

A complete AI-security learning platform (built on the OWASP AI Exchange): 18 modules /
109 lessons, quizzes, spaced-repetition flashcards, a 100-question senior interview lab,
threat/control explorers, a guided "Today" study plan and learning paths — plus optional
**accounts, cross-device sync, and an owner usage dashboard** via Supabase.

It's a **static site** (one `index.html` + `config.js`). No build step, no server to run.

---

## What's in here

| File | Purpose |
|---|---|
| `index.html` | The whole app (self-contained, ~2.9 MB). |
| `config.js` | Your runtime settings (Supabase keys). **Not committed** — see `.gitignore`. |
| `config.example.js` | Template to copy into `config.js`. |
| `supabase/schema.sql` | Database tables, security policies, and the owner-analytics function. |
| `vercel.json` / `netlify.toml` | Hosting config + security headers (CSP) for each platform. |

---

## Option A — Just host it (no login), ~5 minutes

Progress stays per-browser (localStorage). Leave `config.js` blank.

**Vercel**
1. Put this folder in a Git repo (GitHub/GitLab/Bitbucket).
2. vercel.com → *Add New → Project* → import the repo.
3. Framework preset: **Other**. Build command: *(empty)*. Output dir: `./`. Deploy.

**Netlify**
1. Same repo.
2. app.netlify.com → *Add new site → Import an existing project* → pick the repo.
3. Build command: *(empty)*. Publish directory: `.`. Deploy.

*(Or skip Git entirely: Netlify → drag-and-drop this folder onto the deploy zone.)*

That's it — Mermaid diagrams and everything else work out of the box.

---

## Option B — Add accounts, cross-device sync & owner analytics, ~30 minutes

You'll create a free Supabase project and paste two values into `config.js`. Five steps:

### 1. Create a Supabase project
[supabase.com](https://supabase.com) → *New project*. Pick a region near you. Wait ~2 min.

### 2. Create the database
Supabase → **SQL Editor** → *New query* → paste the entire contents of
`supabase/schema.sql` → **Run**. This creates the `progress` table, row-level security
(each user can only touch their own row), and the `owner_stats()` analytics function.

### 3. Make yourself an owner (for the Admin dashboard)
In the SQL Editor, run (with your real email):
```sql
insert into public.owners(email) values ('you@example.com') on conflict do nothing;
```

### 4. Fill in `config.js`
Supabase → **Project Settings → API**. Copy the **Project URL** and the **anon public** key:
```js
window.AISEC_CONFIG = {
  SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi...your anon key...",
  OWNER_EMAIL: "you@example.com",     // same email you inserted above
  AUTH_METHOD: "magiclink"            // or "google" (see step 5)
};
```
The anon key is **designed to be public** — it's safe in the browser. Real security comes
from the row-level policies in step 2, not from hiding this key.

### 5. Configure sign-in redirects
Supabase → **Authentication → URL Configuration**:
- **Site URL**: your deployed URL (e.g. `https://your-app.vercel.app`).
- **Redirect URLs**: add the same URL (and `http://localhost:...` if testing locally).

*Magic-link* email works with zero extra setup. To use Google instead, set
`AUTH_METHOD: "google"` and enable Google under **Authentication → Providers**.

Deploy (Option A steps). Done — a **"Sign in to sync"** button appears top-right; signing in
with your owner email reveals an **Admin · Usage** link in the sidebar.

---

## How sync works (and its guarantees)

- The app keeps writing to **localStorage** as always (works offline, instant).
- When signed in, every change also **debounce-pushes** the full state to your Supabase
  `progress` row; on sign-in it **pulls + merges** (max progress, best quiz scores, latest
  streak, newest flashcard schedule) so no device "wins" destructively.
- **Row-level security** means a signed-in learner can only ever read/write *their own* row.
- The **owner dashboard** reads aggregate stats through a `SECURITY DEFINER` function that
  refuses anyone whose email isn't in the `owners` table — learners cannot see each other.
- No secrets live in the browser except the public anon key.

## Notes
- Mermaid and Supabase load from jsDelivr CDN; the CSP in `vercel.json`/`netlify.toml`
  already allows exactly those origins plus your Supabase project. If you self-host those
  libraries instead, update the CSP `script-src`/`connect-src` accordingly.
- To rebuild `index.html` from source (the shell + module fragments), re-run the project's
  `assemble.py --deploy`; you normally won't need to.
- Content is from the OWASP AI Exchange (CC0). This site makes **no AI/LLM calls at runtime.**
