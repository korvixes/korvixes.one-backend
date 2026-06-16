import { useState } from 'react'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import { Plus, Search, Filter, RefreshCw, ArrowLeft, Sparkles, Factory, Zap as ZapIcon, Wrench, Droplets, Cpu } from 'lucide-react'

const twinsData = [
  { id: 'KV-009', name: 'Factory Floor A', type: 'Manufacturing', status: 'online', devices: 142, accuracy: 99.4, sync: '2s ago', model: 'Physics v4.2' },
  { id: 'KV-007', name: 'Power Grid Zone 3', type: 'Energy', status: 'online', devices: 87, accuracy: 98.7, sync: '5s ago', model: 'Grid Model v2.1' },
  { id: 'KV-012', name: 'Smart Assembly B', type: 'Smart Factory', status: 'warning', devices: 204, accuracy: 96.2, sync: '12s ago', model: 'Robotics v3.0' },
  { id: 'KV-004', name: 'Pipeline Network', type: 'Infrastructure', status: 'online', devices: 63, accuracy: 99.1, sync: '3s ago', model: 'Fluid v1.8' },
  { id: 'KV-015', name: 'Turbine Complex', type: 'Energy', status: 'syncing', devices: 118, accuracy: 97.8, sync: '1m ago', model: 'Thermal v2.4' },
  { id: 'KV-018', name: 'Conveyor System C', type: 'Manufacturing', status: 'online', devices: 76, accuracy: 98.3, sync: '8s ago', model: 'Mechanical v2.9' },
  { id: 'KV-020', name: 'Water Treatment', type: 'Infrastructure', status: 'online', devices: 44, accuracy: 97.5, sync: '15s ago', model: 'Fluid v1.8' },
  { id: 'KV-023', name: 'Substation Grid', type: 'Energy', status: 'error', devices: 32, accuracy: 88.4, sync: '5m ago', model: 'Grid Model v2.1' },
]

const templates = [
  { id: 'tpl-fact', name: 'Smart Factory', desc: 'Assembly lines, robotics, conveyor, MES integration.', icon: Factory, accent: 'var(--blue)', devices: 'PLC · MES · OPC-UA' },
  { id: 'tpl-grid', name: 'Power Grid', desc: 'Substations, transformers, grid load balancing.', icon: ZapIcon, accent: 'var(--cyan)', devices: 'SCADA · IEC 61850' },
  { id: 'tpl-mech', name: 'Mechanical Asset', desc: 'Vibration, thermal, wear prediction modelling.', icon: Wrench, accent: 'var(--warning)', devices: 'IoT Sensors · MQTT' },
  { id: 'tpl-fluid', name: 'Fluid Network', desc: 'Pipelines, water treatment, flow dynamics.', icon: Droplets, accent: 'var(--success)', devices: 'Flow · Pressure · Modbus' },
  { id: 'tpl-comp', name: 'Compute Cluster', desc: 'Edge / fog compute nodes with GPU inference.', icon: Cpu, accent: 'var(--blue)', devices: 'K8s · Prometheus' },
  { id: 'tpl-blank', name: 'Blank Twin', desc: 'Start from scratch with no preset model.', icon: Sparkles, accent: 'var(--text-secondary)', devices: 'Custom' },
]

