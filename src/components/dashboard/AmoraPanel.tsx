interface AmoraPanelProps {
  status: 'ativa' | 'inativa'
  ultima_acao: string
  proxima_tarefa: string
}

export default function AmoraPanel({ status, ultima_acao, proxima_tarefa }: AmoraPanelProps) {
  const isActive = status === 'ativa'
  return (
    <div style={{
      borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)',
      border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'flex-start', gap: 16,
    }}>
      <img
        src="/amora-avatar.jpg"
        alt="Amora"
        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.5)', flexShrink: 0 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Amora</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>CEO</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: isActive ? '#C9A84C' : 'var(--text-secondary)' }}>
            ● {isActive ? 'Ativa' : 'Inativa'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Última ação:</span> {ultima_acao}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Próxima tarefa:</span> {proxima_tarefa}
        </p>
      </div>
    </div>
  )
}
