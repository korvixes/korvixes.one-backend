import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Box, Cpu, Activity, Wifi, Zap, Clock, Play, RefreshCw } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const twinDatabase: Record<string, {
  id: string; name: string; type: string; status: string;
  devices: number; accuracy: number; model: string; description: string;
  location: string; uptime: string; simulationsRun: number; lastSync: string;
}> = {
  'kv-009': {
    id: 'KV-009', name: 'Factory Floor A', type: 'Manufacturing',
    status: 'online', devices: 142, accuracy: 99.4,
    model: 'Physics v4.2', description: 'Full digital representation of Factory Floor A including all assembly lines, robotic arms, conveyor systems, and environmental sensors.',
    location: 'Building A, Zone 3', uptime: '47d 12h 34m',
    simulationsRun: 184, lastSync: '2s ago',
  },
  'kv-007': {
    id: 'KV-007', name: 'Power Grid Zone 3', type: 'Energy',
    status: 'online', devices: 87, accuracy: 98.7,
    model: 'Grid Model v2.1', description: 'Digital twin of the electrical grid distribution network for Zone 3, covering substations, transformers, and load balancers.',
    location: 'Substation 3-A', uptime: '124d 8h 12m',
    simulationsRun: 92, lastSync: '5s ago',
  },
  'kv-012': {
    id: 'KV-012', name: 'Smart Assembly B', type: 'Smart Factory',
    status: 'warning', devices: 204, accuracy: 96.2,
    model: 'Robotics v3.0', description: 'Smart assembly line with robotic integration, vision systems, and predictive maintenance sensors.',
    location: 'Building B, Floor 2', uptime: '32d 5h 48m',
    simulationsRun: 67, lastSync: '12s ago',
  },
  'kv-004': {
    id: 'KV-004', name: 'Pipeline Network', type: 'Infrastructure',
    status: 'online', devices: 63, accuracy: 99.1,
    model: 'Fluid v1.8', description: 'Pipeline infrastructure twin monitoring flow rates, pressure, valve states, and leak detection across the network.',
    location: 'Sector B-4', uptime: '89d 2h 15m',
    simulationsRun: 156, lastSync: '3s ago',
  },
  'kv-015': {
    id: 'KV-015', name: 'Turbine Complex', type: 'Energy',
    status: 'syncing', devices: 118, accuracy: 97.8,
    model: 'Thermal v2.4', description: 'Turbine system digital twin with thermal monitoring, vibration analysis, and efficiency optimization.',
    location: 'Power Station 2', uptime: '12d 18h 33m',
    simulationsRun: 203, lastSync: '1m ago',
  },
  'kv-018': {
    id: 'KV-018', name: 'Conveyor System C', type: 'Manufacturing',
    status: 'online', devices: 76, accuracy: 98.3,
    model: 'Mechanical v2.9', description: 'Conveyor belt system digital twin with wear prediction, speed optimization, and throughput analysis.',
    location: 'Logistics Wing C', uptime: '67d 4h 21m',
    simulationsRun: 45, lastSync: '8s ago',
  },
  'kv-020': {
    id: 'KV-020', name: 'Water Treatment', type: 'Infrastructure',
    status: 'online', devices: 44, accuracy: 97.5,
    model: 'Fluid v1.8', description: 'Water treatment facility digital twin monitoring filtration, chemical levels, flow rates, and quality metrics.',
    location: 'Plant West', uptime: '156d 11h 02m',
    simulationsRun: 78, lastSync: '15s ago',
  },
  'kv-023': {
    id: 'KV-023', name: 'Substation Grid', type: 'Energy',
    status: 'error', devices: 32, accuracy: 88.4,
    model: 'Grid Model v2.1', description: 'Electrical substation digital twin with real-time monitoring of breakers, transformers, and power quality.',
    location: 'Substation 7-B', uptime: '2d 6h 44m',
    simulationsRun: 34, lastSync: '5m ago',
  },
}

const statusColors: Record<string, string> = {
  online: '#4CC38A', warning: '#D4A843', syncing: '#3BC4E8', error: '#D94A3A',
}

