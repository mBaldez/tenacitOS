'use client'
import { useState, useEffect } from 'react'
import { SectionHeader } from '@/components/TenacitOS'
import AgentCard from '@/components/dashboard/AgentCard'
import { multiAgentMock } from '@/lib/mock-data'

interface Agent {
  id: string
  name: string
  emoji: string
  status: 'online' | 'offline'
  lastActivity?: string
  activeSessions: number
  model: string
}

interface Session {
  id: string
  key: string
  typeLabel: string
  typeEmoji: string
  updatedAt: number
  totalTokens: number
  model: string
  aborted: boolean
}

export default function MultiAgentPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [logs, setLogs] = useState<string[]>(multiAgentMock.logs)
  const [cost, setCost] = useState<number>(multiAgentMock.custo_hoje)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // Agents
      try {
        const res = await fetch('/api/agents')
        const data = await res.json()
        if (data.agents?.length > 0) setAgents(data.agents)
      } catch {}

      // Sessions
      try {
        const res = await fetch('/api/sessions')
        const data = await res.json()
        if (data.sessions?.length > 0) setSessions(data.sessions.slice(0, 5))
      } catch {}

      // Logs
      try {
        const res = await fetch('/api/openclaw-logs')
        const data = await res.json()
        if (data.lines?.length > 0) setLogs(data.lines)
      } catch {}

      // Costs
      try {
        const res = await fetch('/api/costs')
        const data = await res.json()
        if (typeof data.today === 'number') setCost(data.today)
      } catch {}

      setLoading(false)
    }
    loadData()
  }, [])

  // Fallback to mock agent cards if real agents not loaded
  const agentCards = agents.length > 0
    ? agents.map(a => ({
        id: a.id,
        nome: a.name || a.id,
        papel: a.model?.includes('haiku') ? 'Claude Haiku' : 'Agente',
        status: a.status === 'online' ? 'ativa' as const : 'inativo' as const,
        ultima_sessao: a.lastActivity ? new Date(a.lastActivity).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—',
        mensagens: a.activeSessions,
      }))
    : multiAgentMock.agentes

  // Fallback to mock sessions if real sessions not loaded
  const sessionList = sessions.length > 0
    ? sessions.map(s => ({
        id: s.id,
        resumo: `${s.typeEmoji} ${s.typeLabel} — ${s.totalTokens.toLocaleString()} tokens`,
        hora: new Date(s.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        tokens: s.totalTokens,
      }))
    : multiAgentMock.sessoes_recentes

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SectionHeader label="Multi-Agent" />
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: -16 }}>
        {loading ? 'Conectando ao OpenClaw...' : agents.length > 0 ? `${agents.length} agente(s) configurado(s)` : 'Agentes OpenClaw'}
      </p>

      {/* Agent grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {agentCards.map((agent, i) => (
          <AgentCard key={agent.id ?? i} agent={agent} />
        ))}
      </div>

      {/* Sessions + Cost + Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Sessões recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sessionList.map((s, i) => (
              <div key={s.id ?? i} style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 4 }}>{s.resumo}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{s.hora} · {s.tokens?.toLocaleString() ?? 0} tokens</p>
              </div>
            ))}
            {sessionList.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Nenhuma sessão ainda.</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Custo hoje</h3>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#C9A84C' }}>${cost.toFixed(4)}</p>
          </div>
          <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', flex: 1 }}>
            <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
              Logs OpenClaw
              {!loading && <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 8 }}>ao vivo</span>}
            </h3>
            <div style={{ backgroundColor: 'var(--bg)', borderRadius: 8, padding: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 200, overflowY: 'auto' }}>
              {logs.map((log, i) => (
                <span key={i} style={{ lineHeight: 1.5, wordBreak: 'break-all' }}>{log}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
