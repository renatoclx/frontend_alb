### Objetivo

Criar as telas correspondentes a cada entidades baseadas nas informações
descritas em screen-patterns.md

# Autenticação

Layout compartilhado entre as telas abaixo — ver seção "Autenticação" em
`ui-guidelines.md` para o padrão visual (`AuthLayout`, split-screen).

## Login

### Campos

- E-mail
- Senha (com opção de mostrar/ocultar)

### Regras específicas

- Checkbox "Lembrar-me": presente na tela, mas sem efeito funcional por
  enquanto (sessão sempre persiste, como hoje).
- Link "Esqueci minha senha" leva para a tela de Recuperação de Senha.
- Sem login social (Google ou outro OAuth).
- Sem link de cadastro — não há fluxo de criação de conta pelo usuário.

---

## Recuperação de Senha

### Campos

- E-mail

### Regras específicas

- Não valida se o e-mail informado existe na base — isso fica para
  quando a API real existir.
- Após o envio, exibe sempre a mesma mensagem de confirmação (não revela
  se o e-mail está cadastrado), com opção de voltar para o Login.

---

# Produto

## Listagem

### Colunas

- Nome
- Referência
- Preço de Venda
- Preço de Locação
- Quantidade
- Categoria
- Status

### Ações

- Visualizar
- Alterar
- Excluir
- Reativar (esta opção só deverá aparecer caso o produto esteja inativo)

### Regras específicas

- Status será baseado pelo deletedAt da entidade, não é um campo propriamente dito.
- Se a quantidade estiver abaixo da quantidade mínima, exibir texto em vermelho.

---

## Cadastro

### Campos

- Nome
- Referência
- Descrição
- Preço de Compra
- Preço de Venda
- Preço de Locação
- Quantidade
- Quantidade mínima
- Categoria
- Tipo de produto

### Regras Específicas

- Apenas os campos Referência e Descrição são opcionais.
- Os campos de preço devem possuir padrão de máscara monetária e ícone de identificação.
- Os campos de quantidade e quantidade mínima devem ser numéricos.
- O código de referência não representa a identidade do produto.
- Categorias devem ser listadas em um selectbox populado com as categorias cadastradas.
- Preço de venda não pode ser menor do que o preço de compra.
- Quantidade não pode ser menor do que quantidade mínima.
- Não se pode cadastrar um produto com quantidades "zeradas".
- Tipo de produto deve ser um buttonGroup onde o usuário informará se o produto é para venda ou locação.
- Tipo de produto deve ser a primeira informação do formulário.

### Padrão de formulário

- O formulário deverá se dividir em duas colunas.
  - A primeira coluna contará apenas com Tipo de Produto e logo abaixo os preços.
  - A segunda coluna contará com o restante das informações do cadastro do produto.

---

---

# Cliente

## Listagem

### Colunas

- Nome
- E-mail
- Telefone
- Endereço
- Cidade
- Status

### Ações

- Visualizar
- Alterar
- Excluir
- Reativar (esta opção só deverá aparecer caso o cliente esteja inativo)

### Regras específicas

- Status será baseado pelo deletedAt da entidade, não é um campo propriamente dito.

---

## Cadastro

### Campos

- Nome
- E-mail
- Telefone
- Documento
- Data de Nascimento
- Endereço
- Cidade

### Regras específicas

