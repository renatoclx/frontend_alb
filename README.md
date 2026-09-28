# LocObra — Frontend

Frontend do **LocObra**, sistema de gestão para empresa de locação e venda
de equipamentos: cadastro de clientes, produtos e categorias, lançamento
de locações e vendas com controle de estoque, dashboard com indicadores do
negócio e geração de relatórios/recibos em PDF.

Consome a API em [`../backend`](../backend).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — design system próprio sobre os
  primitivos do [Radix UI](https://www.radix-ui.com) e [`cmdk`](https://cmdk.paco.me)
- [Recharts](https://recharts.org) — gráfico de receita do dashboard
- [`@react-pdf/renderer`](https://react-pdf.org) — relatórios e recibos em PDF
- [Sonner](https://sonner.emilkowal.ski) — notificações (toasts)

## Pré-requisitos

- Node.js 20+
- Backend rodando (veja [`../backend/README.md`](../backend/README.md)) — por padrão em `http://localhost:3333`

## Como rodar

```bash
npm run setup   # cria .env.local a partir de .env.example + npm install
npm run dev
```

(`npm run setup` é idempotente — não sobrescreve um `.env.local` já
existente. Equivalente manual: `cp .env.example .env.local && npm install`.)

Acesse [http://localhost:3000](http://localhost:3000). Não há cadastro de
usuário pela interface — o backend precisa já ter um usuário (veja
["Primeiro acesso"](../backend/README.md#primeiro-acesso) no README do
backend; `npm run setup` de lá já deixa um usuário padrão pronto).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run setup` | `.env.local` (se não existir) + `npm install` |
| `npm run dev` | Sobe o servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |

## Estrutura

```
app/            rotas (App Router) — (protected)/ exige sessão
components/     componentes de UI, por entidade + components/ui (design system)
services/       toda chamada HTTP fica aqui — nunca direto nos componentes
hooks/          hooks compartilhados (auth, debounce, toast, tema...)
types/          tipos de domínio
utils/          formatação, máscara, cliente HTTP, PDF
docs/           documentação do projeto (fonte da verdade para regras de UI/negócio)
```

## Autenticação

Sessão JWT guardada em `localStorage` (`locobra:auth-session`); token
expira em 1h e não há refresh — uma chamada autenticada que volte com 401
desloga e redireciona para `/login`.

## Documentação

A pasta [`docs/`](docs/) é a fonte da verdade do projeto — antes de
alterar uma tela ou regra, ela deve ser consultada. Destaques:

- `screens.md` / `screen-patterns.md` / `ui-guidelines.md` / `forms.md` —
  especificação de telas e padrões de UI
- `dashboard*.md` — especificação do Dashboard
- `frontend-architecture.md` / `frontend-rules.md` — convenções de código
- `implementacao-*.md` — registro técnico de cada rodada de implementação
- `stack-tecnologico.md` — resumo da stack usada no projeto
