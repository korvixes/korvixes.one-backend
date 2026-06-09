import { useState } from 'react'
import { Shield, Key, Eye, EyeOff, Check, Copy, ArrowLeft, Clock, Smartphone } from 'lucide-react'
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

const sessions = [
  { device: 'Chrome — Windows', ip: '192.168.1.42', lastActive: 'Active now', current: true },
  { device: 'Safari — macOS', ip: '192.168.1.55', lastActive: '2h ago', current: false },
  { device: 'Mobile App — iOS', ip: '10.0.0.8', lastActive: '1d ago', current: false },
]

export function SecurityPage() {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState({ twoFactor: true, sso: false, apiAccess: true })
  const [showCurrent, setShowCurrent] = useState(false)

  const toggle = (key: keyof typeof toggles) => setToggles(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-icon">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="page-title">Security</h1>
            <p className="page-subtitle">// Authentication, sessions, and access control</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Authentication */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Authentication</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'twoFactor' as const, label: 'Two-Factor Authentication', desc: 'Require OTP from authenticator app on login' },
              { key: 'sso' as const, label: 'SSO / SAML', desc: 'Single Sign-On via corporate identity provider' },
              { key: 'apiAccess' as const, label: 'API Access', desc: 'Allow external API key authentication' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#090C14', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#7E8394' }}>{item.desc}</div>
                </div>
                <Toggle on={toggles[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Change Password</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
            <input className="input" type="password" placeholder="Current password" />
            <input className="input" type="password" placeholder="New password" />
            <input className="input" type="password" placeholder="Confirm new password" />
            <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}><Key size={12} /> Update Password</button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Active Sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sessions.map(s => (
              <div key={s.device} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', background: '#090C14', borderRadius: 8,
                border: s.current ? '1px solid rgba(59,196,232,0.2)' : '1px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Smartphone size={14} color={s.current ? '#3BC4E8' : '#7E8394'} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>
                      {s.device}
                      {s.current && <span style={{ marginLeft: 6, fontSize: 10, color: '#3BC4E8', fontFamily: 'JetBrains Mono' }}>(This device)</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono' }}>{s.ip}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={10} color="#4A5168" />
                  <span style={{ fontSize: 11, color: '#7E8394', fontFamily: 'JetBrains Mono' }}>{s.lastActive}</span>
                  {!s.current && <button className="btn btn-danger btn-sm btn-icon"><span style={{ fontSize: 10 }}>✕</span></button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Personal API Key</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              flex: '1 1 200px', background: '#090C14', border: '1px solid #262A38',
              borderRadius: 6, padding: '9px 14px',
              fontFamily: 'JetBrains Mono', fontSize: 12,
              color: showCurrent ? '#3BC4E8' : '#7E8394',
              minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {showCurrent ? 'kvx_user_8f2a3d7b9c4e1f5a' : '••••••••••••••••••••••••'}
            </div>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowCurrent(p => !p)}>
              {showCurrent ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { navigator.clipboard?.writeText('kvx_user_8f2a3d7b9c4e1f5a') }}>
              <Copy size={13} />
            </button>
            <button className="btn btn-secondary btn-sm"><Key size={11} /> Regenerate</button>
          </div>
        </div>
      </div>
    </div>
  )
}
