### Objetivo

Criar as telas correspondentes a cada entidades baseadas nas informações descritas em screen-patterns.md

# Cliente

## Listagem

### Colunas

- Nome
- E-mail
- Telefone
- Endereço
- Cidade

### Ações

- Visualizar
- Alterar
- Excluir

---

## Cadastro

### Campos

- Nome
- E-mail
- Telefone
- Documento (CPF/CNPJ)
- Data de Nascimento
- Endereço
- Cidade

### Regras específicas

- Data de Nascimento é opcional.
- E-mail é opcional.
- Cliente deve pertencer a uma cidade.
- O campo cidade será de busca, trazendo a cidade já cadastrada baseado na cidade informada
- Notificar o usuário caso não exista a cidade antes de terminar o cadastro

---

## Alteração

### Campos

- Nome
- E-mail
- Telefone
- Documento (CPF/CNPJ)
- Data de Nascimento
- Endereço
- Cidade

### Regras específicas

- Data de Nascimento é opcional.
- E-mail é opcional.
- Se houver troca de Endereço, confirmar se precisa alterar a cidade.

---

## Exclusão

- Não permitir hard delete de clientes com histórico.

---

# Categoria

## Listagem

### Colunas

- Nome
- Quantidade de produtos cadastrados

### Ações

- Excluir

---

## Cadastro

. Utilizar modal para esta entidade.

### Campos

- Nome

### Regras específicas

- Não permitir nomes iguais.

---

## Exclusão

- Não permitir exclusão de categoria com produtos cadastrados.
- O botão excluir deverá ficar desabilitado quando houver produtos cadastrados na categoria.

---
