# UI Guidelines

## Identidade

Nome da aplicação: **LocObra**.

## Objetivo

Construir uma interface limpa, moderna e minimalista.
Evitar excesso de cores e informações.

---

## Estilo

- A aplicação deve possuir dark-mode.
- A aplicação deve priorizar design minimalista.
- Espaçamento moderado entre elementos.
- Bordas arredondadas pequenas.
- Sombras discretas.
- Evitar excesso de bordas.

---

## Textos

### Geral

- Utilizar fonte Roboto para títulos e subtítulos.
- Utilizar fonte Inter para o restante dos textos.

- Utilizar text-xs para legendas e avisos pequenos (12px / 18px).
- Utilizar text-sm para menus, botões ou textos secundários (14px / 22px).
- Utilizar text-base para tamanho padrão do corpo de texto (16px / 24px).
- Utilizar text-lg para introduções ou destaques leves (18px / 26px).
- Utilizar text-xl para títulos menores ou subtítulos (20px / 28px).
- Utilizar text-2xl para títulos chamativos, cabeçalhos e seções de
  destaque (24px / 32px).
- Utilizar text-3xl para títulos de página em destaque (30px / 38px).

Escala de tamanho/altura de linha sincronizada com o Figma (TapTap Design
System). Fonte segue Inter/Roboto (não alterado pela sincronização).

### Datas

- Qualquer data exibida como texto na tela deve seguir o formato
  `dd/MM/yyyy` (`utils/date.ts`, `formatDate`).
- Isso vale só para exibição — campos de inserção (`<input type="date">`)
  continuam no formato nativo do navegador (ISO), sem alteração.

### Sidebar

- Utilizar fonte Roboto.
- Utilizar fonte bold.

### Tabelas

- Cabeçalho: text-xs font-semibold uppercase tracking-wider ou text-sm
  font-semibold.
- Células de Dados: text-sm.
- Destacar sutilmente o cabeçalho das células.
- Hover nas linhas.
- Container da tabela com cantos levemente arredondados (`rounded-sm`).

- Paginação na parte inferior, dividida em dois blocos na mesma linha:
  - Esquerda: contagem "X–Y de Z itens".
  - Direita: navegação com setas anterior/próxima + números de página,
    estilo flat (sem bordas).
- Sem indicador ou seletor de itens por página — a quantidade fica fixa
  em 8 por enquanto (ver abaixo).
- Página ativa usa a cor Primária (`bg-primary` + `text-primary-foreground`),
  mesmo padrão do item ativo do menu lateral.
- Exibir no máximo 8 registros por página.
- Quando o volume de dados for grande, utilizar abreviação na paginação
  com "..." (ex.: 1 2 3 4 5 ... 50), sempre exibindo a primeira e a
  última página.
- Campo de ir direto para uma página específica não foi adotado.

---

## Cores

Paleta sincronizada com o Figma (TapTap Design System). Ver
`docs/figma-sync.md` para o registro completo da extração.

### Textos

| Token      | Light                 | Dark                  |
| ---------- | --------------------- | --------------------- |
| Principal  | Neutral 700 `#1F1F1F` | white `#FFFFFF`       |
| Secundário | Neutral 600 `#4B4B4B` | Neutral 400 `#CACACA` |

### Tabelas

| Token     | Light                 | Dark                  |
| --------- | --------------------- | --------------------- |
| Cabeçalho | Neutral 700 `#1F1F1F` | white `#FFFFFF`       |
| Células   | Neutral 600 `#4B4B4B` | Neutral 400 `#CACACA` |

### Fundo e Superfície

| Token      | Light                 | Dark                  |
| ---------- | --------------------- | --------------------- |
| Fundo      | Neutral 100 `#F5F5F5` | black `#000000`       |
| Superfície | Neutral 50 `#FAFAFA`  | Neutral 700 `#1F1F1F` |

### Padrão da Aplicação

Base no light = shade 600 da escala; base no dark = shade 500.
Hover/pressed dos botões usam a mesma escala (ver seção Botões).

