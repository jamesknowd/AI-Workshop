# Project state
Last updated: 2026-10-08

## Works
- Next.js site (App Router, TypeScript, plain CSS) is live on Vercel at https://ai-workshop-nine-beige.vercel.app and deploys from the main branch.
- A Supabase project exists and is linked to the repo.

## Broken or flaky
- Nothing known. The site does not use Supabase yet, so there is no sign-in and no saved data.

## Environment notes
- Hosting: Vercel. Database and auth: Supabase.
- Supabase keys live in Vercel project settings (Environment Variables) and in a local .env.local file. They are never committed or pasted into chat.
- Supabase sends a confirmation email on sign-up by default. Its built-in email sender only allows a few emails per hour, so testing sign-up repeatedly can hit that limit.

## Next session
- Start Slice 1 (sign up and log in) from roadmap.md.
- Ask before adding the Supabase client library.
