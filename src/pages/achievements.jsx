import { useApp } from '../context/AppContext'

export default function Achievements() {
  const { achievements, user } = useApp()

  const earned = achievements.filter(a => a.earned)
  const inProgress = achievements.filter(a => !a.earned)

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-header">Achievements</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {earned.length} of {achievements.length} unlocked
        </p>
      </div>

      {/* Summary bar */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))',
          border: '2px solid rgba(251,191,36,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
          boxShadow: '0 0 20px rgba(251,191,36,0.15)',
        }}>🏆</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
            {earned.length} Achievements Earned
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(earned.length / achievements.length) * 100}%` }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 5 }}>
            {achievements.length - earned.length} remaining · {earned.reduce((a, x) => a + x.xp, 0)} XP earned
          </div>
        </div>
      </div>

      {/* Earned */}
      {earned.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
            ✅ Unlocked
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 28 }}>
            {earned.map(a => (
              <AchievementCard key={a.id} a={a} />
            ))}
          </div>
        </>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
            🔒 In Progress
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {inProgress.map(a => (
              <AchievementCard key={a.id} a={a} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function AchievementCard({ a }) {
  const pct = a.earned ? 100 : a.progress != null ? Math.round((a.progress / a.total) * 100) : 0

  return (
    <div style={{
      padding: '18px 20px',
      borderRadius: 16,
      background: a.earned
        ? 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.03))'
        : 'rgba(255,255,255,0.03)',
      border: `1px solid ${a.earned ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.06)'}`,
      opacity: a.earned ? 1 : 0.7,
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.opacity = '1' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.opacity = a.earned ? '1' : '0.7' }}
    >
      {a.earned && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 40, height: 40,
          background: 'linear-gradient(135deg, rgba(251,191,36,0.3), transparent)',
          borderBottomLeftRadius: 16,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
          padding: '6px 8px', fontSize: 10,
        }}>✓</div>
      )}

      <div style={{ fontSize: 34, marginBottom: 10 }}>{a.icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>{a.desc}</div>

      {!a.earned && a.progress != null && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 5 }}>
            <span>{a.progress} / {a.total}</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: a.earned ? 'var(--neon-amber)' : 'var(--text-muted)',
        }}>
          +{a.xp} XP
        </span>
        {a.earned && (
          <span style={{ fontSize: 10, color: 'var(--neon-amber)', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', padding: '2px 8px', borderRadius: 20, fontFamily: 'var(--font-mono)' }}>
            EARNED
          </span>
        )}
      </div>
    </div>
  )
}