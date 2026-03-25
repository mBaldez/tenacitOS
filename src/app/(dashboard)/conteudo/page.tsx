'use client'
import { useState } from 'react'
import { SectionHeader } from '@/components/TenacitOS'
import PostCard from '@/components/dashboard/PostCard'
import { conteudoMock } from '@/lib/mock-data'

type Tab = 'calendario' | 'publicados' | 'agendados' | 'rascunhos'

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const CALENDARIO_MOCK = [
  { dia: 'Qua', post: 'Contrato de Trabalho — cuidados', plataforma: 'Instagram' },
  { dia: 'Sex', post: 'Planejamento Sucessório', plataforma: 'TikTok' },
]

export default function ConteudoPage() {
  const [tab, setTab] = useState<Tab>('calendario')

  const posts = conteudoMock.posts.filter((p) => {
    if (tab === 'publicados') return p.status === 'publicado'
    if (tab === 'agendados') return p.status === 'agendado'
    if (tab === 'rascunhos') return p.status === 'rascunho'
    return false
  })

  const tabLabels: Record<Tab, string> = {
    calendario: '📅 Calendário',
    publicados: 'Publicados',
    agendados: 'Agendados',
    rascunhos: 'Rascunhos',
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <SectionHeader label="Conteúdo" />
        <p style={{ marginTop: 4, fontSize: 13, color: 'var(--text-secondary)' }}>Gestão editorial</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(Object.keys(tabLabels) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              cursor: 'pointer',
              border: tab === t ? 'none' : '1px solid var(--border)',
              backgroundColor: tab === t ? '#C9A84C' : 'var(--surface)',
              color: tab === t ? '#0B1F3A' : 'var(--text-secondary)',
              fontWeight: tab === t ? 600 : 400,
              transition: 'all 150ms ease',
            }}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Calendário */}
      {tab === 'calendario' && (
        <div style={{ borderRadius: 12, padding: 20, backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Semana atual</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {DIAS_SEMANA.map((dia) => {
              const evento = CALENDARIO_MOCK.find((e) => e.dia === dia)
              return (
                <div
                  key={dia}
                  style={{
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 80,
                    border: evento ? '1px solid rgba(201,168,76,0.3)' : '1px solid var(--border)',
                    backgroundColor: evento ? 'rgba(201,168,76,0.08)' : 'var(--bg)',
                  }}
                >
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>{dia}</p>
                  {evento && <p style={{ fontSize: 11, color: 'var(--text-primary)', lineHeight: 1.4 }}>{evento.post}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Post grid */}
      {tab !== 'calendario' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
          {posts.length === 0 && <p style={{ color: 'var(--text-secondary)', gridColumn: '1/-1' }}>Nenhum post nesta aba.</p>}
        </div>
      )}
    </div>
  )
}
