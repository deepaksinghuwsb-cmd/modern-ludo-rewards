const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_WORKER_URL ||
  '';

export const sessionToken = () => localStorage.getItem('ludo-token');

export function getApiBaseUrl() {
  if (typeof window === 'undefined') return '';
  if (API_URL) return API_URL.replace(/\/$/, '');
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  return '';
}

const demoUser = {
  id: 'demo-user',
  email: 'player@modernludo.app',
  username: 'Player One',
  coins: 2450,
  gems: 128,
  xp: 3200,
  level: 18,
  streak: 7,
};

const demoLeaderboard = [
  { id: '1', username: 'Aarav', coins: 4200, level: 24, streak: 9 },
  { id: '2', username: 'Mira', coins: 3900, level: 23, streak: 8 },
  { id: '3', username: 'Leo', coins: 3650, level: 22, streak: 7 },
  { id: '4', username: 'Zara', coins: 3400, level: 21, streak: 6 },
];

export async function fetchProfileFromNeon<T = any>(): Promise<T | null> {
  const neonUrl = import.meta.env.VITE_NEON_URL || import.meta.env.VITE_SUPABASE_URL || '';

  if (!neonUrl) {
    return demoUser as T;
  }

  try {
    const response = await fetch(neonUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          SELECT id, email, username, coins, gems, xp, level, streak
          FROM profiles
          ORDER BY updated_at DESC
          LIMIT 1
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Neon profile fetch failed');
    }

    const payload = await response.json();
    const row = payload?.rows?.[0] || payload?.data?.[0] || null;
    return (row ?? demoUser) as T;
  } catch {
    return demoUser as T;
  }
}

export async function api<T = any>(path: string, body?: unknown, method = 'POST'): Promise<T> {
  const token = sessionToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  try {
    if (!baseUrl) {
      if (path.includes('/leaderboard')) return { players: demoLeaderboard } as T;
      if (path.includes('/profile')) return { user: demoUser } as T;
      if (path.includes('/missions')) return { missions: [] } as T;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Request failed');
    }

    return await response.json();
  } catch {
    if (path.includes('/leaderboard')) return { players: demoLeaderboard } as T;
    if (path.includes('/profile')) return { user: demoUser } as T;
    return { missions: [] } as T;
  }
}

export async function signIn(email: string, password: string) {
  const data = await api<{ token: string }>('/auth/login', { email, password });
  localStorage.setItem('ludo-token', data.token);
  return data;
}

export async function signUp(email: string, password: string, username: string) {
  const data = await api<{ token: string }>('/auth/signup', { email, password, username });
  localStorage.setItem('ludo-token', data.token);
  return data;
}
