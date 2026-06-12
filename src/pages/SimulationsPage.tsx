import { useState } from 'react'
import { useRouteTab } from '../hooks/useRouteTab'
import {
  Play, Pause, StopCircle, RefreshCw, Plus,
  Search, Filter, Clock, Cpu,
  ChevronRight, BarChart2, AlertTriangle, CheckCircle,
  XCircle, Timer, Layers, Settings2, Download
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

const simulations = [
  { id: 'SIM-0091', name: 'Factory Floor Thermal Sim', twin: 'Factory Floor A', status: 'running', progress: 67, duration: '2h 14m', cpu: 84, ram: 61, accuracy: 97.2, started: '10:32 AM', eta: '18 min', priority: 'high' },
  { id: 'SIM-0089', name: 'Power Grid Load Balancing', twin: 'Power Grid Zone 3', status: 'running', progress: 43, duration: '1h 02m', cpu: 72, ram: 55, accuracy: 98.1, started: '11:44 AM', eta: '41 min', priority: 'critical' },
  { id: 'SIM-0087', name: 'Assembly Line Optimization', twin: 'Smart Assembly B', status: 'queued', progress: 0, duration: '—', cpu: 0, ram: 0, accuracy: 0, started: 'Pending', eta: '~35 min', priority: 'medium' },
  { id: 'SIM-0086', name: 'Fluid Dynamics Pipeline', twin: 'Pipeline Network', status: 'completed', progress: 100, duration: '3h 28m', cpu: 0, ram: 0, accuracy: 99.4, started: '07:15 AM', eta: 'Done', priority: 'low' },
  { id: 'SIM-0085', name: 'Turbine Stress Analysis', twin: 'Turbine Complex', status: 'completed', progress: 100, duration: '5h 11m', cpu: 0, ram: 0, accuracy: 98.9, started: '05:00 AM', eta: 'Done', priority: 'high' },
  { id: 'SIM-0083', name: 'Substation Fault Detect', twin: 'Substation Grid', status: 'failed', progress: 38, duration: '0h 52m', cpu: 0, ram: 0, accuracy: 0, started: '09:18 AM', eta: 'Failed', priority: 'critical' },
  { id: 'SIM-0082', name: 'Conveyor Wear Prediction', twin: 'Conveyor System C', status: 'running', progress: 89, duration: '4h 05m', cpu: 31, ram: 29, accuracy: 96.7, started: '08:20 AM', eta: '6 min', priority: 'medium' },
  { id: 'SIM-0081', name: 'Water Treatment Cycle', twin: 'Water Treatment', status: 'completed', progress: 100, duration: '2h 40m', cpu: 0, ram: 0, accuracy: 97.8, started: '07:55 AM', eta: 'Done', priority: 'low' },
]

const throughputData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  sims: Math.floor(3 + Math.random() * 8),
  failed: Math.floor(Math.random() * 2),
}))

const statusConfig = {
  running:   { label: 'Running',   cls: 'badge-info',    dot: 'dot-info',    icon: Play },
  queued:    { label: 'Queued',    cls: 'badge-muted',   dot: 'dot-muted',   icon: Timer },
  completed: { label: 'Completed', cls: 'badge-success', dot: 'dot-success', icon: CheckCircle },
  failed:    { label: 'Failed',    cls: 'badge-error',   dot: 'dot-error',   icon: XCircle },
} as const

const priorityConfig = {
  critical: { cls: 'text-error',   label: 'CRITICAL' },
  high:     { cls: 'text-warning', label: 'HIGH' },
  medium:   { cls: 'text-cyan',    label: 'MED' },
  low:      { cls: 'text-muted',   label: 'LOW' },
} as const

