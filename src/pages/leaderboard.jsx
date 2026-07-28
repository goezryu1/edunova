import { useApp } from '../context/AppContext'
import { Zap, Flame, Trophy, Medal, Award } from 'lucide-react'

const RANK_STYLES = {
  1: { bg: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))', border: 'rgba(251,191,36,0.35)', glow: 'rgba(251,191,36,0.2)', label: '🥇', textColor: '#fbbf24' },
  2: { bg: 'linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.04))', border: 'rgba(148,163,184,0.25)', glow: 'rgba(148,163,184,0.1)', label: '🥈', textColor: '#94a3b8' },
  3: { bg: 'linear-gradient(135deg, rgba(180,83,9,0.12), rgba(180,83,9,0.04))', border: 'rgba(180,83,9,0.3)', glow: 'rgba(180,83,9,0.1)', label: '🥉', textColor: '#c2763a' },
}

export default function Leaderboard() {
  const { leaderboard, user } = useApp()
  const you = leaderboard.find(e => e.isYou)

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-header">Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Weekly rankings by XP earned
        </p>
      </div>

      {/* Your rank callout */}
      {you && (
        <div style={{
          marginBottom: 24, padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(124,58,237,0.08))',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 0 30px rgba(0,245,255,0.05)',
        }}>
          <div style={{ fontSize: 28 }}>⚡</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
              You're ranked <span style={{ color: 'var(--neon-cyan)' }}>#{you.rank}</span> this week
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {you.xp.toLocaleString()} XP · {you.streak} day streak — keep going to climb!
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, color: 'var(--neon-cyan)' }}>
            #{you.rank}
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, vi) => {
          if (!entry) return <div key={vi} />
          const podiumOrder = [2, 1, 3]
          const rank = podiumOrder[vi]
          const rs = RANK_STYLES[rank]
          const heights = ['80px', '100px', '60px']
          return (
            <div key={entry.rank} style={{
              padding: '20px 16px',
              background: rs.bg,
              border: `1px solid ${rs.border}`,
              borderRadius: 16,
              textAlign: 'center',
              position: 'relative',
              boxShadow: `0 0 30px ${rs.glow}`,
              marginTop: vi === 1 ? 0 : 20,
            }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{entry.avatar}</div>
              <div style={{ fontSize: 22 }}>{rs.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: entry.isYou ? 'var(--neon-cyan)' : 'var(--text-primary)', marginTop: 6 }}>
                {entry.name} {entry.isYou && '(you)'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: rs.textColor, fontWeight: 700, marginTop: 4 }}>
                {entry.xp.toLocaleString()} XP
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                🔥 {entry.streak}d
              </div>
            </div>
          )
        })}
      </div>

      {/* Full list */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '44px 1fr 120px 100px 80px', gap: 12, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          <span>Rank</span><span>Student</span><span>XP</span><span>Streak</span><span>Badges</span>
        </div>

        {leaderboard.map((entry, i) => {
          const rs = RANK_STYLES[entry.rank]
          return (
            <div key={entry.rank} style={{
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'grid', gridTemplateColumns: '44px 1fr 120px 100px 80px', gap: 12,
              alignItems: 'center',
              background: entry.isYou ? 'rgba(0,245,255,0.04)' : rs ? rs.bg : 'transparent',
              border: entry.isYou ? '1px solid rgba(0,245,255,0.1)' : 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!entry.isYou) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
            onMouseLeave={e => { e.currentTarget.style.background = entry.isYou ? 'rgba(0,245,255,0.04)' : rs ? rs.bg : 'transparent' }}
            >
              {/* Rank */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {entry.rank <= 3
                  ? <span style={{ fontSize: 18 }}>{['🥇','🥈','🥉'][entry.rank-1]}</span>
                  : <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--text-muted)' }}>#{entry.rank}</span>
                }
              </div>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: entry.isYou
                    ? 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(124,58,237,0.2))'
                    : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${entry.isYou ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {entry.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: entry.isYou ? 700 : 500, color: entry.isYou ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>
                    {entry.name} {entry.isYou && <span style={{ fontSize: 10, color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>YOU</span>}
                  </div>
                </div>
              </div>

              {/* XP */}
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: rs?.textColor || 'var(--text-primary)' }}>
                {entry.xp.toLocaleString()}
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>xp</span>
              </div>

              {/* Streak */}
              <div style={{ fontSize: 12, color: 'var(--neon-amber)', fontFamily: 'var(--font-mono)' }}>
                🔥 {entry.streak}d
              </div>

              {/* Mini XP bar */}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(entry.xp / leaderboard[0].xp) * 100}%`, background: entry.isYou ? 'linear-gradient(90deg, var(--neon-cyan), var(--neon-violet))' : undefined }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}