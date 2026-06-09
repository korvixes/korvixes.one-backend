import { useState } from 'react'
import { useRouteTab } from '../hooks/useRouteTab'
import {
  Server, Database, Network, Wifi, WifiOff,
  Plus, RefreshCw, Search, Filter, Settings2,
  Activity, HardDrive, Layers, Link, Cpu,
  CheckCircle, AlertTriangle, XCircle, Clock, Zap, Boxes
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const iotDevices = [
  { id: 'DEV-0142', name: 'Pressure Sensor Array 7', type: 'Sensor', twin: 'Factory Floor A', status: 'online', signal: 98, lastSeen: '2s ago', firmware: 'v3.2.1', protocol: 'MQTT' },
  { id: 'DEV-0141', name: 'Industrial PLC Unit B', type: 'Controller', twin: 'Smart Assembly B', status: 'online', signal: 94, lastSeen: '1s ago', firmware: 'v2.8.4', protocol: 'OPC-UA' },
  { id: 'DEV-0139', name: 'Thermal Camera TH-22', type: 'Camera', twin: 'Turbine Complex', status: 'warning', signal: 71, lastSeen: '45s ago', firmware: 'v1.9.0', protocol: 'RTSP' },
  { id: 'DEV-0138', name: 'Flow Meter FM-09', type: 'Meter', twin: 'Pipeline Network', status: 'online', signal: 99, lastSeen: '1s ago', firmware: 'v4.0.2', protocol: 'Modbus' },
  { id: 'DEV-0135', name: 'Grid Voltage Monitor', type: 'Monitor', twin: 'Power Grid Zone 3', status: 'online', signal: 96, lastSeen: '3s ago', firmware: 'v2.3.7', protocol: 'IEC 61850' },
  { id: 'DEV-0132', name: 'Vibration Sensor VS-04', type: 'Sensor', twin: 'Conveyor System C', status: 'online', signal: 88, lastSeen: '8s ago', firmware: 'v3.1.0', protocol: 'MQTT' },
  { id: 'DEV-0129', name: 'Water Quality Probe', type: 'Sensor', twin: 'Water Treatment', status: 'offline', signal: 0, lastSeen: '5m ago', firmware: 'v1.4.2', protocol: 'MQTT' },
  { id: 'DEV-0127', name: 'Substation RTU-12', type: 'Controller', twin: 'Substation Grid', status: 'error', signal: 22, lastSeen: '2m ago', firmware: 'v2.1.1', protocol: 'DNP3' },
]

const dataSources = [
  { id: 'DS-001', name: 'SAP ERP Production', type: 'ERP', vendor: 'SAP', status: 'active', records: '2.4M', syncRate: '15s', lastSync: '12s ago' },
  { id: 'DS-002', name: 'Siemens MindSphere', type: 'IoT Platform', vendor: 'Siemens', status: 'active', records: '8.7M', syncRate: '5s', lastSync: '3s ago' },
  { id: 'DS-003', name: 'Azure Digital Twins API', type: 'Cloud Twin', vendor: 'Microsoft', status: 'active', records: '1.1M', syncRate: '30s', lastSync: '18s ago' },
  { id: 'DS-004', name: 'Snowflake Data Warehouse', type: 'Database', vendor: 'Snowflake', status: 'active', records: '45M', syncRate: '1h', lastSync: '24m ago' },
  { id: 'DS-005', name: 'SCADA Legacy System', type: 'SCADA', vendor: 'Honeywell', status: 'warning', records: '340K', syncRate: '60s', lastSync: '2m ago' },
  { id: 'DS-006', name: 'Kafka Event Stream', type: 'Streaming', vendor: 'Confluent', status: 'active', records: 'RT', syncRate: 'RT', lastSync: 'Live' },
]

const networkData = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  ingress: Math.floor(120 + Math.random() * 80),
  egress: Math.floor(40 + Math.random() * 50),
}))

const statusConf = {
  online:  { cls: 'badge-success', dot: 'dot-success', label: 'Online' },
  warning: { cls: 'badge-warning', dot: 'dot-warning', label: 'Warning' },
  offline: { cls: 'badge-muted',   dot: 'dot-muted',   label: 'Offline' },
  error:   { cls: 'badge-error',   dot: 'dot-error',   label: 'Error' },
  active:  { cls: 'badge-success', dot: 'dot-success', label: 'Active' },
} as const

