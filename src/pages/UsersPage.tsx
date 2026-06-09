import { useState } from 'react'
import {
  Users, UserPlus, Shield, Activity, Search,
  Filter, MoreHorizontal, Edit2, Trash2,
  Key, Eye, Clock, CheckCircle, XCircle,
  ChevronDown
} from 'lucide-react'

const users = [
  { id: 'USR-001', name: 'Nishant Pereira', email: 'n.pereira@korvixes.io', role: 'Super Admin', status: 'active', lastLogin: '2m ago', twins: 12, simulations: 84, joined: 'Jan 2024', avatar: 'NP' },
  { id: 'USR-002', name: 'Anika Sørensen', email: 'a.sorensen@korvixes.io', role: 'Operations Lead', status: 'active', lastLogin: '18m ago', twins: 8, simulations: 56, joined: 'Feb 2024', avatar: 'AS' },
  { id: 'USR-003', name: 'Marcus Kim', email: 'm.kim@korvixes.io', role: 'Data Engineer', status: 'active', lastLogin: '1h ago', twins: 5, simulations: 31, joined: 'Mar 2024', avatar: 'MK' },
  { id: 'USR-004', name: 'Priya Nair', email: 'p.nair@korvixes.io', role: 'AI Analyst', status: 'active', lastLogin: '3h ago', twins: 6, simulations: 47, joined: 'Mar 2024', avatar: 'PN' },
  { id: 'USR-005', name: 'Tobias Müller', email: 't.muller@korvixes.io', role: 'Infrastructure', status: 'inactive', lastLogin: '2d ago', twins: 3, simulations: 12, joined: 'Apr 2024', avatar: 'TM' },
  { id: 'USR-006', name: 'Sofia Carvalho', email: 's.carvalho@korvixes.io', role: 'Read Only', status: 'active', lastLogin: '45m ago', twins: 0, simulations: 0, joined: 'May 2024', avatar: 'SC' },
  { id: 'USR-007', name: 'David Okonkwo', email: 'd.okonkwo@korvixes.io', role: 'Simulation Engineer', status: 'suspended', lastLogin: '7d ago', twins: 4, simulations: 22, joined: 'Apr 2024', avatar: 'DO' },
]

const roles = [
  { name: 'Super Admin', users: 1, permissions: 'Full access', color: 'var(--error)' },
  { name: 'Operations Lead', users: 2, permissions: 'Twins, Sims, Monitoring', color: 'var(--warning)' },
  { name: 'Data Engineer', users: 3, permissions: 'Data sources, ETL, Reports', color: 'var(--blue)' },
  { name: 'AI Analyst', users: 2, permissions: 'AI Center, Read twins', color: 'var(--cyan)' },
  { name: 'Infrastructure', users: 1, permissions: 'Infra, Monitoring, Devices', color: 'var(--success)' },
  { name: 'Simulation Engineer', users: 4, permissions: 'Simulations, Twins read', color: '#9B7FE8' },
  { name: 'Read Only', users: 5, permissions: 'Dashboard, Reports read', color: 'var(--text-secondary)' },
]

const activityLog = [
  { user: 'Nishant Pereira', action: 'Created digital twin', target: 'Warehouse Sector D', time: '4m ago', type: 'create' },
  { user: 'Anika Sørensen', action: 'Started simulation', target: 'SIM-0091', time: '18m ago', type: 'run' },
  { user: 'Priya Nair', action: 'Exported AI report', target: 'FailurePredict Q2', time: '1h ago', type: 'export' },
  { user: 'Marcus Kim', action: 'Connected data source', target: 'Kafka Stream v2', time: '2h ago', type: 'connect' },
  { user: 'Sofia Carvalho', action: 'Viewed dashboard', target: 'System Health', time: '3h ago', type: 'view' },
  { user: 'Nishant Pereira', action: 'Updated user role', target: 'David Okonkwo → Suspended', time: '5h ago', type: 'admin' },
]

const roleColors: Record<string, string> = {
  'Super Admin': 'var(--error)',
  'Operations Lead': 'var(--warning)',
  'Data Engineer': 'var(--blue)',
  'AI Analyst': 'var(--cyan)',
  'Infrastructure': 'var(--success)',
  'Simulation Engineer': '#9B7FE8',
  'Read Only': 'var(--text-secondary)',
}

const statusConf = {
  active:    { cls: 'badge-success', label: 'Active' },
  inactive:  { cls: 'badge-muted',   label: 'Inactive' },
  suspended: { cls: 'badge-error',   label: 'Suspended' },
} as const

