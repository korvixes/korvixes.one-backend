import { useState } from 'react'
import { User, Mail, Shield, Calendar, MapPin, Save, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: 'Admin User',
    email: 'admin@korvixes.io',
    role: 'Super Admin',
    department: 'Platform Operations',
    location: 'Zone 3 — Command Center',
    timezone: 'UTC',
  })

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-icon">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">// Personal account settings and preferences</p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm"><Save size={13} /> Save Changes</button>
      </div>

      <div className="rg-profile-layout">
        {/* Avatar card */}
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2A6BDB, #3BC4E8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28, fontWeight: 700, color: '#fff',
            fontFamily: 'Syne, sans-serif',
            boxShadow: '0 0 24px rgba(42,107,219,0.3)',
          }}>
            A
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{form.name}</div>
          <div style={{ fontSize: 12, color: '#3BC4E8', fontFamily: 'JetBrains Mono', marginBottom: 12 }}>
            {form.role}
          </div>
          <div style={{
            background: 'rgba(76,195,138,0.1)', border: '1px solid rgba(76,195,138,0.25)',
            borderRadius: 5, padding: '4px 10px', fontSize: 10, color: '#4CC38A',
            fontFamily: 'JetBrains Mono', display: 'inline-block',
          }}>
            <span className="status-dot status-online" style={{ marginRight: 5 }} />
            ACTIVE
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #262A38' }}>
            <div style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', marginBottom: 10 }}>MEMBER SINCE</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#7E8394' }}>
              <Calendar size={13} />
              January 2024
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { icon: User, label: 'Full Name', key: 'name', type: 'text' },
              { icon: Mail, label: 'Email Address', key: 'email', type: 'email' },
              { icon: Shield, label: 'Role', key: 'role', type: 'text' },
              { icon: MapPin, label: 'Location', key: 'location', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <field.icon size={11} style={{ display: 'inline', marginRight: 5 }} />
                  {field.label}
                </label>
                <input
                  className="input"
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Calendar size={11} style={{ display: 'inline', marginRight: 5 }} />
                Timezone
              </label>
              <select className="input" value={form.timezone} onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))}>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="CET">CET (Central European Time)</option>
                <option value="IST">IST (India Standard Time)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
