import { useEffect, useState } from 'react'
import { AppProvider, useApp } from "../context/AppContext.jsx"

import Sidebar from '../components/layout/sidebar.jsx'
import Topbar from '../components/layout/topbar.jsx'
import ToastContainer from '../components/layout/toast.jsx'

import dashboard from './dashboard.jsx'
import aiassistant from './aiassistant.jsx'
import quiz from './quiz.jsx'
import flashcards from './Flashcards.jsx'
import assignments from './assignments.jsx'
import schedule from './schedule.jsx'
import pomodoro from './pomodoro.jsx'
import achievements from './achievements.jsx'
import leaderboard from './leaderboard.jsx'
import profile from './profile.jsx'
import grades from './grades.jsx'
import notes from './notes.jsx'
import pdfsummary from './pdfsummary.jsx'
import studyrooms from './studyrooms.jsx'
import files from './files.jsx'

const PAGE_MAP = {
  dashboard: dashboard,
  'aiassistant': aiassistant,
  quiz: quiz,
  flashcards: flashcards,
  assignments: assignments,
  schedule: schedule,
  pomodoro: pomodoro,
  achievements: achievements,
  leaderboard: leaderboard,
  profile: profile,
  grades: grades,
  notes: notes,
  'pdf-summary': pdfsummary,
  'study-rooms': studyrooms,
  files: files,
}

function AppShell() {
  const { activePage } = useApp()
  const Page = PAGE_MAP[activePage] || dashboard

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="ambient-bg">
        <div
          className="ambient-orb"
          style={{
            width: 600,
            height: 600,
            background: '#7c3aed',
            top: '-10%',
            left: '-5%',
            animation: 'pulse-glow 8s ease-in-out infinite',
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: 400,
            height: 400,
            background: '#00f5ff',
            bottom: '20%',
            right: '10%',
            animation: 'pulse-glow 6s ease-in-out infinite 2s',
          }}
        />
        <div
          className="ambient-orb"
          style={{
            width: 300,
            height: 300,
            background: '#00ff88',
            top: '60%',
            left: '30%',
            animation: 'pulse-glow 10s ease-in-out infinite 4s',
          }}
        />
      </div>

      <Sidebar />

      <div
        className="main-content"
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-w, 240px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          minWidth: 0,
        }}
      >
        <Topbar />

        <main
          style={{
            flex: 1,
            padding: '84px 28px 40px',
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <div key={activePage} className="page-transition">
            <Page />
          </div>
        </main>
      </div>

      <ToastContainer />

      <style>{`
        .app-enter {
          animation: app-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes app-enter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .page-transition {
          animation: page-switch 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes page-switch {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; }
          main { padding: 80px 16px 32px !important; }
        }
      `}</style>
    </div>
  )
}

function LoadingScreen({ exiting }) {
  return (
    <>
      <style>{`
        @keyframes ls-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ls-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes ls-ring {
          0%   { transform: translate(-50%, -50%) scale(0.92); opacity: 0.15; }
          50%  { transform: translate(-50%, -50%) scale(1);    opacity: 0.55; }
          100% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.08; }
        }
        @keyframes ls-ring2 {
          0%   { transform: translate(-50%, -50%) scale(0.92); opacity: 0.08; }
          50%  { transform: translate(-50%, -50%) scale(1);    opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.04; }
        }
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ls-grid {
          from { transform: translateY(0); }
          to   { transform: translateY(40px); }
        }
        @keyframes ls-blink {
          0%, 100% { opacity: 0.9; }
          50%      { opacity: 0.3; }
        }
        @keyframes ls-exit {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.04); }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #111827 0%, #0b0f19 50%, #05070d 100%)',
        zIndex: 9999,
        animation: exiting ? 'ls-exit 0.5s cubic-bezier(0.4,0,1,1) both' : 'none',
      }}>

        {/* Animated grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'ls-grid 20s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Content column */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'ls-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* Ring + Logo anchor */}
          <div style={{
            position: 'relative',
            width: 360,
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Ring 1 */}
            <div style={{
              position: 'absolute',
              width: 260,
              height: 260,
              top: '50%',
              left: '50%',
              borderRadius: '50%',
              border: '1px solid rgba(0,245,255,0.2)',
              animation: 'ls-ring 4s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            {/* Ring 2 */}
            <div style={{
              position: 'absolute',
              width: 340,
              height: 340,
              top: '50%',
              left: '50%',
              borderRadius: '50%',
              border: '1px solid rgba(0,245,255,0.1)',
              animation: 'ls-ring2 4s ease-in-out infinite 1.2s',
              pointerEvents: 'none',
            }} />

            {/* Logo text */}
            <div style={{
              fontSize: '4rem',
              fontWeight: 900,
              letterSpacing: '-3px',
              color: '#ffffff',
              lineHeight: 1,
              animation: 'ls-float 3.5s ease-in-out infinite',
              userSelect: 'none',
              position: 'relative',
              zIndex: 1,
            }}>
              EDU<span style={{ color: '#00f5ff' }}>NOVA</span>
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            marginTop: 6,
            color: '#64748b',
            fontSize: 11,
            letterSpacing: 5,
            textTransform: 'uppercase',
          }}>
            Next-gen learning OS
          </div>

          {/* Status */}
          <div style={{
            marginTop: 24,
            color: '#00f5ff',
            fontSize: 13,
            fontWeight: 600,
            animation: 'ls-blink 2s ease-in-out infinite',
          }}>
            🧠 Initializing AI Assistant...
          </div>

          {/* Spinner */}
          <div style={{
            width: 60,
            height: 60,
            margin: '20px 0 0',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #00f5ff, #8b5cf6, #00ff88, #00f5ff)',
            animation: 'ls-spin 1.6s linear infinite',
            position: 'relative',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute',
              inset: 8,
              borderRadius: '50%',
              background: '#0b0f19',
            }} />
          </div>

          {/* Feature pills */}
          <div style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 18,
            color: '#475569',
            fontSize: 12,
          }}>
            <span>⚡ Focus</span>
            <span>📚 Flashcards</span>
            <span>🎯 Quizzes</span>
            <span>🚀 XP System</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [phase, setPhase] = useState('loading') 

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exiting'), 2200)
    const t2 = setTimeout(() => setPhase('done'), 2700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase !== 'done') {
    return <LoadingScreen exiting={phase === 'exiting'} />
  }

  return (
    <div className="app-enter">
      <AppProvider>
        <AppShell />
      </AppProvider>
    </div>
  )
}