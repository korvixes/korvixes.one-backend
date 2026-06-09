import { useState } from 'react'
import { useRouteTab } from '../hooks/useRouteTab'
import {
  BarChart2, TrendingUp, Download, Calendar,
  FileText, Filter, RefreshCw, ArrowUp, ArrowDown,
  Activity, Layers, Brain, Cpu
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const twinGrowth = months.map((m, i) => ({
  month: m,
  twins: 4 + i * 1.2 + Math.random() * 0.8,
  simulations: 12 + i * 3.5 + Math.random() * 4,
})).map(d => ({ ...d, twins: Math.round(d.twins), simulations: Math.round(d.simulations) }))

const accuracyTrend = months.map(m => ({
  month: m,
  accuracy: 91 + Math.random() * 7,
  confidence: 88 + Math.random() * 9,
}))

const deviceActivity = months.slice(0, 6).map((m, i) => ({
  month: m,
  connected: 140 + i * 8 + Math.floor(Math.random() * 10),
  active: 110 + i * 6 + Math.floor(Math.random() * 8),
}))

const twinByType = [
  { name: 'Manufacturing', value: 38, color: '#2A6BDB' },
  { name: 'Energy', value: 27, color: '#3BC4E8' },
  { name: 'Infrastructure', value: 20, color: '#4CC38A' },
  { name: 'Smart Factory', value: 15, color: '#D4A843' },
]

const savedReports = [
  { name: 'Q2 Digital Twin Performance', date: 'Jun 1, 2025', type: 'PDF', size: '2.4 MB', status: 'ready' },
  { name: 'May AI Prediction Summary', date: 'Jun 1, 2025', type: 'XLSX', size: '1.1 MB', status: 'ready' },
  { name: 'Infrastructure Health Report', date: 'May 28, 2025', type: 'PDF', size: '3.8 MB', status: 'ready' },
  { name: 'User Activity Q1–Q2', date: 'May 15, 2025', type: 'CSV', size: '580 KB', status: 'ready' },
  { name: 'Simulation Throughput Analysis', date: 'May 10, 2025', type: 'PDF', size: '5.1 MB', status: 'ready' },
]

const kpis = [
  { label: 'Total Simulations Run', val: '1,284', change: '+18%', up: true, sub: 'vs last period', icon: Layers },
  { label: 'Avg Prediction Accuracy', val: '95.4%', change: '+1.2%', up: true, sub: 'All models', icon: Brain },
  { label: 'Device Uptime', val: '99.2%', change: '-0.1%', up: false, sub: 'IoT fleet', icon: Activity },
  { label: 'Compute Hours Used', val: '4,812h', change: '+22%', up: true, sub: 'GPU + CPU', icon: Cpu },
]

export function ReportsPage() {
  const [period, setPeriod] = useState('12m')
  const [tab, setTab] = useRouteTab('/reports', ['overview', 'analytics', 'exports'] as const, 'overview')
  const showAnalytics = tab === 'overview' || tab === 'analytics'
  const showExports   = tab === 'overview' || tab === 'exports'


  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">// Platform performance overview · June 2025</p>
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          <div className="tab-list-wrap">
          <div className="tab-list">
            {['1m', '3m', '6m', '12m'].map(p => (
              <button key={p} className={`tab-item ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          </div>
          <button className="btn btn-ghost btn-sm"><Download size={12} /> Export</button>
        </div>
      </div>

      {/* Sub-route tabs */}
      <div className="tab-list-wrap" style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {([
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'exports', label: 'Exports', icon: Download },
          ] as const).map(t => (
            <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={12} style={{ display: 'inline', marginRight: 5 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {showAnalytics && <>


      {/* KPIs */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} className="card animate-in" style={{ padding: '16px 18px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <span className="text-secondary text-sm">{k.label}</span>
              <k.icon size={14} color="var(--blue)" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{k.val}</div>
            <div className="flex items-center gap-1" style={{ marginTop: 5 }}>
              {k.up ? <ArrowUp size={10} color="var(--success)" /> : <ArrowDown size={10} color="var(--error)" />}
              <span className="text-xs text-mono" style={{ color: k.up ? 'var(--success)' : 'var(--error)' }}>{k.change}</span>
              <span className="text-muted text-xs text-mono">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Twins & Simulations Growth</span>
            <span className="badge badge-muted"><TrendingUp size={10} style={{ display: 'inline' }} /> YTD</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={twinGrowth} margin={{ top: 0, right: 16, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Bar dataKey="twins" fill="#2A6BDB" radius={[2,2,0,0]} name="Digital Twins" />
                <Bar dataKey="simulations" fill="#3BC4E8" radius={[2,2,0,0]} name="Simulations" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">AI Model Accuracy Trend</span>
            <span className="badge badge-success">↑ Improving</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={accuracyTrend} margin={{ top: 0, right: 16, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="accG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CC38A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4CC38A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                <YAxis domain={[85, 100]} tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} unit="%" />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="accuracy" stroke="#4CC38A" strokeWidth={1.5} fill="url(#accG)" name="Accuracy %" />
                <Line type="monotone" dataKey="confidence" stroke="#2A6BDB" strokeWidth={1} strokeDasharray="4 2" dot={false} name="Confidence %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="rg-content-sidebar" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Device Fleet Activity</span>
            <span className="text-muted text-xs text-mono">Connected vs Active</span>
          </div>
          <div style={{ padding: '12px 4px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={deviceActivity} margin={{ top: 0, right: 16, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="connG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A6BDB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2A6BDB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3BC4E8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3BC4E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                <YAxis tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                <Area type="monotone" dataKey="connected" stroke="#2A6BDB" strokeWidth={1.5} fill="url(#connG)" name="Connected" />
                <Area type="monotone" dataKey="active" stroke="#3BC4E8" strokeWidth={1.5} fill="url(#actG)" name="Active" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Twins by Type</span></div>
          <div style={{ padding: '12px 0 8px' }}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={twinByType} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value">
                  {twinByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {twinByType.map(t => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
                    <span className="text-secondary text-xs">{t.name}</span>
                  </div>
                  <span className="text-mono text-xs">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>}

      {/* Saved reports */}
      {showExports && (
      <div className="card">

        <div className="card-header">
          <span className="card-title">Saved Reports</span>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm"><Filter size={12} /> Filter</button>
            <button className="btn btn-primary btn-sm"><FileText size={12} /> Generate Report</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>REPORT NAME</th>
                <th>DATE</th>
                <th>FORMAT</th>
                <th>SIZE</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {savedReports.map(r => (
                <tr key={r.name}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(42,107,219,0.1)', border: '1px solid rgba(42,107,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={12} color="var(--blue)" />
                      </div>
                      <span style={{ fontWeight: 500, fontSize: 12.5 }}>{r.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} color="var(--text-muted)" />
                      <span className="text-muted text-xs text-mono">{r.date}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-muted">{r.type}</span></td>
                  <td><span className="text-muted text-xs text-mono">{r.size}</span></td>
                  <td><span className="badge badge-success">Ready</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm"><Download size={11} /> Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  )
}
