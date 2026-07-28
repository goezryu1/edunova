import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { CheckSquare, Zap, TrendingUp, BookOpen, Flame, ArrowRight, Clock, Star } from 'lucide-react'

const PRIORITY_COLOR = {
  urgent: '#ff4d6d', high: '#fbbf24', medium: '#00f5ff', low: '#7777aa'
}

function StatCard({ icon: Icon, label, value, sub, accent, delay = 0 }) {
  return (
    <div style={{
      position: 'relative', padding: '20px', borderRadius: 18, overflow: 'hidden',
      background: 'rgba(255,255,255,0.032)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(24px)',
      animation: `card-pop 0.4s cubic-bezier(0.4,0,0.2,1) ${delay}s both`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px ${accent}20`; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity:0.7 }} />
      <div style={{ position:'absolute', top:-30, right:-30, width:100, height:100, borderRadius:'50%', background:accent, filter:'blur(50px)', opacity:0.08, pointerEvents:'none' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
        <div>
          <div style={{ fontSize:10, fontFamily:'var(--ff-mono)', color:'var(--text-3)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:8 }}>{label}</div>
          <div style={{ fontSize:32, fontWeight:800, fontFamily:'var(--ff-display)', color:accent, letterSpacing:'-1.5px', lineHeight:1, textShadow:`0 0 20px ${accent}60` }}>{value}</div>
          {sub && <div style={{ fontSize:11, color:'var(--text-2)', marginTop:5 }}>{sub}</div>}
        </div>
        <div style={{
          width:42, height:42, borderRadius:12, flexShrink:0,
          background:`linear-gradient(135deg, ${accent}18, ${accent}08)`,
          border:`1px solid ${accent}28`,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:accent, boxShadow:`0 0 16px ${accent}20`,
        }}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  )
}

function AssignmentRow({ item }) {
  const color = PRIORITY_COLOR[item.priority] || '#7777aa'
  const days = item.due ? Math.ceil((new Date(item.due) - new Date()) / 86400000) : null
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.045)' }}>
      <div style={{ width:7, height:7, borderRadius:'50%', flexShrink:0, background:color, boxShadow:`0 0 7px ${color}` }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'var(--text-1)' }}>{item.title}</div>
        <div style={{ fontSize:10.5, color:'var(--text-3)', fontFamily:'var(--ff-mono)', marginTop:1 }}>{item.course} · {item.due}</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
        <div style={{ width:56, height:3, borderRadius:99, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${item.progress}%`, background:`linear-gradient(90deg, ${color}88, ${color})`, borderRadius:99, transition:'width 0.6s' }} />
        </div>
        {days !== null && (
          <span style={{ fontSize:9.5, fontFamily:'var(--ff-mono)', color: days <= 1 ? '#ff4d6d' : days <= 3 ? '#fbbf24' : 'var(--text-3)' }}>
            {days < 0 ? 'overdue' : days === 0 ? 'today' : `${days}d`}
          </span>
        )}
      </div>
    </div>
  )
}

const QUICK_ACTIONS = [
  { label:'AI Assistant', icon:'🧠', page:'aiassistant', accent:'#00f5ff' },
  { label:'Start Focus',  icon:'⏱️', page:'pomodoro',     accent:'#8b5cf6' },
  { label:'Make Quiz',    icon:'⚡', page:'quiz',          accent:'#fbbf24' },
  { label:'Flashcards',  icon:'📚', page:'flashcards',    accent:'#00ff88' },
  { label:'Study Room',  icon:'👥', page:'study-rooms',   accent:'#e879f9' },
  { label:'AI Notes',    icon:'✨', page:'notes',          accent:'#c4b5fd' },
]

