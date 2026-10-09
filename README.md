# Ludo League

Free-to-play Ludo for web and Android, built with React, TypeScript, Vite, Zustand, Tailwind, Cloudflare Workers (Hono), Supabase, and Capacitor.

## Requirements

- Node.js 20+
- A Supabase project
- Cloudflare Wrangler (included as a development dependency)
- Android Studio for Android builds

## Run the web app

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY` (the Supabase anon/publishable key), and `VITE_WORKER_URL` in `.env.local`. Apply `supabase.sql` in the Supabase SQL Editor. Enable email/password authentication. In Supabase Auth settings, add your local web URL (for example `http://localhost:5173`) to the allowed redirect URLs.

## Run the Worker

In a second terminal, set the Worker secrets and start Wrangler:

```sh
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npm run worker:dev
```

Set `SUPABASE_URL` in `wrangler.toml` to your project URL (or configure it as a Worker variable). Set `VITE_WORKER_URL=http://localhost:8787` in `.env.local`. Keep the service role key only in Worker secrets; never place it in a `VITE_` variable or commit it.

## Android

```sh
npm run android:add
npm run android:sync
npx cap open android
```

Configure the same Supabase and Worker URLs in the web build environment before syncing. Use HTTPS endpoints for a production build. The Android project is generated locally by Capacitor and is not checked in.

## Game and data notes

- Dice are generated in the Worker with `crypto.getRandomValues()`.
- The Worker checks turn ownership, dice, token ownership, move distance, home entry, safe cells, captures, and wins before saving a move.
- Coin, XP, mission, and shop balance writes happen in the Worker.
- Realtime match events use a Supabase Broadcast channel per match.
- Coins and gems have no cash value. There are no cash stakes, entry fees, payments, withdrawals, transfers, or real-money prizes.

The app requires Supabase and Worker configuration for online play. Never expose the Supabase service role key to the frontend.
