'use client'
import { SectionHeader } from '@/components/TenacitOS'
import MetricBlock from '@/components/dashboard/MetricBlock'
import { metricasMock } from '@/lib/mock-data'
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const m = metricasMock
const GOLD = '#C9A84C'
const TEAL = '#38BDF8'
const TOOLTIP_STYLE = { background: '#0F2847', border: '1px solid rgba(201,168,76,0.2)', color: '#fff', fontSize: 12 }

export default function MetricasPage() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <SectionHeader label="Métricas" />
        <p style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>Performance do escritório</p>
      </div>

      {/* 3 KPI blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <MetricBlock title="📱 Social" rows={[
          { label: 'Instagram', value: m.social.instagram_seguidores.toLocaleString() + ' seg.' },
          { label: 'TikTok', value: m.social.tiktok_seguidores.toLocaleString() + ' seg.' },
          { label: 'YouTube', value: m.social.youtube_inscritos.toLocaleString() + ' inscritos' },
          { label: 'Engajamento médio', value: m.social.engajamento_medio + '%' },
        ]} />
        <MetricBlock title="🎯 Leads" rows={[
          { label: 'Captados no mês', value: m.leads.captados_mes },
          { label: 'Conversão', value: m.leads.conversao_pct + '%' },
          { label: 'Pipeline', value: 'R$' + m.leads.pipeline_valor.toLocaleString() },
          { label: 'Origem top', value: m.leads.origem_top },
        ]} />
        <MetricBlock title="💰 Tráfego Pago" rows={[
          { label: 'Meta Ads', value: 'R$' + m.trafego_pago.meta_spend },
          { label: 'Google Ads', value: 'R$' + m.trafego_pago.google_spend },
          { label: 'CPL', value: 'R$' + m.trafego_pago.cpl },
          { label: 'ROAS', value: m.trafego_pago.roas + 'x' },
        ]} />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Crescimento seguidores (30 dias)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={m.social.crescimento_30d}>
              <XAxis dataKey="dia" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Line type="monotone" dataKey="instagram" stroke={GOLD} dot={false} name="Instagram" />
              <Line type="monotone" dataKey="tiktok" stroke={TEAL} dot={false} name="TikTok" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Origem dos leads</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={m.leads.origem_pizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}>
                {m.leads.origem_pizza.map((_, i) => <Cell key={i} fill={i === 0 ? GOLD : TEAL} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart row 2 */}
      <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Leads por semana</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={m.leads.por_semana}>
            <XAxis dataKey="semana" tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="leads" fill={GOLD} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
