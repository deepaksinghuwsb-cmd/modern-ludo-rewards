import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users } from '../src/db/schema';

neonConfig.fetchConnectionCache = true;

type Env = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  LUDO_ROOM: DurableObjectNamespace;
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

function getTodayIST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    try {
      const sql = neon(env.DATABASE_URL);
      const db = drizzle(sql);

      // AUTH SIGNUP
      if (url.pathname === '/auth/signup' && req.method === 'POST') {
        const { email, password, username } = await req.json() as any;
        if (!email ||!password) return json({ error: 'Missing fields' }, 400);

        const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existing.length > 0) return json({ error: 'Account already exists' }, 400);

        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');

        const inserted = await db.insert(users).values({
          email,
          password_hash: hashHex,
          username: username || email.split('@')[0],
          xp: 0,
          weekly_xp: 0,
          level: 1,
          coins: 100,
        }).returning();

        return json({ user: inserted[0], token: 'demo-token-' + inserted[0].id });
      }

      // AUTH LOGIN - FIXED WITH DETAILED LOGGING
      if (url.pathname === '/auth/login' && req.method === 'POST') {
        try {
          const { email, password } = await req.json() as any;
          if (!email ||!password) return json({ error: 'Missing fields' }, 400);

          const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (found.length === 0) return json({ error: 'User not found' }, 404);

          const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
          const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');

          if (found[0].password_hash!== hashHex) return json({ error: 'Wrong password' }, 401);

          return json({ user: found[0], token: 'demo-token-' + found[0].id });
        } catch (e: any) {
          console.error('LOGIN ERROR FULL:', e.message, e.stack, e.cause);
          return json({ error: 'Login failed: ' + e.message }, 500);
        }
      }

      // LUDO ROOM ROUTING (keep your existing logic here if needed)
      if (url.pathname.startsWith('/ludo/') || url.pathname.startsWith('/socket')) {
        const id = env.LUDO_ROOM.idFromName('global');
        const obj = env.LUDO_ROOM.get(id);
        return obj.fetch(req);
      }

      return json({ error: 'Not found: ' + url.pathname }, 404);

    } catch (err: any) {
      console.error('GLOBAL ERROR:', err.message, err.stack);
      return json({ error: 'Server error: ' + err.message }, 500);
    }
  }
};

// Keep your LudoRoom class if you have it - add below
export class LudoRoom {
  state: any;
  env: any;
  constructor(state: any, env: any) { this.state = state; this.env = env; }
  async fetch(req: Request) { return new Response('Ludo Room OK'); }
}