export default function Dashboard() {
  const { user, assignments, schedule, achievements, grades, setActivePage, addXP, addToast } = useApp()
  const [claimed, setClaimed] = useState(false)

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const greetEmoji = hour < 12 ? '☀️' : hour < 17 ? '👋' : '🌙'

  const today = new Date().getDay()
  const todayClasses = schedule.filter(c => c.day === today)
  const pending = assignments.filter(a => !a.done)
  const earned = achievements.filter(a => a.earned)

  const gpa = grades.length
    ? (grades.reduce((acc, g) => {
        const s = {'A+':4,'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D':1,'F':0}
        return acc + (s[g.letter]||0) * g.credits
      }, 0) / grades.reduce((a,g) => a + g.credits, 0)).toFixed(1)
    : '—'

  const claimBonus = () => {
    if (claimed) return addToast('Already claimed today! Come back tomorrow 😊', 'info')
    setClaimed(true)
    addXP(50)
    addToast('Daily bonus claimed! +50 XP 🚀', 'xp')
  }

  return (
    <div style={{ animation:'slide-in-up 0.4s ease' }}>

      {/* HERO GREETING */}
      <div style={{
        position:'relative', marginBottom:28, padding: isMobile ? '20px 18px' : '24px 28px',
        borderRadius:20, overflow:'hidden',
        background:'linear-gradient(135deg, rgba(0,245,255,0.07) 0%, rgba(139,92,246,0.09) 50%, rgba(232,121,249,0.06) 100%)',
        border:'1px solid rgba(0,245,255,0.12)',
        boxShadow:'0 0 60px rgba(0,245,255,0.04)',
      }}>
        {[120,200,280].map((s,i) => (
          <div key={i} style={{ position:'absolute', right:-s/3, top:'50%', transform:'translateY(-50%)', width:s, height:s, borderRadius:'50%', border:`1px solid rgba(0,245,255,${0.06-i*0.015})`, pointerEvents:'none' }} />
        ))}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontFamily:'var(--ff-mono)', color:'var(--cyan)', letterSpacing:2, textTransform:'uppercase', marginBottom:6, opacity:0.8 }}>
            WELCOME BACK
          </div>
          <h1 style={{ fontFamily:'var(--ff-display)', fontSize: isMobile ? 22 : 28, fontWeight:800, letterSpacing:'-0.8px', marginBottom:8, lineHeight:1.1 }}>
            {greeting}, <span style={{ background:'linear-gradient(135deg, #00f5ff, #8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{user.name.split(' ')[0]}</span> {greetEmoji}
          </h1>
          <p style={{ color:'var(--text-2)', fontSize:13.5, lineHeight:1.5 }}>
            {pending.length > 0
              ? <>You have <strong style={{ color:'#ff4d6d', fontWeight:700 }}>{pending.length} assignments</strong> due — let's tackle them!</>
              : <>All caught up! Great work keeping on top of things 🎉</>
            }
            {user.streak > 0 && <> · <strong style={{ color:'#fbbf24' }}>🔥 {user.streak}-day</strong> streak going strong</>}
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12, marginBottom:24 }}>
        <StatCard icon={Flame}       label="Streak"       value={`${user.streak}d`}              sub="days in a row"        accent="#fbbf24" delay={0.05} />
        <StatCard icon={Zap}         label="Total XP"     value={user.xp.toLocaleString()}        sub={`Level ${user.level}`} accent="#8b5cf6" delay={0.1} />
        <StatCard icon={CheckSquare} label="Due Soon"     value={pending.length}                  sub="assignments"          accent="#ff4d6d" delay={0.15} />
        <StatCard icon={TrendingUp}  label="GPA"          value={gpa}                             sub="this semester"        accent="#00ff88" delay={0.2} />
        <StatCard icon={BookOpen}    label="Achievements" value={`${earned.length}/${achievements.length}`} sub="unlocked"  accent="#00f5ff" delay={0.25} />
      </div>

      {/* MAIN GRID */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14 }}>

        {/* Due Soon */}
        <div style={{ padding: isMobile ? '18px 16px' : '20px 22px', borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:7, height:20, borderRadius:99, background:'linear-gradient(#ff4d6d,#fbbf24)' }} />
              <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15 }}>Due Soon</span>
            </div>
            <button onClick={() => setActivePage('assignments')} style={{ display:'flex', alignItems:'center', gap:3, fontSize:11.5, color:'var(--cyan)', transition:'opacity 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          {pending.length === 0
            ? <div style={{ padding:'24px 0', textAlign:'center', color:'var(--text-3)', fontSize:13 }}>🎉 All caught up!</div>
            : pending.slice(0,3).map(a => <AssignmentRow key={a.id} item={a} />)
          }
        </div>

        {/* Today's Classes */}
        <div style={{ padding: isMobile ? '18px 16px' : '20px 22px', borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:7, height:20, borderRadius:99, background:'linear-gradient(#00f5ff,#8b5cf6)' }} />
              <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15 }}>Today's Classes</span>
            </div>
            <button onClick={() => setActivePage('schedule')} style={{ display:'flex', alignItems:'center', gap:3, fontSize:11.5, color:'var(--cyan)', transition:'opacity 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              Schedule <ArrowRight size={12} />
            </button>
          </div>
          {todayClasses.length === 0
            ? <div style={{ padding:'24px 0', textAlign:'center', color:'var(--text-3)', fontSize:13 }}>🌴 No classes today!</div>
            : todayClasses.map(c => (
              <div key={c.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.045)' }}>
                <div style={{ width:3, height:40, borderRadius:99, background:c.color, boxShadow:`0 0 8px ${c.color}80`, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{c.course}</div>
                  <div style={{ fontSize:10.5, color:'var(--text-3)', fontFamily:'var(--ff-mono)', marginTop:1 }}>{c.startH}:00 · {c.room} · {c.prof}</div>
                </div>
                <span style={{ fontSize:10, fontFamily:'var(--ff-mono)', fontWeight:700, background:`${c.color}18`, border:`1px solid ${c.color}28`, color:c.color, padding:'2px 8px', borderRadius:99 }}>{c.code}</span>
              </div>
            ))
          }
        </div>

        {/* Quick Actions */}
        <div style={{ padding: isMobile ? '18px 16px' : '20px 22px', borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <div style={{ width:7, height:20, borderRadius:99, background:'linear-gradient(#fbbf24,#e879f9)' }} />
            <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15 }}>Quick Actions</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.page} onClick={() => setActivePage(a.page)} style={{
                display:'flex', alignItems:'center', gap:9,
                padding:'11px 13px', borderRadius:12, textAlign:'left', width:'100%',
                background:'rgba(255,255,255,0.036)',
                border:'1px solid rgba(255,255,255,0.07)',
                color:'var(--text-2)', fontSize:12.5, fontWeight:500,
                transition:'all 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background=`${a.accent}12`
                e.currentTarget.style.borderColor=`${a.accent}30`
                e.currentTarget.style.color=a.accent
                e.currentTarget.style.transform='translateY(-1px)'
                e.currentTarget.style.boxShadow=`0 8px 20px rgba(0,0,0,0.25), 0 0 12px ${a.accent}18`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background='rgba(255,255,255,0.036)'
                e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'
                e.currentTarget.style.color='var(--text-2)'
                e.currentTarget.style.transform='translateY(0)'
                e.currentTarget.style.boxShadow='none'
              }}>
                <span style={{ fontSize:18, lineHeight:1 }}>{a.icon}</span>
                <span style={{ fontFamily:'var(--ff-body)' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div style={{ padding: isMobile ? '18px 16px' : '20px 22px', borderRadius:18, background:'rgba(255,255,255,0.028)', border:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(24px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:7, height:20, borderRadius:99, background:'linear-gradient(#fbbf24,#00ff88)' }} />
              <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15 }}>Achievements</span>
            </div>
            <button onClick={() => setActivePage('achievements')} style={{ display:'flex', alignItems:'center', gap:3, fontSize:11.5, color:'var(--cyan)', transition:'opacity 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='0.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
              All <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {achievements.slice(0,4).map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:10, opacity:a.earned?1:0.5 }}>
                <div style={{
                  width:36, height:36, borderRadius:10, flexShrink:0,
                  background:a.earned?'rgba(251,191,36,0.12)':'rgba(255,255,255,0.04)',
                  border:`1px solid ${a.earned?'rgba(251,191,36,0.28)':'rgba(255,255,255,0.06)'}`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:17,
                  boxShadow:a.earned?'0 0 12px rgba(251,191,36,0.2)':'none',
                }}>{a.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, marginBottom:2 }}>{a.title}</div>
                  {!a.earned && a.progress!=null && (
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ flex:1, height:3, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${(a.progress/a.total)*100}%`, background:'linear-gradient(90deg,var(--cyan),var(--violet))', borderRadius:99 }} />
                      </div>
                      <span style={{ fontSize:9.5, color:'var(--text-3)', fontFamily:'var(--ff-mono)' }}>{a.progress}/{a.total}</span>
                    </div>
                  )}
                </div>
                {a.earned && <span style={{ fontSize:10.5, color:'#fbbf24', fontFamily:'var(--ff-mono)', fontWeight:700, flexShrink:0 }}>+{a.xp}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DAILY BONUS */}
      <div style={{ marginTop:20, display:'flex', justifyContent:'center' }}>
        <button onClick={claimBonus} style={{
          display:'flex', alignItems:'center', gap:10,
          padding: isMobile ? '12px 20px' : '13px 28px', borderRadius:99,
          background: claimed
            ? 'rgba(255,255,255,0.04)'
            : 'linear-gradient(135deg, #00f5ff 0%, #8b5cf6 100%)',
          color: claimed ? 'var(--text-3)' : '#04040a',
          fontFamily:'var(--ff-display)', fontWeight:700, fontSize: isMobile ? 12.5 : 13.5,
          border: claimed ? '1px solid rgba(255,255,255,0.08)' : 'none',
          transition:'all 0.25s',
          boxShadow: claimed ? 'none' : '0 0 24px rgba(0,245,255,0.3), 0 8px 24px rgba(0,0,0,0.3)',
          transform:'translateY(0)',
        }}
        onMouseEnter={e => { if(!claimed){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 36px rgba(0,245,255,0.5), 0 12px 30px rgba(0,0,0,0.4)' }}}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=claimed?'none':'0 0 24px rgba(0,245,255,0.3), 0 8px 24px rgba(0,0,0,0.3)' }}>
          <Zap size={16} />
          {claimed ? 'Daily bonus claimed ✓' : 'Claim Daily XP Bonus  +50 XP'}
        </button>
      </div>

    </div>
  )
}
