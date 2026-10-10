# Modern Ludo Rewards

Free-to-play Ludo built with React, TypeScript, Vite, Zustand, Tailwind CSS, Framer Motion, Cloudflare Workers (Hono), Durable Objects, Neon Postgres, Drizzle ORM, and Capacitor.

## Requirements

- Node.js 20+
- Neon Postgres database
- Cloudflare account for deployment (Wrangler local development works without an account)
- Android Studio for Android builds

## Neon database setup

1. Create a Neon project and copy its pooled connection string.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`. Keep `.env` out of Git.
3. Push the Drizzle schema to Neon:

```sh
npm install
npm run db:push
```

`db:studio` opens Drizzle Studio against `DATABASE_URL`.

## Run locally

```sh
npm install
cp .env.example .env
cp .dev.vars.example .dev.vars
npm run dev
```

In a second terminal, set the same Neon URL and a long random `JWT_SECRET` in `.dev.vars`, then run:

```sh
npm run worker:dev
```

Vite runs at `http://localhost:5173`; the Worker runs at `http://localhost:8787`. Set `VITE_WORKER_URL` in `.env` to the Worker URL if you use a different port.

## Build and deploy

```sh
npm run build
npx wrangler secret put DATABASE_URL
npx wrangler secret put JWT_SECRET
npm run worker:deploy
```

Set `VITE_WORKER_URL` to the deployed Worker origin before building the web client. Cloudflare provisions the `LUDO_ROOM` Durable Object binding from `wrangler.toml`.

## Android

```sh
npm run android:add
npm run android:sync
npx cap open android
```

Set the production Worker URL in `.env` before syncing the Android web bundle. The generated Android project is ignored by Git.

## Security and game rules

- Each match has one Durable Object that serializes authoritative roll and move requests and broadcasts state changes over WebSockets.
- Dice come only from Worker `crypto.getRandomValues()`; the client sends `POST /api/roll` with the match and signed-in player IDs.
- The Worker validates turn ownership, pending dice, token selection, path bounds, safe cells, captures, and win conditions before writing moves.
- Only the Worker changes coins, XP, levels, mission progress, and the ledger.
- Passwords are PBKDF2 hashed and sessions are signed by the Worker. Keep `JWT_SECRET` and `DATABASE_URL` out of the frontend and Git.
- This is free-to-play. Coins and gems have no cash value. There are no entry fees, UPI payments, cash withdrawals, wallet transfers, or real-money prizes.
