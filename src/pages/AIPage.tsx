import { useState } from 'react'
import { useRouteTab } from '../hooks/useRouteTab'
import {
  Brain, AlertTriangle, Zap, Target,
  ArrowUp, ArrowDown, RefreshCw, ChevronRight,
  Activity, Play, Sparkles, BarChart2, Wand2
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, RadarChart, Radar, PolarGrid,
  PolarAngleAxis
} from 'recharts'

const predictions = [
  { id: 'PRD-0044', model: 'FailurePredict v3.1', twin: 'Factory Floor A', type: 'Failure Risk', confidence: 94.2, severity: 'high', eta: '4–6 days', trend: 'up', value: '87%', description: 'Bearing degradation detected on Unit 7-C' },
  { id: 'PRD-0043', model: 'EnergyForecast v2.4', twin: 'Power Grid Zone 3', type: 'Energy Demand', confidence: 98.1, severity: 'info', eta: 'Next 48h', trend: 'up', value: '+12%', description: 'Peak demand surge expected Wed–Thu' },
  { id: 'PRD-0042', model: 'OptimizeNet v1.8', twin: 'Conveyor System C', type: 'Optimization', confidence: 91.7, severity: 'success', eta: 'Immediate', trend: 'down', value: '−18%', description: 'Speed adjustment can reduce wear by 18%' },
  { id: 'PRD-0041', model: 'RiskAnalyzer v4.0', twin: 'Substation Grid', type: 'Safety Risk', confidence: 96.8, severity: 'critical', eta: '< 24h', trend: 'up', value: 'CRITICAL', description: 'Transformer overload risk above threshold' },
  { id: 'PRD-0040', model: 'ThermalSense v2.2', twin: 'Turbine Complex', type: 'Temperature', confidence: 89.3, severity: 'warning', eta: '2–3 days', trend: 'up', value: '+8°C', description: 'Cooling system efficiency declining' },
  { id: 'PRD-0039', model: 'FluidModel v1.6', twin: 'Pipeline Network', type: 'Flow Rate', confidence: 97.5, severity: 'info', eta: 'Continuous', trend: 'down', value: '−3%', description: 'Minor flow reduction in sector B-4' },
]

const accuracyHistory = Array.from({ length: 30 }, (_, i) => ({
  day: `D-${30 - i}`,
  accuracy: 94 + Math.random() * 5,
  confidence: 90 + Math.random() * 8,
}))

const modelPerf = [
  { model: 'FailurePredict v3.1', accuracy: 94.2, predictions: 142, correct: 134, f1: 0.943 },
  { model: 'EnergyForecast v2.4', accuracy: 98.1, predictions: 88,  correct: 86,  f1: 0.979 },
  { model: 'OptimizeNet v1.8',    accuracy: 91.7, predictions: 56,  correct: 51,  f1: 0.912 },
  { model: 'RiskAnalyzer v4.0',   accuracy: 96.8, predictions: 31,  correct: 30,  f1: 0.967 },
  { model: 'ThermalSense v2.2',   accuracy: 89.3, predictions: 74,  correct: 66,  f1: 0.890 },
]

const radarData = [
  { metric: 'Precision', value: 94 },
  { metric: 'Recall', value: 91 },
  { metric: 'F1 Score', value: 93 },
  { metric: 'Coverage', value: 88 },
  { metric: 'Latency', value: 96 },
  { metric: 'Stability', value: 97 },
]

const riskData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  critical: Math.floor(Math.random() * 4),
  high: Math.floor(2 + Math.random() * 6),
  medium: Math.floor(5 + Math.random() * 10),
}))

const severityConfig = {
  critical: { cls: 'badge-error',   label: 'CRITICAL', bar: 'var(--error)' },
  high:     { cls: 'badge-error',   label: 'HIGH',     bar: 'var(--error)' },
  warning:  { cls: 'badge-warning', label: 'WARNING',  bar: 'var(--warning)' },
  info:     { cls: 'badge-info',    label: 'INFO',     bar: 'var(--cyan)' },
  success:  { cls: 'badge-success', label: 'OPT',      bar: 'var(--success)' },
} as const

