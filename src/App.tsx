import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  Crown,
  Flame,
  Gamepad2,
  Gift,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { api, fetchProfileFromNeon } from './lib/api';

type LeaderboardRow = {
  id: string;
  username: string;
  coins: number;
  level: number;
  streak: number;
};

type User = {
  id: string;
  email: string;
  username: string;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  streak: number;
};

const demoUser: User = {
  id: 'demo-user',
  email: 'player@modernludo.app',
  username: 'Player One',
  coins: 2450,
  gems: 128,
  xp: 3200,
  level: 18,
  streak: 7,
};

const demoLeaderboard: LeaderboardRow[] = [
  { id: '1', username: 'Aarav', coins: 4200, level: 24, streak: 9 },
  { id: '2', username: 'Mira', coins: 3900, level: 23, streak: 8 },
  { id: '3', username: 'Leo', coins: 3650, level: 22, streak: 7 },
  { id: '4', username: 'Zara', coins: 3400, level: 21, streak: 6 },
];

export default function App() {
  const [user, setUser] = useState<User>(demoUser);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>(demoLeaderboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const profileData = await fetchProfileFromNeon<{ user?: User; ...User } | User | null>();
        const boardData = await api<{ players?: LeaderboardRow[] }>('/api/leaderboard', undefined, 'GET');

        if (cancelled) return;

        if (profileData && typeof profileData === 'object' && 'id' in profileData) {
          setUser(profileData as User);
        } else if (profileData && 'user' in profileData && profileData.user) {
          setUser(profileData.user as User);
        } else {
          setUser(demoUser);
        }

        setLeaderboard(boardData?.players?.length ? boardData.players : demoLeaderboard);
      } catch {
        if (!cancelled) {
          setUser(demoUser);
          setLeaderboard(demoLeaderboard);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-mesh-bg text-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[30px] border border-white/20 bg-white/10 p-4 shadow-premium backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ludoGold to-ludoOrange text-xl shadow-gold">
                ♛
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.26em] text-white/60">Ludo Rewards</div>
                <h1 className="font-heading text-xl font-extrabold">Modern Ludo</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-ludoGold/30 bg-ludoGold/10 px-3 py-2 text-sm font-bold text-ludoGold sm:block">
                <span className="inline-flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  {user.coins}
                </span>
              </div>
              <button className="ludo-button bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-900">
                <span className="inline-flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Play now
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-premium backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="mb-1 text-[10px] uppercase tracking-[0.28em] text-violet-100/70">Profile</div>
                  <h2 className="font-heading text-3xl font-extrabold">Champion's Lounge</h2>
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-yellow-200">
                  Lv {user.level}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-[-6px] rounded-full bg-gradient-to-br from-yellow-300 via-pink-400 to-violet-500 opacity-80 blur-sm" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-gradient-to-br from-violet-500 to-indigo-500 text-3xl font-black shadow-glow">
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-2xl font-black">{user.username}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-300" />
                      {user.streak} day streak
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                      {user.xp} XP
                    </span>
                  </div>
                </div>

                <div className="rounded-[24px] border border-yellow-300/40 bg-gradient-to-r from-yellow-400/30 to-orange-500/20 px-4 py-3 text-right">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-yellow-100/70">Coins</div>
                  <div className="mt-1 flex items-center justify-end gap-2 text-2xl font-black text-yellow-200">
                    <Coins className="h-5 w-5" />
                    {user.coins}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Games won', value: '126', icon: Trophy },
                  { label: 'Gems', value: user.gems, icon: Sparkles },
                  { label: 'Best streak', value: '19', icon: Flame },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-[22px] border border-white/15 bg-white/8 p-4 shadow-soft"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <item.icon className="h-5 w-5 text-white/80" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">#{index + 1}</span>
                    </div>
                    <div className="text-3xl font-extrabold">{item.value}</div>
                    <div className="text-sm text-white/70">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-premium backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.26em] text-violet-100/70">Leaderboard</div>
                  <h3 className="font-heading text-2xl font-bold">Top players</h3>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {leaderboard.length} players
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/10" />
                    ))}
                  </div>
                ) : (
                  leaderboard.slice(0, 4).map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 rounded-[22px] border border-white/15 bg-white/8 p-3"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                          index === 0
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900'
                            : index === 1
                              ? 'bg-gradient-to-r from-slate-300 to-slate-500 text-slate-900'
                              : index === 2
                                ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                                : 'bg-gradient-to-r from-violet-400 to-indigo-500 text-white'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold">{player.username}</div>
                        <div className="text-sm text-white/60">Level {player.level}</div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 font-bold text-yellow-200">
                          <Coins className="h-4 w-4" />
                          {player.coins}
                        </div>
                        <div className="text-xs text-white/60">{player.streak} day streak</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </section>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-premium backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.26em] text-violet-100/70">Reward chest</div>
                <Crown className="h-5 w-5 text-yellow-200" />
              </div>

              <div className="space-y-3">
                <button className="ludo-button w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-slate-900">
                  <span className="inline-flex items-center justify-center gap-2">
                    <Gift className="h-4 w-4" />
                    Claim Daily Chest
                  </span>
                </button>

                <button className="ludo-button w-full bg-gradient-to-r from-[#FF7675] to-[#FDCB6E] text-white">
                  <span className="inline-flex items-center justify-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Play Ranked Match
                  </span>
                </button>
              </div>
            </motion.div>

            <div className="rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-premium backdrop-blur-xl">
              <div className="mb-3 text-[10px] uppercase tracking-[0.26em] text-violet-100/70">Daily mission</div>
              <div className="space-y-3">
                {[
                  ['Daily Login', 20],
                  ['Win 1 Match', 50],
                  ['Play 3 Games', 100],
                ].map(([title, reward]) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-[20px] border border-white/15 bg-white/8 p-3"
                  >
                    <div>
                      <div className="font-bold">{title}</div>
                      <div className="text-sm text-white/60">Reward</div>
                    </div>
                    <div className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1 font-bold">
                      +{reward}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/20 bg-white/10 p-5 shadow-premium backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.26em] text-violet-100/70">Status</div>
                <ShieldCheck className="h-5 w-5 text-green-300" />
              </div>
              <div className="flex items-center gap-3 rounded-[20px] border border-white/15 bg-white/8 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-xl shadow-glow">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">Server safe</div>
                  <div className="text-sm text-white/60">No localhost crash on Vercel</div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
