import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Gamepad2, LockKeyhole } from 'lucide-react';
import { api } from '../lib/api';
import { useGameStore as useStore } from '../store/useGameStore';

const daily = [
  ['daily_login', 'Daily login', 'Open the game today', 20, 1],
  ['play_3', 'On a roll', 'Play 3 matches', 50, 3],
  ['win_1', 'Top of the table', 'Win 1 match', 50, 1],
] as const;

function Missions() {
  const user = useStore((s) => s.user);
  const notify = useStore((s) => s.notify);
  const [rows, setRows] = useState<any[]>([]);
  async function load() {
    if (user) try { setRows((await api<{ missions: any[] }>('/api/missions', undefined, 'GET')).missions); } catch { /* show missions when service is available */ }
  }
  useEffect(() => { void load(); }, [user?.id]);
  async function claim(type: string) {
    try { await api('/api/missions/claim', { type }); notify('Mission reward added to your account.'); void load(); }
    catch (e) { notify((e as Error).message); }
  }
  return <div className="missions-card"><span className="eyebrow">YOUR DAILY CHECK-IN</span><h2>Missions</h2><p className="muted">Small wins, extra coins. Your daily missions reset at midnight IST.</p>
    {daily.map(([type, title, desc, reward, goal], i) => {
      const row = rows.find((x) => x.type === type);
      return <div className="mission" key={type}><div className="mission-icon">{['☀', '🎲', '♛'][i]}</div><div className="mission-info"><b>{title}</b><span>{desc}</span></div><span className="mission-reward">+{reward} ◉</span>{row?.claimed ? <span className="mission-progress">✓</span> : row?.progress >= goal ? <button className="mission-claim" onClick={() => claim(type)}>Claim</button> : <span className="mission-progress">{row?.progress || 0}/{goal}</span>}</div>;
    })}
  </div>;
}

export default function Lobby() {
  const nav = useNavigate();
  const user = useStore((s) => s.user);
  const notify = useStore((s) => s.notify);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState('');
  async function create(privateRoom: boolean) {
    if (!user) { notify('Sign in to create or join a match.'); nav('/profile'); return; }
    try { setLoading(privateRoom ? 'create' : 'quick'); const r = await api<{ matchId: string; roomCode: string }>('/api/create-match', { private: privateRoom, quick: !privateRoom }); nav(`/game/${r.matchId}`, { state: { roomCode: r.roomCode } }); }
    catch (e) { notify((e as Error).message); } finally { setLoading(''); }
  }
  async function join() {
    if (!user) { notify('Sign in to join a match.'); nav('/profile'); return; }
    try { setLoading('join'); const r = await api<{ matchId: string }>('/api/join-match', { room_code: code }); nav(`/game/${r.matchId}`); }
    catch (e) { notify((e as Error).message); } finally { setLoading(''); }
  }
  return <div className="page lobby-dark">
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero">
      <div className="hero-copy"><span className="pill"><span className="live-dot" /> FREE TO PLAY · INDIA FIRST</span><h1>Your next<br /><em>great game.</em></h1><p>Roll the dice. Outsmart your friends. Earn coins just by playing.</p>
        <div className="hero-buttons"><button className="button button-lime" onClick={() => create(false)} disabled={!!loading}><Gamepad2 size={18} />{loading === 'quick' ? 'Finding your table…' : 'Quick match'}<ChevronRight size={18} /></button><button className="button button-ghost" onClick={() => create(true)} disabled={!!loading}><LockKeyhole size={17} /> Create room</button></div>
        <div className="hero-note">No entry fees. No cash prizes. Just Ludo.</div>{user && <div className="hero-note player-level">LEVEL {user.level} · 🔥 {user.streak} DAY STREAK</div>}
      </div>
      <div className="hero-art"><div className="sun-orbit orbit-one" /><div className="sun-orbit orbit-two" /><motion.div className="ludo-die" animate={{ rotate: [-12, -6, -12], y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity }}><span /><span /><span /><span /><span /><span /></motion.div><div className="art-tag tag-top">YOUR MOVE <b>↗</b></div><div className="art-tag tag-bottom">♟ &nbsp; FRIENDS ARE WAITING</div><span className="sparkle s1">✦</span><span className="sparkle s2">✳</span></div>
    </motion.section>
    <section className="join-row"><div><span className="eyebrow">PLAY WITH YOUR PEOPLE</span><h2>Got a room code?</h2></div><div className="join-form"><input value={code} onChange={(e) => setCode(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6))} placeholder="Enter 6-character code" maxLength={6} /><button className="button button-dark" disabled={code.length !== 6 || !!loading} onClick={join}>{loading === 'join' ? 'Joining…' : 'Join room'}<ChevronRight size={16} /></button></div></section>
    <div className="lower-grid"><Missions /><div className="side-card"><span className="eyebrow">THE CLASSIC, REIMAGINED</span><h2>One board.<br />Endless rematches.</h2><p>Play with friends, family, or jump into a quick match. Your next favourite rivalry starts here.</p><Link to="/leaderboard" className="text-link">See who's on top <ChevronRight size={15} /></Link><div className="card-decoration">✦</div></div></div>
    <div className="free-play-note">FREE-TO-PLAY ONLY · NO GAMBLING · NO REAL MONEY PRIZES</div>
  </div>;
}
