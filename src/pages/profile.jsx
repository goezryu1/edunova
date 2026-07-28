import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Edit2, Check, Zap, Flame, Trophy, BookOpen, Clock } from 'lucide-react'

const ACCENT_COLORS = ['#00f5ff', '#7c3aed', '#00ff88', '#fbbf24', '#f0abfc', '#ff4d6d', '#3b82f6', '#f97316']
const AVATARS = ['👤', '🧑‍💻', '👩‍🎓', '🧑‍🎓', '🦊', '🐺', '🐉', '🦅', '🌟', '⚡', '🔥', '💎']

export default function Profile() {
  const { user, update, achievements, grades, assignments, addToast } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user.name, bio: user.bio, accentColor: user.accentColor, avatar: user.avatar || '👤' })

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const save = () => {
    update('user', { ...user, ...form })
    setEditing(false)
    addToast('Profile updated!', 'success')
  }

  const gpa = grades.length
    ? (grades.reduce((a, g) => {
        const s = { 'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D':1,'F':0 }
        return a + (s[g.letter] || 0) * g.credits
      }, 0) / grades.reduce((a, g) => a + g.credits, 0)).toFixed(2)
    : '—'

  const earned = achievements.filter(a => a.earned)
  const done = assignments.filter(a => a.done).length

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease', maxWidth: 720, margin: '0 auto' }}>
      {/* Cover banner */}
      <div style={{
        height: 140, borderRadius: '16px 16px 0 0',
        background: `linear-gradient(135deg, ${user.accentColor}22, rgba(124,58,237,0.2), rgba(0,0,0,0))`,
        border: `1px solid ${user.accentColor}25`,
        borderBottom: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 80 + i * 40, height: 80 + i * 40,
            borderRadius: '50%',
            border: `1px solid ${user.accentColor}15`,
            top: '50%', left: `${10 + i * 15}%`,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
        ))}
      </div>

      {/* Profile card */}
      <div className="glass-card" style={{ borderRadius: '0 0 16px 16px', padding: '0 24px 24px', borderTop: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 20, paddingTop: 0, transform: 'translateY(-32px)', marginBottom: -8 }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${user.accentColor}30, rgba(124,58,237,0.3))`,
            border: `3px solid ${user.accentColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
            boxShadow: `0 0 20px ${user.accentColor}40`,
          }}>
            {user.avatar || '👤'}
          </div>

          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--ff-mono)' }}>{user.username}</div>
          </div>

          <button onClick={() => editing ? save() : setEditing(true)} className={editing ? 'btn-primary' : 'btn-ghost'} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: 4 }}>
            {editing ? <><Check size={13} /> Save</> : <><Edit2 size={13} /> Edit Profile</>}
          </button>
        </div>

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, paddingTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--ff-mono)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Display Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--ff-mono)', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Bio</label>
                <input className="input-field" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--ff-mono)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Avatar</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setForm(f => ({ ...f, avatar: a }))} style={{ width: 40, height: 40, borderRadius: 10, fontSize: 20, background: form.avatar === a ? `${form.accentColor}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${form.avatar === a ? form.accentColor : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.15s' }}>{a}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--ff-mono)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Accent Color</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ACCENT_COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, accentColor: c }))} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: `3px solid ${form.accentColor === c ? 'white' : 'transparent'}`, boxShadow: `0 0 10px ${c}60`, transition: 'all 0.15s', transform: form.accentColor === c ? 'scale(1.2)' : 'scale(1)' }} />
                ))}
              </div>
            </div>

            <button onClick={() => setEditing(false)} className="btn-ghost" style={{ width: 'fit-content', fontSize: 12 }}>Cancel</button>
          </div>
        ) : (
          <div style={{ paddingTop: 16 }}>
            {user.bio && <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>{user.bio}</p>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              {user.badges?.map(b => <span key={b} className="badge badge-amber" style={{ fontSize: 10 }}>🏷️ {b}</span>)}
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { icon: <Zap size={16} />, val: user.xp.toLocaleString(), label: 'Total XP', color: '#a78bfa' },
            { icon: <Flame size={16} />, val: `${user.streak}d`, label: 'Streak', color: 'var(--amber)' },
            { icon: <Trophy size={16} />, val: `${earned.length}`, label: 'Achievements', color: 'var(--amber)' },
            { icon: <BookOpen size={16} />, val: gpa, label: 'GPA', color: 'var(--green)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: s.color, display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 20, color: s.color, letterSpacing: '-1px' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 2, fontFamily: 'var(--ff-mono)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Level progress */}
        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 13 }}>Level {user.level}</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-2)' }}>{user.xp} / {user.xpNext} XP</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${(user.xp / user.xpNext) * 100}%`, height: '100%' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 6 }}>
            {user.xpNext - user.xp} XP until Level {user.level + 1}
          </div>
        </div>

        {/* Earned achievements preview */}
        {earned.length > 0 && (
          <>
            <div className="divider" />
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--ff-display)', marginBottom: 10 }}>Badges</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {earned.map(a => (
                <div key={a.id} className="tooltip" style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {a.icon}
                  <span className="tooltip-text">{a.title}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
