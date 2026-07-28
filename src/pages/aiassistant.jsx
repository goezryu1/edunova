import { useState, useRef, useEffect } from 'react';
import { useApp } from "../context/AppContext.jsx";
import { Send, Brain, Sparkles, BookOpen, Zap, RefreshCw, Copy } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: 'Explain a concept', prompt: 'Explain recursion in computer science with a simple example.', icon: '🧠' },
  { label: 'Study plan', prompt: 'Create a 2-week study plan for a Data Structures final exam.', icon: '📅' },
  { label: 'Summarize topic', prompt: 'Summarize the key concepts of dynamic programming.', icon: '📝' },
  { label: 'Practice problems', prompt: 'Give me 5 practice problems on binary search trees.', icon: '💪' },
  { label: 'Essay outline', prompt: 'Create an outline for an essay about the impact of AI on education.', icon: '✍️' },
  { label: 'Explain mistake', prompt: 'I got confused between Big O and Big Theta notation. Can you clarify?', icon: '🤔' },
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '12px 0', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--neon-cyan)',
          animation: `blink 1.2s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
          opacity: 0.7,
        }} />
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6, fontFamily: 'var(--font-mono)' }}>
        Nexus AI is thinking...
      </span>
    </div>
  );
}

function Message({ msg }) {
  const isAI = msg.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex', gap: 12,
      flexDirection: isAI ? 'row' : 'row-reverse',
      marginBottom: 16,
      animation: 'slide-in-up 0.3s ease',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: isAI
          ? 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(124,58,237,0.2))'
          : 'rgba(255,255,255,0.08)',
        border: isAI ? '1px solid rgba(0,245,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14,
      }}>
        {isAI ? '🤖' : '👤'}
      </div>
      <div style={{ flex: 1, maxWidth: '80%' }}>
        <div style={{
          background: isAI ? 'rgba(0,245,255,0.05)' : 'rgba(124,58,237,0.1)',
          border: `1px solid ${isAI ? 'rgba(0,245,255,0.1)' : 'rgba(124,58,237,0.2)'}`,
          borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
          padding: '12px 14px',
          color: 'var(--text-primary)',
          fontSize: 13, lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {msg.content}
        </div>
        {isAI && (
          <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
            <button onClick={copy} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: copied ? 'var(--neon-green)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', transition: 'color 0.2s',
            }}>
              <Copy size={10} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { aiChatHistory, update, addXP, addToast, user } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemMode, setSystemMode] = useState('tutor');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory, loading]);

  const systemPrompts = {
    tutor: `You are Nexus AI, an expert academic tutor. You help students understand complex concepts with clear explanations, examples, and analogies. You're encouraging, patient, and adapt to the student's level. Student name: ${user.name}.`,
    study: `You are Nexus AI, a study strategist. You help students create effective study plans, optimize their learning, and manage their academic workload. Be concise and actionable.`,
    essay: `You are Nexus AI, an academic writing coach. Help the student with essays, arguments, outlines, and writing structure. Give specific, constructive feedback.`,
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const newHistory = [...aiChatHistory, { role: 'user', content: userMsg }];
    update('aiChatHistory', newHistory);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompts[systemMode],
          messages: newHistory.slice(-12), // keep context window reasonable
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, I encountered an error. Please try again.';
      update('aiChatHistory', [...newHistory, { role: 'assistant', content: reply }]);
      addXP(10);
    } catch (err) {
      update('aiChatHistory', [...newHistory, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again. In the meantime, what topic would you like to study?"
      }]);
      addToast('Connection error — please try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    update('aiChatHistory', []);
    addToast('Chat cleared', 'info');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - 80px)', minHeight: 500, animation: 'slide-in-up 0.4s ease' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {Object.entries({ tutor: '🎓 Tutor', study: '📅 Study Coach', essay: '✍️ Writing' }).map(([k, v]) => (
            <button key={k} onClick={() => setSystemMode(k)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              background: systemMode === k ? 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${systemMode === k ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
              color: systemMode === k ? 'var(--neon-cyan)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}>{v}</button>
          ))}
        </div>
        <button onClick={clearChat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
          <RefreshCw size={11} /> Clear
        </button>
      </div>

      {/* Chat area */}
      <div className="glass-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {aiChatHistory.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                <span className="gradient-text">Nexus AI</span> is ready
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
                Your personal AI tutor. Ask me anything.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, maxWidth: 560, margin: '0 auto' }}>
                {QUICK_PROMPTS.map(q => (
                  <button key={q.label} onClick={() => sendMessage(q.prompt)} style={{
                    padding: '10px 12px', borderRadius: 10, textAlign: 'left',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-secondary)', fontSize: 12, transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,245,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,245,255,0.15)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    <span style={{ fontSize: 16 }}>{q.icon}</span>
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {aiChatHistory.map((m, i) => <Message key={i} msg={m} />)}
              {loading && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', gap: 10, alignItems: 'flex-end',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              color: 'var(--text-primary)',
              padding: '10px 14px',
              fontSize: 13,
              resize: 'none',
              maxHeight: 120,
              fontFamily: 'var(--font-body)',
              lineHeight: 1.5,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.3)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary"
            style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6,
              opacity: (!input.trim() || loading) ? 0.5 : 1,
              flexShrink: 0,
            }}
          >
            {loading ? <RefreshCw size={15} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <Send size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}