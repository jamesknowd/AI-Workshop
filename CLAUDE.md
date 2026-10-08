# CLAUDE.md

## Stack
- Next.js with the App Router, TypeScript, plain CSS (no Tailwind, no UI kits)
- Supabase for login and data storage
- Vercel for hosting; pushing to main deploys the live site

## Commands
- npm install    installs dependencies
- npm run dev    runs the site locally at http://localhost:3000
- npm run build  checks the production build; run before every pull request
- npm run lint   checks code style

## Never
- Add a dependency without asking first.
- Edit .env, .env.local, or any environment variable.
- Change auth configuration without saying what is changing and why.
- Create new top-level folders.
- Put keys, passwords, or connection strings in code, commits, or chat.
- Work on anything outside the ACTIVE slice.

## Conventions
- Plain CSS only. Keep styles in the existing CSS files.
- TypeScript everywhere. No "any" unless it is explained in a comment.
- One pull request per piece of work, with a title that names the slice.
- Skill tags are exactly: Reading, Writing, Listening, Speaking, Vocabulary, Grammar.
- Every Supabase table that holds user data has row level security turned on, so each user sees only their own rows.
- At the end of each session, update project-state.md.
- A slice is done only when every done-criterion in roadmap.md passes on the live site.

## Current focus
See roadmap.md. Work only on the slice marked ACTIVE.
