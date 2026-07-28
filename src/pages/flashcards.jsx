import { useState } from 'react';
import { useApp } from "../context/AppContext.jsx";
import { Plus, ChevronLeft, ChevronRight, RotateCcw, Check, X, Trash2 } from 'lucide-react';

export default function Flashcards() {
  const { flashcards, update, addXP, addToast } = useApp();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ deck: '', front: '', back: '' });
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [studied, setStudied] = useState([]);

  const decks = [...new Set(flashcards.map(f => f.deck))];
  const deckCards = currentDeck ? flashcards.filter(f => f.deck === currentDeck) : [];
  const currentCard = deckCards[cardIndex];

  const next = () => {
    setFlipped(false);
    setCardIndex(i => (i + 1) % deckCards.length);
  };
  const prev = () => {
    setFlipped(false);
    setCardIndex(i => (i - 1 + deckCards.length) % deckCards.length);
  };

  const grade = (correct) => {
    setStudied(s => [...s, { id: currentCard.id, correct }]);
    setResults(r => ({ ...r, [correct ? 'correct' : 'incorrect']: r[correct ? 'correct' : 'incorrect'] + 1 }));
    if (correct) addXP(15);
    if (cardIndex < deckCards.length - 1) { setFlipped(false); setCardIndex(i => i + 1); }
    else addToast(`Deck complete! ${results.correct + (correct ? 1 : 0)} correct 🎉`, 'success');
  };

  const resetDeck = () => {
    setCardIndex(0); setFlipped(false); setStudied([]); setResults({ correct: 0, incorrect: 0 });
  };

  const addCard = () => {
    if (!form.deck || !form.front || !form.back) return addToast('All fields required', 'error');
    update('flashcards', [...flashcards, { ...form, id: Date.now() }]);
    setForm({ deck: '', front: '', back: '' });
    setShowForm(false);
    addToast('Flashcard added!', 'success');
  };

  const removeCard = (id) => {
    update('flashcards', flashcards.filter(f => f.id !== id));
  };

  if (currentDeck) {
    return (
      <div style={{ animation: 'slide-in-up 0.4s ease', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => { setCurrentDeck(null); resetDeck(); }} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }}>
            ← Back
          </button>
          <div>
            <h1 className="page-header" style={{ fontSize: 20 }}>{currentDeck}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
              {cardIndex + 1} / {deckCards.length} · ✅ {results.correct} · ❌ {results.incorrect}
            </p>
          </div>
          <button onClick={resetDeck} style={{ marginLeft: 'auto', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginBottom: 24 }}>
          <div className="progress-fill" style={{ width: `${((cardIndex) / deckCards.length) * 100}%` }} />
        </div>

        {/* Card */}
        {currentCard && (
          <div
            onClick={() => setFlipped(f => !f)}
            style={{
              perspective: 1000, cursor: 'pointer', marginBottom: 20, height: 260,
            }}
          >
            <div style={{
              position: 'relative', width: '100%', height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* Front */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(124,58,237,0.08))',
                border: '1px solid rgba(0,245,255,0.2)',
                borderRadius: 20,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '30px 36px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>Question</div>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', lineHeight: 1.5 }}>
                  {currentCard.front}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 20 }}>Tap to reveal answer</div>
              </div>
              {/* Back */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,245,255,0.06))',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: 20,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '30px 36px', textAlign: 'center',
                transform: 'rotateY(180deg)',
              }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--neon-green)', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>Answer</div>
                <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                  {currentCard.back}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation + grading */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <button onClick={prev} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <ChevronLeft size={18} />
          </button>
          {flipped && (
            <>
              <button onClick={() => grade(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'rgba(255,77,109,0.12)', border: '1px solid rgba(255,77,109,0.25)', color: 'var(--neon-red)', fontSize: 13, fontWeight: 600 }}>
                <X size={14} /> Missed
              </button>
              <button onClick={() => grade(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: 'var(--neon-green)', fontSize: 13, fontWeight: 600 }}>
                <Check size={14} /> Got it
              </button>
            </>
          )}
          <button onClick={next} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'slide-in-up 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-header">Flashcards</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{flashcards.length} cards across {decks.length} decks</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> New Card
        </button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '18px 20px', marginBottom: 16, border: '1px solid rgba(0,245,255,0.15)' }}>
          <div className="section-title" style={{ fontSize: 14, marginBottom: 12 }}>Add Flashcard</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="input-field" placeholder="Deck name (e.g. Data Structures)" value={form.deck} onChange={e => setForm(f => ({ ...f, deck: e.target.value }))} list="deck-list" />
            <datalist id="deck-list">{decks.map(d => <option key={d} value={d} />)}</datalist>
            <textarea className="input-field" placeholder="Front: question or term" rows={2} value={form.front} onChange={e => setForm(f => ({ ...f, front: e.target.value }))} style={{ resize: 'vertical' }} />
            <textarea className="input-field" placeholder="Back: answer or definition" rows={3} value={form.back} onChange={e => setForm(f => ({ ...f, back: e.target.value }))} style={{ resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addCard} className="btn-primary"><Check size={13} /> Add Card</button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Decks grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {decks.map((deck, i) => {
          const cards = flashcards.filter(f => f.deck === deck);
          const colors = ['var(--neon-cyan)', '#a78bfa', 'var(--neon-green)', 'var(--neon-amber)'];
          const c = colors[i % colors.length];
          return (
            <div key={deck} className="glass-card" style={{ padding: '20px', cursor: 'pointer', borderTop: `3px solid ${c}` }} onClick={() => { setCurrentDeck(deck); resetDeck(); }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{deck}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cards.length} cards</div>
              <button onClick={(e) => { e.stopPropagation(); setCurrentDeck(deck); resetDeck(); }} style={{ marginTop: 14, width: '100%', padding: '8px', borderRadius: 8, background: `${c}15`, border: `1px solid ${c}25`, color: c, fontSize: 12, fontWeight: 600, transition: 'all 0.2s' }}>
                Study Now →
              </button>
            </div>
          );
        })}
        {decks.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
            <div>No flashcard decks yet. Create your first one!</div>
          </div>
        )}
      </div>

      {/* All cards list */}
      {flashcards.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>All Cards</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {flashcards.map(f => (
              <div key={f.id} className="glass-card" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{f.front}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.back.slice(0, 80)}{f.back.length > 80 ? '...' : ''}</div>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: 9, flexShrink: 0 }}>{f.deck}</span>
                <button onClick={() => removeCard(f.id)} style={{ color: 'var(--text-muted)', flexShrink: 0 }}><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}