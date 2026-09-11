# Dashboard

## Objetivo

O Dashboard é a tela inicial da aplicação.

Seu objetivo é apresentar um resumo rápido da situação atual da empresa, reunindo informações dos módulos de Locações e Vendas.

Nesta primeira versão (V1), o Dashboard deverá apresentar apenas os indicadores essenciais para o acompanhamento diário do negócio.

Novas métricas poderão ser adicionadas futuramente.

---

# Indicadores

## Receita do mês

Valor total faturado durante o mês atual, considerando:

- Locações
- Vendas

---

## Locações ativas

Quantidade de contratos atualmente em andamento.

---

## Vendas do mês

Quantidade de vendas realizadas durante o mês atual.

---

## Clientes ativos

Quantidade de clientes que:

- possuem uma locação ativa;

ou

- realizaram pelo menos uma compra durante o mês atual.

---

# Gráfico principal

Receita dos últimos 30 dias.

O gráfico deverá considerar:

- Locações
- Vendas

---

# Últimas movimentações

Apresentar uma única tabela contendo as movimentações mais recentes do sistema.

Cada registro deverá identificar seu tipo.

Colunas:

- Tipo (Locação ou Venda)
- Cliente
- Valor
- Data
- Status

---

# Próximas devoluções

Listar as devoluções previstas para os próximos dias.

As devoluções em atraso deverão aparecer primeiro.

---

# Estados vazios

Quando não existirem informações suficientes, apresentar mensagens amigáveis ao usuário.

---

# Carregamento

Utilizar Skeletons durante o carregamento dos dados.

---

# Dados

Todas as informações deverão ser carregadas através da API.

---

# Componentização

Criar componentes independentes para:

- DashboardCard
- RevenueChart
- RecentMovementsTable
- UpcomingReturnsCard
