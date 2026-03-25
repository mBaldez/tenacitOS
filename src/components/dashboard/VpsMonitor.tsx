'use client'
import { useEffect, useState } from 'react'

interface VpsStats {
  cpu: number
  ram: { used: number; total: number; percent: number }
  disk: { used: number; total: number; percent: number }
}

function StatBar({ label, percent, value }: { label: string; percent: number; value: string }) {
  const color = percent > 80 ? '#FF453A' : percent > 60 ? '#FFD60A' : '#C9A84C'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text-primary)' }}>{value}</span>
      </div>
      <div style={{ height: 6, backgroundColor: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent}%`, backgroundColor: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

export default function VpsMonitor() {
  const [stats, setStats] = useState<VpsStats | null>(null)

  useEffect(() => {
    const fetchStats = () =>
      fetch('/api/vps-stats').then(r => r.json()).then(setStats).catch(console.error)
    fetchStats()
    const interval = setInterval(fetchStats, 10_000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return (
    <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Carregando VPS Monitor...</p>
    </div>
  )

  return (
    <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          🖥️ VPS Monitor
        </h3>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>ao vivo · 10s</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <StatBar label="CPU" percent={stats.cpu} value={`${stats.cpu}%`} />
        <StatBar label="RAM" percent={stats.ram.percent} value={`${stats.ram.used}GB / ${stats.ram.total}GB`} />
        <StatBar label="Disco" percent={stats.disk.percent} value={`${stats.disk.used}GB / ${stats.disk.total}GB`} />
      </div>
    </div>
  )
}
