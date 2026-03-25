interface KpiCardProps {
  label: string
  value: number | string
  icon?: string
  highlight?: boolean
}

export default function KpiCard({ label, value, icon, highlight }: KpiCardProps) {
  return (
    <div style={{
      borderRadius: 12,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      border: highlight ? '1px solid rgba(201,168,76,0.4)' : '1px solid var(--border)',
      backgroundColor: highlight ? 'rgba(201,168,76,0.08)' : 'var(--surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
        {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
      </div>
      <span style={{
        fontSize: 32,
        fontWeight: 700,
        color: highlight ? '#C9A84C' : 'var(--text-primary)',
        fontFamily: 'var(--font-heading)',
      }}>
        {value}
      </span>
    </div>
  )
}