function TwinsList() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', flex: '1 1 auto', minWidth: 0 }}>
          <div className="search-bar" style={{ flex: '1 1 160px', maxWidth: 220, minWidth: 120 }}>
            <Search size={13} color="var(--text-muted)" />
            <input placeholder="Search twins..." />
          </div>
          <button className="btn btn-ghost btn-sm"><Filter size={13} /> Filter</button>
          <button className="btn btn-ghost btn-sm"><RefreshCw size={13} /> Sync All</button>
        </div>
        <div className="flex gap-2" style={{ flexShrink: 0, flexWrap: 'wrap' }}>
          <NavLink to="/twins/templates" className="btn btn-ghost btn-sm"><Sparkles size={13} /> Templates</NavLink>
          <NavLink to="/twins/create" className="btn btn-primary btn-sm"><Plus size={14} /> Create Twin</NavLink>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Twins', value: '247', color: 'var(--blue)' },
          { label: 'Online', value: '231', color: 'var(--success)' },
          { label: 'Warning', value: '12', color: 'var(--warning)' },
          { label: 'Offline/Error', value: '4', color: 'var(--error)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{s.value}</span>
            <span className="text-secondary text-sm">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrapper">
        <table className="data-table twins-list-table">
          <thead>
            <tr>
              {['', 'Twin ID', 'Name', 'Type', 'Model', 'Status', 'Devices', 'Accuracy', 'Last Sync', ''].map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {twinsData.map(row => (
              <tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/digital-twins/${row.id.toLowerCase()}`)}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,20,30,0.6)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}>
                <td style={{ width: 18 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: 'var(--blue)', opacity: 0.5 }} />
                </td>
                <td><span className="text-mono text-xs" style={{ color: 'var(--blue)' }}>{row.id}</span></td>
                <td style={{ fontWeight: 500 }}>{row.name}</td>
                <td>
                  <span className={`badge ${row.type === 'Manufacturing' ? 'badge-info' : row.type === 'Energy' ? 'badge-info' : 'badge-muted'}`}>{row.type}</span>
                </td>
                <td className="text-muted text-xs text-mono">{row.model}</td>
                <td>
                  <span className={`badge ${row.status === 'online' ? 'badge-success' : row.status === 'warning' ? 'badge-warning' : row.status === 'syncing' ? 'badge-info' : 'badge-error'}`}>
                    <span className={`dot ${row.status === 'online' ? 'dot-success' : row.status === 'warning' ? 'dot-warning' : row.status === 'syncing' ? 'dot-info' : 'dot-error'}`} />
                    {row.status}
                  </span>
                </td>
                <td className="text-mono text-xs text-secondary">{row.devices}</td>
                <td><span className="text-mono text-xs" style={{ color: row.accuracy > 99 ? 'var(--success)' : row.accuracy > 97 ? 'var(--warning)' : 'var(--error)' }}>{row.accuracy}%</span></td>
                <td className="text-mono text-xs text-muted">{row.sync}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); navigate(`/digital-twins/${row.id.toLowerCase()}`) }}>View →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}

function TwinsCreate() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', type: 'Manufacturing', model: 'Physics v4.2', description: '' })
  const [created, setCreated] = useState(false)

  if (created) {
    return (
      <div className="card animate-in" style={{ maxWidth: 560, margin: '40px auto', padding: '28px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--success-dim)', border: '1px solid rgba(76,195,138,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Sparkles size={24} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Twin Created</h2>
        <p className="text-secondary text-sm" style={{ marginBottom: 18 }}>
          <span className="text-mono text-cyan">{form.name || 'Untitled Twin'}</span> is now provisioned and ready to ingest data.
        </p>
        <div className="flex gap-2 justify-center">
          <button className="btn btn-ghost btn-sm" onClick={() => { setCreated(false); setStep(1) }}>Create Another</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/twins')}>View All Twins</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => navigate('/twins')}><ArrowLeft size={13} /></button>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Create New Digital Twin</h2>
          <div className="text-muted text-xs text-mono">Step {step} of 3</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {step === 1 && (
          <>
            <div className="section-label" style={{ marginBottom: 16 }}>Identity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="text-secondary text-xs text-mono" style={{ display: 'block', marginBottom: 6 }}>TWIN NAME</label>
                <input className="input" placeholder="e.g. Factory Floor D" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-secondary text-xs text-mono" style={{ display: 'block', marginBottom: 6 }}>TYPE</label>
                <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option>Manufacturing</option>
                  <option>Energy</option>
                  <option>Infrastructure</option>
                  <option>Smart Factory</option>
                </select>
              </div>
              <div>
                <label className="text-secondary text-xs text-mono" style={{ display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
                <textarea className="input" rows={3} placeholder="Optional description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="section-label" style={{ marginBottom: 16 }}>Physics Model</div>
            <div className="rg-charts-pair" style={{ gap: 10 }}>
              {['Physics v4.2', 'Grid Model v2.1', 'Robotics v3.0', 'Fluid v1.8', 'Thermal v2.4', 'Mechanical v2.9'].map(m => (
                <button key={m} onClick={() => setForm({ ...form, model: m })}
                  className="card" style={{
                    padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                    borderColor: form.model === m ? 'var(--blue)' : undefined,
                    background: form.model === m ? 'var(--blue-dim)' : undefined,
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{m}</div>
                  <div className="text-muted text-xs text-mono" style={{ marginTop: 4 }}>NVIDIA Omniverse compatible</div>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="section-label" style={{ marginBottom: 16 }}>Review</div>
            <div style={{ background: 'var(--bg-overlay)', borderRadius: 8, padding: '16px 18px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <div className="flex justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}><span className="text-muted">NAME</span><span>{form.name || '—'}</span></div>
              <div className="flex justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}><span className="text-muted">TYPE</span><span>{form.type}</span></div>
              <div className="flex justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}><span className="text-muted">MODEL</span><span className="text-cyan">{form.model}</span></div>
              <div className="flex justify-between" style={{ padding: '6px 0' }}><span className="text-muted">DESCRIPTION</span><span style={{ maxWidth: 320, textAlign: 'right' }}>{form.description || '—'}</span></div>
            </div>
          </>
        )}

        <div className="flex justify-between" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost btn-sm" disabled={step === 1} onClick={() => setStep(s => s - 1)}>Back</button>
          {step < 3
            ? <button className="btn btn-primary btn-sm" onClick={() => setStep(s => s + 1)}>Continue →</button>
            : <button className="btn btn-primary btn-sm" onClick={() => setCreated(true)}><Sparkles size={12} /> Provision Twin</button>}
        </div>
      </div>
    </div>
  )
}

function TwinsTemplates() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 20, gap: 8, flexWrap: 'wrap' }}>
        <div className="flex items-center gap-2" style={{ minWidth: 0, flex: '1 1 auto' }}>
          <button className="btn btn-ghost btn-sm btn-icon" style={{ flexShrink: 0 }} onClick={() => navigate('/twins')}><ArrowLeft size={13} /></button>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Twin Templates</h2>
            <div className="text-muted text-xs text-mono">// Curated starting points for new digital twins</div>
          </div>
        </div>
        <NavLink to="/twins/create" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}><Plus size={13} /> New From Scratch</NavLink>
      </div>

      <div className="grid-3">
        {templates.map(t => (
          <div key={t.id} className="card animate-in" style={{ padding: '18px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${t.accent}1f`, border: `1px solid ${t.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <t.icon size={18} color={t.accent} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t.name}</div>
            <div className="text-secondary text-xs" style={{ marginBottom: 12, lineHeight: 1.5 }}>{t.desc}</div>
            <div className="text-muted text-xs text-mono" style={{ marginBottom: 14 }}>{t.devices}</div>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => navigate('/twins/create')}>Use Template</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TwinsPage() {
  const location = useLocation()
  const sub = location.pathname.replace(/\/+$/, '').split('/')[2]

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Twins</h1>
          <p className="page-subtitle">
            {sub === 'create' ? '// Provisioning a new digital twin'
              : sub === 'templates' ? '// Browse preset twin templates'
              : '// 247 twins · 231 online · NVIDIA Omniverse v2024.2'}
          </p>
        </div>
      </div>

      {sub === 'create' ? <TwinsCreate />
        : sub === 'templates' ? <TwinsTemplates />
        : <TwinsList />}
    </div>
  )
}
