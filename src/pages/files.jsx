import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { Upload, Trash2, Download, Search, FolderOpen } from 'lucide-react'

const DEMO_FILES = [
  { id:1, name:'CS301_Lecture_Notes.pdf',      size:'2.4 MB', type:'pdf',  course:'CS301',   uploaded:'2025-06-08', uploader:'Alex Chen' },
  { id:2, name:'LinearAlgebra_CheatSheet.pdf', size:'890 KB', type:'pdf',  course:'MATH201', uploaded:'2025-06-07', uploader:'Sarah K.' },
  { id:3, name:'Physics_Lab_Report.docx',      size:'1.1 MB', type:'doc',  course:'PHYS202', uploaded:'2025-06-06', uploader:'Alex Chen' },
  { id:4, name:'Algorithm_Slides.pptx',        size:'5.3 MB', type:'ppt',  course:'CS401',   uploaded:'2025-06-05', uploader:'Marcus T.' },
  { id:5, name:'History_Essay_Draft.docx',     size:'340 KB', type:'doc',  course:'HIST110', uploaded:'2025-06-04', uploader:'Alex Chen' },
]

const TYPE_ICON  = { pdf:'📄', doc:'📝', ppt:'📊', img:'🖼️', zip:'📦' }
const TYPE_COLOR = { pdf:'#ff4d6d', doc:'#60a5fa', ppt:'#fbbf24', img:'#00ff88', zip:'#c4b5fd' }

export default function Files() {
  const { addToast } = useApp()
  const [files, setFiles] = useState(DEMO_FILES)
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.course.toLowerCase().includes(search.toLowerCase())
  )

  const handleFiles = (newFiles) => {
    const added = newFiles.map(f => ({
      id: Date.now()+Math.random(), name:f.name,
      size:`${(f.size/1048576).toFixed(1)} MB`,
      type: f.name.split('.').pop().toLowerCase(),
      course:'General', uploaded:new Date().toISOString().split('T')[0], uploader:'You',
    }))
    setFiles(p => [...added, ...p])
    addToast(`${added.length} file(s) uploaded!`, 'success')
  }

  const remove = (id) => { setFiles(f=>f.filter(x=>x.id!==id)); addToast('File removed','info') }

  return (
    <div style={{ animation:'slide-in-up 0.4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 className="page-header">File Sharing</h1>
          <p style={{ color:'var(--text-2)', fontSize:13 }}>{files.length} files shared</p>
        </div>
        <button onClick={()=>fileRef.current?.click()} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Upload size={15} /> Upload
        </button>
        <input ref={fileRef} type="file" multiple style={{ display:'none' }} onChange={e=>handleFiles(Array.from(e.target.files))} />
      </div>

      {/* Drop zone */}
      <div
        onDrop={e=>{ e.preventDefault(); setDragging(false); handleFiles(Array.from(e.dataTransfer.files)) }}
        onDragOver={e=>{ e.preventDefault(); setDragging(true) }}
        onDragLeave={()=>setDragging(false)}
        onClick={()=>fileRef.current?.click()}
        style={{
          border:`2px dashed ${dragging?'#00f5ff':'rgba(255,255,255,0.1)'}`,
          borderRadius:16, padding:'28px', textAlign:'center', cursor:'pointer',
          background:dragging?'rgba(0,245,255,0.04)':'rgba(255,255,255,0.02)',
          transition:'all 0.2s', marginBottom:18,
          boxShadow:dragging?'0 0 30px rgba(0,245,255,0.1)':'none',
        }}>
        <div style={{ fontSize:30, marginBottom:7 }}>☁️</div>
        <div style={{ fontFamily:'var(--ff-display)', fontWeight:600, fontSize:14, color:dragging?'#00f5ff':'var(--text-2)' }}>Drop files here or click to browse</div>
        <div style={{ fontSize:11, color:'var(--text-3)', marginTop:3 }}>PDF, DOCX, PPTX, images and more</div>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:14 }}>
        <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
        <input className="input-field" placeholder="Search by filename or course..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:34 }} />
      </div>

      {/* File list */}
      <div style={{ borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden', backdropFilter:'blur(24px)' }}>
        <div style={{ padding:'11px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'grid', gridTemplateColumns:'2fr 90px 80px 100px auto', gap:12, fontSize:10, fontFamily:'var(--ff-mono)', color:'var(--text-3)', letterSpacing:0.8, textTransform:'uppercase' }}>
          <span>File</span><span>Course</span><span>Size</span><span>Date</span><span></span>
        </div>
        {filtered.map(f => {
          const t = (f.type||'').toLowerCase()
          return (
            <div key={f.id} style={{ padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'grid', gridTemplateColumns:'2fr 90px 80px 100px auto', gap:12, alignItems:'center', transition:'background 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.025)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:`${TYPE_COLOR[t]||'#777'}15`, border:`1px solid ${TYPE_COLOR[t]||'#777'}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{TYPE_ICON[t]||'📎'}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                  <div style={{ fontSize:10.5, color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>by {f.uploader}</div>
                </div>
              </div>
              <span style={{ fontSize:10, fontFamily:'var(--ff-mono)', fontWeight:700, background:'rgba(0,245,255,0.1)', color:'#00f5ff', border:'1px solid rgba(0,245,255,0.22)', padding:'2px 8px', borderRadius:99, width:'fit-content' }}>{f.course}</span>
              <span style={{ fontSize:12, color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>{f.size}</span>
              <span style={{ fontSize:11, color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>{f.uploaded}</span>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={()=>addToast('Download started!','success')} style={{ color:'#00f5ff', transition:'opacity 0.15s' }} onMouseEnter={e=>e.currentTarget.style.opacity='0.6'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}><Download size={14}/></button>
                <button onClick={()=>remove(f.id)} style={{ color:'var(--text-3)', transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='#ff4d6d'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-3)'}><Trash2 size={14}/></button>
              </div>
            </div>
          )
        })}
        {filtered.length===0 && (
          <div style={{ padding:'44px', textAlign:'center', color:'var(--text-3)' }}>
            <FolderOpen size={32} style={{ marginBottom:8, opacity:0.3 }} />
            <div>No files found</div>
          </div>
        )}
      </div>
    </div>
  )
}