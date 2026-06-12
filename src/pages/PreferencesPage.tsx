import { useState } from 'react'
import { Moon, Bell, Palette, ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{
      width: 40, height: 22, borderRadius: 11,
      background: on ? '#2A6BDB' : '#343A4F',
      cursor: 'pointer', position: 'relative', transition: 'background 0.25s',
      flexShrink: 0, boxShadow: on ? '0 0 10px rgba(42,107,219,0.4)' : 'none',
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', position: 'absolute', top: 3,
        left: on ? 21 : 3, transition: 'left 0.25s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }} />
    </div>
  )
}

export function PreferencesPage() {
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState({
    compactMode: false,
    animatedCharts: true,
    soundAlerts: false,
    autoRefresh: true,
    showStatusBar: true,
    reducedMotion: false,
  })
  const [theme, setTheme] = useState('cyberpunk')

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-icon">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="page-title">Preferences</h1>
            <p className="page-subtitle">// Dashboard appearance, notifications, and behavior</p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm"><Save size={13} /> Save Preferences</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            <Palette size={12} style={{ display: 'inline', marginRight: 5 }} />
            Theme & Appearance
          </div>
          <div className="rg-theme-picker">
            {[
              { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Dark &bull; Blue/Cyan accent' },
              { id: 'industrial', label: 'Industrial', desc: 'Dark &bull; Amber/Green accent' },
              { id: 'minimal', label: 'Minimal', desc: 'Dark &bull; Reduced UI' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: 14, borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: theme === t.id ? 'rgba(42,107,219,0.12)' : '#090C14',
                  border: theme === t.id ? '1px solid rgba(42,107,219,0.4)' : '1px solid #262A38',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: '#7E8394' }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            <Moon size={12} style={{ display: 'inline', marginRight: 5 }} />
            Display Preferences
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'compactMode' as const, label: 'Compact Mode', desc: 'Reduce padding and spacing throughout the UI' },
              { key: 'animatedCharts' as const, label: 'Animated Charts', desc: 'Enable entrance animations on all chart components' },
              { key: 'showStatusBar' as const, label: 'Status Bar', desc: 'Show system status indicator in the top bar' },
              { key: 'reducedMotion' as const, label: 'Reduced Motion', desc: 'Minimize animations and transitions' },
            ].map(item => (
              <div key={item.key} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: '#090C14', borderRadius: 8,
              }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#7E8394' }}>{item.desc}</div>
                </div>
                <Toggle on={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            <Bell size={12} style={{ display: 'inline', marginRight: 5 }} />
            Notification Preferences
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'soundAlerts' as const, label: 'Sound Alerts', desc: 'Play alert sounds for critical notifications' },
              { key: 'autoRefresh' as const, label: 'Auto-Refresh', desc: 'Automatically refresh dashboard data every 30s' },
            ].map(item => (
              <div key={item.key} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: '#090C14', borderRadius: 8,
              }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#7E8394' }}>{item.desc}</div>
                </div>
                <Toggle on={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
