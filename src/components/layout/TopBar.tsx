import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Settings, ChevronRight, User, LogOut, Shield, Moon, Menu,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'

const breadcrumbMap: Record<string, string[]> = {
  '/dashboard':              ['Overview', 'Dashboard'],
  '/twins':                  ['Digital Twin', 'All Twins'],
  '/twins/create':           ['Digital Twin', 'Create Twin'],
  '/twins/templates':        ['Digital Twin', 'Twin Templates'],
  '/simulations':            ['Simulation', 'All Simulations'],
  '/simulations/running':    ['Simulation', 'Running'],
  '/simulations/completed':  ['Simulation', 'Completed'],
  '/simulations/failed':     ['Simulation', 'Failed'],
  '/ai/predictions':         ['Intelligence', 'Predictions'],
  '/ai/models':              ['Intelligence', 'Forecast Models'],
  '/ai/risk':                ['Intelligence', 'Risk Analysis'],
  '/ai/optimization':        ['Intelligence', 'Optimization'],
  '/infra/devices':          ['Infrastructure', 'IoT Devices'],
  '/infra/sources':          ['Infrastructure', 'Data Sources'],
  '/infra/erp':              ['Infrastructure', 'ERP Integrations'],
  '/infra/api':              ['Infrastructure', 'API Integrations'],
  '/monitoring/health':      ['Monitoring', 'System Health'],
  '/monitoring/performance': ['Monitoring', 'Performance'],
  '/monitoring/sync':        ['Monitoring', 'Sync Status'],
  '/monitoring/resources':   ['Monitoring', 'Resource Usage'],
  '/users':                  ['Admin', 'Users'],
  '/reports':                ['Admin', 'Reports'],
  '/reports/analytics':      ['Admin', 'Analytics'],
  '/reports/exports':        ['Admin', 'Exports'],
  '/settings/general':       ['Admin', 'Settings'],
  '/settings/security':      ['Admin', 'Security'],
  '/settings/billing':       ['Admin', 'Billing'],
  '/settings/notifications': ['Admin', 'Notifications'],
  '/profile':                ['Admin', 'My Profile'],
  '/security':               ['Admin', 'Security'],
  '/preferences':            ['Admin', 'Preferences'],
  '/notifications':          ['Admin', 'Notifications'],
  '/digital-twins':          ['Digital Twin', 'All Digital Twins'],
}

const notifications = [
  { id: 1, type: 'warning', title: 'Heat Exchanger threshold exceeded', time: '2m ago' },
  { id: 2, type: 'success', title: 'Simulation KVX-2241 completed', time: '8m ago' },
  { id: 3, type: 'info',    title: 'IoT device M-019 reconnected', time: '15m ago' },
  { id: 4, type: 'error',   title: 'API sync failed — ERP-002', time: '32m ago' },
]

const typeDot: Record<string, string> = {
  warning: 'bg-warn shadow-[0_0_6px_rgba(212,168,67,0.7)]',
  success: 'bg-ok shadow-[0_0_6px_rgba(76,195,138,0.7)]',
  error:   'bg-bad shadow-[0_0_6px_rgba(217,74,58,0.7)]',
  info:    'bg-brand-cyan shadow-[0_0_6px_rgba(59,196,232,0.7)]',
}

const iconBtn =
  'relative flex h-8 w-8 items-center justify-center rounded-md border border-line ' +
  'bg-bg-surface text-ink-secondary transition-colors hover:bg-bg-raised hover:text-ink-primary'

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (email && email.trim()) {
    return email.trim()[0].toUpperCase()
  }
  return 'A'
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [ref, handler])
}