export function UsersPage() {
  const [tab, setTab] = useState<'users' | 'roles' | 'activity'>('users')
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">// {users.filter(u=>u.status==='active').length} active · {users.length} total · {roles.length} roles</p>
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm"><Shield size={12} /> Manage Roles</button>
          <button className="btn btn-primary btn-sm"><UserPlus size={13} /> Invite User</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Users', val: String(users.length), sub: '+2 this month', color: 'var(--blue)', icon: Users },
          { label: 'Active Now', val: String(users.filter(u=>u.status==='active').length), sub: 'Logged in <24h', color: 'var(--success)', icon: CheckCircle },
          { label: 'Roles', val: String(roles.length), sub: 'Permission groups', color: 'var(--cyan)', icon: Shield },
          { label: 'Avg Sessions', val: '3.4/day', sub: 'Per active user', color: 'var(--warning)', icon: Activity },
        ].map(c => (
          <div key={c.label} className="card animate-in" style={{ padding: '16px 18px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
              <span className="text-secondary text-sm">{c.label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={14} color={c.color} />
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{c.val}</div>
            <div className="text-muted text-xs text-mono" style={{ marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-list-wrap" style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {([
            { id: 'users', label: 'All Users', icon: Users },
            { id: 'roles', label: 'Roles & Permissions', icon: Shield },
            { id: 'activity', label: 'Activity Logs', icon: Activity },
          ] as const).map(t => (
            <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={12} style={{ display: 'inline', marginRight: 5 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      {tab === 'users' && (
        <div className="card">
          <div className="card-header">
            <div className="flex gap-2 items-center">
              <div className="search-bar" style={{ width: 240 }}>
                <Search size={12} color="var(--text-muted)" />
                <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-ghost btn-sm btn-icon"><Filter size={12} /></button>
            </div>
            <span className="text-muted text-xs text-mono">{filtered.length} users</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>TWINS</th>
                  <th>SIMULATIONS</th>
                  <th>LAST LOGIN</th>
                  <th>JOINED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const s = statusConf[u.status as keyof typeof statusConf]
                  const rc = roleColors[u.role] || 'var(--text-secondary)'
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${rc}22`, border: `1px solid ${rc}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: rc, flexShrink: 0 }}>
                            {u.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 12.5 }}>{u.name}</div>
                            <div className="text-muted text-xs text-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 11.5, fontWeight: 500, color: rc, fontFamily: 'var(--font-mono)' }}>{u.role}</span>
                      </td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td><span className="text-mono text-sm">{u.twins}</span></td>
                      <td><span className="text-mono text-sm">{u.simulations}</span></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Clock size={10} color="var(--text-muted)" />
                          <span className="text-muted text-xs text-mono">{u.lastLogin}</span>
                        </div>
                      </td>
                      <td><span className="text-muted text-xs text-mono">{u.joined}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Edit"><Edit2 size={11} /></button>
                          <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Reset Password"><Key size={11} /></button>
                          <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="View Activity"><Eye size={11} /></button>
                          <button className="btn btn-danger btn-sm btn-icon" data-tooltip="Suspend"><XCircle size={11} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles tab */}
      {tab === 'roles' && (
        <div className="grid-auto">
          {roles.map(r => (
            <div key={r.name} className="card animate-in" style={{ padding: '18px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${r.color}18`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} color={r.color} />
                </div>
                <button className="btn btn-ghost btn-sm btn-icon"><Edit2 size={11} /></button>
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.name}</div>
              <div className="text-muted text-xs text-mono" style={{ marginBottom: 12 }}>{r.permissions}</div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 11, color: r.color, fontFamily: 'var(--font-mono)' }}>{r.users} user{r.users !== 1 ? 's' : ''}</span>
                <div style={{ display: 'flex', gap: -6 }}>
                  {Array.from({ length: Math.min(r.users, 4) }).map((_, i) => (
                    <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: `${r.color}22`, border: `2px solid var(--bg-surface)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 0 ? -6 : 0, fontSize: 8, fontWeight: 700, color: r.color }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity log */}
      {tab === 'activity' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Activity Log</span>
            <span className="text-muted text-xs text-mono">Last 24 hours</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>ACTION</th>
                  <th>TARGET</th>
                  <th>TIME</th>
                  <th>TYPE</th>
                </tr>
              </thead>
              <tbody>
                {activityLog.map((a, i) => {
                  const typeColors: Record<string, string> = { create: 'var(--success)', run: 'var(--cyan)', export: 'var(--blue)', connect: 'var(--warning)', view: 'var(--text-muted)', admin: 'var(--error)' }
                  return (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(42,107,219,0.12)', border: '1px solid rgba(42,107,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--cyan)', fontFamily: 'var(--font-display)' }}>
                            {a.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span style={{ fontSize: 12.5, fontWeight: 500 }}>{a.user}</span>
                        </div>
                      </td>
                      <td className="text-secondary text-sm">{a.action}</td>
                      <td><span className="text-mono text-xs" style={{ color: 'var(--text-primary)' }}>{a.target}</span></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Clock size={10} color="var(--text-muted)" />
                          <span className="text-muted text-xs text-mono">{a.time}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-block', padding: '2px 8px', background: `${typeColors[a.type]}18`, color: typeColors[a.type], borderRadius: 4, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {a.type}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
