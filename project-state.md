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

## Broken or flaky
- `npm run lint` is listed in CLAUDE.md but there is no lint script in package.json, so it does not run. Adding ESLint was declined for now; `npm run build` is the check before pull requests.

## Environment notes
- Hosting: Vercel. Database and auth: Supabase.
- Supabase keys live in Vercel project settings (Environment Variables) and in a local .env.local file. They are never committed or pasted into chat.
- Email confirmation is turned off in Supabase, so a new account is signed in straight away with no confirmation email.
- The site uses @supabase/supabase-js (added 2026-10-13 with approval). The login session is kept in the browser's local storage.
- If login fails on a Vercel preview link but not on the live site, check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are enabled for the Preview environment in Vercel.

## Next session
- Start Slice 2 (tagged tasks that persist) from roadmap.md.
