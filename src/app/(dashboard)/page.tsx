import { SectionHeader } from '@/components/TenacitOS'
import KpiCard from '@/components/dashboard/KpiCard'
import AmoraPanel from '@/components/dashboard/AmoraPanel'
import VpsMonitor from '@/components/dashboard/VpsMonitor'
import SecondBrain from '@/components/dashboard/SecondBrain'
import { missionControlMock } from '@/lib/mock-data'

const m = missionControlMock

export default function MissionControlPage() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <SectionHeader label="Mission Control" />
        <p style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>Visão geral do dia</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KpiCard label="Tarefas hoje" value={m.tarefas_hoje} icon="📋" />
        <KpiCard label="Em curso" value={m.em_curso} icon="⚡" highlight />
        <KpiCard label="Concluídas (semana)" value={m.concluidas_semana} icon="✅" />
        <KpiCard label="Alertas" value={m.alertas} icon="🔔" />
      </div>

      {/* Amora + VPS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <AmoraPanel
          status={m.amora.status}
          ultima_acao={m.amora.ultima_acao}
          proxima_tarefa={m.amora.proxima_tarefa}
        />
        <VpsMonitor />
      </div>

      {/* Second Brain */}
      <SecondBrain ideias={m.second_brain} />
    </div>
  )
}
