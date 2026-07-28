import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Bell, Search, Menu, X, Zap } from 'lucide-react'

const PAGE_TITLES = {
  dashboard:'Dashboard',aiassistant:'AI Assistant',quiz:'Quiz Generator',
  flashcards:'Flashcards',notes:'AI Notes',assignments:'Assignments',
  schedule:'Schedule',pomodoro:'Focus Timer',grades:'Grades',
  'study-rooms':'Study Rooms',files:'File Sharing','pdf-summary':'PDF Summarizer',
  achievements:'Achievements',leaderboard:'Leaderboard',profile:'Profile',
}

export default function Topbar() {
  const { user, notifications, activePage, setSidebarOpen, markNotifRead } = useApp()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const unread = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0

  return (
    <header className="topbar">
      {/* Hamburger — mobile only */}
      <button className="icon-btn" id="hamburger" onClick={() => setSidebarOpen(s => !s)}>
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {PAGE_TITLES[activePage] || 'EduNova AI'}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Streak pill */}
      <div className="pill pill-amber" style={{ gap: 5 }}>
        🔥 <span>{user.streak}d</span>
      </div>

      {/* XP pill */}
      <div className="pill pill-violet" style={{ gap: 5 }}>
        <Zap size={11} /> <span>{user.xp.toLocaleString()}</span>
      </div>

      {/* Search */}
      <button className="icon-btn" onClick={() => setShowSearch(true)}>
        <Search size={15} />
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button className="icon-btn" onClick={() => setShowNotifs(!showNotifs)} style={{ color: unread > 0 ? 'var(--cyan)' : 'var(--text-2)', position: 'relative' }}>
          <Bell size={15} />
          {unread > 0 && <span className="notif-dot">{unread}</span>}
        </button>

        {showNotifs && (
          <div className="notif-dropdown">
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 13 }}>Notifications</span>
              <button onClick={() => setShowNotifs(false)} style={{ color: 'var(--text-3)' }}><X size={14} /></button>
            </div>
            {notifications.map(n => (
              <div key={n.id} onClick={() => markNotifRead(n.id)} style={{
                padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: n.read ? 'transparent' : 'rgba(0,245,255,0.035)',
                cursor: 'pointer', transition: 'background 0.15s',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(0,245,255,0.035)'}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                  background: n.read ? 'transparent' : 'var(--cyan)',
                  boxShadow: n.read ? 'none' : '0 0 6px rgba(0,245,255,0.7)',
                  border: n.read ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }} />
                <div>
                  <div style={{ fontSize: 12, color: n.read ? 'var(--text-2)' : 'var(--text-1)', lineHeight: 1.4 }}>{n.msg}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginTop: 2 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div onClick={() => setShowSearch(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          zIndex: 200, display: 'flex',
          alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 560, margin: '0 16px',
            background: 'rgba(7,7,16,0.98)',
            border: '1px solid rgba(0,245,255,0.22)',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 0 60px rgba(0,245,255,0.12), 0 40px 80px rgba(0,0,0,0.6)',
            animation: 'drop-in 0.2s var(--ease)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
              <Search size={17} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
              <input autoFocus className="input-field"
                placeholder="Search notes, assignments, courses..."
                style={{ border: 'none', background: 'transparent', fontSize: 14, padding: '0' }}
                onKeyDown={e => e.key === 'Escape' && setShowSearch(false)}
              />
              <kbd style={{ fontSize: 10, color: 'var(--text-3)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 7px', borderRadius: 5, fontFamily: 'var(--ff-mono)', flexShrink: 0 }}>ESC</kbd>
            </div>
            <div style={{ padding: '8px 18px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginBottom: 8, letterSpacing: 0.5 }}>QUICK JUMP</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Dashboard','AI Assistant','Assignments','Grades','Flashcards'].map(l => (
                  <button key={l} onClick={() => setShowSearch(false)} style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-2)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(0,245,255,0.08)'; e.currentTarget.style.color='var(--cyan)'; e.currentTarget.style.borderColor='rgba(0,245,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        #hamburger { display: none; }
        @media (max-width: 768px) { #hamburger { display: flex !important; } }
      `}</style>
    </header>
  )
}