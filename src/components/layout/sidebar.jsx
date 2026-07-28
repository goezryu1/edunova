import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, Brain, Zap, BookOpen, CheckSquare, Timer,
  Calendar, BarChart2, Users, Files, FileText, StickyNote,
  Trophy, Medal, User, Settings, X
} from 'lucide-react'

const NAV = [
  { group: 'Learn', items: [
    { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'aiassistant', label: 'AI Assistant',   icon: Brain,      badge: 'AI' },
    { id: 'quiz',         label: 'Quiz Generator', icon: Zap,        badge: 'AI' },
    { id: 'flashcards',   label: 'Flashcards',     icon: BookOpen },
    { id: 'notes',        label: 'AI Notes',       icon: StickyNote, badge: 'AI' },
  ]},
  { group: 'Organize', items: [
    { id: 'assignments',  label: 'Assignments',    icon: CheckSquare },
    { id: 'schedule',     label: 'Schedule',       icon: Calendar },
    { id: 'pomodoro',     label: 'Focus Timer',    icon: Timer },
    { id: 'grades',       label: 'Grades',         icon: BarChart2 },
  ]},
  { group: 'Connect', items: [
    { id: 'study-rooms',  label: 'Study Rooms',    icon: Users },
    { id: 'files',        label: 'File Sharing',   icon: Files },
    { id: 'pdf-summary',  label: 'PDF Summarizer', icon: FileText, badge: 'AI' },
  ]},
  { group: 'Progress', items: [
    { id: 'achievements', label: 'Achievements',   icon: Trophy },
    { id: 'leaderboard',  label: 'Leaderboard',    icon: Medal },
    { id: 'profile',      label: 'Profile',        icon: User },
  ]},
]

export default function Sidebar() {
  const { user, activePage, setActivePage, sidebarOpen, setSidebarOpen } = useApp()

  const nav = (id) => { setActivePage(id); setSidebarOpen(false) }

  return (
    <>
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)', zIndex: 99,
        }} />
      )}

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Rainbow top line already in CSS ::before */}

        {/* Logo */}
        <div style={{
          padding: '18px 18px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, fontWeight: 900, color: '#04040a',
              fontFamily: 'var(--ff-display)',
              boxShadow: '0 0 18px rgba(0,245,255,0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
              flexShrink: 0,
            }}>N</div>
            <div>
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', lineHeight: 1.1 }}>EduNova</div>
              <div style={{ fontSize: 9.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', letterSpacing: 0.5 }}>STUDENT AI</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--text-3)', display: 'none' }} id="sidebar-close">
            <X size={17} />
          </button>
        </div>

        {/* User mini */}
        <div className="user-mini" onClick={() => nav('profile')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(0,245,255,0.18), rgba(139,92,246,0.3))',
              border: '2px solid rgba(0,245,255,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, boxShadow: '0 0 14px rgba(0,245,255,0.2)',
            }}>
              {user.avatar || '👤'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, fontFamily: 'var(--ff-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-2)', fontFamily: 'var(--ff-mono)' }}>
                Lv.{user.level} · {user.streak}🔥 streak
              </div>
            </div>
          </div>
          <div style={{ marginTop: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--text-3)', marginBottom: 4, fontFamily: 'var(--ff-mono)' }}>
              <span>XP Progress</span>
              <span>{user.xp} / {user.xpNext}</span>
            </div>
            <div className="progress-bar" style={{ height: 3 }}>
              <div className="progress-fill" style={{ width: `${(user.xp / user.xpNext) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '6px 8px', overflowY: 'auto' }}>
          {NAV.map(g => (
            <div key={g.group} style={{ marginBottom: 2 }}>
              <div className="nav-group-label">{g.group}</div>
              {g.items.map(item => {
                const Icon = item.icon
                const active = activePage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => nav(item.id)}
                    className={`nav-item${active ? ' active' : ''}`}
                  >
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontSize: 9, fontFamily: 'var(--ff-mono)', fontWeight: 700,
                        background: active ? 'rgba(0,245,255,0.18)' : 'rgba(139,92,246,0.15)',
                        color: active ? 'var(--cyan)' : '#c4b5fd',
                        padding: '1px 5px', borderRadius: 4, letterSpacing: 0.3,
                      }}>{item.badge}</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => nav('profile')}
            className="nav-item"
            style={{ color: 'var(--text-3)' }}
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>
          <div style={{ padding: '8px 10px', fontSize: 9.5, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>
            v1.0.0 — EduNova - AI
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-close { display: flex !important; }
        }
      `}</style>
    </>
  )
}