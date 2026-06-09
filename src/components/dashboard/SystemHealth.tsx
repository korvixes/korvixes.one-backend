import { useState, useEffect } from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function generatePoint(prev: number, min: number, max: number, step = 5) {
  return Math.max(min, Math.min(max, prev + (Math.random() - 0.48) * step))
}

function initSeries(start: number, min: number, max: number, length = 20) {
  let v = start
  return Array.from({ length }, (_, i) => {
    v = generatePoint(v, min, max, 4)
    return { t: i, v: +v.toFixed(1) }
  })
}

function GaugeBar({ label, value, color, unit = '%' }: { label: string; value: number; color: string; unit?: string }) {
  const pct = unit === '%' ? value : Math.min((value / 100) * 100, 100)
  const statusColor = pct > 85 ? '#D94A3A' : pct > 70 ? '#D4A843' : color

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#7E8394' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono', color: statusColor, fontWeight: 500 }}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg, ${color}, ${statusColor})` }}
        />
      </div>
    </div>
  )
}

export function SystemHealth() {
  const [cpu,    setCpu]    = useState(initSeries(42, 20, 90))
  const [gpu,    setGpu]    = useState(initSeries(68, 40, 95))
  const [cpuVal, setCpuVal] = useState(42.0)
  const [memVal, setMemVal] = useState(61.0)
  const [gpuVal, setGpuVal] = useState(68.0)
  const [latVal, setLatVal] = useState(2.4)
  const [tput,   setTput]   = useState(142.0)
  const [render, setRender] = useState(74.0)

  useEffect(() => {
    const id = setInterval(() => {
      setCpuVal(p => { const n = generatePoint(p, 20, 90); setCpu(d => [...d.slice(1), { t: d.length, v: +n.toFixed(1) }]); return +n.toFixed(1) })
      setGpuVal(p => { const n = generatePoint(p, 40, 95); setGpu(d => [...d.slice(1), { t: d.length, v: +n.toFixed(1) }]); return +n.toFixed(1) })
      setMemVal(p => +generatePoint(p, 50, 80, 2).toFixed(1))
      setLatVal(p => +generatePoint(p, 1.5, 4.0, 0.2).toFixed(2))
      setTput(p => +generatePoint(p, 100, 200, 8).toFixed(1))
      setRender(p => +generatePoint(p, 60, 90, 3).toFixed(1))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const tooltipStyle = {
    background: '#1A1F2E', border: '1px solid #343A4F',
    borderRadius: 6, fontSize: 11, color: '#F0F1F6',
  }

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6', marginBottom: 16 }}>System Health</div>

      <div className="rg-charts-pair" style={{ gap: 20 }}>
        {/* Left: gauges */}
        <div>
          <GaugeBar label="CPU Usage" value={cpuVal} color="#2A6BDB" />
          <GaugeBar label="Memory" value={memVal} color="#9B6BDB" />
          <GaugeBar label="GPU Utilization" value={gpuVal} color="#3BC4E8" />
          <GaugeBar label="Sync Latency" value={latVal} color="#4CC38A" unit=" ms" />
          <GaugeBar label="Data Throughput" value={tput} color="#D4A843" unit=" Hz" />
          <GaugeBar label="Render Load" value={render} color="#2A6BDB" />
        </div>

        {/* Right: charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: '#4A5168', marginBottom: 4, fontFamily: 'JetBrains Mono' }}>CPU_STREAM</div>
            <div style={{ height: 70 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpu} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A6BDB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2A6BDB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(42,107,219,0.08)" vertical={false} />
                  <XAxis hide />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#4A5168' }} tickLine={false} axisLine={false} tickCount={3} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'CPU']} labelFormatter={() => ''} />
                  <Area type="monotone" dataKey="v" stroke="#2A6BDB" strokeWidth={1.5} fill="url(#cpuGrad)" isAnimationActive={false} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#4A5168', marginBottom: 4, fontFamily: 'JetBrains Mono' }}>GPU_STREAM</div>
            <div style={{ height: 70 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpu} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3BC4E8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3BC4E8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(59,196,232,0.08)" vertical={false} />
                  <XAxis hide />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: '#4A5168' }} tickLine={false} axisLine={false} tickCount={3} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'GPU']} labelFormatter={() => ''} />
                  <Area type="monotone" dataKey="v" stroke="#3BC4E8" strokeWidth={1.5} fill="url(#gpuGrad)" isAnimationActive={false} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
