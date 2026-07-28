import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

const icons = {
  success: <CheckCircle size={15} />,
  error: <AlertCircle size={15} />,
  info: <Info size={15} />,
  xp: <Zap size={15} />,
};

const colors = {
  success: { bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.25)', color: 'var(--neon-green)' },
  error: { bg: 'rgba(255,77,109,0.1)', border: 'rgba(255,77,109,0.25)', color: 'var(--neon-red)' },
  info: { bg: 'rgba(0,245,255,0.1)', border: 'rgba(0,245,255,0.2)', color: 'var(--neon-cyan)' },
  xp: { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', color: '#a78bfa' },
};

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 8,
      zIndex: 999, pointerEvents: 'none',
    }}>
      {Array.isArray(toasts) ? toasts.map(t => {
        const c = colors[t.type] || colors.info;
        return (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: c.bg, border: `1px solid ${c.border}`,
            backdropFilter: 'blur(20px)',
            color: c.color, borderRadius: 12,
            padding: '10px 16px', fontSize: 13,
            boxShadow: `0 8px 30px rgba(0,0,0,0.3)`,
            animation: 'slide-in-right 0.3s ease',
            pointerEvents: 'auto',
            maxWidth: 320,
            fontFamily: 'var(--font-body)',
          }}>
            {icons[t.type] || icons.info}
            <span>{t.msg}</span>
          </div>
        );
      }) : null}  
    </div>
  );
}