export function AIPage() {
  const [activeTab, setActiveTab] = useRouteTab('/ai', ['predictions', 'models', 'risk', 'optimization'] as const, 'predictions')

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Prediction Center</h1>
          <p className="page-subtitle">// 5 active models · 391 predictions · 95.4% avg accuracy</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm"><RefreshCw size={12} /> Refresh Models</button>
          <button className="btn btn-primary btn-sm"><Sparkles size={13} /> Train New Model</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {[
          { label: 'Avg Accuracy', val: '95.4%', trend: '+1.2%', up: true, color: 'var(--success)', icon: Target },
          { label: 'Active Models', val: '5', trend: 'All healthy', up: true, color: 'var(--cyan)', icon: Brain },
          { label: 'Critical Alerts', val: '1', trend: 'Needs action', up: false, color: 'var(--error)', icon: AlertTriangle },
          { label: 'Optimizations', val: '3', trend: 'Ready to apply', up: true, color: 'var(--blue)', icon: Zap },
        ].map(k => (
          <div key={k.label} className="card animate-in" style={{ padding: '16px 18px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <span className="text-secondary text-sm">{k.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={14} color={k.color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{k.val}</div>
            <div className="flex items-center gap-1" style={{ marginTop: 4 }}>
              {k.up ? <ArrowUp size={10} color="var(--success)" /> : <ArrowDown size={10} color="var(--error)" />}
              <span className="text-xs text-mono" style={{ color: k.up ? 'var(--success)' : 'var(--error)' }}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="tab-list-wrap" style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {([
            { id: 'predictions', label: 'Predictions', icon: Activity },
            { id: 'models', label: 'Forecast Models', icon: Brain },
            { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
            { id: 'optimization', label: 'Optimization', icon: Wand2 },
          ] as const).map(t => (
            <button key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              <t.icon size={12} style={{ display: 'inline', marginRight: 5 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* PREDICTIONS TAB */}
      {activeTab === 'predictions' && (
        <div className="rg-content-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {predictions.map(p => {
              const sev = severityConfig[p.severity as keyof typeof severityConfig]
              return (
                <div key={p.id} className="card animate-in" style={{ padding: '16px 18px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${sev.cls}`}>{sev.label}</span>
                      <span className="text-mono text-xs text-muted">{p.id}</span>
                      <span className="text-secondary text-xs">{p.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ETA: {p.eta}</span>
                      <button className="btn btn-ghost btn-sm btn-icon"><ChevronRight size={12} /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{p.description}</div>
                      <div className="text-muted text-xs text-mono">{p.model} · {p.twin}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: sev.bar }}>{p.value}</div>
                      <div className="text-muted text-xs text-mono">{p.confidence}% confidence</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${p.confidence}%`, background: sev.bar }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Accuracy chart sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Accuracy Trend (30d)</span></div>
              <div style={{ padding: '12px 4px 8px' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={accuracyHistory} margin={{ top: 0, right: 12, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CC38A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CC38A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 8, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} interval={9} />
                    <YAxis domain={[88, 100]} tick={{ fontSize: 8, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                    <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                    <Area type="monotone" dataKey="accuracy" stroke="#4CC38A" strokeWidth={1.5} fill="url(#accGrad)" name="Accuracy" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Model Quality Radar</span></div>
              <div style={{ padding: '8px 0' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                    <PolarGrid stroke="#262A38" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#7E8394', fontFamily: 'JetBrains Mono' }} />
                    <Radar dataKey="value" stroke="#3BC4E8" fill="#3BC4E8" fillOpacity={0.15} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODELS TAB */}
      {activeTab === 'models' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Deployed Models</span>
              <button className="btn btn-primary btn-sm"><Play size={12} /> Run Inference</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>MODEL</th>
                    <th>ACCURACY</th>
                    <th>F1 SCORE</th>
                    <th>PREDICTIONS</th>
                    <th>CORRECT</th>
                    <th>PERFORMANCE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {modelPerf.map(m => (
                    <tr key={m.model}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'rgba(42,107,219,0.12)', border: '1px solid rgba(42,107,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Brain size={13} color="var(--cyan)" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 12.5 }}>{m.model}</div>
                            <div className="text-muted text-xs text-mono">Production</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: m.accuracy > 95 ? 'var(--success)' : 'var(--warning)' }}>
                          {m.accuracy}%
                        </span>
                      </td>
                      <td><span className="text-mono text-sm">{m.f1.toFixed(3)}</span></td>
                      <td><span className="text-mono text-sm">{m.predictions}</span></td>
                      <td>
                        <span className="text-mono text-sm text-success">{m.correct}</span>
                        <span className="text-muted text-xs"> / {m.predictions}</span>
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <div className="progress-track">
                          <div className={`progress-fill ${m.accuracy > 95 ? 'progress-green' : 'progress-warn'}`} style={{ width: `${m.accuracy}%` }} />
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="View Details"><Eye size={11} /></button>
                          <button className="btn btn-secondary btn-sm btn-icon" data-tooltip="Retrain"><RefreshCw size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RISK TAB */}
      {activeTab === 'risk' && (
        <div className="rg-charts-pair">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Risk Events by Month</span>
              <span className="badge badge-muted"><BarChart2 size={10} style={{ display: 'inline', marginRight: 4 }} />Annual</span>
            </div>
            <div style={{ padding: '12px 4px 8px' }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={riskData} margin={{ top: 0, right: 16, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                  <YAxis tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} />
                  <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
                  <Bar dataKey="critical" stackId="a" fill="#D94A3A" radius={[0,0,0,0]} name="Critical" />
                  <Bar dataKey="high" stackId="a" fill="#D4A843" name="High" />
                  <Bar dataKey="medium" stackId="a" fill="#2A6BDB" radius={[3,3,0,0]} name="Medium" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Active Risk Alerts</span></div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {predictions.filter(p => ['critical','high','warning'].includes(p.severity)).map(p => {
                const sev = severityConfig[p.severity as keyof typeof severityConfig]
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', background: 'var(--bg-overlay)', borderRadius: 7, border: `1px solid ${sev.bar}28` }}>
                    <AlertTriangle size={14} color={sev.bar} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 3 }}>{p.description}</div>
                      <div className="text-muted text-xs text-mono">{p.twin} · {p.eta}</div>
                    </div>
                    <span className={`badge ${sev.cls}`}>{sev.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* OPTIMIZATION TAB */}
      {activeTab === 'optimization' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid-2">
            {[
              { title: 'Conveyor C — Speed Tuning', impact: '−18% wear', conf: 92, status: 'recommended', desc: 'Reduce conveyor cycle rate by 4% during off-peak windows.' },
              { title: 'Grid Zone 3 — Load Shift', impact: '+11% efficiency', conf: 96, status: 'recommended', desc: 'Move non-critical loads to 02:00–05:00 demand trough.' },
              { title: 'Turbine — Cooling Cycle', impact: '−6°C steady-state', conf: 88, status: 'pending', desc: 'Increase coolant flow rate by 8% on Unit T-4.' },
              { title: 'Pipeline Sector B-4 — Pressure', impact: '+3% throughput', conf: 94, status: 'recommended', desc: 'Adjust intake pressure setpoint from 4.2 to 4.4 bar.' },
            ].map(o => (
              <div key={o.title} className="card animate-in" style={{ padding: '16px 18px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <span className="badge badge-success">{o.status}</span>
                  <span className="text-mono text-xs text-muted">{o.conf}% conf</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{o.title}</div>
                <div className="text-secondary text-xs" style={{ marginBottom: 12 }}>{o.desc}</div>
                <div className="flex items-center justify-between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-muted text-xs text-mono">PROJECTED IMPACT</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--success)', fontSize: 16 }}>{o.impact}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm">Dismiss</button>
                    <button className="btn btn-primary btn-sm"><Zap size={11} /> Apply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
