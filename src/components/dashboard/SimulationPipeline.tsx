import { motion } from 'framer-motion'
import { Database, Box, Play, Brain, Zap, CheckCircle } from 'lucide-react'

const stages = [
  { label: 'Data Source',       sublabel: 'IoT · ERP · SCADA',      icon: Database, color: '#2A6BDB', status: 'active' },
  { label: 'Digital Twin',      sublabel: 'KV-009 · Factory A',      icon: Box,      color: '#3BC4E8', status: 'active' },
  { label: 'Simulation Engine', sublabel: 'Physics Model v4.2',       icon: Play,     color: '#9B6BDB', status: 'running' },
  { label: 'AI Prediction',     sublabel: 'NVIDIA SDK · GPU Compute', icon: Brain,    color: '#4CC38A', status: 'queued' },
  { label: 'Optimization',      sublabel: 'Decision Layer',           icon: Zap,      color: '#D4A843', status: 'queued' },
]

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  active:  { label: 'ACTIVE',   color: '#4CC38A', bg: 'rgba(76,195,138,0.1)' },
  running: { label: 'RUNNING',  color: '#D4A843', bg: 'rgba(212,168,67,0.1)' },
  queued:  { label: 'QUEUED',   color: '#4A5168', bg: 'rgba(74,81,104,0.15)' },
  done:    { label: 'DONE',     color: '#2A6BDB', bg: 'rgba(42,107,219,0.1)' },
}

export function SimulationPipeline() {
  return (
    <div className="glass-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F1F6' }}>Simulation Pipeline</div>
          <div style={{ fontSize: 11, color: '#7E8394', marginTop: 2 }}>KVX-2245 · Active run</div>
        </div>
        <div className="badge badge-yellow">
          <span className="status-dot status-warning" style={{ width: 5, height: 5 }} />
          Stage 3/5
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
        {stages.map((stage, i) => {
          const Icon = stage.icon
          const badge = statusBadge[stage.status]
          const isLast = i === stages.length - 1
          const isActive = stage.status === 'active' || stage.status === 'running'

          return (
            <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flex: '1 1 120px' }}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  flex: 1,
                  background: isActive ? `${stage.color}10` : '#090C14',
                  border: `1px solid ${isActive ? stage.color + '35' : '#262A38'}`,
                  borderRadius: 7, padding: '12px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  position: 'relative', overflow: 'hidden',
                  boxShadow: isActive ? `0 0 12px ${stage.color}18` : 'none',
                }}
              >
                {/* Active glow pulse */}
                {stage.status === 'running' && (
                  <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: `radial-gradient(ellipse at center, ${stage.color}20, transparent)`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                <div style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: `${stage.color}18`,
                  border: `1px solid ${stage.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} color={stage.color} strokeWidth={1.5} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#F0F1F6', lineHeight: 1.2, marginBottom: 2 }}>
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 9, color: '#4A5168', fontFamily: 'JetBrains Mono' }}>
                    {stage.sublabel}
                  </div>
                </div>
                <div style={{
                  padding: '1px 6px', borderRadius: 3,
                  background: badge.bg, fontSize: 8,
                  color: badge.color, fontFamily: 'JetBrains Mono', fontWeight: 600,
                  letterSpacing: '0.08em',
                }}>
                  {badge.label}
                </div>
              </motion.div>

              {/* Connector arrow */}
              {!isLast && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 4px', flexShrink: 0 }}>
                  <div style={{ width: 20, height: 2, background: 'linear-gradient(90deg, #2A6BDB, #3BC4E8)', position: 'relative', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ x: ['-100%', '150%'] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
                      style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: '#7E8394' }}>Overall progress</span>
          <span style={{ fontSize: 10, color: '#D4A843', fontFamily: 'JetBrains Mono' }}>47%</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: '0%' }}
            animate={{ width: '47%' }}
            transition={{ duration: 1.2, delay: 0.5 }}
            style={{ background: 'linear-gradient(90deg, #2A6BDB, #3BC4E8)' }}
          />
        </div>
      </div>
    </div>
  )
}