| Token      | Light                   | Dark                    |
| ---------- | ----------------------- | ----------------------- |
| Primária   | blue-600 `#2563EB`      | blue-500 `#3B82F6`      |
| Secundária | Auxiliary 600 `#FF8156` | Auxiliary 500 `#FFA487` |
| Sucesso    | Success 600 `#47B881`   | Success 500 `#6BC497`   |
| Erro       | Danger 600 `#F64C4C`    | Danger 500 `#EB6F70`    |
| Alerta     | Warning 600 `#FFAD0D`   | Warning 500 `#FFC62B`   |
| Informação | Primary 600 `#15C5CE`   | Primary 500 `#47CFD6`   |

**Exceções:**

- A Primária do Figma (escala `Primary`, teal `#15C5CE`) foi descartada por
  decisão explícita — contraste muito alto tanto no light quanto no dark mode.
  Mantido o azul (`blue-600`/`blue-500`) que já era usado antes da sincronização
  com o Figma, com hover (`blue-500`/`blue-400`) e pressed (`blue-700`/`blue-600`)
  seguindo a mesma lógica de shades das demais cores.
- Como a Primária virou azul, a escala `Infor` (azul) do Figma ficou parecida
  demais com ela. A escala `Primary` (teal), sem uso depois dessa troca, foi
  realocada para o token de Informação — mantém as duas cores visualmente
  distintas e ainda aproveita uma escala já extraída do Figma.

---

## Botões

### Geral

- Utilizar fundo sólido.
- Utilizar cores do texto de acordo com o padrão.
- Utilizar rounded-sm para bordas arredondadas (4px — confirmado contra o
  Figma, sem alteração).
- Utilizar Hover nas linhas.
- Todo botão da aplicação usa `cursor: pointer` — regra global em
  `app/globals.css` (o Preflight do Tailwind v4 não aplica mais isso).
  Botões desabilitados mantêm `cursor-not-allowed` (definido nos
  componentes `Button`/`IconButton`).
- Não utilizar cores nas bordas.

### Tamanhos e Estados (referência Figma)

O `Button` possui prop `size` (`lg` padrão, `md`, `sm`) e prop `variant`
(`primary`, `secondary`, `ghost`, `link`, `danger`), com cores de hover/pressed
extraídas do Figma usando a mesma escala de 50–700 documentada em Cores (ex.:
Primária usa 600 no estado padrão, 500 no hover, 700 no pressed).

| Size          | Altura      | Fonte   |
| ------------- | ----------- | ------- |
| `lg` (padrão) | 40px (h-10) | text-sm |
| `md`          | 36px (h-9)  | text-sm |
| `sm`          | 24px (h-6)  | text-xs |

- `primary` / `danger`: fundo sólido, cor muda por estado (default/hover/pressed).
- `secondary`: outline neutro por padrão; borda e texto migram para a cor
  primária no hover/pressed (padrão "Outline" do Figma).
- `ghost`: sem fundo/borda; preenchimento sutil no hover/pressed.
- `link`: sem fundo/borda, apenas texto na cor primária.
- Estado disabled usa opacidade reduzida (`disabled:opacity-50`), que
  aproxima visualmente o tom pastel (shade 300) do Figma sem precisar de um
  token de cor dedicado.

### Botões da coluna Ações das tabelas

- Os botões da coluna Ações são ícone-only, formato circular (`IconButton`,
  variant `default`), em estilo neutro — não há mais cor por ação
  (Visualizar/Alterar/Excluir deixaram de ter cores distintas nessa coluna).
- Quando a entidade possui múltiplas ações: a ação "Alterar" fica destacada
  como ícone isolado; as demais ações ficam agrupadas num menu acionado por
  um ícone de kebab (`MoreVertical`), usando o componente `DropdownMenu`.
- Quando a entidade possui apenas uma ação, ela aparece sozinha na coluna, no
  mesmo estilo neutro, sem menu.

### Ícones

- O uso de ícones dentro dos botões é permitido.
- Utilizar ícones à esquerda do texto.

---

## Sidebar

- Iniciar a sidebar fechada como padrão.
- Utilizar uma largura de w-18 na sidebar fechada.
- Deslizar suave a sidebar quando abrir e/ou fechar o componente.
- Utilizar Neutral 100 (`#F5F5F5`) para light-mode e Neutral 700 (`#1F1F1F`)
  para dark-mode.

## Inputs

- Todos possuem label.
- Placeholder discreto.
- Mensagens de erro abaixo do campo.
- Mesmo espaçamento entre campos.
- Campo obrigatório: prop `required` marca a label com um asterisco
  vermelho automaticamente (`Input`, `Textarea`, `Select`, `Combobox`).
