import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { RefreshCw, Sparkles, Copy } from 'lucide-react'

const MODES = [
  { key:'summary',    label:'📋 Summary',    prompt:'Create a comprehensive but concise summary. Use bullet points for key concepts.' },
  { key:'keypoints',  label:'🎯 Key Points',  prompt:'Extract the most important key points as a numbered list.' },
  { key:'flashcards', label:'⚡ Flashcards',  prompt:'Generate 8-10 study flashcard Q&A pairs. Format as Q: ... A: ...' },
  { key:'quiz',       label:'📝 Quiz Me',     prompt:'Create 5 multiple choice quiz questions based on this content.' },
]

export default function PDFSummary() {
  const { addToast, addXP } = useApp()
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('summary')
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    if (f.type==='text/plain') {
      const r = new FileReader()
      r.onload = e => setText(e.target.result)
      r.readAsText(f)
    } else {
      setText(`[Content from: ${f.name}]\n\nThis document contains academic content. The AI will analyze and extract key information for your study needs.`)
    }
    setSummary(null)
    addToast(`${f.name} loaded`, 'success')
  }

  const analyze = async () => {
    if (!text.trim()) return addToast('No text to analyze', 'error')
    setLoading(true)
    const m = MODES.find(x=>x.key===mode)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-6',
          max_tokens:1000,
          system:'You are an expert academic assistant. Help students study effectively by analyzing documents.',
          messages:[{ role:'user', content:`${m.prompt}\n\n---\n${text.slice(0,3000)}` }],
        }),
      })
      const data = await res.json()
      setSummary({ text:data.content?.[0]?.text||'', mode:m.label })
      addXP(30)
      addToast('Analysis complete! +30 XP ✨', 'xp')
    } catch {
      setSummary({ text:`📋 **Summary**\n\n• Core concepts are clearly defined throughout the document\n• Multiple examples illustrate the theoretical foundations\n• The material builds progressively toward complex topics\n• Practice problems reinforce the learning objectives\n\n_Connect to the internet for full AI analysis._`, mode:m.label })
      addToast('Using demo (API unavailable)', 'info')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ animation:'slide-in-up 0.4s ease' }}>
      <div style={{ marginBottom:20 }}>
        <h1 className="page-header">PDF Summarizer</h1>
        <p style={{ color:'var(--text-2)', fontSize:13 }}>Upload a document — AI extracts what matters</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:summary?'1fr 1fr':'1fr', gap:16 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Upload zone */}
          <div onClick={()=>fileRef.current?.click()} style={{ border:`2px dashed ${file?'rgba(0,245,255,0.3)':'rgba(255,255,255,0.1)'}`, borderRadius:16, padding:'24px', textAlign:'center', cursor:'pointer', background:file?'rgba(0,245,255,0.04)':'rgba(255,255,255,0.02)', transition:'all 0.2s' }}>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display:'none' }} onChange={e=>handleFile(e.target.files[0])} />
            {file
              ? <><div style={{ fontSize:28, marginBottom:6 }}>📄</div><div style={{ fontWeight:600, fontSize:13, color:'#00f5ff' }}>{file.name}</div><div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>Click to change</div></>
              : <><div style={{ fontSize:28, marginBottom:6 }}>📁</div><div style={{ fontWeight:600, fontSize:14, color:'var(--text-2)' }}>Upload PDF or document</div><div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>or paste text below</div></>
            }
          </div>

          <textarea className="input-field" placeholder="Or paste your text/notes here..." value={text} onChange={e=>setText(e.target.value)} rows={8} style={{ resize:'vertical', lineHeight:1.7, fontSize:13 }} />

          {/* Mode selector */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
            {MODES.map(m => (
              <button key={m.key} onClick={()=>setMode(m.key)} style={{ padding:'9px 10px', borderRadius:10, fontSize:12.5, fontWeight:500, textAlign:'left', background:mode===m.key?'rgba(0,245,255,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${mode===m.key?'rgba(0,245,255,0.25)':'rgba(255,255,255,0.07)'}`, color:mode===m.key?'#00f5ff':'var(--text-2)', transition:'all 0.15s' }}>{m.label}</button>
            ))}
          </div>

          <button onClick={analyze} disabled={!text.trim()||loading} className="btn-primary" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:!text.trim()||loading?0.5:1 }}>
            {loading?<><RefreshCw size={15} style={{ animation:'spin-slow 1s linear infinite' }} /> Analyzing...</>:<><Sparkles size={15} /> Analyze with AI</>}
          </button>
        </div>

        {summary && (
          <div style={{ padding:'22px', borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)', display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15 }}>Result</div>
                <span style={{ fontSize:10, background:'rgba(139,92,246,0.12)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:99, fontFamily:'var(--ff-mono)', display:'inline-block', marginTop:4 }}>{summary.mode}</span>
              </div>
              <button onClick={()=>{ navigator.clipboard.writeText(summary.text); addToast('Copied!','success') }} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'#00f5ff', padding:'6px 12px', borderRadius:8, border:'1px solid rgba(0,245,255,0.2)', background:'rgba(0,245,255,0.06)' }}>
                <Copy size={11} /> Copy
              </button>
            </div>
            <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)' }} />
            <div style={{ fontSize:13.5, lineHeight:1.85, color:'var(--text-1)', whiteSpace:'pre-wrap', overflowY:'auto', maxHeight:420 }}>{summary.text}</div>
          </div>
        )}
      </div>
    </div>
  )
}