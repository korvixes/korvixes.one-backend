import { useState, useEffect } from 'react'
import { useRouteTab } from '../hooks/useRouteTab'
import {
  Cpu, MemoryStick, HardDrive, Activity, Zap,
  Server, AlertTriangle, CheckCircle, RefreshCw,
  TrendingUp, TrendingDown, Clock
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

function useAnimatedValue(target: number, interval = 2000) {
  const [val, setVal] = useState(target)
  useEffect(() => {
    const id = setInterval(() => {
      setVal(target + (Math.random() - 0.5) * 8)
    }, interval)
    return () => clearInterval(id)
  }, [target, interval])
  return Math.max(0, Math.min(100, Math.round(val)))
}

const generateHistory = (base: number, points = 40) =>
  Array.from({ length: points }, (_, i) => ({
    t: i,
    v: Math.max(5, Math.min(95, base + (Math.random() - 0.5) * 20)),
  }))

const nodes = [
  { id: 'NODE-01', role: 'Primary Compute', cpu: 74, ram: 61, gpu: 88, disk: 42, status: 'healthy', uptime: '47d 12h' },
  { id: 'NODE-02', role: 'Simulation Engine', cpu: 91, ram: 79, gpu: 95, disk: 38, status: 'warning', uptime: '47d 12h' },
  { id: 'NODE-03', role: 'AI Inference', cpu: 58, ram: 44, gpu: 72, disk: 55, status: 'healthy', uptime: '32d 8h' },
  { id: 'NODE-04', role: 'Data Ingestion', cpu: 33, ram: 38, gpu: 12, disk: 67, status: 'healthy', uptime: '47d 12h' },
  { id: 'NODE-05', role: 'API Gateway', cpu: 22, ram: 28, gpu: 0, disk: 31, status: 'healthy', uptime: '47d 12h' },
  { id: 'NODE-06', role: 'Storage Node', cpu: 18, ram: 71, gpu: 0, disk: 89, status: 'warning', uptime: '12d 3h' },
]

const alerts = [
  { level: 'error',   msg: 'NODE-02: GPU utilization >90% for 15m', time: '2m ago' },
  { level: 'warning', msg: 'NODE-06: Disk usage above 85% threshold', time: '8m ago' },
  { level: 'warning', msg: 'Sync latency spike detected on Substation Grid', time: '14m ago' },
  { level: 'info',    msg: 'NODE-03 memory optimized — reclaimed 4.2 GB', time: '32m ago' },
  { level: 'success', msg: 'Scheduled backup completed successfully', time: '1h ago' },
  { level: 'info',    msg: 'SSL certificates auto-renewed (3 services)', time: '2h ago' },
]

const alertConf = {
  error:   { cls: 'badge-error',   icon: AlertTriangle, color: 'var(--error)' },
  warning: { cls: 'badge-warning', icon: AlertTriangle, color: 'var(--warning)' },
  info:    { cls: 'badge-info',    icon: Activity,      color: 'var(--cyan)' },
  success: { cls: 'badge-success', icon: CheckCircle,   color: 'var(--success)' },
} as const

export function MonitoringPage() {
  const [tab, setTab] = useRouteTab('/monitoring', ['health', 'performance', 'sync', 'resources'] as const, 'health')
  const subtitle = ({
    health: '// System health overview · Real-time',
    performance: '// CPU + Memory + GPU performance trends',
    sync: '// Data ingestion + sync status across nodes',
    resources: '// Compute, storage, network resource usage',
  } as const)[tab]

  const cpuLive  = useAnimatedValue(62)
  const ramLive  = useAnimatedValue(58)
  const gpuLive  = useAnimatedValue(77)
  const diskLive = useAnimatedValue(51)

  const cpuHistory  = generateHistory(62)
  const ramHistory  = generateHistory(58)
  const gpuHistory  = generateHistory(77)
  const latHistory  = generateHistory(30)

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">System Monitoring</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm"><RefreshCw size={12} /> Refresh</button>
          <span className="badge badge-info" style={{ alignSelf: 'center' }}><span className="dot-live" />&nbsp;Live</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list-wrap" style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {([
            { id: 'health', label: 'System Health', icon: Activity },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'sync', label: 'Sync Status', icon: RefreshCw },
            { id: 'resources', label: 'Resource Usage', icon: Server },
          ] as const).map(t => (
            <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={12} style={{ display: 'inline', marginRight: 5 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'sync' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <span className="card-title">Sync Pipelines</span>
            <span className="badge badge-success"><span className="dot dot-success" /> All synced</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>SOURCE</th><th>TARGET TWIN</th><th>RATE</th><th>LAST SYNC</th><th>STATUS</th></tr></thead>
            <tbody>
              {[
                { src: 'SAP S/4HANA', tgt: 'Factory Floor A', rate: '15s', last: '3s ago', st: 'ok' },
                { src: 'Siemens MindSphere', tgt: 'Power Grid Zone 3', rate: '5s', last: '1s ago', st: 'ok' },
                { src: 'Kafka Event Stream', tgt: 'Pipeline Network', rate: 'RT', last: 'Live', st: 'ok' },
                { src: 'SCADA Legacy', tgt: 'Substation Grid', rate: '60s', last: '2m ago', st: 'warn' },
                { src: 'Azure Digital Twins', tgt: 'Turbine Complex', rate: '30s', last: '18s ago', st: 'ok' },
              ].map((r, i) => (
                <tr key={i}>
                  <td>{r.src}</td>
                  <td className="text-secondary">{r.tgt}</td>
                  <td><span className="text-mono text-xs text-cyan">{r.rate}</span></td>
                  <td><span className="text-mono text-xs text-muted">{r.last}</span></td>
                  <td><span className={`badge ${r.st === 'ok' ? 'badge-success' : 'badge-warning'}`}>{r.st === 'ok' ? 'Synced' : 'Delayed'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {tab === 'resources' && (
        <div className="grid-4 stagger" style={{ marginBottom: 16 }}>
          {[
            { label: 'Compute Hours', val: '4,812 h', sub: 'GPU + CPU this month', icon: Cpu, color: 'var(--blue)' },
            { label: 'Storage Used', val: '8.4 TB / 12 TB', sub: '70% of allocation', icon: HardDrive, color: 'var(--cyan)' },
            { label: 'Network Egress', val: '142 GB', sub: 'Last 24h', icon: Activity, color: 'var(--success)' },
            { label: 'Active GPUs', val: '14 / 16', sub: 'Across 6 nodes', icon: Zap, color: 'var(--warning)' },
          ].map(r => (
            <div key={r.label} className="card" style={{ padding: '16px 18px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                <span className="text-secondary text-sm">{r.label}</span>
                <r.icon size={14} color={r.color} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{r.val}</div>
              <div className="text-muted text-xs text-mono" style={{ marginTop: 4 }}>{r.sub}</div>
            </div>
          ))}
        </div>
      )}


      {/* Live gauges */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {[
          { label: 'CPU Usage', val: cpuLive, unit: '%', icon: Cpu, color: cpuLive > 80 ? 'var(--warning)' : 'var(--blue)', track: cpuLive > 80 ? 'progress-warn' : 'progress-blue' },
          { label: 'Memory', val: ramLive, unit: '%', icon: MemoryStick, color: ramLive > 80 ? 'var(--error)' : 'var(--cyan)', track: ramLive > 80 ? 'progress-error' : 'progress-blue' },
          { label: 'GPU Utilization', val: gpuLive, unit: '%', icon: Zap, color: gpuLive > 85 ? 'var(--error)' : 'var(--warning)', track: gpuLive > 85 ? 'progress-error' : 'progress-warn' },
          { label: 'Disk I/O', val: diskLive, unit: '%', icon: HardDrive, color: 'var(--success)', track: 'progress-green' },
        ].map(g => (
          <div key={g.label} className="card animate-in" style={{ padding: '16px 18px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <span className="text-secondary text-sm">{g.label}</span>
              <g.icon size={14} color={g.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: g.color, marginBottom: 10, lineHeight: 1 }}>
              {g.val}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>{g.unit}</span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${g.track}`} style={{ width: `${g.val}%`, transition: 'width 0.8s ease' }} />
            </div>
            <div className="text-muted text-xs text-mono" style={{ marginTop: 6 }}>
              {g.val > 80 ? '⚠ Above threshold' : '✓ Normal range'}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">CPU + Memory (40 samples)</span>
            <span className="text-muted text-xs text-mono">1s interval</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart margin={{ top: 0, right: 16, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} unit="%" />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Line data={cpuHistory} type="monotone" dataKey="v" stroke="#2A6BDB" strokeWidth={1.5} dot={false} name="CPU %" />
                <Line data={ramHistory} type="monotone" dataKey="v" stroke="#3BC4E8" strokeWidth={1.5} dot={false} name="RAM %" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">GPU + Sync Latency</span>
            <span className="text-muted text-xs text-mono">Real-time</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart margin={{ top: 0, right: 16, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" hide />
                <YAxis tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Line data={gpuHistory} type="monotone" dataKey="v" stroke="#D4A843" strokeWidth={1.5} dot={false} name="GPU %" />
                <Line data={latHistory} type="monotone" dataKey="v" stroke="#4CC38A" strokeWidth={1.5} dot={false} name="Latency ms" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rg-content-sidebar">
        {/* Node table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Compute Nodes</span>
            <span className="text-muted text-xs text-mono">{nodes.length} nodes registered</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>NODE</th>
                  <th>STATUS</th>
                  <th>CPU</th>
                  <th>RAM</th>
                  <th>GPU</th>
                  <th>DISK</th>
                  <th>UPTIME</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(n => (
                  <tr key={n.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: n.status === 'warning' ? 'var(--warning-dim)' : 'rgba(42,107,219,0.1)', border: `1px solid ${n.status === 'warning' ? 'rgba(212,168,67,0.25)' : 'rgba(42,107,219,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Server size={12} color={n.status === 'warning' ? 'var(--warning)' : 'var(--blue)'} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 12 }}>{n.id}</div>
                          <div className="text-muted text-xs">{n.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${n.status === 'healthy' ? 'badge-success' : 'badge-warning'}`}>
                        {n.status === 'healthy' ? <CheckCircle size={9} /> : <AlertTriangle size={9} />}
                        {n.status}
                      </span>
                    </td>
                    {[n.cpu, n.ram, n.gpu, n.disk].map((v, i) => (
                      <td key={i} style={{ minWidth: 90 }}>
                        <div className="flex items-center gap-2">
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className={`progress-fill ${v > 85 ? 'progress-error' : v > 70 ? 'progress-warn' : 'progress-blue'}`} style={{ width: `${v}%` }} />
                          </div>
                          <span className="text-mono text-xs text-muted">{v}%</span>
                        </div>
                      </td>
                    ))}
                    <td>
                      <div className="flex items-center gap-1">
                        <Clock size={10} color="var(--text-muted)" />
                        <span className="text-muted text-xs text-mono">{n.uptime}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert log */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">System Alerts</span>
            <span className="badge badge-error">
              {alerts.filter(a => a.level === 'error' || a.level === 'warning').length} active
            </span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map((a, i) => {
              const conf = alertConf[a.level as keyof typeof alertConf]
              return (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--bg-overlay)', borderRadius: 6, borderLeft: `3px solid ${conf.color}` }}>
                  <conf.icon size={13} color={conf.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, marginBottom: 3 }}>{a.msg}</div>
                    <div className="text-muted text-xs text-mono">{a.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
