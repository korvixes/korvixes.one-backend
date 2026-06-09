import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { MiniSparkline } from '../charts/MiniSparkline'
import { generateSparkline, cn } from '../../lib/utils'

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string
  delta: number
  deltaLabel: string
  color: string
  sparkColor?: string
  status?: 'good' | 'warn' | 'bad'
}

const statusClass: Record<NonNullable<MetricCardProps['status']>, string> = {
  good: 'bg-ok shadow-[0_0_6px_rgba(76,195,138,0.7)]',
  warn: 'bg-warn shadow-[0_0_6px_rgba(212,168,67,0.7)]',
  bad:  'bg-bad shadow-[0_0_6px_rgba(217,74,58,0.7)]',
}

function TrendIcon({ delta }: { delta: number }) {
  if (delta > 0) return <TrendingUp size={11} className="text-ok" />
  if (delta < 0) return <TrendingDown size={11} className="text-bad" />
  return <Minus size={11} className="text-ink-secondary" />
}

function trendColorClass(delta: number) {
  if (delta > 0) return 'text-ok'
  if (delta < 0) return 'text-bad'
  return 'text-ink-secondary'
}

export function MetricCard({
  icon: Icon, label, value, delta, deltaLabel, color, sparkColor, status,
}: MetricCardProps) {
  const [liveValue, setLiveValue] = useState(value)
  const [ripple, setRipple] = useState(false)
  const sparkline = generateSparkline(14, 30, 80)

  useEffect(() => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(numeric)) return

    const id = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.6
      const newVal = numeric + fluctuation
      const formatted = value.includes('%')
        ? `${newVal.toFixed(1)}%`
        : value.includes(',')
          ? Math.round(newVal).toLocaleString()
          : newVal.toFixed(value.includes('.') ? 1 : 0)
      setLiveValue(formatted)
      setRipple(true)
      setTimeout(() => setRipple(false), 400)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(id)
  }, [value])

  return (
    <div className="group relative flex flex-col rounded-xl border border-line bg-bg-surface p-4 transition-all duration-200 hover:border-line-mid hover:shadow-card animate-fade-in">
      {/* Data-flow shimmer bar */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue to-transparent animate-shimmer" />
      </div>

      {/* Top row */}
      <div className="mb-3.5 flex items-start justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md border"
          style={{ background: `${color}18`, borderColor: `${color}30` }}
        >
          <Icon size={15} strokeWidth={1.6} style={{ color }} />
        </div>
        {status && <span className={cn('mt-1 h-1.5 w-1.5 rounded-full', statusClass[status])} />}
      </div>

      {/* Value */}
      <div className={cn('mb-1 text-[26px] font-bold leading-none tracking-tight text-ink-primary', ripple && 'animate-value-ripple')}>
        {liveValue}
      </div>
      <div className="mb-3 text-[11.5px] text-ink-secondary">{label}</div>

      {/* Sparkline */}
      <div className="mb-2.5 -mx-1">
        <MiniSparkline data={sparkline} color={sparkColor || color} height={28} />
      </div>

      {/* Delta */}
      <div className="flex items-center gap-1">
        <TrendIcon delta={delta} />
        <span className={cn('text-[11px] font-medium', trendColorClass(delta))}>
          {delta > 0 ? '+' : ''}{delta}%
        </span>
        <span className="text-[11px] text-ink-muted">{deltaLabel}</span>
      </div>
    </div>
  )
}
