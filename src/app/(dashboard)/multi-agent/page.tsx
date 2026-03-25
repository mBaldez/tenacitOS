'use client'
import { SectionHeader } from '@/components/TenacitOS'
import AgentCard from '@/components/dashboard/AgentCard'
import { multiAgentMock } from '@/lib/mock-data'

const m = multiAgentMock

export default function MultiAgentPage() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <SectionHeader label="Multi-Agent" />
        <p style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>Agentes OpenClaw</p>
      </div>

      {/* Grid de agentes */}
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Agentes configurados</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {m.agentes.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Sessões + Custo + Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Sessões recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {m.sessoes_recentes.map((s) => (
              <div key={s.id} style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 4 }}>{s.resumo}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{s.hora} · {s.tokens} tokens</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Custo hoje</h3>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#C9A84C' }}>${m.custo_hoje.toFixed(2)}</p>
          </div>
          <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', flex: 1 }}>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Logs (mock)</h3>
            <div style={{ backgroundColor: 'var(--bg)', borderRadius: 8, padding: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {m.logs.map((log, i) => <span key={i}>{log}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
