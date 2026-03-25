---
name: Claude Code
description: Executa tarefas de programação, edição de arquivos e deploy via Claude Code CLI na VPS.
metadata:
  openclaw:
    emoji: "💻"
    category: "development"
---

# Claude Code — Skill de Programação

Você pode delegar tarefas de programação ao Claude Code (claude CLI) rodando na VPS.

## Quando usar

Use esta skill quando Michael pedir qualquer coisa relacionada a:
- Programação, criação ou edição de código
- Mudanças no dashboard Amora HQ (`/root/lawyer-mb`)
- Deploy, commits, configurações
- Análise de arquivos, bugs, melhorias de interface
- Qualquer tarefa técnica que requeira mexer em código

## Como invocar

Faça um POST HTTP para o bridge local:

```
POST http://localhost:3010/api/claude-task
Content-Type: application/json
x-bridge-secret: {{CLAUDE_BRIDGE_SECRET}}

{
  "task": "<descrição completa da tarefa em português>",
  "project": "/root/lawyer-mb"
}
```

## Formato da tarefa

Seja específica e completa. Inclua:
- O que deve ser feito
- Em qual arquivo/página (se souber)
- Como deve ficar o resultado

**Exemplos de bons prompts:**
- `"Adicione um gráfico de linha mostrando evolução de novos clientes por mês na página de Métricas (/metricas). Use dados mock por enquanto."`
- `"Crie uma nova seção 'Processos' no Mission Control mostrando uma tabela com número do processo, cliente e status. Dados mock."`
- `"Corrija o bug na página Multi-Agent onde os logs aparecem vazios quando o container Docker está offline — mostrar mensagem amigável em vez de tela em branco."`

## Após executar

1. Informe Michael do que foi feito (resumo em 2-3 linhas)
2. Diga que o build precisa ser atualizado na VPS:
   `pm2 restart lawyer-mb` (se for só reiniciar) ou
   `cd /root/lawyer-mb && git pull && npm run build && pm2 restart lawyer-mb` (se houver novos commits)
3. Mencione a URL para visualizar: http://100.78.232.120:3010

## Projetos disponíveis

| Projeto | Caminho | Descrição |
|---|---|---|
| `lawyer-mb` | `/root/lawyer-mb` | Dashboard Amora HQ (padrão) |

## Limitações

- Tarefas muito longas podem demorar até 8 minutos
- Claude Code não pode acessar a internet diretamente
- Para mudanças visuais, oriente Michael a acessar o dashboard após o deploy