export function SimulationsPage() {
  const [tab, setTab] = useRouteTab('/simulations', ['all', 'running', 'completed', 'failed'] as const, 'all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = simulations.filter(s => {
    if (tab === 'running'   && s.status !== 'running')   return false
    if (tab === 'completed' && s.status !== 'completed') return false
    if (tab === 'failed'    && s.status !== 'failed')    return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    all: simulations.length,
    running: simulations.filter(s => s.status === 'running').length,
    completed: simulations.filter(s => s.status === 'completed').length,
    failed: simulations.filter(s => s.status === 'failed').length,
  }

  const selectedSim = simulations.find(s => s.id === selected)

  return (
    <div className="page animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Simulation Management</h1>
          <p className="page-subtitle">// {counts.running} active · {counts.completed} completed · {counts.failed} failed today</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm"><Download size={12} /> Export</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> New Simulation</button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Today', val: '18', sub: '+3 from yesterday', color: 'var(--blue)', icon: Layers },
          { label: 'Running', val: String(counts.running), sub: 'Active pipelines', color: 'var(--cyan)', icon: Play },
          { label: 'GPU Utilization', val: '74%', sub: 'Across 8 nodes', color: 'var(--warning)', icon: Cpu },
          { label: 'Avg Accuracy', val: '98.1%', sub: 'Last 24h', color: 'var(--success)', icon: BarChart2 },
        ].map(c => (
          <div key={c.label} className="card animate-in" style={{ padding: '16px 18px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <span className="text-secondary text-sm">{c.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={14} color={c.color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{c.val}</div>
            <div className="text-muted text-xs text-mono" style={{ marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="rg-content-sidebar">
        {/* Main table */}
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: 8 }}>
            <div className="tab-list-wrap">
              <div className="tab-list">
                {(['all', 'running', 'completed', 'failed'] as const).map(t => (
                  <button key={t} className={`tab-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                    <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>({counts[t]})</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2" style={{ flexShrink: 0 }}>
              <div className="search-bar" style={{ width: 200, maxWidth: '100%' }}>
                <Search size={12} color="var(--text-muted)" />
                <input placeholder="Search simulations..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Filter"><Filter size={13} /></button>
              <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Refresh"><RefreshCw size={13} /></button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID / NAME</th>
                  <th>STATUS</th>
                  <th>PROGRESS</th>
                  <th>TWIN</th>
                  <th>DURATION</th>
                  <th>ACCURACY</th>
                  <th>PRIORITY</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sim => {
                  const s = statusConfig[sim.status as keyof typeof statusConfig]
                  const p = priorityConfig[sim.priority as keyof typeof priorityConfig]
                  return (
                    <tr key={sim.id} style={{ cursor: 'pointer', background: selected === sim.id ? 'rgba(42,107,219,0.06)' : undefined }}
                      onClick={() => setSelected(selected === sim.id ? null : sim.id)}>
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', marginBottom: 2 }}>{sim.id}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 500 }}>{sim.name}</div>
                      </td>
                      <td>
                        <span className={`badge ${s.cls}`}>
                          <span className={`dot ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <div className="flex items-center gap-2">
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className={`progress-fill ${
                              sim.status === 'failed' ? 'progress-error' :
                              sim.status === 'completed' ? 'progress-green' : 'progress-blue'
                            }`} style={{ width: `${sim.progress}%` }} />
                          </div>
                          <span className="text-mono text-xs text-muted">{sim.progress}%</span>
                        </div>
                      </td>
                      <td className="text-secondary text-sm">{sim.twin}</td>
                      <td>
                        <span className="text-mono text-xs">{sim.duration}</span>
                      </td>
                      <td>
                        {sim.accuracy > 0
                          ? <span style={{ color: sim.accuracy > 98 ? 'var(--success)' : 'var(--warning)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{sim.accuracy}%</span>
                          : <span className="text-muted text-xs">—</span>
                        }
                      </td>
                      <td><span className={`text-mono text-xs ${p.cls}`}>{p.label}</span></td>
                      <td>
                        <div className="flex gap-1">
                          {sim.status === 'running' && (
                            <>
                              <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Pause"><Pause size={11} /></button>
                              <button className="btn btn-danger btn-sm btn-icon" data-tooltip="Stop"><StopCircle size={11} /></button>
                            </>
                          )}
                          {sim.status === 'failed' && (
                            <button className="btn btn-secondary btn-sm btn-icon" data-tooltip="Retry"><RefreshCw size={11} /></button>
                          )}
                          <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Details"><ChevronRight size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Detail panel */}
          {selectedSim ? (
            <div className="card animate-in">
              <div className="card-header">
                <span className="card-title">{selectedSim.id}</span>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>SIMULATION NAME</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedSim.name}</div>
                </div>
                <div className="grid-2">
                  <div>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>STATUS</div>
                    <span className={`badge ${statusConfig[selectedSim.status as keyof typeof statusConfig].cls}`}>
                      {statusConfig[selectedSim.status as keyof typeof statusConfig].label}
                    </span>
                  </div>
                  <div>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>ETA</div>
                    <span className="text-mono text-sm">{selectedSim.eta}</span>
                  </div>
                </div>
                {selectedSim.status === 'running' && (
                  <>
                    <div>
                      <div className="flex justify-between text-xs text-mono" style={{ marginBottom: 6 }}>
                        <span className="text-muted">CPU</span>
                        <span style={{ color: selectedSim.cpu > 80 ? 'var(--warning)' : 'var(--success)' }}>{selectedSim.cpu}%</span>
                      </div>
                      <div className="progress-track">
                        <div className={`progress-fill ${selectedSim.cpu > 80 ? 'progress-warn' : 'progress-blue'}`} style={{ width: `${selectedSim.cpu}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-mono" style={{ marginBottom: 6 }}>
                        <span className="text-muted">RAM</span>
                        <span className="text-cyan">{selectedSim.ram}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill progress-blue" style={{ width: `${selectedSim.ram}%` }} />
                      </div>
                    </div>
                  </>
                )}
                <div className="grid-2">
                  <div>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>STARTED</div>
                    <span className="text-sm text-mono">{selectedSim.started}</span>
                  </div>
                  <div>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>DURATION</div>
                    <span className="text-sm text-mono">{selectedSim.duration}</span>
                  </div>
                </div>
                {selectedSim.accuracy > 0 && (
                  <div style={{ background: 'var(--success-dim)', border: '1px solid rgba(76,195,138,0.2)', borderRadius: 7, padding: '10px 12px' }}>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>ACCURACY SCORE</div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--success)' }}>{selectedSim.accuracy}%</div>
                  </div>
                )}
                {selectedSim.status === 'running' && (
                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Pause size={12} /> Pause</button>
                    <button className="btn btn-danger btn-sm" style={{ flex: 1 }}><StopCircle size={12} /> Stop</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Layers size={18} color="var(--blue)" />
              </div>
              <div className="text-secondary text-sm" style={{ marginBottom: 6 }}>Select a simulation</div>
              <div className="text-muted text-xs text-mono">Click any row to view details</div>
            </div>
          )}

          {/* Throughput chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">24h Throughput</span>
              <span className="badge badge-info"><span className="dot-live" />&nbsp;Live</span>
            </div>
            <div style={{ padding: '12px 4px 8px' }}>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={throughputData} margin={{ top: 0, right: 12, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A6BDB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2A6BDB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="h" tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} interval={5} />
                  <YAxis tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                  <Tooltip
                    contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }}
                    labelStyle={{ color: '#7E8394' }}
                  />
                  <Area type="monotone" dataKey="sims" stroke="#2A6BDB" strokeWidth={1.5} fill="url(#simGrad)" name="Simulations" />
                  <Area type="monotone" dataKey="failed" stroke="#D94A3A" strokeWidth={1} fill="none" strokeDasharray="3 3" name="Failed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <div className="card-header"><span className="card-title">Quick Actions</span></div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: Play,         label: 'Run All Queued',      color: 'var(--cyan)' },
                { icon: AlertTriangle, label: 'Investigate Failed',  color: 'var(--warning)' },
                { icon: Settings2,    label: 'Simulation Settings',  color: 'var(--blue)' },
                { icon: Download,     label: 'Export Results',       color: 'var(--success)' },
              ].map(a => (
                <button key={a.label} className="btn btn-ghost" style={{ justifyContent: 'flex-start', width: '100%', gap: 10 }}>
                  <a.icon size={13} color={a.color} />
                  <span style={{ fontSize: 12.5 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
