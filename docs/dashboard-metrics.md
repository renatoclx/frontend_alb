# Métricas do Dashboard

## Objetivo

Definir como cada indicador deverá ser calculado.

---

# Receita do mês

Somar:

- todas as locações do mês;
- todas as vendas do mês.

Não considerar:

- registros cancelados;
- registros excluídos logicamente.

---

# Locações ativas

Quantidade de locações com status "Ativa".

---

# Vendas do mês

Quantidade de vendas realizadas durante o mês atual.

---

# Clientes ativos

Contar clientes distintos que:

- possuem locação ativa;

ou

- realizaram pelo menos uma venda no mês.

Cada cliente deverá ser contabilizado apenas uma vez.

---

# Receita últimos 30 dias

Agrupar por dia.

Somar:

- receitas de locações;
- receitas de vendas.

Dias sem movimentação deverão possuir valor zero.

---

# Últimas movimentações

Exibir os registros mais recentes considerando:

- Locações;
- Vendas.

Ordenar da mais recente para a mais antiga.

Quantidade sugerida:

10 registros.

---

# Próximas devoluções

Ordenação:

1. Em atraso.
2. Hoje.
3. Próximas datas.

Quantidade sugerida:

10 registros.

---

# Performance

Sempre utilizar agregações diretamente no banco de dados.

Evitar carregar registros completos quando apenas contagens e somatórios forem necessários.
