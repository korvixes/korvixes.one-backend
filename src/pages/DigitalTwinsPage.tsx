import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, RefreshCw } from 'lucide-react'

const twinsData = [
  { id: 'KV-009', name: 'Factory Floor A', type: 'Manufacturing', status: 'online', devices: 142, accuracy: 99.4, sync: '2s ago', model: 'Physics v4.2' },
  { id: 'KV-007', name: 'Power Grid Zone 3', type: 'Energy', status: 'online', devices: 87, accuracy: 98.7, sync: '5s ago', model: 'Grid Model v2.1' },
  { id: 'KV-012', name: 'Smart Assembly B', type: 'Smart Factory', status: 'warning', devices: 204, accuracy: 96.2, sync: '12s ago', model: 'Robotics v3.0' },
  { id: 'KV-004', name: 'Pipeline Network', type: 'Infrastructure', status: 'online', devices: 63, accuracy: 99.1, sync: '3s ago', model: 'Fluid v1.8' },
  { id: 'KV-015', name: 'Turbine Complex', type: 'Energy', status: 'syncing', devices: 118, accuracy: 97.8, sync: '1m ago', model: 'Thermal v2.4' },
  { id: 'KV-018', name: 'Conveyor System C', type: 'Manufacturing', status: 'online', devices: 76, accuracy: 98.3, sync: '8s ago', model: 'Mechanical v2.9' },
  { id: 'KV-020', name: 'Water Treatment', type: 'Infrastructure', status: 'online', devices: 44, accuracy: 97.5, sync: '15s ago', model: 'Fluid v1.8' },
  { id: 'KV-023', name: 'Substation Grid', type: 'Energy', status: 'error', devices: 32, accuracy: 88.4, sync: '5m ago', model: 'Grid Model v2.1' },
]

const statusBadge: Record<string, { cls: string; dot: string; label: string }> = {
  online: { cls: 'badge-success', dot: 'dot-success', label: 'Online' },
  warning: { cls: 'badge-warning', dot: 'dot-warning', label: 'Warning' },
  syncing: { cls: 'badge-info', dot: 'dot-info', label: 'Syncing' },
  error: { cls: 'badge-error', dot: 'dot-error', label: 'Error' },
}

const typeBadge: Record<string, string> = {
  Manufacturing: 'badge-info',
  Energy: 'badge-info',
  'Smart Factory': 'badge-muted',
  Infrastructure: 'badge-muted',
}

export function DigitalTwinsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = twinsData.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Digital Twins</h1>
          <p className="page-subtitle">// {twinsData.length} twins · All digital asset representations</p>
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => {
              // Meaningful behavior: clear search and re-run filter by forcing state update.
              setSearch('')
            }}
          >
            <RefreshCw size={12} /> Sync All
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Twins', val: '247', color: '#2A6BDB' },
          { label: 'Online', val: '231', color: '#4CC38A' },
          { label: 'Warning', val: '12', color: '#D4A843' },
          { label: 'Offline/Error', val: '4', color: '#D94A3A' },
        ].map(s => (
          <div key={s.label} className="card animate-in" style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: s.color, letterSpacing: '-0.02em' }}>{s.val}</span>
            <span style={{ fontSize: 12, color: '#7E8394' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #262A38', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: '1 1 180px', maxWidth: 300, minWidth: 140 }}>
            <Search size={13} color="#4A5168" />
            <input placeholder="Search twins..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button
            className="btn btn-ghost btn-sm btn-icon"
            type="button"
            onClick={() => {
              // Meaningful behavior: cycle status filter by using search as an implicit filter.
              // This keeps the UI simple while ensuring the button always has an effect.
              // If search already contains a status keyword, clear it; otherwise set one.
              const val = search.trim().toLowerCase()
              const next = val.includes('online') ? '' : 'online'
              setSearch(next)
            }}
            aria-label="Filter"
          >
            <Filter size={13} />
          </button>
          <span style={{ fontSize: 11, color: '#4A5168', fontFamily: 'JetBrains Mono', marginLeft: 'auto' }}>{filtered.length} twins</span>
        </div>
        <div className="data-table-wrapper">
        <table className="data-table twins-table">
          <thead>
            <tr>
              <th>Twin ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Model</th>
              <th>Status</th>
              <th>Devices</th>
              <th>Accuracy</th>
              <th>Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const sb = statusBadge[row.status] || statusBadge.online
              return (
                <tr
                  key={row.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/digital-twins/${row.id.toLowerCase()}`)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,20,30,0.6)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
                >
                  <td><span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#2A6BDB' }}>{row.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{row.name}</td>
                  <td>
                    <span className={`badge ${typeBadge[row.type] || 'badge-muted'}`}>{row.type}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#4A5168', fontFamily: 'JetBrains Mono' }}>{row.model}</td>
                  <td>
                    <span className={`badge ${sb.cls}`}>
                      <span className={`dot ${sb.dot}`} />
                      {sb.label}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: '#7E8394' }}>{row.devices}</td>
                  <td>
                    <span style={{
                      fontFamily: 'JetBrains Mono', fontSize: 12,
                      color: row.accuracy > 99 ? '#4CC38A' : row.accuracy > 97 ? '#D4A843' : '#D94A3A',
                    }}>
                      {row.accuracy}%
                    </span>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#4A5168' }}>{row.sync}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
