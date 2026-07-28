import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Users, Plus, Mic, MicOff, Video, VideoOff, LogIn, LogOut, MessageSquare } from 'lucide-react'

export default function StudyRooms() {
  const { studyRooms, update, addXP, addToast } = useApp()
  const [joined, setJoined] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name:'', topic:'', maxMembers:6, avatar:'📚' })
  const [mic, setMic] = useState(false)
  const [cam, setCam] = useState(false)
  const [chat, setChat] = useState([
    { user:'Sarah K.', msg:'Hey everyone! Ready to study?', time:'2m ago' },
    { user:'Marcus T.', msg:"Yes! Let's tackle chapter 7 first.", time:'1m ago' },
  ])
  const [msg, setMsg] = useState('')

  const AVATARS = ['📚','🧠','⚡','🔥','🎯','💎','🌟','🚀']

  const joinRoom = (room) => {
    setJoined(room); addXP(25)
    addToast(`Joined "${room.name}" · +25 XP`, 'xp')
  }
  const leaveRoom = () => { setJoined(null); addToast('Left the study room', 'info') }

  const createRoom = () => {
    if (!form.name || !form.topic) return addToast('Name and topic required', 'error')
    const room = { ...form, id:Date.now(), members:1, active:true }
    update('studyRooms', [...studyRooms, room])
    setShowCreate(false)
    setForm({ name:'', topic:'', maxMembers:6, avatar:'📚' })
    joinRoom(room)
    addToast('Study room created!', 'success')
  }

  const sendMsg = () => {
    if (!msg.trim()) return
    setChat(c => [...c, { user:'You', msg, time:'just now' }])
    setMsg('')
  }

  if (joined) return (
    <div style={{ animation:'slide-in-up 0.4s ease', display:'flex', gap:14, height:'calc(100vh - var(--topbar-h) - 80px)', minHeight:400 }}>
      <div style={{ width:232, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ padding:'16px', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize:30, marginBottom:8 }}>{joined.avatar}</div>
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15, marginBottom:3 }}>{joined.name}</div>
          <div style={{ fontSize:12, color:'var(--text-2)', marginBottom:10 }}>{joined.topic}</div>
          <span style={{ fontSize:10, fontFamily:'var(--ff-mono)', fontWeight:700, background:'rgba(0,255,136,0.1)', color:'#00ff88', border:'1px solid rgba(0,255,136,0.22)', padding:'2px 10px', borderRadius:99 }}>{joined.members} online</span>
        </div>
        <div style={{ padding:'14px', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', flex:1 }}>
          <div style={{ fontSize:10, fontFamily:'var(--ff-mono)', color:'var(--text-3)', marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>Members</div>
          {['You','Sarah K.','Marcus T.','Priya M.'].slice(0,joined.members).map((m,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>{i===0?'👤':['👑','🔥','🌟'][i-1]}</div>
              <span style={{ fontSize:12.5, color:i===0?'#00f5ff':'var(--text-1)' }}>{m} {i===0&&'(you)'}</span>
              <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#00ff88', boxShadow:'0 0 6px #00ff88' }} />
            </div>
          ))}
        </div>
        <div style={{ padding:'12px', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:8 }}>
          {[
            { icon: mic?<Mic size={15}/>:<MicOff size={15}/>, active:mic, toggle:()=>setMic(m=>!m) },
            { icon: cam?<Video size={15}/>:<VideoOff size={15}/>, active:cam, toggle:()=>setCam(c=>!c) },
          ].map((b,i) => (
            <button key={i} onClick={b.toggle} style={{ flex:1, padding:'9px', borderRadius:9, background:b.active?'rgba(0,255,136,0.1)':'rgba(255,77,109,0.1)', border:`1px solid ${b.active?'rgba(0,255,136,0.25)':'rgba(255,77,109,0.25)'}`, color:b.active?'#00ff88':'#ff4d6d', display:'flex', alignItems:'center', justifyContent:'center' }}>{b.icon}</button>
          ))}
          <button onClick={leaveRoom} style={{ flex:1, padding:'9px', borderRadius:9, background:'rgba(255,77,109,0.1)', border:'1px solid rgba(255,77,109,0.25)', color:'#ff4d6d', display:'flex', alignItems:'center', justifyContent:'center' }}><LogOut size={15}/></button>
        </div>
      </div>
      <div style={{ flex:1, borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:8 }}>
          <MessageSquare size={15} style={{ color:'#00f5ff' }} />
          <span style={{ fontFamily:'var(--ff-display)', fontWeight:600, fontSize:14 }}>Room Chat</span>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', display:'flex', flexDirection:'column', gap:12 }}>
          {chat.map((c,i) => (
            <div key={i} style={{ display:'flex', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>{c.user==='You'?'👤':c.user[0]}</div>
              <div>
                <div style={{ fontSize:10.5, color:c.user==='You'?'#00f5ff':'var(--text-3)', fontFamily:'var(--ff-mono)', marginBottom:3 }}>{c.user} · {c.time}</div>
                <div style={{ fontSize:13, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px 12px 12px 12px', padding:'8px 12px', lineHeight:1.5 }}>{c.msg}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:8 }}>
          <input className="input-field" placeholder="Send a message..." value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} style={{ flex:1, fontSize:13 }} />
          <button onClick={sendMsg} className="btn-primary" style={{ padding:'8px 16px' }}>Send</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ animation:'slide-in-up 0.4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h1 className="page-header">Study Rooms</h1>
          <p style={{ color:'var(--text-2)', fontSize:13 }}>{studyRooms.filter(r=>r.active).length} active rooms</p>
        </div>
        <button onClick={()=>setShowCreate(!showCreate)} className="btn-primary" style={{ display:'flex', alignItems:'center', gap:6 }}>
          <Plus size={15} /> Create Room
        </button>
      </div>

      {showCreate && (
        <div style={{ padding:'20px', marginBottom:16, borderRadius:16, background:'rgba(0,245,255,0.04)', border:'1px solid rgba(0,245,255,0.18)' }}>
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:14, marginBottom:14 }}>Create Study Room</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
            <input className="input-field" placeholder="Room name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            <input className="input-field" placeholder="Topic / Subject *" value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} />
            <select className="input-field" value={form.maxMembers} onChange={e=>setForm(f=>({...f,maxMembers:Number(e.target.value)}))}>
              {[2,4,6,8,10].map(n=><option key={n} value={n}>Max {n} members</option>)}
            </select>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
              {AVATARS.map(a=>(
                <button key={a} onClick={()=>setForm(f=>({...f,avatar:a}))} style={{ fontSize:20, width:36, height:36, borderRadius:8, background:form.avatar===a?'rgba(0,245,255,0.15)':'rgba(255,255,255,0.04)', border:`1px solid ${form.avatar===a?'rgba(0,245,255,0.3)':'rgba(255,255,255,0.07)'}`, transition:'all 0.15s' }}>{a}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={createRoom} className="btn-primary">Create & Join</button>
            <button onClick={()=>setShowCreate(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {studyRooms.map(room => (
          <div key={room.id} style={{ padding:'22px', borderRadius:18, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', position:'relative', overflow:'hidden', transition:'all 0.2s', backdropFilter:'blur(24px)' }}
            onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
            {room.active && <div style={{ position:'absolute', top:14, right:14, width:8, height:8, borderRadius:'50%', background:'#00ff88', boxShadow:'0 0 8px #00ff88', animation:'pulse-glow 2s infinite' }} />}
            <div style={{ fontSize:32, marginBottom:10 }}>{room.avatar}</div>
            <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:16, marginBottom:4 }}>{room.name}</div>
            <div style={{ fontSize:13, color:'var(--text-2)', marginBottom:12 }}>{room.topic}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
              <Users size={13} style={{ color:'var(--text-3)' }} />
              <span style={{ fontSize:12, color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>{room.members}/{room.maxMembers}</span>
              <div style={{ flex:1, height:3, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(room.members/room.maxMembers)*100}%`, background:'linear-gradient(90deg,#00f5ff,#8b5cf6)', borderRadius:99 }} />
              </div>
            </div>
            <button onClick={()=>joinRoom(room)} disabled={room.members>=room.maxMembers} className="btn-primary" style={{ width:'100%', opacity:room.members>=room.maxMembers?0.4:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <LogIn size={14} /> {room.members>=room.maxMembers?'Room Full':'Join Room'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}