- Campos podem ter um ícone à esquerda (`startAdornment`, ex.: lupa de
  busca) e/ou à direita (`endAdornment`, ex.: alternar visibilidade da
  senha).
- Prop `clearable`: mostra um "x" para limpar o campo quando há valor
  (requer `onClear`); não é usado junto com `endAdornment` customizado.
- Prop `size` (`lg` padrão fora de formulários, `md`, `sm`) — mesma
  escala do `Button`/`Tag` (40/36/24px). O `lg` mantém `text-sm`, não
  `text-base`, mesma exceção já decidida no `Button`.
- Tamanho `xl` (48px): altura obrigatória de todo campo **dentro de um
  formulário** (`Input`, `Textarea`, `Select`, `Combobox`, `Cascader`)
  e dos botões do rodapé do formulário (`Button` também ganhou `xl`) —
  regra vem de `docs/forms.md`. Fora de formulários (busca em listagem,
  botões de página, etc.) os tamanhos `lg`/`md`/`sm` continuam os
  mesmos de sempre.

## Checkbox

- Estados: normal, hover, marcado, indeterminado, desabilitado.
- Cor de "marcado" é a Primária (a imagem de referência usava um
  teal/ciano — mapeado para o nosso padrão, sem paleta própria).
- Label opcional, com 8px de espaçamento em relação à caixa.
- Tamanho único (a referência não define variação de tamanho).

## Radio

- Mesmo padrão visual do Checkbox (círculo em vez de quadrado, ponto
  preenchido na cor Primária quando marcado), mesmo espaçamento de
  label (8px).
- `RadioGroup` agrupa as opções por `name`, com `value`/`onChange`
  únicos — usar sempre que houver mais de uma opção mutuamente
  exclusiva.

## Switch

- Trilho de 20px de altura, thumb com 2px de inset (medidas exatas da
  referência). Cor "ligado" é a Primária.
- Variante opcional com texto "ON"/"OFF" dentro do trilho.
- Tamanho único.

## Textarea

- Mesma escala de tamanho do Input (`lg`/`md`/`sm`).
- Contador de caracteres opcional (`showCount` + `maxLength`, formato
  "6/1000").
- Redimensionável verticalmente (resize nativo do navegador).

## Select

- Mesma escala de tamanho do Input. Diferente do `Combobox` (que já
  existe e é buscável): o `Select` tem lista fixa de opções, sem busca.
- Largura mínima do painel = 2× a altura do campo (regra explícita da
  imagem de referência).
- Painel de opções via portal, mesmo mecanismo de posicionamento do
  `DropdownMenu` (fecha ao rolar/redimensionar em vez de reposicionar,
  evita o bug de scroll preso já corrigido lá).

## Cascader

- Seleção em níveis (colunas progressivas), cada clique num item com
  filhos revela a próxima coluna; clicar numa folha seleciona o
  caminho inteiro e fecha.
- Gatilho mostra o caminho selecionado separado por "/".
- Sem caso de uso real no app hoje (nenhuma entidade tem dado
  hierárquico) — componente pronto para quando for necessário.
- Interação simplificada em relação à referência (clique a clique, sem
  busca nem hover-cascade) — suficiente para o padrão visual, sem a
  complexidade extra de um componente que ainda não está em uso.

## Tabs

- Tamanhos `default` e `sm`. Indicador da aba ativa: sublinhado sólido
  na cor Primária (a imagem de referência usa um gradiente
  rosa/roxo — mapeado para o nosso padrão).
- Suporta alinhamento `left`/`center` e variante com borda inferior
  contínua (`bordered`).

## Autenticação

Telas de Login e Recuperação de Senha usam um layout compartilhado
(`AuthLayout`, split-screen), baseado em imagem de referência:

- Painel esquerdo (some no mobile): gradiente fixo nos tokens `--primary` /
  `--primary-pressed` (não muda com o tema — é uma peça de marca, como no
  layout de referência), com eyebrow + título + descrição curta.
- Painel direito: wordmark "LocObra" + formulário, usando os tokens de
  fundo/texto padrão (`bg-surface`, `text-foreground`), respeitando
  light/dark mode normalmente.
