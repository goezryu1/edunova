import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Trash2, Sparkles, RefreshCw, Search } from 'lucide-react'

export default function Notes() {
  const { notes, update, addXP, addToast } = useApp()
  const [selected, setSelected] = useState(notes[0] || null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ title:'', course:'', tags:'', content:'', aiGenerated:false })

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.course.toLowerCase().includes(search.toLowerCase())
  )

  const generateAI = async () => {
    if (!form.title.trim()) return addToast('Enter a title/topic first', 'error')
    setLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-6',
          max_tokens:1000,
          system:'You are an expert note-taker. Create clear, structured study notes with headings, bullet points, key definitions, and important concepts.',
          messages:[{ role:'user', content:`Create comprehensive study notes about: ${form.title}` }],
        }),
      })
      const data = await res.json()
      setForm(f => ({ ...f, content: data.content?.[0]?.text || '', aiGenerated:true }))
      addToast('AI notes generated! ✨', 'success')
    } catch {
      addToast('API unavailable — write notes manually', 'error')
    } finally { setLoading(false) }
  }

  const save = () => {
    if (!form.title || !form.content) return addToast('Title and content required', 'error')
    const note = { id:Date.now(), ...form, tags:form.tags.split(',').map(t=>t.trim()).filter(Boolean), created:new Date().toISOString().split('T')[0] }
    update('notes', [...notes, note])
    setSelected(note)
    setShowForm(false)
    setForm({ title:'', course:'', tags:'', content:'', aiGenerated:false })
    if (form.aiGenerated) addXP(20)
    addToast('Note saved!', 'success')
  }

  const remove = (id) => {
    update('notes', notes.filter(n => n.id !== id))
    if (selected?.id === id) setSelected(notes.find(n => n.id !== id) || null)
  }

  return (
    <div style={{ animation:'slide-in-up 0.4s ease', display:'flex', gap:14, height:'calc(100vh - var(--topbar-h) - 80px)', minHeight:400 }}>
      {/* Sidebar list */}
      <div style={{ width:272, flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ position:'relative', flex:1 }}>
            <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
            <input className="input-field" placeholder="Search notes..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:30, fontSize:12 }} />
          </div>
          <button onClick={()=>{ setShowForm(true); setSelected(null) }} className="btn-primary" style={{ padding:'8px 12px', flexShrink:0 }}>
            <Plus size={15} />
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:5 }}>
          {filtered.map(n => (
            <div key={n.id} onClick={()=>{ setSelected(n); setShowForm(false) }} style={{
              padding:'12px 14px', borderRadius:12, cursor:'pointer',
              background: selected?.id===n.id ? 'linear-gradient(135deg,rgba(0,245,255,0.1),rgba(139,92,246,0.1))' : 'rgba(255,255,255,0.03)',
              border:`1px solid ${selected?.id===n.id?'rgba(0,245,255,0.2)':'rgba(255,255,255,0.05)'}`,
              transition:'all 0.18s',
            }}>
              <div style={{ fontWeight:600, fontSize:13, color:selected?.id===n.id?'#00f5ff':'var(--text-1)', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</div>
              <div style={{ fontSize:10.5, color:'var(--text-3)', marginTop:3, fontFamily:'var(--ff-mono)' }}>{n.course} · {n.created}</div>
              {n.aiGenerated && <span style={{ fontSize:9, background:'rgba(139,92,246,0.15)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.25)', padding:'1px 6px', borderRadius:4, fontFamily:'var(--ff-mono)', fontWeight:700, marginTop:4, display:'inline-block' }}>AI</span>}
            </div>
          ))}
          {filtered.length===0 && <div style={{ textAlign:'center', padding:'28px 0', color:'var(--text-3)', fontSize:12 }}><div style={{ fontSize:28, marginBottom:6 }}>📭</div>No notes yet</div>}
        </div>
      </div>

      {/* Content panel */}
      <div style={{ flex:1, borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {showForm ? (
          <div style={{ padding:'22px 24px', overflowY:'auto', flex:1 }}>
            <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:16, marginBottom:16 }}>New Note</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <input className="input-field" placeholder="Title / Topic *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <input className="input-field" placeholder="Course (e.g. CS301)" value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} />
                <input className="input-field" placeholder="Tags (comma-separated)" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} />
              </div>
              <button onClick={generateAI} disabled={loading} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:10, fontSize:13, fontWeight:600, background:'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(0,245,255,0.1))', border:'1px solid rgba(139,92,246,0.3)', color:'#c4b5fd', transition:'all 0.2s', opacity:loading?0.7:1, cursor:'pointer' }}>
                {loading ? <><RefreshCw size={14} style={{ animation:'spin-slow 1s linear infinite' }} /> Generating...</> : <><Sparkles size={14} /> Generate with AI ✨</>}
              </button>
              <textarea className="input-field" placeholder="Note content..." rows={10} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} style={{ resize:'vertical', lineHeight:1.7 }} />
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={save} className="btn-primary">Save Note</button>
                <button onClick={()=>setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </div>
          </div>
        ) : selected ? (
          <div style={{ padding:'24px', overflowY:'auto', flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <h2 style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:800, marginBottom:6 }}>{selected.title}</h2>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                  {selected.course && <span style={{ fontSize:10, fontFamily:'var(--ff-mono)', fontWeight:700, background:'rgba(0,245,255,0.1)', color:'#00f5ff', border:'1px solid rgba(0,245,255,0.22)', padding:'2px 8px', borderRadius:99 }}>{selected.course}</span>}
                  {selected.aiGenerated && <span style={{ fontSize:10, background:'rgba(139,92,246,0.12)', color:'#c4b5fd', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:99, fontFamily:'var(--ff-mono)' }}>AI Generated</span>}
                  <span style={{ fontSize:11, color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>{selected.created}</span>
                </div>
              </div>
              <button onClick={()=>remove(selected.id)} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#ff4d6d', transition:'opacity 0.15s' }}><Trash2 size={13} /> Delete</button>
            </div>
            {selected.tags?.length>0 && <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>{selected.tags.map(t=><span key={t} style={{ fontSize:11, fontFamily:'var(--ff-mono)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--text-2)', padding:'2px 8px', borderRadius:5 }}>#{t}</span>)}</div>}
            <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)', margin:'14px 0' }} />
            <div style={{ fontSize:13.5, lineHeight:1.85, color:'var(--text-1)', whiteSpace:'pre-wrap' }}>{selected.content}</div>
          </div>
        ) : (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--text-3)' }}>
            <div style={{ fontSize:44, marginBottom:10 }}>📝</div>
            <div style={{ fontSize:14, marginBottom:4 }}>Select a note or create a new one</div>
            <button onClick={()=>setShowForm(true)} className="btn-primary" style={{ marginTop:14, display:'flex', alignItems:'center', gap:6 }}><Plus size={14} /> New Note</button>
          </div>
        )}
      </div>
    </div>
  )
}