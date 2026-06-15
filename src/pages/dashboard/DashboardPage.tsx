import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Play, Radio, Brain, Activity, Users, X, BarChart2 } from 'lucide-react'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { TwinVisualizer } from '../../components/dashboard/TwinVisualizer'
import { SystemHealth } from '../../components/dashboard/SystemHealth'
import { ActivityFeed } from '../../components/dashboard/ActivityFeed'
import { SimulationPipeline } from '../../components/dashboard/SimulationPipeline'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { cn } from '../../lib/utils'

const metrics = [
  { icon: Box,      label: 'Total Digital Twins',    value: '247',    delta: 12,   deltaLabel: 'vs last month',  color: '#2A6BDB', status: 'good' as const },
  { icon: Play,     label: 'Active Simulations',     value: '38',     delta: 5,    deltaLabel: 'vs last week',   color: '#9B6BDB', status: 'good' as const },
  { icon: Radio,    label: 'Connected Devices',      value: '1,824',  delta: 8,    deltaLabel: 'vs last week',   color: '#3BC4E8', status: 'good' as const },
  { icon: Brain,    label: 'AI Prediction Accuracy', value: '99.4%',  delta: 0.2,  deltaLabel: 'vs last cycle',  color: '#4CC38A', status: 'good' as const },
  { icon: Activity, label: 'Infrastructure Health',  value: '98.7%',  delta: -0.3, deltaLabel: 'vs yesterday',   color: '#D4A843', status: 'warn' as const },
  { icon: Users,    label: 'Active Users',           value: '142',    delta: 18,   deltaLabel: 'vs last month',  color: '#6B5ECD', status: 'good' as const },
]

const weeklySimData = [
  { day: 'Mon', runs: 42, completed: 39, failed: 3 },
  { day: 'Tue', runs: 58, completed: 55, failed: 3 },
  { day: 'Wed', runs: 47, completed: 44, failed: 3 },
  { day: 'Thu', runs: 63, completed: 60, failed: 3 },
  { day: 'Fri', runs: 51, completed: 50, failed: 1 },
  { day: 'Sat', runs: 29, completed: 29, failed: 0 },
  { day: 'Sun', runs: 22, completed: 22, failed: 0 },
]

const twinTypeData = [
  { name: 'Manufacturing', value: 98,  color: '#2A6BDB' },
  { name: 'Energy',        value: 62,  color: '#3BC4E8' },
  { name: 'Smart Factory', value: 54,  color: '#9B6BDB' },
  { name: 'Infrastructure',value: 33,  color: '#4CC38A' },
]

const throughputData = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  throughput: Math.round(80 + Math.random() * 80 + Math.sin(i / 4) * 30),
}))

const tooltipStyle = {
  background: '#1A1F2E', border: '1px solid #343A4F', borderRadius: 6, fontSize: 11, color: '#F0F1F6'
}

function SimulationRunsModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose])

  const dailyBreakdown = weeklySimData.map(d => ({
    ...d,
    avgDuration: Math.round(20 + Math.random() * 40),
    efficiency: Math.round(85 + Math.random() * 12),
  }))

  return (
    <div className="modal-overlay" style={{ animation: 'fade-in 0.2s ease' }}>
      <div ref={modalRef} className="modal" style={{ maxWidth: 'min(680px, calc(100vw - 20px))', animation: 'fade-in 0.25s ease' }}>
        <div className="modal-header">
          <div>
            <span className="card-title" style={{ fontSize: 14 }}>Simulation Analytics — 7 Days</span>
            <div style={{ fontSize: 11, color: '#7E8394', fontFamily: 'JetBrains Mono', marginTop: 2 }}>Week 23 · Jun 2 – Jun 8, 2025</div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-icon"><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* KPI row */}
          <div className="grid-4" style={{ gap: 10 }}>
            {[
              { label: 'Total Runs', value: '312', color: '#2A6BDB' },
              { label: 'Completed', value: '299', color: '#4CC38A' },
              { label: 'Failed', value: '13', color: '#D94A3A' },
              { label: 'Avg Accuracy', value: '98.1%', color: '#3BC4E8' },
            ].map(k => (
              <div key={k.label} style={{ padding: '10px 12px', background: '#090C14', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: k.color, marginBottom: 2 }}>{k.value}</div>
                <div style={{ fontSize: 10, color: '#4A5168', fontFamily: 'JetBrains Mono' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Detailed bar chart */}
          <div>
            <div style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Breakdown</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyBreakdown} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(42,107,219,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4A5168' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#4A5168' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="#2A6BDB" radius={[0, 0, 0, 0]} />
                <Bar dataKey="failed" name="Failed" stackId="a" fill="#D94A3A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Efficiency + Duration row */}
          <div className="rg-charts-pair" style={{ gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Efficiency</div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={dailyBreakdown} margin={{ top: 0, right: 4, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CC38A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4CC38A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(76,195,138,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 8, fill: '#4A5168' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 8, fill: '#4A5168' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="efficiency" stroke="#4CC38A" strokeWidth={1.5} fill="url(#effGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Duration (min)</div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={dailyBreakdown} margin={{ top: 0, right: 4, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(59,196,232,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 8, fill: '#4A5168' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fill: '#4A5168' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgDuration" fill="#3BC4E8" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const recentTwins = [
  { id: 'KV-009', name: 'Factory Floor A', type: 'Manufacturing', status: 'online', devices: 142, accuracy: 99.4, sync: '2s ago' },
  { id: 'KV-007', name: 'Power Grid Zone 3', type: 'Energy', status: 'online', devices: 87, accuracy: 98.7, sync: '5s ago' },
  { id: 'KV-012', name: 'Smart Assembly B', type: 'Smart Factory', status: 'warning', devices: 204, accuracy: 96.2, sync: '12s ago' },
  { id: 'KV-004', name: 'Pipeline Network', type: 'Infrastructure', status: 'online', devices: 63, accuracy: 99.1, sync: '3s ago' },
  { id: 'KV-015', name: 'Turbine Complex', type: 'Energy', status: 'syncing', devices: 118, accuracy: 97.8, sync: '1m ago' },
]

const typeBadgeClass: Record<string, string> = {
  Manufacturing: 'badge-info',
  Energy: 'badge-info',
  'Smart Factory': 'badge-muted',
  Infrastructure: 'badge-muted',
}

const statusDotClass: Record<string, string> = {
  online: 'status-online',
  warning: 'status-warning',
  syncing: 'status-idle',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [showSimModal, setShowSimModal] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {showSimModal && <SimulationRunsModal onClose={() => setShowSimModal(false)} />}

      {/* Section: Executive Metrics */}
      <section>
        <div className="grid-4">
          {metrics.slice(0, 4).map((m, i) => (
            <MetricCard key={i} {...m} sparkColor={m.color} />
          ))}
        </div>
        <div className="grid-2" style={{ marginTop: 12 }}>
          {metrics.slice(4).map((m, i) => (
            <MetricCard key={i + 4} {...m} sparkColor={m.color} />
          ))}
        </div>
      </section>

      {/* Section: Twin Visualizer + Sim Pipeline */}
      <section className="rg-main-panel">
        <TwinVisualizer />
        <SimulationPipeline />
      </section>

      {/* Section: Charts row */}
      <section className="rg-charts-row">
        {/* Weekly simulations bar chart — CLICKABLE */}
        <div
          className="glass-card"
          style={{ padding: 20, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
          onClick={() => setShowSimModal(true)}
        >
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-shimmer" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6' }}>Simulation Runs — 7 Days</div>
            <span style={{ fontSize: 10, color: '#3BC4E8', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 4 }}>
              <BarChart2 size={11} /> Click to expand
            </span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={weeklySimData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(42,107,219,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4A5168' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4A5168' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#2A6BDB" radius={[0, 0, 0, 0]} />
              <Bar dataKey="failed" name="Failed" stackId="a" fill="#D94A3A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Twin type distribution */}
        <div className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6', marginBottom: 14, wordBreak: 'break-word' }}>Twin Distribution</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={twinTypeData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {twinTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {twinTypeData.map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 11, color: '#7E8394' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 11, color: '#F0F1F6', fontFamily: 'JetBrains Mono' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Throughput 24h */}
        <div className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-shimmer" style={{ animationDelay: '1s' }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6', marginBottom: 14 }}>Data Throughput 24h</div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={throughputData} margin={{ top: 0, right: 4, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3BC4E8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3BC4E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(59,196,232,0.07)" vertical={false} />
              <XAxis dataKey="h" tick={{ fontSize: 9, fill: '#4A5168' }} axisLine={false} tickLine={false} interval={5} />
              <YAxis tick={{ fontSize: 9, fill: '#4A5168' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="throughput" stroke="#3BC4E8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section: System Health + Activity Feed */}
      <section className="rg-health-feed">
        <SystemHealth />
        <ActivityFeed />
      </section>

      {/* Section: Recent twins table */}
      <section>
        <div className="glass-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6', whiteSpace: 'nowrap' }}>Recent Digital Twins</div>
            <button className="btn btn-ghost" style={{ fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => navigate('/digital-twins')}>View all →</button>
          </div>
          <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {['Twin ID', 'Name', 'Type', 'Status', 'Devices', 'Accuracy', 'Last Sync'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTwins.map(row => (
                <tr
                  key={row.id}
                  style={{ cursor: 'pointer' }}
                  className="hover:bg-bg-overlay"
                  onClick={() => navigate(`/digital-twins/${row.id.toLowerCase()}`)}
                >
                  <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)' }}>{row.id}</span></td>
                  <td><span style={{ fontWeight: 500, fontSize: 12.5 }}>{row.name}</span></td>
                  <td><span className={`badge ${typeBadgeClass[row.type] || 'badge-muted'}`}>{row.type}</span></td>
                  <td><div className="flex items-center gap-1"><span className={`status-dot ${statusDotClass[row.status] || 'status-idle'}`} /><span className="text-secondary text-sm" style={{ textTransform: 'capitalize' }}>{row.status}</span></div></td>
                  <td><span className="text-mono text-sm">{row.devices}</span></td>
                  <td><span className="text-mono text-sm" style={{ color: row.accuracy > 99 ? 'var(--success)' : row.accuracy > 97 ? 'var(--warning)' : 'var(--text-muted)' }}>{row.accuracy}%</span></td>
                  <td><span className="text-muted text-xs text-mono">{row.sync}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </section>
    </div>
  )
}
