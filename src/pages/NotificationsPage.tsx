import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle, XCircle, Info, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../lib/utils'

const allNotifications = [
  { id: 1, type: 'warning', title: 'Heat Exchanger threshold exceeded', desc: 'M-003 · 88°C · Warning at 85°C', time: '2m ago', read: false },
  { id: 2, type: 'success', title: 'Simulation KVX-2241 completed', desc: 'Factory Floor A — Zone 3 · 99.4% accuracy', time: '8m ago', read: false },
  { id: 3, type: 'info', title: 'IoT device M-019 reconnected', desc: 'Sensor Grid · Factory B', time: '15m ago', read: false },
  { id: 4, type: 'error', title: 'API sync failed — ERP-002', desc: 'Connection timeout after 30s retry', time: '32m ago', read: false },
  { id: 5, type: 'success', title: 'Prediction model updated', desc: 'Compressor failure risk: 2.4%', time: '18m ago', read: true },
  { id: 6, type: 'info', title: 'Digital Twin KV-009 synced', desc: '142 assets updated · 0.3ms latency', time: '24m ago', read: true },
  { id: 7, type: 'warning', title: 'Memory usage high on NODE-02', desc: '91% utilization · GPU compute', time: '42m ago', read: true },
  { id: 8, type: 'info', title: 'Scheduled backup completed', desc: 'All twin data backed up to S3', time: '1h ago', read: true },
  { id: 9, type: 'success', title: 'Twin KV-007 auto-calibrated', desc: 'Deviation corrected · 0.02% delta', time: '1h ago', read: true },
  { id: 10, type: 'error', title: 'Device offline — Water Treatment', desc: 'Flow Meter FM-09 unreachable', time: '2h ago', read: true },
]

const typeConfig = {
  warning: { icon: AlertTriangle, color: '#D4A843', bg: 'rgba(212,168,67,0.12)', border: 'rgba(212,168,67,0.3)' },
  success: { icon: CheckCircle, color: '#4CC38A', bg: 'rgba(76,195,138,0.12)', border: 'rgba(76,195,138,0.3)' },
  error: { icon: XCircle, color: '#D94A3A', bg: 'rgba(217,74,58,0.12)', border: 'rgba(217,74,58,0.3)' },
  info: { icon: Info, color: '#3BC4E8', bg: 'rgba(59,196,232,0.12)', border: 'rgba(59,196,232,0.3)' },
}

export function NotificationsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState(allNotifications)

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-icon">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">// {unreadCount} unread · {notifications.length} total</p>
          </div>
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter(f => f === 'all' ? 'unread' : 'all')}
            className="btn btn-ghost btn-sm"
          >
            {filter === 'all' ? 'Unread only' : 'All notifications'}
          </button>
          <button onClick={markAllRead} className="btn btn-secondary btn-sm">
            <CheckCircle size={12} /> Mark All Read
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((n, i) => {
          const cfg = typeConfig[n.type as keyof typeof typeConfig]
          const Icon = cfg.icon
          return (
            <div
              key={n.id}
              className={cn('animate-in', 'card')}
              style={{
                padding: '14px 18px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                borderLeft: `3px solid ${cfg.color}`,
                background: n.read ? undefined : `${cfg.bg}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                animationDelay: `${i * 60}ms`,
              }}
              onClick={() => setNotifications(prev =>
                prev.map(p => p.id === n.id ? { ...p, read: !p.read } : p)
              )}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} color={cfg.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{
                      fontSize: 13,
                      fontWeight: n.read ? 400 : 600,
                      color: '#F0F1F6',
                      marginBottom: 3,
                    }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#7E8394' }}>{n.desc}</div>
                  </div>
                  {!n.read && (
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#3BC4E8', flexShrink: 0, marginTop: 5,
                      boxShadow: '0 0 6px rgba(59,196,232,0.6)',
                    }} />
                  )}
                </div>
                <div style={{ fontSize: 10, color: '#4A5168', fontFamily: 'JetBrains Mono', marginTop: 6 }}>
                  {n.time}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
