// src/lib/mock-data.ts

export const missionControlMock = {
  tarefas_hoje: 4,
  em_curso: 1,
  concluidas_semana: 7,
  alertas: 0,
  amora: {
    status: 'ativa' as const,
    ultima_acao: 'Respondeu lead Maria Silva via Telegram — há 12 min',
    proxima_tarefa: 'Revisar rascunho post LGPD às 14h',
  },
  second_brain: [
    'Post sobre reforma tributária pendente',
    'Lead Maria Silva aguarda retorno',
    'Gravar reels sobre LGPD',
  ],
}

export const multiAgentMock = {
  agentes: [
    { id: 1, nome: 'Amora', papel: 'CEO', status: 'ativa' as const, ultima_sessao: 'há 12 min', mensagens: 247 },
    { id: 2, nome: 'conteudo-mb', papel: 'Editor', status: 'inativo' as const, ultima_sessao: '—', mensagens: 0 },
    { id: 3, nome: 'leads-mb', papel: 'SDR', status: 'inativo' as const, ultima_sessao: '—', mensagens: 0 },
    { id: 4, nome: 'juridico-mb', papel: 'Jurídico', status: 'inativo' as const, ultima_sessao: '—', mensagens: 0 },
  ],
  sessoes_recentes: [
    { id: 1, resumo: 'Maria Silva — consulta sobre processo trabalhista', hora: '14:32', tokens: 1200 },
    { id: 2, resumo: 'Revisão post Instagram sobre reforma tributária', hora: '11:15', tokens: 800 },
    { id: 3, resumo: 'Lead João Costa — dúvida contrato de aluguel', hora: '09:48', tokens: 650 },
    { id: 4, resumo: 'Agendamento consulta Ana Pereira', hora: '09:20', tokens: 420 },
    { id: 5, resumo: 'Briefing semanal — prioridades escritório', hora: '08:00', tokens: 950 },
  ],
  custo_hoje: 0.04,
  logs: [
    '[09:20] amora › Sessão iniciada — lead João Costa',
    '[09:48] amora › Consulta encerrada — contrato aluguel',
    '[11:15] amora › Post Instagram revisado',
    '[14:32] amora › Novo lead recebido — Maria Silva',
    '[14:44] amora › Sessão ativa',
  ],
}

export const conteudoMock = {
  posts: [
    {
      id: 1,
      plataforma: 'Instagram',
      titulo: 'O que é Holding Familiar?',
      legenda: 'Sua família merece proteção patrimonial. Descubra como...',
      status: 'publicado' as const,
      data: '2026-03-22',
      metricas: { alcance: 1240, engajamento: 87, cliques: 34 },
    },
    {
      id: 2,
      plataforma: 'TikTok',
      titulo: 'LGPD para empresas — o básico',
      legenda: 'Você sabia que sua empresa pode estar em infração?',
      status: 'publicado' as const,
      data: '2026-03-20',
      metricas: { alcance: 3400, engajamento: 210, cliques: 90 },
    },
    {
      id: 3,
      plataforma: 'YouTube',
      titulo: 'Reforma Tributária 2026 — impactos',
      legenda: 'Análise completa das mudanças e o que muda para sua empresa.',
      status: 'publicado' as const,
      data: '2026-03-18',
      metricas: { alcance: 520, engajamento: 41, cliques: 22 },
    },
    {
      id: 4,
      plataforma: 'Instagram',
      titulo: 'Contrato de Trabalho — cuidados',
      legenda: 'Erros comuns que custam caro. Fique atento a...',
      status: 'agendado' as const,
      data: '2026-03-26',
      metricas: null,
    },
    {
      id: 5,
      plataforma: 'TikTok',
      titulo: 'Planejamento Sucessório',
      legenda: 'Por que você deve pensar nisso antes dos 40?',
      status: 'agendado' as const,
      data: '2026-03-28',
      metricas: null,
    },
    {
      id: 6,
      plataforma: 'Instagram',
      titulo: 'Direito do Consumidor — rascunho',
      legenda: 'Comprou online e arrependeu? Veja seus direitos...',
      status: 'rascunho' as const,
      data: null,
      metricas: null,
    },
    {
      id: 7,
      plataforma: 'YouTube',
      titulo: 'Abertura de empresa — passo a passo',
      legenda: 'Do CNPJ ao alvará em 5 passos práticos.',
      status: 'rascunho' as const,
      data: null,
      metricas: null,
    },
  ],
}

export const metricasMock = {
  social: {
    instagram_seguidores: 512,
    tiktok_seguidores: 340,
    youtube_inscritos: 87,
    engajamento_medio: 6.8,
    crescimento_30d: Array.from({ length: 30 }, (_, i) => ({
      dia: i + 1,
      instagram: 480 + Math.floor(i * 1.1 + Math.random() * 5),
      tiktok: 290 + Math.floor(i * 1.7 + Math.random() * 8),
    })),
  },
  leads: {
    captados_mes: 3,
    conversao_pct: 33,
    pipeline_valor: 4500,
    origem_top: 'Instagram',
    por_semana: [
      { semana: 'S1', leads: 0 },
      { semana: 'S2', leads: 1 },
      { semana: 'S3', leads: 1 },
      { semana: 'S4', leads: 1 },
    ],
    origem_pizza: [
      { name: 'Instagram', value: 2 },
      { name: 'Indicação', value: 1 },
    ],
  },
  trafego_pago: {
    meta_spend: 90,
    google_spend: 60,
    cpl: 50,
    roas: 1.8,
    budget_restante: 0,
  },
}
