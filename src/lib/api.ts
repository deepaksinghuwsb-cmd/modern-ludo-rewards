const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_WORKER_URL ||
  '';

export const sessionToken = () => localStorage.getItem('ludo-token');

/**
 * Get safe API base URL for Vercel/localhost/APK
 * - If VITE_API_URL/VITE_WORKER_URL set, use it
 * - If on Vercel (vercel.app), use relative /api
 * - If localhost, use http://localhost:8787
 * - Otherwise fallback to empty string (use mock data)
 */
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  // Explicit env config takes precedence
  if (DEFAULT_API_URL) {
    return DEFAULT_API_URL.replace(/\/$/, '');
  }

  // Vercel deployment
  if (window.location.hostname.includes('vercel.app')) {
    return '';
  }

  // Local dev
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'http://localhost:8787';
  }

  // Default to relative /api
  return '';
}

// Mock data for fallback
const mockUser = {
  id: 'demo-user-' + Math.random().toString(36).slice(2, 9),
  email: 'player@modernludo.app',
  username: 'Champion ' + Math.floor(Math.random() * 999),
  coins: Math.floor(Math.random() * 5000) + 1000,
  gems: Math.floor(Math.random() * 500) + 50,
  xp: Math.floor(Math.random() * 10000) + 1000,
  level: Math.floor(Math.random() * 30) + 5,
  streak: Math.floor(Math.random() * 20) + 1,
};

const mockLeaderboard = [
  { id: '1', username: 'Aarav', coins: 5420, level: 28, streak: 12 },
  { id: '2', username: 'Mira', coins: 4900, level: 26, streak: 10 },
  { id: '3', username: 'Leo', coins: 4350, level: 24, streak: 9 },
  { id: '4', username: 'Zara', coins: 3890, level: 22, streak: 8 },
  { id: '5', username: 'Rajesh', coins: 3420, level: 20, streak: 7 },
  { id: '6', username: 'Priya', coins: 2890, level: 18, streak: 6 },
  { id: '7', username: 'Vikram', coins: 2340, level: 16, streak: 5 },
  { id: '8', username: 'Neha', coins: 1890, level: 14, streak: 4 },
];

/**
 * Fetch with timeout and fallback
 * - 3 second timeout
 * - Never throws, always returns data
 * - Falls back to mock if unreachable
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 3000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function api<T = any>(
  path: string,
  body?: unknown,
  method = 'POST'
): Promise<T> {
  const token = sessionToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const url = baseUrl ? `${baseUrl}${path}` : path;

  try {
    // If no baseUrl and not localhost, return mock immediately
    if (!baseUrl && !url.startsWith('http')) {
      if (path.includes('/leaderboard')) {
        return { players: mockLeaderboard } as T;
      }
      if (path.includes('/profile')) {
        return { user: mockUser } as T;
      }
      if (path.includes('/missions')) {
        return { missions: [] } as T;
      }
    }

    const response = await fetchWithTimeout(
      url,
      {
        method,
        headers,
        body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
      },
      3000
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Graceful fallback to mock data
    console.warn(`API fetch failed for ${path}:`, error);

    if (path.includes('/leaderboard')) {
      return { players: mockLeaderboard } as T;
    }
    if (path.includes('/profile')) {
      return { user: mockUser } as T;
    }
    if (path.includes('/missions')) {
      return { missions: [] } as T;
    }

    // Generic error fallback
    return {} as T;
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ token: string }> {
  try {
    const data = await api<{ token: string }>('/auth/login', {
      email,
      password,
    });
    if (data.token) {
      localStorage.setItem('ludo-token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<{ token: string }> {
  try {
    const data = await api<{ token: string }>('/auth/signup', {
      email,
      password,
      username,
    });
    if (data.token) {
      localStorage.setItem('ludo-token', data.token);
    }
    return data;
  } catch (error) {
    throw error;
  }
}
