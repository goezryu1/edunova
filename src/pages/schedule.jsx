import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Plus, Trash2, Clock } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const COLORS = ['#00f5ff', '#8b5cf6', '#00ff88', '#fbbf24', '#f472b6', '#fb923c', '#60a5fa']

export default function Schedule() {
  const { schedule, update, addToast } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', day: 'Monday', time: '09:00', duration: 60, color: '#00f5ff' })

  const add = () => {
    if (!form.title.trim()) return addToast('Title required', 'error')
    update('schedule', [...schedule, { ...form, id: Date.now() }])
    setForm({ title: '', day: 'Monday', time: '09:00', duration: 60, color: '#00f5ff' })
    setShowForm(false)
    addToast('Class added!', 'success')
  }

  const remove = (id) => {
    update('schedule', schedule.filter(s => s.id !== id))
    addToast('Removed', 'info')
  }

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-header">Schedule</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13 }}>{schedule.length} classes this week</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Add Class
        </button>
      </div>

      {showForm && (
        <div style={{ padding: '20px', marginBottom: 20, borderRadius: 16, background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.18)' }}>
          <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>New Class</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <input className="input-field" placeholder="Class title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ gridColumn: '1/-1' }} />
            <select className="input-field" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" className="input-field" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Duration (min)</label>
              <input type="number" className="input-field" min="15" max="300" step="15" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Color</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, flexShrink: 0,
                    border: form.color === c ? '3px solid white' : '3px solid transparent',
                    boxShadow: form.color === c ? `0 0 10px ${c}` : 'none',
                    transition: 'all 0.15s',
                  }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={add} className="btn-primary">Add Class</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Weekly grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {DAYS.map(day => {
          const dayClasses = schedule.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time))
          return (
            <div key={day} style={{
              borderRadius: 16, overflow: 'hidden',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              {/* Day header */}
              <div style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 13,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span>{day}</span>
                <span style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', fontWeight: 400 }}>
                  {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                </span>
              </div>

              {/* Classes */}
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 6, minHeight: 80 }}>
                {dayClasses.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 11, padding: '14px 0' }}>
                    No classes
                  </div>
                ) : dayClasses.map(cls => (
                  <div key={cls.id} style={{
                    padding: '9px 11px', borderRadius: 10,
                    background: `${cls.color}12`,
                    border: `1px solid ${cls.color}28`,
                    borderLeft: `3px solid ${cls.color}`,
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)' }}>
                        <Clock size={9} />
                        {cls.time} · {cls.duration}min
                      </div>
                    </div>
                    <button onClick={() => remove(cls.id)} style={{ color: 'var(--text-3)', flexShrink: 0, transition: 'color 0.15s', marginTop: 1 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ff4d6d'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Upcoming list */}
      {schedule.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--ff-display)', marginBottom: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 1 }}>All Classes</div>
          <div style={{ borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {[...schedule].sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.time.localeCompare(b.time)).map((cls, i) => (
              <div key={cls.id} style={{
                padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 14,
                borderBottom: i < schedule.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div style={{ width: 4, height: 36, borderRadius: 99, background: cls.color, boxShadow: `0 0 8px ${cls.color}60`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{cls.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginTop: 2 }}>
                    {cls.day} · {cls.time} · {cls.duration} min
                  </div>
                </div>
                <button onClick={() => remove(cls.id)} style={{ color: 'var(--text-3)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ff4d6d'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}