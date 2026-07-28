import { useState } from 'react';
import { useApp } from "../context/AppContext.jsx";
import { Plus, Check, Trash2, ChevronDown, Filter } from 'lucide-react';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const PRIORITY_COLORS = {
  urgent: 'var(--neon-red)', high: 'var(--neon-amber)',
  medium: 'var(--neon-cyan)', low: 'var(--text-muted)',
};
const PRIORITY_BG = {
  urgent: 'rgba(255,77,109,0.08)', high: 'rgba(251,191,36,0.08)',
  medium: 'rgba(0,245,255,0.06)', low: 'rgba(255,255,255,0.03)',
};

export default function Assignments() {
  const { assignments, update, addXP, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', course: '', due: '', priority: 'medium', progress: 0 });
  const [editId, setEditId] = useState(null);

  const filtered = assignments.filter(a => {
    if (filter === 'done') return a.done;
    if (filter === 'pending') return !a.done;
    if (filter === 'urgent') return a.priority === 'urgent' && !a.done;
    return true;
  });

  const toggle = (id) => {
    const a = assignments.find(x => x.id === id);
    if (!a.done) { addXP(50); addToast('Assignment complete! +50 XP 🎉', 'xp'); }
    update('assignments', assignments.map(x => x.id === id ? { ...x, done: !x.done, progress: x.done ? x.progress : 100 } : x));
  };

  const remove = (id) => {
    update('assignments', assignments.filter(x => x.id !== id));
    addToast('Assignment removed', 'info');
  };

  const save = () => {
    if (!form.title.trim() || !form.course.trim()) return addToast('Title and course are required', 'error');
    if (editId) {
      update('assignments', assignments.map(x => x.id === editId ? { ...x, ...form } : x));
      addToast('Assignment updated', 'success');
      setEditId(null);
    } else {
      update('assignments', [...assignments, { ...form, id: Date.now(), done: false }]);
      addToast('Assignment added!', 'success');
    }
    setForm({ title: '', course: '', due: '', priority: 'medium', progress: 0 });
    setShowForm(false);
  };

  const startEdit = (a) => {
    setForm({ title: a.title, course: a.course, due: a.due, priority: a.priority, progress: a.progress });
    setEditId(a.id);
    setShowForm(true);
  };

  const daysUntil = (due) => {
    if (!due) return null;
    const diff = Math.ceil((new Date(due) - new Date()) / 86400000);
    return diff;
  };

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-header">Assignments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {assignments.filter(a => !a.done).length} pending · {assignments.filter(a => a.done).length} completed
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title:'',course:'',due:'',priority:'medium',progress:0 }); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> New
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['all','All'], ['pending','Pending'], ['urgent','Urgent 🔴'], ['done','Completed']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
            background: filter === val ? 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${filter === val ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
            color: filter === val ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>{label}</button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '18px 20px', marginBottom: 16, border: '1px solid rgba(0,245,255,0.15)' }}>
          <div className="section-title" style={{ fontSize: 14, marginBottom: 14 }}>
            {editId ? 'Edit Assignment' : 'New Assignment'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <input className="input-field" placeholder="Assignment title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <input className="input-field" placeholder="Course (e.g. CS301) *" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
            <input type="date" className="input-field" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} />
            <select className="input-field" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>
              PROGRESS: {form.progress}%
            </label>
            <input type="range" min="0" max="100" value={form.progress}
              onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: 'var(--neon-cyan)' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={14} /> Save
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Assignment list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <div>No assignments here!</div>
          </div>
        )}
        {filtered.map(a => {
          const days = daysUntil(a.due);
          const overdue = days !== null && days < 0 && !a.done;
          return (
            <div key={a.id} className="glass-card" style={{
              padding: '14px 18px',
              background: PRIORITY_BG[a.priority],
              opacity: a.done ? 0.6 : 1,
              borderLeft: `3px solid ${PRIORITY_COLORS[a.priority]}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Checkbox */}
                <button onClick={() => toggle(a.id)} style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${a.done ? 'var(--neon-green)' : PRIORITY_COLORS[a.priority]}`,
                  background: a.done ? 'rgba(0,255,136,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {a.done && <Check size={12} style={{ color: 'var(--neon-green)' }} />}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 14, fontWeight: 500,
                      textDecoration: a.done ? 'line-through' : 'none',
                      color: a.done ? 'var(--text-muted)' : 'var(--text-primary)',
                    }}>{a.title}</span>
                    <span className="badge badge-cyan" style={{ fontSize: 10 }}>{a.course}</span>
                    <span className="badge" style={{
                      fontSize: 10, background: `${PRIORITY_COLORS[a.priority]}18`,
                      color: PRIORITY_COLORS[a.priority], border: `1px solid ${PRIORITY_COLORS[a.priority]}30`,
                    }}>{a.priority}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                    {a.due && (
                      <span style={{
                        fontSize: 11, fontFamily: 'var(--font-mono)',
                        color: overdue ? 'var(--neon-red)' : 'var(--text-muted)',
                      }}>
                        {overdue ? '⚠️ ' : '📅 '}
                        {a.due}
                        {days !== null && !a.done && ` (${days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'due today' : `${days}d left`})`}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 100 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${a.progress}%` }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{a.progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(a)} style={{ color: 'var(--text-muted)', padding: 4, fontSize: 11 }}>Edit</button>
                  <button onClick={() => remove(a.id)} style={{ color: 'var(--neon-red)', padding: 4 }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}