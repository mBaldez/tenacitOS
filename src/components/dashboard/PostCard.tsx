const STATUS_LABEL = {
  publicado: { label: '✅ Publicado', color: '#32D74B' },
  agendado: { label: '⏳ Agendado', color: '#FFD60A' },
  rascunho: { label: '📝 Rascunho', color: '#8A8A8A' },
}

const PLATAFORMA_ICON: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  YouTube: '▶️',
}

interface Post {
  id: number
  plataforma: string
  titulo: string
  legenda: string
  status: 'publicado' | 'agendado' | 'rascunho'
  data: string | null
  metricas: { alcance: number; engajamento: number; cliques: number } | null
}

export default function PostCard({ post }: { post: Post }) {
  const statusInfo = STATUS_LABEL[post.status]
  return (
    <div style={{ borderRadius: 12, padding: 16, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{PLATAFORMA_ICON[post.plataforma] ?? '📄'}</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13 }}>{post.titulo}</span>
        </div>
        <span style={{ fontSize: 12, color: statusInfo.color, flexShrink: 0 }}>{statusInfo.label}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.legenda}
      </p>
      {post.data && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{post.data}</p>}
      {post.metricas && (
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>👁 {post.metricas.alcance.toLocaleString()}</span>
          <span style={{ color: 'var(--text-secondary)' }}>❤️ {post.metricas.engajamento}</span>
          <span style={{ color: 'var(--text-secondary)' }}>🔗 {post.metricas.cliques}</span>
        </div>
      )}
    </div>
  )
}
