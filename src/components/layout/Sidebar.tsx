import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Box, Play, Brain, Server, Activity,
  Users, BarChart2, Settings, ChevronDown, ChevronRight,
  PanelLeftClose, PanelLeft, X,
} from 'lucide-react'
import { cn } from '../../lib/utils'

import logoHeader from '../../assets/logo-header.webp'

interface NavChild { label: string; href: string }
interface NavItemDef {
  label: string
  icon: React.ElementType
  href?: string
  children?: NavChild[]
  badge?: string
}
interface NavGroup {
  label?: string
  items: NavItemDef[]
}

const navigation: NavGroup[] = [
  { items: [{ label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' }] },
  {
    label: 'Digital Twin',
    items: [{
      label: 'Twin Management', icon: Box, children: [
        { label: 'All Twins (Tabbed)', href: '/twins' },
        { label: 'Full Twin List', href: '/digital-twins' },
        { label: 'Create Twin', href: '/twins/create' },
        { label: 'Twin Templates', href: '/twins/templates' },
      ],
    }],
  },
  {
    label: 'Simulation',
    items: [{
      label: 'Simulations', icon: Play, children: [
        { label: 'All Simulations', href: '/simulations' },
        { label: 'Running', href: '/simulations/running' },
        { label: 'Completed', href: '/simulations/completed' },
        { label: 'Failed', href: '/simulations/failed' },
      ],
    }],
  },
  {
    label: 'Intelligence',
    items: [{
      label: 'AI Systems', icon: Brain, children: [
        { label: 'Predictions', href: '/ai/predictions' },
        { label: 'Forecast Models', href: '/ai/models' },
        { label: 'Risk Analysis', href: '/ai/risk' },
        { label: 'Optimization', href: '/ai/optimization' },
      ],
    }],
  },
  {
    label: 'Infrastructure',
    items: [{
      label: 'Infrastructure', icon: Server, children: [
        { label: 'IoT Devices', href: '/infra/devices' },
        { label: 'Data Sources', href: '/infra/sources' },
        { label: 'ERP Integrations', href: '/infra/erp' },
        { label: 'API Integrations', href: '/infra/api' },
      ],
    }],
  },
  {
    label: 'Monitoring',
    items: [{
      label: 'Monitoring', icon: Activity, children: [
        { label: 'System Health', href: '/monitoring/health' },
        { label: 'Performance', href: '/monitoring/performance' },
        { label: 'Sync Status', href: '/monitoring/sync' },
        { label: 'Resource Usage', href: '/monitoring/resources' },
      ],
    }],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Users', icon: Users, href: '/users' },
      {
        label: 'Reports', icon: BarChart2, children: [
          { label: 'Analytics', href: '/reports/analytics' },
          { label: 'Reports', href: '/reports' },
          { label: 'Exports', href: '/reports/exports' },
        ],
      },
      {
        label: 'Settings', icon: Settings, children: [
          { label: 'General', href: '/settings/general' },
          { label: 'Security', href: '/settings/security' },
          { label: 'Billing', href: '/settings/billing' },
          { label: 'Notifications', href: '/settings/notifications' },
        ],
      },
    ],
  },
]

const itemBase =
  'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[12.5px] font-medium ' +
  'text-ink-secondary transition-colors duration-150 hover:bg-bg-raised hover:text-ink-primary'

const itemActive =
  'bg-brand-blue/10 text-ink-primary ' +
  'before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:rounded-r before:bg-brand-blue before:shadow-[0_0_8px_rgba(42,107,219,0.6)]'

function LeafLink({
  href, label, icon: Icon, collapsed, onNavigate,
}: { href: string; label: string; icon: React.ElementType; collapsed: boolean; onNavigate?: () => void }) {
  return (
    <NavLink
      to={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) => cn(itemBase, collapsed && 'justify-center px-2', isActive && itemActive)}
    >
      <Icon size={16} strokeWidth={1.6} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

function GroupItem({
  item, collapsed, onNavigate,
}: { item: NavItemDef; collapsed: boolean; onNavigate?: () => void }) {
  const location = useLocation()
  const Icon = item.icon
  const childActive = item.children?.some(c => location.pathname.startsWith(c.href)) ?? false
  const [open, setOpen] = useState(childActive)

  useEffect(() => {
    if (childActive) setOpen(true)
  }, [childActive])

  if (collapsed) {
    // In collapsed mode show just the parent icon as a tooltip link to first child.
    const first = item.children?.[0]
    return (
      <NavLink
        to={first?.href ?? '#'}
        onClick={onNavigate}
        title={item.label}
        className={cn(itemBase, 'justify-center px-2', childActive && itemActive)}
      >
        <Icon size={16} strokeWidth={1.6} className="shrink-0" />
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(itemBase, 'w-full', childActive && 'text-ink-primary')}
      >
        <Icon size={16} strokeWidth={1.6} className="shrink-0" />
        <span className="flex-1 truncate text-left">{item.label}</span>
        {open ? <ChevronDown size={12} className="text-ink-muted" /> : <ChevronRight size={12} className="text-ink-muted" />}
      </button>
      {open && (
        <div className="ml-[18px] mt-0.5 flex flex-col gap-0.5 border-l border-line/60 pl-2.5">
          {item.children!.map(child => (
            <NavLink
              key={child.href}
              to={child.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'rounded px-2 py-1.5 text-[11.5px] text-ink-secondary transition-colors hover:bg-bg-raised hover:text-ink-primary',
                  isActive && 'bg-bg-raised text-ink-primary'
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({
  collapsed, onToggle, mobileOpen, onMobileClose,
}: {
  collapsed: boolean
  onToggle: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  return (
    <aside
      className={cn(
        'flex flex-col flex-shrink-0 bg-bg-base border-r border-line z-50',
        'transition-[width,transform] duration-300 ease-out',
        'fixed inset-y-0 left-0 lg:static',
        collapsed ? 'w-[60px]' : 'w-[232px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}
    >
      {/* Logo */}
      <div className={cn(
        'group flex items-center gap-2.5 border-b border-line px-3 min-h-[56px] flex-shrink-0',
        collapsed && 'justify-center px-0'
      )}>
        {collapsed ? (
          <img
            src={logoHeader}
            alt="K"
            className="h-8 w-8 shrink-0 rounded object-contain brightness-0 invert-[0.7] transition-all duration-300 group-hover:scale-110 group-hover:brightness-100"
          />
        ) : (
          <>
            <img
              src={logoHeader}
              alt="KORVIXES"
              className="h-12 sm:h-[52px] max-w-[180px] object-contain transition-all duration-300 group-hover:scale-[1.02] group-hover:drop-shadow-[0_0_6px_rgba(42,107,219,0.4)]"
            />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted leading-tight">
                Admin Console
              </div>
            </div>
          </>
        )}
        {mobileOpen && (
          <button
            onClick={onMobileClose}
            className="ml-auto rounded p-1 text-ink-secondary hover:bg-bg-raised hover:text-ink-primary lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        {navigation.map((group, gi) => (
          <div key={gi} className="mb-3">
            {group.label && !collapsed && (
              <div className="px-2.5 mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.15em] text-ink-muted/80">
                {group.label}
              </div>
            )}
            {group.label && collapsed && <div className="mx-2 mb-2 h-px bg-line/60" />}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item, ii) =>
                item.children ? (
                  <GroupItem key={ii} item={item} collapsed={collapsed} onNavigate={onMobileClose} />
                ) : (
                  <LeafLink
                    key={ii}
                    href={item.href!}
                    label={item.label}
                    icon={item.icon}
                    collapsed={collapsed}
                    onNavigate={onMobileClose}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block border-t border-line p-2 flex-shrink-0">
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[12px] font-medium',
            'text-ink-secondary transition-colors hover:bg-bg-raised hover:text-ink-primary',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? <PanelLeft size={15} /> : (<><PanelLeftClose size={15} /><span>Collapse</span></>)}
        </button>
      </div>
    </aside>
  )
}
