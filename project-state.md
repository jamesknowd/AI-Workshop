# Project state
Last updated: 2026-10-13

## Works
- Next.js site (App Router, TypeScript, plain CSS) is live on Vercel at https://ai-workshop-nine-beige.vercel.app and deploys from the main branch.
- A Supabase project exists and is linked to the repo.
- Slice 1 (sign up and log in) is done and working on the live site.
- A person can open the live site and create an account with an email and a password. They are signed in straight away, and the page shows "Signed in as" followed by their email.
- A person can log out, and the login form comes back with their email no longer shown.
- A person who logs in with a wrong password sees an error message and stays logged out.
- A person who logs in, closes the tab, and reopens the site is still signed in.
- Slice 2 (tagged tasks that persist) is done and working on the live site.
- A signed-in person can type a study task, choose one of six skills (Reading, Writing, Listening, Speaking, Vocabulary, Grammar), and click Add. The task appears in their list with its skill label.
- A person who logs out and back in finds their tasks still there with the same skill labels.
- A person can tick a task's checkbox to mark it done, and it still shows as done after they reload the page.
- A person who signs up for a second account sees none of the first account's tasks.

## In progress
- Slice 2 (tagged tasks that persist) is built in the "Slice 2" pull request, not yet merged or checked on the live site.
- Signed-in users see a task form (text plus one of the six skills) and a list of their tasks with checkboxes. Tasks are saved in a Supabase table called `tasks`.
- The `tasks` table is created by pasting SQL into the Supabase SQL Editor (it is in the pull request description). Row level security is on, so each user can read, add and update only their own rows. There is no delete policy because deleting tasks is in the Backlog.

## Broken or flaky
- `npm run lint` is listed in CLAUDE.md but there is no lint script in package.json, so it does not run. Adding ESLint was declined for now; `npm run build` is the check before pull requests.

## Environment notes
- Hosting: Vercel. Database and auth: Supabase.
- Supabase keys live in Vercel project settings (Environment Variables) and in a local .env.local file. They are never committed or pasted into chat.
- Email confirmation is turned off in Supabase, so a new account is signed in straight away with no confirmation email.
- The site uses @supabase/supabase-js (added 2026-10-13 with approval). The login session is kept in the browser's local storage.
- If login fails on a Vercel preview link but not on the live site, check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are enabled for the Preview environment in Vercel.

## Next session
- Confirm the `tasks` table exists in Supabase, then check every Slice 2 done-criterion on the preview link and, after merging, on the live site. Mark Slice 2 DONE in roadmap.md only after that.
- Heads-up for Slice 3: the summary counts tasks completed in the last 7 days, so the `tasks` table will need a column recording when each task was ticked off. That is a Slice 3 change, not part of Slice 2.
