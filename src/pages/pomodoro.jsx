import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from "../context/AppContext.jsx";
import { Play, Pause, RotateCcw, Settings, Check } from 'lucide-react';

const MODES = [
  { key: 'work', label: 'Focus', color: 'var(--neon-cyan)', emoji: '🧠' },
  { key: 'shortBreak', label: 'Short Break', color: 'var(--neon-green)', emoji: '☕' },
  { key: 'longBreak', label: 'Long Break', color: '#a78bfa', emoji: '😴' },
];

export default function Pomodoro() {
  const { pomodoroSettings, update, addXP, addToast } = useApp();
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.work * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState({ ...pomodoroSettings });
  const [task, setTask] = useState('');
  const intervalRef = useRef(null);
  const totalRef = useRef(pomodoroSettings.work * 60);

  const modeConfig = MODES.find(m => m.key === mode);

  const reset = useCallback(() => {
    setRunning(false);
    clearInterval(intervalRef.current);
    const secs = pomodoroSettings[mode] * 60;
    setTimeLeft(secs);
    totalRef.current = secs;
  }, [mode, pomodoroSettings]);

  useEffect(() => { reset(); }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'work') {
              setSessions(s => s + 1);
              addXP(100);
              addToast('Focus session complete! +100 XP 🎯', 'xp');
              // Notification
              if (Notification.permission === 'granted') {
                new Notification('EduNova — Session Complete! 🎉', { body: 'Time for a break!' });
              }
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const saveSettings = () => {
    update('pomodoroSettings', tempSettings);
    setShowSettings(false);
    addToast('Timer settings saved', 'success');
    setTimeLeft(tempSettings[mode] * 60);
    totalRef.current = tempSettings[mode] * 60;
    setRunning(false);
  };

  const requestNotifPermission = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const progress = 1 - timeLeft / totalRef.current;
  const circ = 2 * Math.PI * 100;

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-header">Focus Timer</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {sessions} sessions today · {sessions * pomodoroSettings.work} min focused
          </p>
        </div>
        <button onClick={() => { setShowSettings(!showSettings); setTempSettings({ ...pomodoroSettings }); }} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', transition: 'all 0.2s',
        }}>
          <Settings size={15} />
        </button>
      </div>

      {showSettings && (
        <div className="glass-card" style={{ padding: '18px 20px', marginBottom: 20, border: '1px solid rgba(0,245,255,0.15)' }}>
          <div className="section-title" style={{ fontSize: 14, marginBottom: 14 }}>Timer Settings</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[['work', 'Focus (min)'], ['shortBreak', 'Short Break'], ['longBreak', 'Long Break']].map(([k, l]) => (
              <div key={k}>
                <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{l}</label>
                <input type="number" min="1" max="90" className="input-field" value={tempSettings[k]}
                  onChange={e => setTempSettings(s => ({ ...s, [k]: Number(e.target.value) }))} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveSettings} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Check size={13} /> Save</button>
            <button onClick={() => setShowSettings(false)} className="btn-ghost">Cancel</button>
            <button onClick={requestNotifPermission} className="btn-ghost" style={{ fontSize: 11 }}>Enable Notifications</button>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 32, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
        {MODES.map(m => (
          <button key={m.key} onClick={() => { setMode(m.key); setRunning(false); }} style={{
            flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 500,
            background: mode === m.key ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: mode === m.key ? m.color : 'var(--text-secondary)',
            border: mode === m.key ? `1px solid ${m.color}30` : '1px solid transparent',
            transition: 'all 0.2s',
          }}>{m.emoji} {m.label}</button>
        ))}
      </div>

      {/* Current task */}
      <div style={{ marginBottom: 32 }}>
        <input
          className="input-field"
          placeholder="What are you working on? (optional)"
          value={task}
          onChange={e => setTask(e.target.value)}
          style={{ textAlign: 'center', fontSize: 14 }}
        />
      </div>

      {/* Circular timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ position: 'relative', width: 240, height: 240 }}>
          <svg width="240" height="240" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            {/* Progress circle */}
            <circle
              cx="120" cy="120" r="100"
              fill="none"
              stroke={modeConfig.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${modeConfig.color}80)` }}
            />
          </svg>
          {/* Time display */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 6 }}>
              {modeConfig.emoji} {modeConfig.label}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 56, fontWeight: 700,
              color: modeConfig.color,
              letterSpacing: '-2px',
              textShadow: `0 0 20px ${modeConfig.color}60`,
              lineHeight: 1,
            }}>
              {mins}:{secs}
            </div>
            {task && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, maxWidth: 140, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {task}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={reset} style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
          <RotateCcw size={18} />
        </button>
        <button onClick={() => setRunning(r => !r)} style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `linear-gradient(135deg, ${modeConfig.color}22, ${modeConfig.color}44)`,
          border: `2px solid ${modeConfig.color}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: modeConfig.color, transition: 'all 0.2s',
          boxShadow: running ? `0 0 30px ${modeConfig.color}30` : 'none',
          fontSize: 28,
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${modeConfig.color}40`}
        onMouseLeave={e => e.currentTarget.style.boxShadow = running ? `0 0 30px ${modeConfig.color}30` : 'none'}>
          {running ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
        </button>
        <div style={{ width: 48 }} />
      </div>

      {/* Session dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i < sessions ? modeConfig.color : 'rgba(255,255,255,0.08)',
            boxShadow: i < sessions ? `0 0 6px ${modeConfig.color}` : 'none',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
        Every completed session earns you <span style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>+100 XP</span>
      </div>
    </div>
  );
}