- Sem login social (Google ou outro OAuth) e sem link de cadastro — não há
  fluxo de cadastro público no app.
- Checkbox "Lembrar-me" no Login é apenas visual por enquanto (sem lógica de
  sessão temporária vs. persistente) — fica para quando a API real de
  autenticação for integrada.
- Recuperação de senha não valida se o e-mail existe na base (fica para o
  backend real); a tela sempre mostra a mesma mensagem de confirmação.

## Modais

Baseado em imagem de referência (spec de espaçamento com 3 tamanhos).

- Sem borda visível — o card usa `bg-surface` (contraste suficiente com o
  fundo esmaecido atrás, inclusive no dark mode) e só sombra (`shadow-sm`)
  para se destacar, sem `border`.
- Padding interno único de 24px (`p-6`) e espaçamento de 16px (`gap-4`)
  entre cabeçalho, conteúdo e rodapé — sem linhas divisórias entre essas
  seções (menos bordas, mais espaço em branco).
- Cabeçalho: título + botão de fechar (`X`) na mesma linha.
- Rodapé: botões alinhados à direita, reaproveitando o `Button` já
  existente — Cancelar em `secondary`, ação de confirmação em `primary`
  (ou `danger` quando for uma exclusão). A cor sólida do botão de
  confirmação na imagem de referência foi mapeada para a nossa Primária,
  não uma cor nova — os modais não têm paleta própria.
- Transição de abertura: fundo esmaecido com fade (`animate-modal-backdrop`,
  150ms) e o card com fade + leve escala/deslocamento vertical
  (`animate-modal-panel`, 180ms) — só ao abrir, sem animação de saída.

### Tamanhos

| Tamanho | Largura máxima |
| ------- | --------------- |
| `sm`    | 400px           |
| `md` (padrão) | 600px     |
| `lg`    | 800px           |

- `sm`: confirmações simples e formulários curtos (ex.: excluir, criar
  categoria).
- `md`: conteúdo moderado, como visualização de um registro com vários
  campos.
- `lg`: reservado para conteúdo mais denso (ainda sem uso no app).

## Tags

- Serão basicamente usadas para informar o status de uma entidade.
- Cores suportadas: Sucesso, Erro, Alerta, Informação (tokens já definidos
  em Cores).
- As cores de fundo e texto deverão seguir um contraste dentro da mesma cor
  (fundo em tom claro/pastel, texto em tom mais forte da mesma cor).
- Dark-mode: usar fundo translúcido/escurecido da cor (baixa opacidade sobre
  a superfície escura) com texto em um tom mais claro da mesma cor, mantendo
  contraste adequado sem estourar saturação.
- O texto deverá estar em caixa alta e padrão bold para melhor visualização.
- Não há necessidade de usar ícone dentro das tags.

### Tamanhos

| Tamanho | Altura      | Padding (V / H) | Fonte     |
| ------- | ----------- | ---------------- | --------- |
| Large   | 40px (h-10) | 8px / 24px        | text-base |
| Medium  | 36px (h-9)  | 4px / 12px        | text-sm   |
| Small   | 24px (h-6)  | 4px / 12px        | text-xs   |

---

## Responsividade

Mobile First.

Sidebar recolhível.

Menu hambúrguer no mobile.

---

## Componentes

Sempre reutilizar componentes existentes antes de criar novos.

- Button
- Input
- Textarea
- Checkbox
- Radio / RadioGroup
- Switch
- Select
- Combobox
- Cascader
- Tabs
- Modal
- Card
- Table
- Tag
- DropdownMenu
- Pagination
- Toast
- Skeleton

## Notificações e loadings

- Toast utiliza o [sonner](https://sonner.emilkowal.ski/) como base
  (decisão revertida — adoção do padrão shadcn/ui). A lógica de
  posicionamento responsivo e empilhamento de notificações passa a ser da
  lib; o projeto mantém a customização visual (cores/variantes success,
  error, warning) para seguir a paleta sincronizada do Figma.
- A API de uso permanece um hook/context simples (`notify(variant,
  message)`) por cima do `sonner`, para não exigir mudança nas telas que já
  consomem `ToastContext`.
- Não utilizar biblioteca externa para skeletons; construir o componente
  `Skeleton` com Tailwind (`animate-pulse`), seguindo o mesmo padrão dos
  demais componentes de `components/ui`.
