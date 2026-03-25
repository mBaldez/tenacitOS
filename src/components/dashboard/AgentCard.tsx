interface Agent {
  nome: string
  papel: string
  status: 'ativa' | 'inativo'
  ultima_sessao: string
  mensagens: number
}

export default function AgentCard({ agent }: { agent: Agent }) {
  const isActive = agent.status === 'ativa'
  return (
    <div style={{
      borderRadius: 12, padding: 20,
      backgroundColor: isActive ? 'rgba(201,168,76,0.05)' : 'var(--surface)',
      border: isActive ? '1px solid rgba(201,168,76,0.3)' : '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{agent.nome}</span>
        <span style={{ fontSize: 12, color: isActive ? '#C9A84C' : 'var(--text-secondary)' }}>
          ● {isActive ? 'Ativa' : 'Inativo'}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Papel: {agent.papel}</p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Última sessão: {agent.ultima_sessao}</p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{agent.mensagens} mensagens</p>
    </div>
  )
}
