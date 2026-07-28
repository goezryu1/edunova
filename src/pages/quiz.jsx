import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { Zap, RefreshCw, Check, X, ChevronRight, RotateCcw, Sparkles, Trophy } from 'lucide-react'

const SAMPLE_TOPICS = [
  { label: 'Data Structures', icon: '🌳' },
  { label: 'Linear Algebra', icon: '📐' },
  { label: 'Photosynthesis', icon: '🌿' },
  { label: 'World War II', icon: '📜' },
  { label: 'Python Basics', icon: '🐍' },
  { label: 'Calculus', icon: '∫' },
]

function ResultScreen({ questions, answers, onRetry, onNew }) {
  const score = answers.filter((a, i) => a === questions[i].answer).length
  const pct = Math.round((score / questions.length) * 100)
  const grade = pct >= 90 ? { label: 'Excellent!', color: '#00ff88', icon: '🏆' }
    : pct >= 70 ? { label: 'Good job!', color: '#00f5ff', icon: '🎯' }
    : pct >= 50 ? { label: 'Keep going!', color: '#fbbf24', icon: '💪' }
    : { label: 'Need more practice', color: '#ff4d6d', icon: '📚' }

  return (
    <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', padding: '20px 0', animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>{grade.icon}</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: 26, fontWeight: 800, marginBottom: 6, color: grade.color }}>{grade.label}</div>
      <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'var(--ff-display)', marginBottom: 4 }}>
        {score}<span style={{ fontSize: 22, color: 'var(--text-3)', fontWeight: 400 }}>/{questions.length}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>{pct}% correct</div>

      {/* Score bar */}
      <div className="progress-bar" style={{ height: 8, marginBottom: 28 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${grade.color}, #8b5cf6)` }} />
      </div>

      {/* Per-question review */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, textAlign: 'left' }}>
        {questions.map((q, i) => {
          const correct = answers[i] === q.answer
          return (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 12,
              background: correct ? 'rgba(0,255,136,0.06)' : 'rgba(255,77,109,0.06)',
              border: `1px solid ${correct ? 'rgba(0,255,136,0.2)' : 'rgba(255,77,109,0.2)'}`,
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{correct ? '✅' : '❌'}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, lineHeight: 1.4 }}>{q.question}</div>
                {!correct && (
                  <div style={{ fontSize: 11, color: '#00ff88' }}>✓ {q.options[q.answer]}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button onClick={onRetry} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RotateCcw size={14} /> Retry
        </button>
        <button onClick={onNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} /> New Quiz
        </button>
      </div>
    </div>
  )
}

export default function Quiz() {
  const { addXP, addToast } = useApp()
  const [topic, setTopic] = useState('')
  const [numQ, setNumQ] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  const reset = () => {
    setQuestions(null); setCurrent(0); setSelected(null)
    setAnswers([]); setRevealed(false); setDone(false)
  }

  const generate = async () => {
    if (!topic.trim()) return addToast('Enter a topic first', 'error')
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are a quiz generator. Always respond with ONLY valid JSON — no markdown, no explanation, no code fences.
Return this exact shape:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}
"answer" is the 0-based index of the correct option.`,
          messages: [{
            role: 'user',
            content: `Generate ${numQ} ${difficulty} multiple-choice questions about: ${topic}. Each question must have exactly 4 options.`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      if (!parsed.questions?.length) throw new Error('Bad response')
      setQuestions(parsed.questions)
      setCurrent(0); setAnswers([]); setSelected(null); setRevealed(false); setDone(false)
      addToast(`${parsed.questions.length} questions ready! 🎯`, 'success')
    } catch {
      addToast('Could not generate quiz — try again', 'error')
    } finally {
      setLoading(false)
    }
  }

  const choose = (idx) => {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    const correct = idx === questions[current].answer
    if (correct) addXP(20)
  }

  const next = () => {
    const newAnswers = [...answers, selected]
    if (current + 1 >= questions.length) {
      setAnswers(newAnswers); setDone(true)
      const score = newAnswers.filter((a, i) => a === questions[i].answer).length
      addXP(score * 10)
      addToast(`Quiz complete! ${score}/${questions.length} correct 🏆`, 'success')
    } else {
      setAnswers(newAnswers)
      setCurrent(c => c + 1)
      setSelected(null); setRevealed(false)
    }
  }

  // ── Results screen ──────────────────────────────────────────────
  if (done && questions) {
    return (
      <div style={{ animation: 'slide-in-up 0.4s ease' }}>
        <h1 className="page-header" style={{ marginBottom: 20 }}>Quiz Results</h1>
        <ResultScreen questions={questions} answers={answers} onRetry={() => { setCurrent(0); setAnswers([]); setSelected(null); setRevealed(false); setDone(false) }} onNew={reset} />
      </div>
    )
  }

  // ── Active quiz ─────────────────────────────────────────────────
  if (questions) {
    const q = questions[current]
    const pct = (current / questions.length) * 100
    return (
      <div style={{ animation: 'slide-in-up 0.4s ease', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={reset} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>← Exit</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--ff-mono)', marginBottom: 5 }}>
              <span>{topic}</span>
              <span>{current + 1} / {questions.length}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div style={{
          padding: '28px 30px', borderRadius: 20, marginBottom: 18,
          background: 'linear-gradient(135deg, rgba(0,245,255,0.07), rgba(124,58,237,0.07))',
          border: '1px solid rgba(0,245,255,0.18)',
          boxShadow: '0 0 40px rgba(0,245,255,0.04)',
        }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--neon-cyan)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            Question {current + 1}
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--ff-display)', lineHeight: 1.55 }}>
            {q.question}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer
            const isSelected = i === selected
            let bg = 'rgba(255,255,255,0.04)'
            let border = 'rgba(255,255,255,0.07)'
            let color = 'var(--text-1)'
            if (revealed) {
              if (isCorrect) { bg = 'rgba(0,255,136,0.1)'; border = 'rgba(0,255,136,0.35)'; color = '#00ff88' }
              else if (isSelected) { bg = 'rgba(255,77,109,0.1)'; border = 'rgba(255,77,109,0.35)'; color = '#ff4d6d' }
            } else if (isSelected) {
              bg = 'rgba(0,245,255,0.1)'; border = 'rgba(0,245,255,0.3)'; color = '#00f5ff'
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={revealed} style={{
                padding: '13px 16px', borderRadius: 12, textAlign: 'left', fontSize: 13, lineHeight: 1.5,
                background: bg, border: `1px solid ${border}`, color,
                transition: 'all 0.18s', cursor: revealed ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
              }}
              onMouseEnter={e => { if (!revealed) e.currentTarget.style.background = 'rgba(0,245,255,0.07)' }}
              onMouseLeave={e => { if (!revealed) e.currentTarget.style.background = bg }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--ff-mono)', fontWeight: 700, flexShrink: 0 }}>
                  {['A','B','C','D'][i]}
                </span>
                {opt}
                {revealed && isCorrect && <Check size={14} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                {revealed && isSelected && !isCorrect && <X size={14} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>

        {/* Explanation + Next */}
        {revealed && (
          <div style={{ animation: 'slide-in-up 0.3s ease' }}>
            {q.explanation && (
              <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 14, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
                💡 {q.explanation}
              </div>
            )}
            <button onClick={next} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px' }}>
              {current + 1 < questions.length ? <><ChevronRight size={15} /> Next Question</> : <><Trophy size={15} /> See Results</>}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Setup screen ────────────────────────────────────────────────
  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-header">Quiz Generator</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 13 }}>Generate a custom quiz on any topic with AI</p>
      </div>

      <div style={{ maxWidth: 560 }}>
        {/* Topic input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Topic</label>
          <input
            className="input-field"
            placeholder="e.g. Binary Search Trees, French Revolution, Photosynthesis..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            style={{ fontSize: 14 }}
          />
        </div>

        {/* Quick topic chips */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 20 }}>
          {SAMPLE_TOPICS.map(t => (
            <button key={t.label} onClick={() => setTopic(t.label)} style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 500,
              background: topic === t.label ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${topic === t.label ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
              color: topic === t.label ? '#00f5ff' : 'var(--text-2)',
              transition: 'all 0.15s',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Options row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
          <div>
            <label style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Questions</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[3, 5, 10].map(n => (
                <button key={n} onClick={() => setNumQ(n)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 13, fontWeight: 700,
                  fontFamily: 'var(--ff-mono)',
                  background: numQ === n ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${numQ === n ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  color: numQ === n ? '#00f5ff' : 'var(--text-2)',
                  transition: 'all 0.15s',
                }}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Difficulty</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, fontSize: 11, fontWeight: 600,
                  background: difficulty === d ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${difficulty === d ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  color: difficulty === d ? '#00f5ff' : 'var(--text-2)',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}>{d}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: (!topic.trim() || loading) ? 0.6 : 1 }}
        >
          {loading
            ? <><RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating quiz...</>
            : <><Sparkles size={15} /> Generate Quiz</>
          }
        </button>
      </div>
    </div>
  )
}