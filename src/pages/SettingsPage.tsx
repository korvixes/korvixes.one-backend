import { useState } from 'react'
import { useRouteTab } from '../hooks/useRouteTab'
import {
  Settings, Shield, CreditCard, Bell,
  Save, RefreshCw, Eye, EyeOff, Copy,
  Check, Zap, Globe, Lock, Key, Webhook,
  Mail, Slack, MessageSquare, AlertTriangle
} from 'lucide-react'

function FormRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rg-form-row" style={{ paddingBottom: 20, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</div>
        {hint && <div className="text-muted text-xs" style={{ lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width: 40, height: 22, borderRadius: 11, background: on ? 'var(--blue)' : 'var(--border-mid)', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0, boxShadow: on ? '0 0 10px rgba(42,107,219,0.4)' : 'none' }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 21 : 3, transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
    </div>
  )
}

const apiKeys = [
  { name: 'Production API Key', key: 'kvx_live_8f2a...b4c9', created: 'Jan 15, 2025', lastUsed: '2m ago', scope: 'Full Access' },
  { name: 'Analytics Read Key', key: 'kvx_read_7e1b...a3f2', created: 'Mar 3, 2025', lastUsed: '1h ago', scope: 'Read Only' },
  { name: 'Webhook Signing Key', key: 'kvx_wh_9d4c...e5a1', created: 'Apr 20, 2025', lastUsed: '12h ago', scope: 'Webhooks' },
]

