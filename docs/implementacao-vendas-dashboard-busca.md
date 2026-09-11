# Implementação: Vendas, Dashboard V1 e busca/paginação real

Registro consolidado de uma rodada de implementação (2026‑09‑10) que cobre
três frentes grandes — módulo de **Vendas**, **Dashboard V1** e a migração
de todas as listagens para **busca e paginação server‑side** — além de
correções pontuais de UI.

Backend: `alb_locacoes/backend` (NestJS + Prisma + PostgreSQL).
Frontend: `alb_locacoes/frontend` (Next.js App Router + Tailwind).

---

## 1. Módulo de Vendas

Espelho do módulo de Locação, porém mais simples (a API de vendas já
existia: `POST /sales`, `GET /sales`, `GET /sales/:id`).

### Diferenças em relação a Locação

| Aspecto | Locação | Venda |
| --- | --- | --- |
| Status | ATIVA / DEVOLVIDA / EM ATRASO | **não existe** |
| Datas | início + devolução + retorno | só **Data da Venda** (= `createdAt`) |
| Ação "Realizar devolução" | sim | **não existe** |
| Filtro na listagem | nome do cliente + status | nome do cliente **+ nome do produto** |
| Preço unitário no lançamento | doc dizia "editável" (API nunca suportou) | "desabilitado, informativo" — bate com a API |
| Produtos abaixo da qtd. mínima | escondidos da busca | **continuam listados** (a doc de Venda não os exclui) |

### Inconsistências doc × API (documentadas, sem ação)

- "Não considerar registros cancelados / excluídos logicamente": nem `Sale`
  nem `Rental` têm status de cancelamento ou `deletedAt` — regra é no‑op.
- `POST /sales` usa sempre `product.salePrice` e a data do servidor; não há
  campo para sobrescrever preço nem data.

### Arquivos

**Frontend — criados:** `types/venda.ts`, `services/vendas-service.ts`,
`app/(protected)/vendas/{page,nova/page}.tsx`,
`components/vendas/{relatorio-venda-pdf,recibo-pagamento-pdf}.tsx`.
**Frontend — alterados:** `components/layout/sidebar.tsx` (item "Vendas",
ícone `ShoppingCart`, entre Produtos e Locações).

---

## 2. Dashboard V1

Tela inicial com resumo do negócio (Locações + Vendas). Docs de origem:
`dashboard.md`, `dashboard-layout.md`, `dashboard-metrics.md`,
`dashboard-prompt.md`.

### Backend — novo módulo `modules/dashboard/`

Endpoints separados (um por seção). Todas as agregações são feitas no
banco (`aggregate` / `count` / `$queryRaw`).

| Endpoint | Retorno |
| --- | --- |
| `GET /dashboard/metrics` | `{ monthRevenue, activeRentals, monthSales, activeClients }` |
| `GET /dashboard/revenue?days=7\|30\|90` | `[{ date, rentals, sales, total }]` — 1 ponto por dia, zero‑fill |
| `GET /dashboard/recent-movements` | `[{ id, type, client, total, date, status }]` — 10 itens |
| `GET /dashboard/upcoming-returns` | `[{ id, client, expectedReturnDate, status, daysOverdue }]` — 10 itens |

- **Fuso horário:** as janelas de "mês" e "dia" são resolvidas no fuso da
  aplicação via `AT TIME ZONE` no SQL. Configurável por
  `APP_TIMEZONE` (default `America/Sao_Paulo`; o Brasil não tem horário de
  verão desde 2019). Validado em `config/env.validation.ts`.
- **Cache leve:** `getMetrics` guarda o resultado por 60 s em memória no
  service (sem dependência nova).
- **Status de venda** nas movimentações: `"CONCLUDED"` fixo.
- **"Locações ativas"** = `status = 'ACTIVE'` no banco (inclui as vencidas —
  "em andamento").
- Regra "ACTIVE vencida → DELAY" foi extraída para
  `common/helpers/rental-status.helper.ts` (`computeRentalStatus`) e é usada
  por `RentalService` **e** `DashboardService`.

### Frontend

- Dependência nova: **`recharts`** (`^3.10.1`, compatível com React 19).
- `app/(protected)/dashboard/page.tsx` — `"use client"`; cada seção carrega
  independente com seu próprio `Skeleton`; grid de cards 1/2/4 colunas
  (mobile/tablet/desktop).
- `components/dashboard/`: `dashboard-card.tsx`, `revenue-chart.tsx`
  (área empilhada Locações + Vendas, eixo Y compacto, tema via CSS vars),
  `recent-movements-table.tsx`, `upcoming-returns-card.tsx`.
- Filtro de período do gráfico (`ButtonGroup` "7d / 30d / 90d").
- `services/dashboard-service.ts`, `types/dashboard.ts`.

### Arquivos

**Backend — criados:** `modules/dashboard/{dashboard.module,dashboard.controller,dashboard.service}.ts`,
`modules/dashboard/entities/dashboard.entity.ts`,
`modules/dashboard/dto/revenue-query.dto.ts`,
`common/helpers/rental-status.helper.ts`.
**Backend — alterados:** `app.module.ts`, `config/env.validation.ts`,
`modules/rental/rental.service.ts`, `.env` / `.env.example`.

---

## 3. Busca e paginação real (todas as listagens)

Substitui o padrão temporário "buscar tudo, filtrar no cliente"
(`?limit=1000`) por busca e paginação server‑side.

### Backend

- Novo helper `common/helpers/search.helper.ts` — `containsInsensitive`
  (`{ contains, mode: 'insensitive' }` ou `undefined`).
