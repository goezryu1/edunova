import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

function calcGPA(grades) {
  const scale = { 'A+': 1.0, 'A': 1.25, 'A-': 1.5, 'B+': 1.75, 'B': 2.0, 'B-': 2.25, 'C+': 2.5, 'C': 2.75, 'C-': 3.0, 'F': 5.0 };
  const totalCredits = grades.reduce((a, g) => a + g.credits, 0);
  const totalPoints = grades.reduce((a, g) => a + (scale[g.letter] || 0) * g.credits, 0);
  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
}

function getLetterGrade(pct) {
  if (pct >= 97) return 'A+';
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 60) return 'F';
  return 'F';
}

const GRADE_COLORS = { 'A+': '#00ff88', 'A': '#00ff88', 'A-': '#4ade80', 'B+': '#00f5ff', 'B': '#00f5ff', 'B-': '#38bdf8', 'C+': '#fbbf24', 'C': '#fbbf24', 'C-': '#f97316', 'D': '#f87171', 'F': 'var(--neon-red)' };

export default function Grades() {
  const { grades, update, addToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ course: '', code: '', grade: 90, credits: 3, letter: 'A-' });

  const gpa = calcGPA(grades);
  const gpaColor = parseFloat(gpa) >= 3.5 ? 'var(--neon-green)' : parseFloat(gpa) >= 2.7 ? 'var(--neon-cyan)' : parseFloat(gpa) >= 2.0 ? 'var(--neon-amber)' : 'var(--neon-red)';

  const addGrade = () => {
    if (!form.course || !form.code) return addToast('Course name and code required', 'error');
    const letter = getLetterGrade(form.grade);
    update('grades', [...grades, { ...form, id: Date.now(), letter }]);
    setForm({ course: '', code: '', grade: 90, credits: 3, letter: 'A-' });
    setShowForm(false);
    addToast('Grade added!', 'success');
  };

  const remove = (id) => update('grades', grades.filter(g => g.id !== id));

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-header">Grades</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{grades.length} courses tracked</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Add Course
        </button>
      </div>

      {/* GPA display */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center', borderTop: `3px solid ${gpaColor}` }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Cumulative GPA</div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-display)', color: gpaColor, letterSpacing: '-2px', textShadow: `0 0 20px ${gpaColor}60` }}>{gpa}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {parseFloat(gpa) >= 3.5 ? "Dean's List 🏆" : parseFloat(gpa) >= 3.0 ? 'Good Standing 👍' : 'Keep pushing 💪'}
          </div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Total Credits</div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)', letterSpacing: '-2px' }}>
            {grades.reduce((a, g) => a + g.credits, 0)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>credit hours</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Avg Score</div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#a78bfa', letterSpacing: '-2px' }}>
            {grades.length ? Math.round(grades.reduce((a, g) => a + g.grade, 0) / grades.length) : 0}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>across all courses</div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '18px 20px', marginBottom: 16, border: '1px solid rgba(0,245,255,0.15)' }}>
          <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>Add Course</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <input className="input-field" placeholder="Course name *" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
            <input className="input-field" placeholder="Code *" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
            <input type="number" className="input-field" placeholder="Grade %" min="0" max="100" value={form.grade}
              onChange={e => setForm(f => ({ ...f, grade: Number(e.target.value) }))} />
            <input type="number" className="input-field" placeholder="Credits" min="1" max="6" value={form.credits}
              onChange={e => setForm(f => ({ ...f, credits: Number(e.target.value) }))} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
            → Letter grade: <strong style={{ color: 'var(--neon-cyan)' }}>{getLetterGrade(form.grade)}</strong>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addGrade} className="btn-primary">Add Course</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Grade table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '2fr 100px 80px 80px 60px 100px 40px', gap: 12, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          <span>Course</span><span>Code</span><span>Score</span><span>Letter</span><span>Cr.</span><span>Bar</span><span></span>
        </div>
        {grades.map(g => (
          <div key={g.id} style={{
            padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'grid', gridTemplateColumns: '2fr 100px 80px 80px 60px 100px 40px', gap: 12,
            alignItems: 'center', transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{g.course}</span>
            <span className="badge badge-cyan" style={{ fontSize: 10, width: 'fit-content' }}>{g.code}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{g.grade}%</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: GRADE_COLORS[g.letter] || 'var(--text-primary)' }}>{g.letter}</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{g.credits}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${g.grade}%`, background: `linear-gradient(90deg, ${GRADE_COLORS[g.letter] || 'var(--neon-cyan)'}88, ${GRADE_COLORS[g.letter] || 'var(--neon-cyan)'})` }} />
            </div>
            <button onClick={() => remove(g.id)} style={{ color: 'var(--text-muted)' }}><Trash2 size={12} /></button>
          </div>
        ))}
        {grades.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No grades yet. Add your first course!
          </div>
        )}
      </div>
    </div>
  );
}