export function SettingsPage() {
  const [tab, setTab] = useRouteTab('/settings', ['general', 'security', 'billing', 'notifications'] as const, 'general')
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState('')
  const [toggles, setToggles] = useState({
    twoFactor: true, ssoEnabled: false, auditLog: true, apiAccess: true,
    emailAlerts: true, slackAlerts: true, smsAlerts: false, criticalOnly: false,
    weeklyReport: true, maintenanceWin: true,
  })

  const toggle = (key: keyof typeof toggles) => setToggles(p => ({ ...p, [key]: !p[key] }))

  const handleCopy = (id: string) => {
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="page-subtitle">// Korvixes Admin v2.4.1 · Enterprise Edition</p>
        </div>
        <button className="btn btn-primary btn-sm"><Save size={13} /> Save Changes</button>
      </div>

      {/* Tabs */}
      <div className="tab-list-wrap" style={{ marginBottom: 24 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {([
            { id: 'general',       label: 'General',       icon: Settings },
            { id: 'security',      label: 'Security',      icon: Shield },
            { id: 'billing',       label: 'Billing',       icon: CreditCard },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ] as const).map(t => (
            <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={12} style={{ display: 'inline', marginRight: 5 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* GENERAL */}
      {tab === 'general' && (
        <div style={{ maxWidth: 820 }}>
          <div style={{ marginBottom: 6, paddingBottom: 16, borderBottom: '1px solid var(--border)', marginTop: 0 }}>
            <div className="section-label">Platform Identity</div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <FormRow label="Platform Name" hint="Displayed in the browser tab and dashboard header.">
              <input className="input" defaultValue="Korvixes Admin" />
            </FormRow>
            <FormRow label="Organization" hint="Your company or organization name.">
              <input className="input" defaultValue="Korvixes Industrial AI" />
            </FormRow>
            <FormRow label="Default Timezone" hint="Used for scheduling and reporting.">
              <select className="input" defaultValue="UTC">
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="CET">CET (Central European Time)</option>
                <option value="IST">IST (India Standard Time)</option>
              </select>
            </FormRow>
            <FormRow label="Data Retention" hint="How long simulation and prediction data is kept.">
              <select className="input" defaultValue="365">
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
                <option value="730">2 years</option>
              </select>
            </FormRow>
          </div>
          <div className="section-label">Simulation Defaults</div>
          <FormRow label="Default Simulation Mode" hint="Mode applied to new simulations unless overridden.">
            <select className="input" defaultValue="realtime">
              <option value="realtime">Real-Time (Live Data)</option>
              <option value="batch">Batch Processing</option>
              <option value="historical">Historical Replay</option>
            </select>
          </FormRow>
          <FormRow label="NVIDIA SDK Integration" hint="Enable NVIDIA Omniverse SDK for physics rendering.">
            <div className="flex items-center gap-3">
              <Toggle on={true} onChange={() => {}} />
              <span className="text-sm text-success">Connected · Omniverse v2024.2</span>
            </div>
          </FormRow>
          <FormRow label="AI Prediction Auto-Run" hint="Automatically run predictions when simulations complete.">
            <Toggle on={true} onChange={() => {}} />
          </FormRow>
        </div>
      )}

      {/* SECURITY */}
      {tab === 'security' && (
        <div style={{ maxWidth: 820 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Authentication</div>
          <FormRow label="Two-Factor Authentication" hint="Require 2FA for all admin accounts.">
            <Toggle on={toggles.twoFactor} onChange={() => toggle('twoFactor')} />
          </FormRow>
          <FormRow label="SSO / SAML" hint="Single Sign-On via SAML 2.0 provider.">
            <div className="flex items-center gap-3">
              <Toggle on={toggles.ssoEnabled} onChange={() => toggle('ssoEnabled')} />
              {toggles.ssoEnabled && <span className="text-sm text-cyan">Configure provider →</span>}
            </div>
          </FormRow>
          <FormRow label="Audit Logging" hint="Log all admin actions to immutable audit trail.">
            <Toggle on={toggles.auditLog} onChange={() => toggle('auditLog')} />
          </FormRow>
          <FormRow label="API Access" hint="Allow external API access to this platform.">
            <Toggle on={toggles.apiAccess} onChange={() => toggle('apiAccess')} />
          </FormRow>

          <div className="divider" />
          <div className="section-label" style={{ marginBottom: 16 }}>API Keys</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {apiKeys.map(k => (
              <div key={k.name} className="card" style={{ padding: '14px 16px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(42,107,219,0.12)', border: '1px solid rgba(42,107,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Key size={12} color="var(--blue)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 12.5 }}>{k.name}</div>
                      <div className="text-muted text-xs text-mono">Created {k.created} · Used {k.lastUsed}</div>
                    </div>
                  </div>
                  <span className="badge badge-muted">{k.scope}</span>
                </div>
                <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 160px', background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 6, padding: '7px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {showKey[k.name] ? k.key.replace('...', '3d7f8a2b') : k.key}
                  </div>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowKey(p => ({ ...p, [k.name]: !p[k.name] }))}>
                    {showKey[k.name] ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => handleCopy(k.name)}>
                    {copied === k.name ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><Key size={12} /> Generate New Key</button>
        </div>
      )}

      {/* BILLING */}
      {tab === 'billing' && (
        <div style={{ maxWidth: 820 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(42,107,219,0.15) 0%, rgba(59,196,232,0.08) 100%)', border: '1px solid rgba(42,107,219,0.25)', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', letterSpacing: '0.1em', marginBottom: 6 }}>CURRENT PLAN</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Enterprise</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--cyan)' }}>$2,400<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>/mo</span></div>
                <div className="text-muted text-xs text-mono">Billed annually · Renews Jan 1 2026</div>
              </div>
            </div>
            <div className="grid-4">
              {[
                { label: 'Digital Twins', used: 12, limit: 50 },
                { label: 'Simulations/mo', used: 284, limit: 500 },
                { label: 'IoT Devices', used: 756, limit: 1000 },
                { label: 'AI Model Runs', used: 1284, limit: 5000 },
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '10px 12px' }}>
                  <div className="text-muted text-xs text-mono" style={{ marginBottom: 8 }}>{item.label}</div>
                  <div className="progress-track" style={{ marginBottom: 6 }}>
                    <div className="progress-fill progress-blue" style={{ width: `${(item.used / item.limit) * 100}%` }} />
                  </div>
                  <div className="text-xs text-mono" style={{ color: 'var(--text-primary)' }}>{item.used.toLocaleString()} / {item.limit.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-label" style={{ marginBottom: 16 }}>Billing Information</div>
          <FormRow label="Company Name" hint="Appears on invoices.">
            <input className="input" defaultValue="Korvixes Industrial AI Ltd." />
          </FormRow>
          <FormRow label="Billing Email" hint="Invoices and billing notices are sent here.">
            <input className="input" type="email" defaultValue="billing@korvixes.io" />
          </FormRow>
          <FormRow label="Payment Method" hint="Credit card on file.">
            <div className="flex items-center gap-3">
              <div style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={14} color="var(--text-secondary)" />
                <span>Visa •••• •••• •••• 4821</span>
                <span className="badge badge-success">Default</span>
              </div>
              <button className="btn btn-ghost btn-sm">Update</button>
            </div>
          </FormRow>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {tab === 'notifications' && (
        <div style={{ maxWidth: 820 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Channels</div>
          {[
            { key: 'emailAlerts', icon: Mail, label: 'Email Alerts', desc: 'Receive alerts via email', color: 'var(--blue)' },
            { key: 'slackAlerts', icon: Slack, label: 'Slack Integration', desc: 'Post to #korvixes-alerts channel', color: '#4A154B' },
            { key: 'smsAlerts', icon: MessageSquare, label: 'SMS Alerts', desc: 'Critical-only text messages', color: 'var(--success)' },
          ].map(item => (
            <FormRow key={item.key} label={item.label} hint={item.desc}>
              <div className="flex items-center gap-3">
                <Toggle on={toggles[item.key as keyof typeof toggles] as boolean} onChange={() => toggle(item.key as keyof typeof toggles)} />
                {item.key === 'slackAlerts' && <span className="text-cyan text-sm" style={{ cursor: 'pointer' }}>Configure →</span>}
              </div>
            </FormRow>
          ))}

          <div className="divider" />
          <div className="section-label" style={{ marginBottom: 16 }}>Alert Preferences</div>

          <FormRow label="Critical Alerts Only" hint="Only send notifications for critical severity events.">
            <Toggle on={toggles.criticalOnly} onChange={() => toggle('criticalOnly')} />
          </FormRow>
          <FormRow label="Weekly Summary Report" hint="Automated weekly performance digest every Monday.">
            <Toggle on={toggles.weeklyReport} onChange={() => toggle('weeklyReport')} />
          </FormRow>
          <FormRow label="Maintenance Window Alerts" hint="Notify before scheduled maintenance periods.">
            <Toggle on={toggles.maintenanceWin} onChange={() => toggle('maintenanceWin')} />
          </FormRow>

          <div className="divider" />
          <div className="section-label" style={{ marginBottom: 16 }}>Alert Rules</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { trigger: 'CPU Usage > 90% for 10 min', severity: 'critical', channel: 'Email + Slack' },
              { trigger: 'Simulation Failed', severity: 'high', channel: 'Email' },
              { trigger: 'Device offline > 5 min', severity: 'warning', channel: 'Slack' },
              { trigger: 'AI prediction confidence < 85%', severity: 'warning', channel: 'Email' },
              { trigger: 'Disk usage > 85%', severity: 'high', channel: 'Email + SMS' },
            ].map(rule => (
              <div key={rule.trigger} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div className="flex items-center gap-3" style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <AlertTriangle size={13} color={rule.severity === 'critical' ? 'var(--error)' : 'var(--warning)'} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5 }}>{rule.trigger}</span>
                </div>
                <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
                  <span className={`badge ${rule.severity === 'critical' ? 'badge-error' : 'badge-warning'}`}>{rule.severity}</span>
                  <span className="text-muted text-xs text-mono">{rule.channel}</span>
                  <button className="btn btn-ghost btn-sm btn-icon"><Settings size={11} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