- `?search=` (nome) adicionado ao `findAll` de `client`, `product`,
  `category`, `city`, `rental` (nome do cliente), `sale` (nome do cliente).
  Sempre opcional e aditivo — o mesmo `where` no `count`.
- **rental:** `?status=ativa|devolvida|atrasada` traduzido para `where`
  (`atrasada` = `ACTIVE` + `expectedReturnDate < now`). Resposta passa a
  incluir nome do cliente/cidade e nome de cada produto (`RENTAL_INCLUDE`).
- **sale:** `?search` (cliente) **+** `?productSearch` (produto, via
  `items.some.product.name`). Resposta enriquecida (`SALE_INCLUDE`).
- **product:** `?type=SALE|RENTAL` (usado nos lançamentos). Resposta inclui
  nome da categoria (`PRODUCT_INCLUDE`).
- **category:** `productsCount` via `_count` (conta todos os produtos —
  mesma base da regra que bloqueia a exclusão).
- **client:** resposta inclui nome da cidade (`CLIENT_INCLUDE`).
- Novos `*-query.dto.ts` por módulo.

### Frontend

- Novo hook `hooks/use-debounced-value.ts` (350 ms).
- 5 páginas de listagem migradas para server‑side (busca + paginação +
  filtros): `/clientes`, `/produtos`, `/categorias`, `/locacoes`,
  `/vendas`. `Pagination` passa a ler o `total` do backend; removidos os
  `.filter()` / `.slice()` locais. Recarga após mutação via `refreshKey`.
- Padrão do efeito de carga: flag `cancelled` + todos os `setState` dentro
  de `.then`/`.catch` (evita a regra `react-hooks/set-state-in-effect` e
  descarta respostas obsoletas).
- Lançamentos (`locacoes/nova`, `vendas/nova`): os comboboxes de cliente e
  item passam a buscar no servidor a cada digitação
  (`searchClientesParaLancamento`, `searchProdutosParaLancamento`), com
  guarda de corrida (`useRef` de sequência). Não carregam mais a lista
  inteira no mount.
- `cliente-form` (cidade): `searchCidades` agora usa `GET /cities?search`;
  o cache das 645 cidades foi removido.
- Nomes agora vêm da resposta da API: `locacoes-service` e
  `vendas-service` não chamam mais `listClientes` / `listProdutos`;
  `clientes-service.toCliente` lê `client.city.name` (não resolve mais
  `cityId → nome`).
- **Removidos:** `listClientes`, `listProdutos`, `findCidadeById`,
  `getAllCidades` (cache), e os `?limit=1000` de busca. Sobra só o de
  `GET /categories` no `listCategorias`, usado pelo *select* do formulário
  de produto — conjunto pequeno e controlado.

---

## 4. Correções de UI

- **`utils/pdf.ts`:** `downloadPdf` agora tipa o parâmetro como
  `ReactElement<DocumentProps>` — o `next build` estava quebrando nesse
  arquivo (o projeto rodava só com `next dev`).
- **Máscara nos relatórios:** documento e telefone do cliente passam por
  `maskDocumento` / `maskTelefone` nos 4 PDFs (Venda e Locação, relatório e
  recibo) — a API guarda só os dígitos.
- **`cursor: pointer` global:** regra em `@layer base` no `app/globals.css`
  (`button:not(:disabled)`, `[role="button"]`) — o Preflight do Tailwind v4
  deixou de aplicar isso. Documentado em `ui-guidelines.md` > Botões.
- **`Combobox` (`components/ui/combobox.tsx`):**
  - o botão "inserir item" ficava travado quando o usuário digitava o nome
    sem clicar no dropdown — agora texto que bate exatamente com uma opção
    conta como seleção;
  - `onBlur` (Tab / clique fora): completa o campo com o **primeiro
    resultado** da busca (ou o de nome exato). Vale para todos os
    comboboxes de filtragem (cliente, item, cidade).
- **`utils/locacao-status.ts`** (novo): `locacaoStatusLabel`,
  `locacaoStatusVariant`, `locacaoStatusFilterOptions` — antes duplicados
  entre `locacoes/page.tsx` e a tabela de movimentações do Dashboard.

---

## 5. Pendências / dívidas técnicas

- **`docs/implementacao-integracao-api.md`** — a seção "Pendências"
  descreve o padrão "buscar tudo" e diz que a API não tem busca por nome.
  **Obsoleto** depois desta rodada; precisa ser revisado.
- **Fuso horário do Dashboard:** se o servidor de produção não estiver em
  `America/Sao_Paulo` e `APP_TIMEZONE` não for setado, há risco de
  deslocamento na virada de dia/mês. Um `APP_TIMEZONE` inválido derruba os
  endpoints do Dashboard (falha explícita — é config de operação).
- **Recuperação de senha:** continua mockada em `services/auth-service.ts`.
- **`getProduto`** (tela de edição) ainda resolve o nome da categoria via
  `listCategorias()` — `GET /products/:id` não tem o `include`.

---

## 6. Como validar localmente

Não há suíte de testes automatizada. A validação foi feita com scripts de
integração (curl / Node contra a API) e Playwright dirigindo o app real:

- Backend: `npm run build` + subir numa porta alternativa e conferir os
  endpoints (`/dashboard/*`, `?search=`, `?status=`, `?type=`, `?days=`).
- Frontend: `npx tsc --noEmit`, `npm run build`, e navegar as telas
  logado (sessão em `localStorage`, chave `locobra:auth-session`).

Ao subir mudanças do backend, **reiniciar o processo** — `nest start` não
está em watch mode.
