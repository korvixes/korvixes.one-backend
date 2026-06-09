import { useState, useEffect } from 'react'
import { Box, Play, Radio, Brain, User, AlertTriangle } from 'lucide-react'

type EventType = 'twin' | 'simulation' | 'device' | 'prediction' | 'user' | 'alert'

interface Event {
  id: number
  type: EventType
  title: string
  desc: string
  time: string
  status: 'success' | 'warning' | 'error' | 'info'
}

const seedEvents: Event[] = [
  { id: 1, type: 'simulation', title: 'Simulation KVX-2241 completed', desc: 'Factory Floor A — Zone 3 · 99.4% accuracy', time: '2m ago', status: 'success' },
  { id: 2, type: 'alert',      title: 'Heat Exchanger threshold exceeded', desc: 'M-003 · 88°C · Warning at 85°C', time: '5m ago', status: 'warning' },
  { id: 3, type: 'device',     title: 'IoT device M-019 reconnected', desc: 'Sensor Grid · Factory B', time: '12m ago', status: 'info' },
  { id: 4, type: 'prediction', title: 'Prediction model updated', desc: 'Compressor failure risk: 2.4%', time: '18m ago', status: 'success' },
  { id: 5, type: 'twin',       title: 'Digital Twin KV-009 synced', desc: '142 assets updated · 0.3ms latency', time: '24m ago', status: 'info' },
  { id: 6, type: 'user',       title: 'New user account created', desc: 'engineer@acmeplant.com · Operator role', time: '31m ago', status: 'info' },
  { id: 7, type: 'simulation', title: 'Simulation KVX-2239 failed', desc: 'Timeout — ERP data sync error', time: '45m ago', status: 'error' },
]

const eventConfig: Record<EventType, { icon: React.ElementType; color: string }> = {
  twin:       { icon: Box,          color: '#2A6BDB' },
  simulation: { icon: Play,         color: '#9B6BDB' },
  device:     { icon: Radio,        color: '#3BC4E8' },
  prediction: { icon: Brain,        color: '#4CC38A' },
  user:       { icon: User,         color: '#D4A843' },
  alert:      { icon: AlertTriangle, color: '#D94A3A' },
}

const statusColor: Record<string, string> = {
  success: '#4CC38A', warning: '#D4A843', error: '#D94A3A', info: '#3BC4E8'
}

const newEventPool: Omit<Event, 'id' | 'time'>[] = [
  { type: 'twin',       title: 'Twin KV-007 auto-calibrated', desc: 'Deviation corrected · 0.02% delta', status: 'success' },
  { type: 'device',     title: 'Sensor M-044 data stream active', desc: 'Pressure sensor · Zone 1', status: 'info' },
  { type: 'prediction', title: 'Anomaly detected — Pump Station', desc: 'Vibration pattern shift · Low risk', status: 'warning' },
  { type: 'simulation', title: 'Simulation KVX-2245 started', desc: 'Energy optimization scenario', status: 'info' },
]

export function ActivityFeed() {
  const [events, setEvents] = useState<Event[]>(seedEvents)
  const [nextId, setNextId] = useState(100)

  useEffect(() => {
    const id = setInterval(() => {
      const pool = newEventPool[Math.floor(Math.random() * newEventPool.length)]
      const newEv: Event = { ...pool, id: nextId, time: 'just now' }
      setEvents(prev => [newEv, ...prev.slice(0, 9)])
      setNextId(n => n + 1)
    }, 6000)
    return () => clearInterval(id)
  }, [nextId])

  return (
    <div className="glass-card" style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6' }}>Live Activity Feed</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span className="status-dot status-online animate-pulse-dot" />
          <span style={{ fontSize: 10, color: '#4CC38A', fontFamily: 'JetBrains Mono' }}>LIVE</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {events.map((ev, i) => {
          const cfg = eventConfig[ev.type]
          const Icon = cfg.icon
          return (
            <div
              key={ev.id}
              className="animate-fade-in"
              style={{
                display: 'flex', gap: 10, padding: '9px 10px',
                borderRadius: 6, borderLeft: `2px solid ${statusColor[ev.status]}40`,
                background: i === 0 ? `${statusColor[ev.status]}08` : 'transparent',
                transition: 'background 300ms',
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 5, flexShrink: 0,
                background: `${cfg.color}18`, border: `1px solid ${cfg.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
              }}>
                <Icon size={12} color={cfg.color} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#F0F1F6', fontWeight: 500, lineHeight: 1.3 }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: '#4A5168', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.desc}</div>
              </div>
              <div style={{ fontSize: 10, color: '#4A5168', flexShrink: 0, marginTop: 1, fontFamily: 'JetBrains Mono' }}>{ev.time}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