export function InfraPage() {
  const [tab, setTab] = useRouteTab('/infra', ['devices', 'sources', 'erp', 'api'] as const, 'devices')
  const [search, setSearch] = useState('')

  const onlineCount  = iotDevices.filter(d => d.status === 'online').length
  const warningCount = iotDevices.filter(d => d.status === 'warning').length
  const offlineCount = iotDevices.filter(d => ['offline', 'error'].includes(d.status)).length

  const filteredDevices = iotDevices.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Infrastructure</h1>
          <p className="page-subtitle">// {onlineCount} online · {warningCount} warnings · {offlineCount} offline</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm"><RefreshCw size={12} /> Sync All</button>
          <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Device</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger" style={{ marginBottom: 20 }}>
        {[
          { label: 'IoT Devices', val: String(iotDevices.length), sub: `${onlineCount} online`, color: 'var(--cyan)', icon: Wifi },
          { label: 'Data Sources', val: String(dataSources.length), sub: 'All connected', color: 'var(--blue)', icon: Database },
          { label: 'Ingress Rate', val: '182 MB/s', sub: '+4% vs 1h ago', color: 'var(--success)', icon: Activity },
          { label: 'API Calls', val: '14.2K/m', sub: 'P99: 42ms', color: 'var(--warning)', icon: Zap },
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

      {/* Network chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Network I/O (live)</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 2, background: 'var(--cyan)', borderRadius: 1 }} />
              <span className="text-xs text-muted text-mono">Ingress</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 2, background: 'var(--blue)', borderRadius: 1 }} />
              <span className="text-xs text-muted text-mono">Egress</span>
            </div>
            <span className="badge badge-info"><span className="dot-live" />&nbsp;Live</span>
          </div>
        </div>
        <div style={{ padding: '12px 4px 8px' }}>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={networkData} margin={{ top: 0, right: 16, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3BC4E8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3BC4E8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="egGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A6BDB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2A6BDB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1C2030" strokeDasharray="3 3" vertical={false} />
              <XAxis hide />
              <YAxis tick={{ fontSize: 9, fill: '#4A5168', fontFamily: 'JetBrains Mono' }} unit=" MB" />
              <Tooltip contentStyle={{ background: '#10141E', border: '1px solid #262A38', borderRadius: 6, fontSize: 11 }} />
              <Area type="monotone" dataKey="ingress" stroke="#3BC4E8" strokeWidth={1.5} fill="url(#ingGrad)" name="Ingress MB/s" />
              <Area type="monotone" dataKey="egress" stroke="#2A6BDB" strokeWidth={1.5} fill="url(#egGrad)" name="Egress MB/s" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="tab-list-wrap" style={{ marginBottom: 16 }}>
        <div className="tab-list" style={{ display: 'inline-flex' }}>
          {([
            { id: 'devices', label: 'IoT Devices', icon: Wifi },
            { id: 'sources', label: 'Data Sources', icon: Database },
            { id: 'erp', label: 'ERP Integrations', icon: Boxes },
            { id: 'api', label: 'API Integrations', icon: Link },
          ] as const).map(t => (
            <button key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={12} style={{ display: 'inline', marginRight: 5 }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* IoT Devices tab */}
      {tab === 'devices' && (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: 8 }}>
            <div className="flex gap-2 items-center" style={{ flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ width: 220, maxWidth: '100%' }}>
                <Search size={12} color="var(--text-muted)" />
                <input placeholder="Search devices..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-ghost btn-sm btn-icon"><Filter size={12} /></button>
            </div>
            <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
              <span className="text-muted text-xs text-mono">{onlineCount}/{iotDevices.length} online</span>
              <button className="btn btn-ghost btn-sm btn-icon" data-tooltip="Refresh"><RefreshCw size={12} /></button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>DEVICE</th>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>SIGNAL</th>
                  <th>TWIN</th>
                  <th>PROTOCOL</th>
                  <th>FIRMWARE</th>
                  <th>LAST SEEN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map(d => {
                  const s = statusConf[d.status as keyof typeof statusConf]
                  return (
                    <tr key={d.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(42,107,219,0.1)', border: '1px solid rgba(42,107,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {d.status === 'online' ? <Wifi size={12} color="var(--cyan)" /> : <WifiOff size={12} color="var(--text-muted)" />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 12.5 }}>{d.name}</div>
                            <div className="text-muted text-xs text-mono">{d.id}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-secondary text-sm">{d.type}</span></td>
                      <td><span className={`badge ${s.cls}`}><span className={`dot ${s.dot}`} />{s.label}</span></td>
                      <td style={{ minWidth: 100 }}>
                        <div className="flex items-center gap-2">
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className={`progress-fill ${d.signal > 80 ? 'progress-green' : d.signal > 50 ? 'progress-warn' : 'progress-error'}`} style={{ width: `${d.signal}%` }} />
                          </div>
                          <span className="text-mono text-xs text-muted">{d.signal}%</span>
                        </div>
                      </td>
                      <td className="text-secondary text-sm">{d.twin}</td>
                      <td><span className="badge badge-muted">{d.protocol}</span></td>
                      <td><span className="text-muted text-xs text-mono">{d.firmware}</span></td>
                      <td><span className="text-muted text-xs text-mono">{d.lastSeen}</span></td>
                      <td>
                        <button className="btn btn-ghost btn-sm btn-icon"><Settings2 size={11} /></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Sources tab */}
      {tab === 'sources' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Connected Data Sources</span>
            <button className="btn btn-primary btn-sm"><Plus size={12} /> Connect Source</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SOURCE</th>
                  <th>TYPE</th>
                  <th>VENDOR</th>
                  <th>STATUS</th>
                  <th>RECORDS</th>
                  <th>SYNC RATE</th>
                  <th>LAST SYNC</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map(ds => {
                  const s = statusConf[ds.status as keyof typeof statusConf]
                  return (
                    <tr key={ds.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(59,196,232,0.08)', border: '1px solid rgba(59,196,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Database size={12} color="var(--cyan)" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: 12.5 }}>{ds.name}</div>
                            <div className="text-muted text-xs text-mono">{ds.id}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-muted">{ds.type}</span></td>
                      <td className="text-secondary text-sm">{ds.vendor}</td>
                      <td><span className={`badge ${s.cls}`}><span className={`dot ${s.dot}`} />{s.label}</span></td>
                      <td><span className="text-mono text-sm">{ds.records}</span></td>
                      <td><span className="text-mono text-sm text-cyan">{ds.syncRate}</span></td>
                      <td><span className="text-muted text-xs text-mono">{ds.lastSync}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-sm btn-icon"><RefreshCw size={11} /></button>
                          <button className="btn btn-ghost btn-sm btn-icon"><Settings2 size={11} /></button>
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

      {/* ERP tab */}
      {tab === 'erp' && (
        <div className="grid-2">
          {[
            { name: 'SAP S/4HANA', module: 'Production Planning', status: 'connected', records: '482K', sync: 'Every 15s', health: 99.4, vendor: 'SAP' },
            { name: 'Oracle NetSuite', module: 'Supply Chain', status: 'connected', records: '128K', sync: 'Every 60s', health: 98.1, vendor: 'Oracle' },
            { name: 'Microsoft Dynamics 365', module: 'Asset Management', status: 'connected', records: '94K', sync: 'Every 30s', health: 97.8, vendor: 'Microsoft' },
            { name: 'Infor LN', module: 'Manufacturing Ops', status: 'warning', records: '64K', sync: 'Every 5m', health: 89.2, vendor: 'Infor' },
          ].map(erp => (
            <div key={erp.name} className="card" style={{ padding: '18px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(76,195,138,0.12)', border: '1px solid rgba(76,195,138,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Boxes size={16} color="var(--success)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{erp.name}</div>
                    <div className="text-muted text-xs text-mono">{erp.vendor} · {erp.module}</div>
                  </div>
                </div>
                <span className={`badge ${erp.status === 'connected' ? 'badge-success' : 'badge-warning'}`}>
                  {erp.status === 'connected' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                  {erp.status}
                </span>
              </div>
              <div className="rg-charts-pair" style={{ gap: 10, marginBottom: 12 }}>
                {[
                  { label: 'RECORDS', val: erp.records },
                  { label: 'SYNC', val: erp.sync },
                ].map(item => (
                  <div key={item.label} style={{ padding: '8px 10px', background: 'var(--bg-overlay)', borderRadius: 6 }}>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-xs text-mono" style={{ marginBottom: 6 }}>
                  <span className="text-muted">HEALTH</span>
                  <span style={{ color: erp.health > 95 ? 'var(--success)' : 'var(--warning)' }}>{erp.health}%</span>
                </div>
                <div className="progress-track">
                  <div className={`progress-fill ${erp.health > 95 ? 'progress-green' : 'progress-warn'}`} style={{ width: `${erp.health}%` }} />
                </div>
              </div>
              <div className="flex gap-2" style={{ marginTop: 14 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><RefreshCw size={11} /> Sync Now</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Settings2 size={11} /> Configure</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'api' && (
        <div className="grid-2">
          {[
            { name: 'REST API v2', endpoint: 'api.korvixes.io/v2', status: 'active', calls: '14.2K/min', latency: '38ms', uptime: '99.99%', auth: 'Bearer JWT' },
            { name: 'GraphQL API', endpoint: 'api.korvixes.io/graphql', status: 'active', calls: '2.1K/min', latency: '52ms', uptime: '99.97%', auth: 'API Key' },
            { name: 'WebSocket Stream', endpoint: 'ws.korvixes.io/stream', status: 'active', calls: 'Persistent', latency: '12ms', uptime: '99.95%', auth: 'Token' },
            { name: 'Webhook Dispatcher', endpoint: 'hooks.korvixes.io', status: 'warning', calls: '340/min', latency: '180ms', uptime: '98.2%', auth: 'HMAC' },
          ].map(api => (
            <div key={api.name} className="card" style={{ padding: '18px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(42,107,219,0.12)', border: '1px solid rgba(42,107,219,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Network size={16} color="var(--blue)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{api.name}</div>
                    <div className="text-muted text-xs text-mono">{api.endpoint}</div>
                  </div>
                </div>
                <span className={`badge ${api.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {api.status === 'active' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                  {api.status}
                </span>
              </div>
              <div className="rg-charts-pair" style={{ gap: 10 }}>
                {[
                  { label: 'CALLS', val: api.calls },
                  { label: 'P99 LATENCY', val: api.latency },
                  { label: 'UPTIME', val: api.uptime },
                  { label: 'AUTH', val: api.auth },
                ].map(item => (
                  <div key={item.label} style={{ padding: '8px 10px', background: 'var(--bg-overlay)', borderRadius: 6 }}>
                    <div className="text-muted text-xs text-mono" style={{ marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