export function TopBar({ onMobileMenu }: { onMobileMenu?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useClickOutside(notifRef, () => setShowNotif(false))
  useClickOutside(profileRef, () => setShowProfile(false))

  const crumbs = breadcrumbMap[location.pathname] ?? ['Overview', 'Dashboard']
  const pageTitle = crumbs[crumbs.length - 1]

  const photoURL = user?.photoURL
  const displayName = user?.displayName
  const email = user?.email
  const initials = getInitials(displayName, email)

  return (
    <header className="sticky top-0 z-20 flex h-14 flex-shrink-0 items-center justify-between gap-2 border-b border-line bg-bg-base px-3 sm:px-5">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={onMobileMenu}
          className={cn(iconBtn, 'lg:hidden')}
          aria-label="Open menu"
        >
          <Menu size={15} />
        </button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="hidden sm:flex items-center gap-1 text-[10.5px] text-ink-muted">
            <span>Korvixes</span>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={10} />
                <span className={i === crumbs.length - 1 ? 'text-ink-secondary' : 'text-ink-muted'}>{c}</span>
              </span>
            ))}
          </div>
          <h1 className="truncate text-[14px] sm:text-[15px] font-semibold leading-none text-ink-primary font-display tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search — hide on smallest screens */}
        <div className="hidden md:flex items-center gap-2 w-[180px] xl:w-[220px] rounded-md border border-line bg-bg-surface px-3 py-1.5 focus-within:border-brand-blue/50">
          <Search size={13} className="text-ink-muted shrink-0" />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search…"
            className="w-full bg-transparent text-[12px] text-ink-primary placeholder:text-ink-muted outline-none min-w-0"
          />
          <kbd className="hidden xl:inline rounded border border-line-mid bg-bg-raised px-1.5 py-px font-mono text-[9px] text-ink-muted shrink-0">⌘K</kbd>
        </div>

        {/* System status */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-ok/25 bg-ok/10 px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ok shadow-[0_0_6px_rgba(76,195,138,0.8)] animate-pulse shrink-0" />
          <span className="font-mono text-[10px] font-medium text-ok">All Systems</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className={iconBtn}
            onClick={() => { setShowNotif(v => !v); setShowProfile(false) }}
            aria-label="Notifications"
          >
            <Bell size={15} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-bad ring-2 ring-bg-base" />
          </button>
          {showNotif && (
            <div className={cn(
              'z-50 rounded-lg border border-line-mid bg-bg-surface shadow-2xl',
              'fixed left-3 right-3 top-14',
              'sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+6px)] sm:w-80',
              'max-w-[400px] max-h-[75vh] overflow-y-auto',
            )}>
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg-surface px-3.5 py-3">
                <span className="text-[12px] font-semibold text-ink-primary">Notifications</span>
                <span className="rounded bg-bad/15 px-1.5 py-0.5 font-mono text-[10px] text-bad">4 new</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-2.5 border-b border-line/60 px-3 py-2.5 sm:px-3.5 last:border-b-0 hover:bg-bg-raised/60 min-h-[44px]">
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', typeDot[n.type])} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] leading-snug text-ink-primary">{n.title}</div>
                    <div className="mt-0.5 text-[10px] text-ink-muted">{n.time}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setShowNotif(false); navigate('/notifications') }}
                className="sticky bottom-0 w-full border-t border-line/60 bg-bg-surface px-3.5 py-3 text-left text-[11px] font-medium text-brand-cyan hover:bg-bg-raised"
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings/general')}
          className={cn(iconBtn, 'hidden sm:flex')} aria-label="Settings"
        >
          <Settings size={15} />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotif(false) }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-md border border-line bg-bg-surface px-1.5 py-1 transition-colors hover:bg-bg-raised"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-brand-blue to-brand-cyan text-[10px] font-bold text-white overflow-hidden shrink-0">
              {photoURL ? (
                <img src={photoURL} alt="" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="hidden sm:block pr-1 text-left min-w-0 max-w-[130px]">
              <div className="text-[12px] font-medium leading-tight text-ink-primary truncate">
                {displayName ?? 'User'}
              </div>
              <div className="text-[10px] leading-tight text-ink-muted truncate">
                {email ?? ''}
              </div>
            </div>
          </button>
          {showProfile && (
            <div className={cn(
              'z-50 rounded-lg border border-line-mid bg-bg-surface shadow-2xl overflow-hidden',
              'fixed right-3 left-3 top-14',
              'sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+6px)] sm:w-56',
            )}>
              {/* User info header */}
              <div className="border-b border-line px-3.5 py-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-[13px] font-bold text-white overflow-hidden shrink-0">
                  {photoURL ? (
                    <img src={photoURL} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink-primary truncate">
                    {displayName ?? 'User'}
                  </div>
                  <div className="text-[11px] text-ink-muted truncate">
                    {email ?? ''}
                  </div>
                </div>
              </div>

              {[
                { icon: User, label: 'My Profile', href: '/profile' },
                { icon: Shield, label: 'Security', href: '/security' },
                { icon: Moon, label: 'Preferences', href: '/preferences' },
                { icon: LogOut, label: 'Sign Out', danger: true, action: 'logout' },
              ].map(({ icon: Icon, label, danger, href, action }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (action === 'logout') {
                      setShowProfile(false)
                      logout()
                    } else if (href) {
                      setShowProfile(false)
                      navigate(href)
                    }
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] transition-colors min-h-[40px]',
                    danger
                      ? 'text-bad hover:bg-bad/10'
                      : 'text-ink-secondary hover:bg-bg-raised hover:text-ink-primary'
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
