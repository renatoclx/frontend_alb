# Stack Tecnológico — LocObra

Resumo das tecnologias usadas no projeto, para referência rápida (ex.:
divulgação em portfólio/LinkedIn).

**Sobre o projeto:** sistema de gestão para empresa de locação e venda de
equipamentos — cadastro de clientes, produtos e categorias, lançamento de
locações e vendas com controle de estoque, dashboard com indicadores do
negócio e geração de relatórios/recibos em PDF.

---

## Frontend

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design system próprio construído sobre os
  primitivos do **Radix UI** (dialog, dropdown, select, popover, tabs,
  checkbox, radio, switch) e `cmdk` (combobox de busca)
- **Recharts** — gráfico de receita do dashboard
- **@react-pdf/renderer** — geração de relatórios e recibos em PDF no
  navegador
- **class-variance-authority** + **tailwind-merge** — variantes de
  componente (`Button`, `Tag`, `Input`...) de forma tipada
- **Sonner** — notificações (toasts)
- **Lucide React** — ícones
- **ESLint** (`eslint-config-next`)

## Backend

- **NestJS** + **TypeScript** — arquitetura modular
  (Controller → Service → DTO), por entidade de domínio
- **Prisma ORM** + **PostgreSQL** (driver adapter `@prisma/adapter-pg`)
- **JWT** (`@nestjs/jwt` + `passport-jwt`) — autenticação stateless, guard
  global de rota
- **bcrypt** — hash de senha
- **class-validator** + **class-transformer** — validação e transformação
  de payload nos DTOs
- **Docker Compose** — banco de dados local

## Infraestrutura de desenvolvimento

- Monorepo simples: `frontend/` (Next.js) + `backend/` (NestJS), times
  desacoplados por contrato HTTP/JSON
- **Prettier + ESLint** nos dois projetos
- Variáveis de ambiente validadas na subida da aplicação (`class-validator`
  no backend)

---

## Destaques técnicos

- **Agregações no banco:** o dashboard (receita do mês, série dos últimos
  N dias, movimentações recentes, próximas devoluções) é resolvido
  inteiramente via SQL (`aggregate`, `$queryRaw` com `generate_series`),
  sem carregar registros para somar/contar em memória.
- **Transações atômicas:** lançar uma venda/locação decrementa o estoque
  dentro de uma `$transaction`, com checagem condicional
  (`quantity >= solicitado`) — nunca vende/aluga além do disponível, mesmo
  sob concorrência.
- **Preço snapshot:** o valor cobrado em cada item fica congelado no
  registro da venda/locação; alterar o preço do produto depois não afeta
  histórico.
- **Soft delete com exceções documentadas:** a maioria das entidades usa
  exclusão lógica (`deletedAt`); as exceções (ex.: categoria) são
  deliberadas e registradas em documentação própria.
- **Design system tipado:** componentes de UI construídos com variantes
  (`cva`) sobre primitivos acessíveis do Radix, documentado e consistente
  em toda a aplicação (grid de formulário, tamanhos, estados, cores).
- **Geração de PDF client-side:** relatórios e recibos são montados como
  componentes React e renderizados em PDF no próprio navegador, sem
  serviço externo.
