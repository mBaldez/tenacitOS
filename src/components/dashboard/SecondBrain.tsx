export default function SecondBrain({ ideias }: { ideias: string[] }) {
  return (
    <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        🧠 Second Brain
      </h3>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
        {ideias.map((ideia, i) => (
          <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ color: '#C9A84C', marginTop: 1 }}>›</span>
            {ideia}
          </li>
        ))}
      </ul>
    </div>
  )
}