const recentSims = [
  { id: 'SIM-0091', name: 'Thermal Load Analysis', status: 'completed', accuracy: 99.1, duration: '2h 14m' },
  { id: 'SIM-0087', name: 'Efficiency Optimization', status: 'running', accuracy: 97.4, duration: '1h 02m' },
  { id: 'SIM-0083', name: 'Failure Mode Simulation', status: 'completed', accuracy: 98.7, duration: '3h 28m' },
  { id: 'SIM-0079', name: 'Throughput Prediction', status: 'failed', accuracy: 0, duration: '0h 52m' },
]

const metricsHistory = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  cpu: 40 + Math.random() * 40 + Math.sin(i / 3) * 10,
  throughput: 200 + Math.random() * 100 + Math.sin(i / 2) * 50,
}))

export function TwinDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const twin = id ? twinDatabase[id.toLowerCase()] : null

  const [liveCpu, setLiveCpu] = useState(62)
  const [liveMem, setLiveMem] = useState(54)
  const [liveLat, setLiveLat] = useState(2.4)

  useEffect(() => {
    if (!twin) return
    const interval = setInterval(() => {
      setLiveCpu(p => Math.max(20, Math.min(95, p + (Math.random() - 0.5) * 8)))
      setLiveMem(p => Math.max(30, Math.min(85, p + (Math.random() - 0.5) * 6)))
      setLiveLat(p => Math.max(0.5, Math.min(8, p + (Math.random() - 0.5) * 1.2)))
    }, 2500)
    return () => clearInterval(interval)
  }, [twin])

  if (!twin) {
    return (
      <div className="page animate-in" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#2A6BDB', fontFamily: 'Syne, sans-serif', marginBottom: 12 }}>404</div>
        <div style={{ fontSize: 16, color: '#7E8394', marginBottom: 20 }}>Digital twin not found</div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/digital-twins')}>Back to Twins</button>
      </div>
    )
  }

  const statusColor = statusColors[twin.status] || '#7E8394'
  const statusLabel = twin.status.charAt(0).toUpperCase() + twin.status.slice(1)

  return (
    <div className="page animate-in">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/digital-twins')} className="btn btn-ghost btn-sm btn-icon">
            <ArrowLeft size={14} />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="page-title" style={{ wordBreak: 'break-word' }}>{twin.name}</h1>
              <span className={`badge ${twin.status === 'online' ? 'badge-success' : twin.status === 'warning' ? 'badge-warning' : twin.status === 'syncing' ? 'badge-info' : 'badge-error'}`} style={{ flexShrink: 0 }}>
                <span className={`dot ${twin.status === 'online' ? 'dot-success' : twin.status === 'warning' ? 'dot-warning' : twin.status === 'syncing' ? 'dot-info' : 'dot-error'}`} />
                {statusLabel}
              </span>
            </div>
            <p className="page-subtitle">// {twin.id} &middot; {twin.type} &middot; {twin.model}</p>
          </div>
        </div>
      </div>

      {/* Overview grid */}
      <div className="rg-overview-status" style={{ marginBottom: 20 }}>
        {/* Left: Description + Key Metrics */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Overview</div>
          <p style={{ fontSize: 13, color: '#7E8394', lineHeight: 1.6, marginBottom: 20 }}>{twin.description}</p>

          <div className="grid-2">
            {[
              { icon: Box, label: 'Location', value: twin.location },
              { icon: Clock, label: 'Uptime', value: twin.uptime },
              { icon: Cpu, label: 'Simulations Run', value: String(twin.simulationsRun) },
              { icon: Wifi, label: 'Connected Devices', value: String(twin.devices) },
              { icon: Activity, label: 'Sync Rate', value: '142 Hz' },
              { icon: Zap, label: 'Model Accuracy', value: `${twin.accuracy}%` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', background: '#090C14', borderRadius: 8, minWidth: 0,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 6,
                  background: 'rgba(42,107,219,0.12)', border: '1px solid rgba(42,107,219,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={13} color="#3BC4E8" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: '#4A5168', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.06em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Status Panel */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Live Status
              <span className="status-dot status-online animate-pulse-dot" style={{ marginLeft: 4 }} />
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'CPU Load', value: liveCpu, color: '#2A6BDB', unit: '%', warnAt: 80 },
              { label: 'Memory Usage', value: liveMem, color: '#9B6BDB', unit: '%', warnAt: 80 },
              { label: 'Sync Latency', value: liveLat, color: '#3BC4E8', unit: ' ms', warnAt: 5 },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#7E8394', fontFamily: 'JetBrains Mono' }}>{m.label}</span>
                  <span style={{
                    fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 500,
                    color: m.value > m.warnAt ? '#D4A843' : '#4CC38A',
                  }}>
                    {m.value.toFixed(m.unit === ' ms' ? 2 : 1)}{m.unit}
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min((m.value / (m.unit === ' ms' ? 10 : 100)) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${m.color}, ${m.value > m.warnAt ? '#D4A843' : m.color})`,
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #262A38' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                type="button"
                onClick={() => {
                  // Meaningful behavior: kick off a “sim” state by updating live metrics.
                  setLiveCpu(p => Math.min(95, Math.max(p, 80 + Math.random() * 10)))
                  setLiveLat(p => Math.min(8, Math.max(p, 2.8 + Math.random() * 1.5)))
                  setLiveMem(p => Math.min(85, Math.max(p, 70 + Math.random() * 10)))
                }}
              >
                <Play size={11} /> Run Simulation
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ flex: 1 }}
                type="button"
                onClick={() => {
                  // Meaningful behavior: emulate a successful sync by reducing latency and updating accuracy-ish signals.
                  setLiveLat(p => Math.max(0.6, p - (0.8 + Math.random() * 0.8)))
                  setLiveCpu(p => Math.max(20, p - (5 + Math.random() * 8)))
                  setLiveMem(p => Math.max(30, p - (3 + Math.random() * 6)))
                }}
              >
                <RefreshCw size={11} /> Sync Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="rg-charts-pair" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">CPU & Memory Trend (20 samples)</span>
            <span className="badge badge-info"><span className="dot-live" />&nbsp;Live</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={metricsHistory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A6BDB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2A6BDB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#4A5168' }} />
                <YAxis tick={{ fontSize: 8, fill: '#4A5168' }} />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="cpu" stroke="#2A6BDB" strokeWidth={1.5} fill="url(#cpuGrad)" name="CPU %" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Data Throughput</span>
            <span className="text-muted text-xs text-mono">MB/s</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={metricsHistory} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="tputGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3BC4E8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3BC4E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#4A5168' }} />
                <YAxis tick={{ fontSize: 8, fill: '#4A5168' }} />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="throughput" stroke="#3BC4E8" strokeWidth={1.5} fill="url(#tputGrad)" name="MB/s" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Simulations */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Simulations</span>
          <span className="text-muted text-xs text-mono">Last 30 days</span>
        </div>
        <div className="data-table-wrapper">
        <table className="data-table detail-sims-table">
          <thead>
            <tr>
              <th>SIMULATION</th>
              <th>STATUS</th>
              <th>ACCURACY</th>
              <th>DURATION</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentSims.map(sim => (
              <tr key={sim.id}>
                <td>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#3BC4E8', marginBottom: 2 }}>{sim.id}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{sim.name}</div>
                </td>
                <td>
                  <span className={`badge ${
                    sim.status === 'completed' ? 'badge-success' :
                    sim.status === 'running' ? 'badge-info' : 'badge-error'
                  }`}>
                    <span className={`dot ${
                      sim.status === 'completed' ? 'dot-success' :
                      sim.status === 'running' ? 'dot-info' : 'dot-error'
                    }`} />
                    {sim.status.charAt(0).toUpperCase() + sim.status.slice(1)}
                  </span>
                </td>
                <td>
                  {sim.accuracy > 0 ? (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#4CC38A' }}>{sim.accuracy}%</span>
                  ) : (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#4A5168' }}>—</span>
                  )}
                </td>
                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#7E8394' }}>{sim.duration}</td>
                <td>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11 }}
                    type="button"
                    onClick={() => {
                      // Meaningful behavior: navigate to the simulations page and seed selection via query.
                      // (SimulationsPage currently uses local in-memory selection, so we just navigate.)
                      navigate('/simulations')
                    }}
                  >
                    Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}