- Adicionar máscara para telefone:
  . Até 10 dígitos, fixo (##) ####-####;
  . A partir do 11º dígito, celular (##) #####-####.
- Adicionar máscara para CPF e CNPJ:
  . CPF de 11 dígitos (###.###.###-##);
  . Caso o usuário digitar mais números, altera para máscara de CNPJ
  (##.###.###/####-##).
- Inserir o registro na base de dados sem a máscara (telefone e documento
  ficam só com os dígitos).
- Data de Nascimento é opcional.
- E-mail é opcional.
- Cliente deve pertencer a uma cidade.
- O campo cidade será de busca, trazendo a cidade já cadastrada baseado
  na cidade informada
- Notificar o usuário caso não exista a cidade antes de terminar o
  cadastro

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

- Adicionar máscara para telefone:
  . Até 10 dígitos, fixo (##) ####-####;
  . A partir do 11º dígito, celular (##) #####-####.
- Adicionar máscara para CPF e CNPJ:
  . CPF de 11 dígitos (###.###.###-##);
  . Caso o usuário digitar mais números, altera para máscara de CNPJ
  (##.###.###/####-##).
- Inserir o registro na base de dados sem a máscara (telefone e documento
  ficam só com os dígitos).
- Data de Nascimento não pode ser alterada após o cadastro (limitação da
  API); o campo aparece desabilitado na tela de Alteração.
- E-mail é opcional.
- Se houver troca de Endereço, confirmar se precisa alterar a cidade.
- Um cliente cadastrado já está com status ativado por estar com o
  deletedAt como null.

---

## Exclusão

- Não permitir hard delete de clientes com histórico.
- As opções "Excluir" e "Alterar" devem ficar desabilitadas quando o
  cliente já estiver removido (`deletedAt` diferente de `null`).

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
- O botão excluir deverá ficar desabilitado quando houver produtos
  cadastrados na categoria.

---

# Locação

## Listagem

### Filtros de pesquisa

- Nome do Cliente.
- Status da locação (ATIVA, DEVOLVIDA, EM ATRASO).
- Botão Realizar Locação.

### Campos

- Cliente.
- Cidade (que o cliente está vinculado).
- Data de Início.
- Data de Retorno.
- Status.
- Valor total.

### Ações

- Visualizar itens locados:
  - Dialog com as informações dos itens naquela locação (Nome, quantidade e valores).
  - Considere o modal-lg para exibir estas informações
- Realizar devolução.
- Dentro do kebab:
  - Imprimir Relatório de Locação;
  - Gerar Recibo para pagamento;

### Regras específicas

- A tag de status EM ATRASO deverá contar os dias juntamente com a tag (ex: EM ATRASO HÁ XX DIA(S)).
- A ação Visualizar itens locados deve ser a padrão na coluna Ações (outras opções ficam no dropdown).
- A ação Realizar devolução deve realizar justamente a devolução dos itens locados para o lançamento em específico.
- Ao clicar em Realizar devolução, um modal de confirmação deve surgir. Ao confirmar, o Status da locação deve ser alterado para DEVOLVIDA e o estoque reestabelecido.

---

## Lançar Locação

### Campos

- Campo Buscar Clientes, realizando filtragem e trazendo o cliente já cadastrado de acordo com os dados passados.
- Botão Confirmar para selecionar o cliente e iniciar o processo de lançamento de locação.
- Data de inicio da Locação.
- Data de Devolução.
- Campo Inserir item:
  - Este campo também será uma filtragem, que vai buscar os itens já cadastrados;
  - Campo Quantidade para informar a quantidade locada daquele item em específico;
  - Campo Preço Unitário;
  - Botões Limpar e inserir, para que o item buscado seja inserido;
  - Tabela para verificar os itens que estão sendo inseridos no lançamento da locação, contendo:
    - Nome do Equipamento;
    - Quantidade;
    - Valor unitário;
    - Valor total;
    - Botão para remover um produto inserido.
- Label informado o valor total da Locação realizada;
- Botão Realizar Locação;

### Regras específicas

- Ao abrir o Lançamento de locação, apenas o campo de Buscar cliente e as respectivas funçlões ficam habilitados, liberando as opções seguintes ao confirmar o cliente ao qual será realizada a locação.
- Informar caso o cliente não seja encontrado.
- No âmbito dos itens, o botão de Inserir fica desabilitado enquanto todos os campos de lançamento do item não forem preenchidos;
- O preço unitário deve vir já preenchido com a informação contida na base de dados do item em questão, podendo ser alterado pelo usuário.
- O valor do preço unitário não pode ser menor do que o preço cadastrado na base;
- Itens que estão com a quantidade abaixo da quantidade mínima não devem ser listados;
- A quantidade informada do item não pode ser maior do que a quantidade existente na base de dados;
- Caso a quantidade do item selecionado faça com que a quantidade mínima seja atingida, o usuário deve ser informado em um modal de confirmação, para que o seja validada a inserção.
- Ao clicar em inserir, um modal de confirmação deverá surgir para confirmar a inserção do item;
- O item deverá ser listado na tabela de Itens inseridos com as devidas informações.
- Ao clicar para remover o item da tabela, um modal de confirmação deverá ser utilizado para validação e caso a opção seja por remover, ele deve ser removido imediatamente da tabela.
- A label com o Total da Locação deverá ser contabilizada conforme a inserção/remoção de itens
- O botão Realizar Locação só deverá habilitado quando existir ao menos 01 item adicionado no lançamento.
- Ao clicar em Realizar locação, deverá aparecer um modal de confirmação com os equipamentos locados.
- Ao realizar a locação, o Relatório de Locação deve ser gerado, e o usuário redirecionado a listagem de locações.
- Campo data de devolução deve ser um Date e aparecer o calendário padrão.
- Validar se a data de devolução é menor que a data de início ao perder o foco do campo.
- Concentre as validações em toasters, pois o layout está sendo quebrado ao validar.

### Padrão de Formulário

- Na primeira linha do panel, Buscar cliente e Datas da locação ficam lado a lado.
- Itens de locação ficará centralizado, com a tabela podendo preencher o panel no eixo X.
- O scroll deve ser habilitado na tabela de Itens, para não gerar scroll no panel principal

---

## Relatório de Locação

- O Relatório deverá ser gerado em PDF em um modelo para impressão (A4).
- O Relatório se divirá em 03 pequenos painéis;
- Nestes painéis deverão conter:
  - Cabeçalho:
    - Título (Documento de Locação de Equipamentos).
    - Nome, Documento, Cidade, Telefone (Cliente);
    - Data de Início;
    - Data de Devolução;
  - Corpo do Relatório:
    - Nome do Item locado;
    - Quantidade;
    - Valor Unitário;
    - Valor total por item (Valor Unitário \* Quantidade);
      Rodapé:
    - Valor total da Locação (soma dos itens);
    - Campo para assinatura do cliente com seu respectivo nome alinhados ao centro, um abaixo do outro.
    - Ao final PDF, exibir data e horário de emissão do relatório, juntamente com o usuário que gerou.
    - Fixar o rodapé no final da "folha A4", deixando o espaço maior para os itens locados.

---

## Recibo de Pagamento

- O recibo deverá ser gerado em PDF em um modelo para impressão (A5).
- "Envolver" as informações com uma pequena borda com cantos arrendodados para melhor UX.
- Neste recibo deverá conter:
  - Nome, documento e cidade do cliente;
  - Valor total da locação centralizado no documento;
  - Campo para assinatura do recebedor nome alinhados ao centro, um abaixo do outro.
  - Data e horário de emissão;

---
