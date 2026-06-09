import { motion } from 'framer-motion'
import { Cpu, Zap, Activity, Thermometer, GitBranch, Settings2, Wifi } from 'lucide-react'

const nodes = [
  { id: 'compressor', label: 'Compressor A', x: 15, y: 20, status: 'online', metric: '3,200 rpm', icon: Cpu },
  { id: 'pump',       label: 'Pump Station', x: 50, y: 15, status: 'online', metric: '1,800 rpm', icon: Activity },
  { id: 'turbine',    label: 'Turbine B',    x: 80, y: 22, status: 'online', metric: '5,400 rpm', icon: Zap },
  { id: 'heat',       label: 'Heat Exchanger', x: 15, y: 60, status: 'warning', metric: '88°C ⚠', icon: Thermometer },
  { id: 'valve',      label: 'Valve Array',  x: 50, y: 65, status: 'online', metric: '100% open', icon: Settings2 },
  { id: 'sensor',     label: 'Sensor Grid',  x: 80, y: 60, status: 'online', metric: '142 pts/s', icon: Wifi },
]

const connections = [
  ['compressor', 'pump'], ['pump', 'turbine'], ['pump', 'valve'],
  ['compressor', 'heat'], ['heat', 'valve'], ['valve', 'sensor'],
]

function getNodePos(id: string, nodes: typeof import('./TwinVisualizer').nodes) {
  const n = nodes.find(n => n.id === id)
  return n ? { x: n.x, y: n.y } : { x: 50, y: 50 }
}

export function TwinVisualizer() {
  const statusColor = (s: string) => s === 'online' ? '#4CC38A' : s === 'warning' ? '#D4A843' : '#D94A3A'

  return (
    <div className="glass-card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6' }}>Digital Twin — Factory Floor A</div>
          <div style={{ fontSize: 11, color: '#7E8394', marginTop: 2 }}>Real-time asset topology · Zone 3</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(76,195,138,0.1)', border: '1px solid rgba(76,195,138,0.25)',
            borderRadius: 5, padding: '3px 8px',
          }}>
            <span className="status-dot status-online animate-pulse-dot" />
            <span style={{ fontSize: 10, color: '#4CC38A', fontFamily: 'JetBrains Mono' }}>LIVE SYNC</span>
          </div>
          <div style={{
            background: 'rgba(42,107,219,0.12)', border: '1px solid rgba(42,107,219,0.3)',
            borderRadius: 5, padding: '3px 8px',
            fontSize: 10, color: '#6B9FEC',
            fontFamily: 'JetBrains Mono', fontWeight: 600,
          }}>
            ⬡ NVIDIA SDK
          </div>
        </div>
      </div>

      {/* Visualization canvas */}
      <div style={{
        position: 'relative', height: 200,
        background: '#090C14',
        borderRadius: 6, border: '1px solid #262A38',
        overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(42,107,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(42,107,219,0.04) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* SVG connections */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A6BDB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3BC4E8" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {connections.map(([a, b], i) => {
            const pa = getNodePos(a, nodes as typeof import('./TwinVisualizer').nodes)
            const pb = getNodePos(b, nodes as typeof import('./TwinVisualizer').nodes)
            return (
              <motion.line
                key={i}
                x1={`${pa.x}%`} y1={`${pa.y}%`}
                x2={`${pb.x}%`} y2={`${pb.y}%`}
                stroke="url(#lineGrad)"
                strokeWidth="1"
                strokeDasharray="6 4"
                initial={{ strokeDashoffset: 0, opacity: 0.6 }}
                animate={{ strokeDashoffset: -20, opacity: [0.4, 0.8, 0.4] }}
                transition={{
                  strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.2 },
                  opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
                }}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const Icon = node.icon
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
              style={{
                position: 'absolute',
                left: `${node.x}%`, top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div style={{
                background: '#0B0E16',
                border: `1px solid ${statusColor(node.status)}40`,
                borderRadius: 6, padding: '6px 9px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                minWidth: 80,
                boxShadow: node.status === 'warning'
                  ? '0 0 8px rgba(212,168,67,0.2)'
                  : '0 0 8px rgba(42,107,219,0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, maxWidth: '100%' }}>
                  <Icon size={11} color={statusColor(node.status)} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: '#F0F1F6', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {node.label}
                  </span>
                </div>
                <div style={{ fontSize: 9, color: node.status === 'warning' ? '#D4A843' : '#7E8394', fontFamily: 'JetBrains Mono' }}>
                  {node.metric}
                </div>
                <span className="status-dot" style={{ background: statusColor(node.status), boxShadow: `0 0 4px ${statusColor(node.status)}` }} />
              </div>
            </motion.div>
          )
        })}

        {/* Bottom info strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(7,9,15,0.9)',
          borderTop: '1px solid #262A38',
          padding: '5px 12px',
          display: 'flex', gap: 16, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Nodes', value: '6' },
            { label: 'Connections', value: '6' },
            { label: 'Sync rate', value: '142 Hz' },
            { label: 'Twin accuracy', value: '99.4%' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: '#4A5168' }}>{label}</span>
              <span style={{ fontSize: 9, color: '#7E8394', fontFamily: 'JetBrains Mono', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Export nodes for use in SVG
export { nodes }
