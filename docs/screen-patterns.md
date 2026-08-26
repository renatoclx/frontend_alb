# Padrões de Telas

### Objetivo

Definir os padrões visuais e comportamentais das telas da aplicação.
Todas as implementações de interface deverão seguir estes padrões, salvo
quando a documentação da entidade definir comportamento diferente.
Em caso de conflito entre este documento e a documentação de uma entidade
específica, prevalece a documentação da entidade.

## Telas de listagem

- Título
- Campo de pesquisa com atualização da listagem durante a digitação.
- Botão Novo relacionado a entidade.
- Exibição de tabela com itens já registrados.
- Paginação.
- Toda entidade deverá possuir uma opção de acesso no menu lateral
  acompanhada de um ícone representativo.

---

## Feedback visual

- As notificações devem aparecer no rodapé centralizado em dispositivos
  móveis.
- Em telas maiores, as notificações devem aparecer no canto superior
  direito.
- As notificações de erro em campos obrigatórios devem aparecer abaixo do
  campo correspondente.
- Ao executar uma requisição, sempre notificar o usuário.

## Loading

- Utilizar skeletons durante o carregamento inicial das páginas.
- Utilizar loaders dentro dos botões de ação para melhor experiência de
  usuário.

---

## Tabelas

- Os itens exibidos em cada tabela serão descritos por entidade e
  deverão ser respeitados.
- Todas as tabelas deverão contar com uma coluna chamada "Ação", situada
  sempre na última coluna.
- Nesta coluna deverá ter os botões para interação com o item da tabela
  em questão.
- Os nomes das colunas deverão permanecer consistentes entre todas as
  telas.
- A ordem dos botões deverá permanecer consistente em todas as
  entidades.

---

## Coluna Ações

- Botões com ações exclusivas e/ou adicionais serão informados nas
  entidades relacionadas.
- Botões que não deverão estar presentes em entidades específicas serão
  informados nas entidades relacionadas.
- Botões padrão:
  - Visualizar
  - Alterar
  - Excluir
- A ordem deverá ser mantida em todas as entidades.
- Quando a entidade possuir mais de uma ação: a ação "Alterar" fica destacada
  como ícone próprio na coluna; as demais ações (Visualizar, Excluir, etc.)
  ficam agrupadas em um menu acionado por um ícone de kebab ("⋮"), mantendo a
  ordem padrão entre si.
- Quando a entidade possuir apenas uma ação (ex.: Excluir em Categoria), essa
  ação aparece sozinha na coluna, sem menu.
- Todos os botões da coluna Ações (destacado, kebab e ação única) usam estilo
  neutro (ícone-only, sem cor por ação) — não há mais distinção de cor entre
  Visualizar/Alterar/Excluir nessa coluna.

---

## Formulários

O padrão completo de formulários (grid de 12 colunas, larguras por tipo
de campo, altura de 48px dos componentes, espaçamentos, labels,
obrigatoriedade, estados, mensagens de erro, agrupamento) está em
`docs/forms.md` — essa é a fonte da verdade, pra não duplicar/discordar
daqui. Resumo rápido:

- Checkbox/Radio/Switch usam os componentes `Checkbox`/`RadioGroup`/
  `Switch` (ver `ui-guidelines.md`), nunca input nativo.
- Rodapé com os botões alinhados à direita: "Cancelar" e a ação
  principal — mesmo padrão já usado em todos os formulários/modais do
  app.

---

## Telas de Cadastros

Todas as telas de cadastro deverão possuir:

- Título.
- Botão Salvar.
- Validação dos campos obrigatórios.
- Exibir feedback de sucesso ou erro após a operação.

---

## Telas de Alteração

Todas as telas de alteração deverão possuir:

- Layout baseado na tela de cadastro.
- Título.
- Botão Salvar.
- Validação dos campos obrigatórios.
- Exibir feedback de sucesso ou erro após a operação.

---

## Modal de visualização

Ao solicitar uma visualização:

- Abrir modal de visualização.
- Exibirá as informações da entidade e do item selecionado.
- Botão Fechar para encerrar a visualização.

---

## Modal de Exclusão

Ao solicitar uma exclusão:

- Abrir modal de confirmação.
- Exibir claramente qual registro será removido.
- Exibir mensagem de exclusão com o nome da entidade.
- Permitir cancelar.
- Executar a operação somente após confirmação.

## Responsividade

- Padrão a ser definido e implementado em etapa futura.
