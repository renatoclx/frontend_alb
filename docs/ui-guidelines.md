# UI Guidelines

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
- Utilizar text-2xl para títulos chamativos, cabeçalhos e seções de destaque (24px / 32px).
- Utilizar text-3xl para títulos de página em destaque (30px / 38px).

Escala de tamanho/altura de linha sincronizada com o Figma (TapTap Design System). Fonte segue Inter/Roboto (não alterado pela sincronização).

### Sidebar

- Utilizar fonte Roboto.
- Utilizar fonte bold.

### Tabelas

- Cabeçalho: text-xs font-semibold uppercase tracking-wider ou text-sm font-semibold.
- Células de Dados: text-sm.
- Destacar sutilmente o cabeçalho das células.
- Hover nas linhas.

- Paginação na parte inferior.
- Utilizar a paginação sempre a direita da tabela.
- Exibir no máximo 13 registros por página.
- Quando a volume de dados for grande, utilizar abreviação na paginação (Ex: 1,2...40).

---

## Cores

Paleta sincronizada com o Figma (TapTap Design System). Ver `docs/figma-sync.md` para o registro completo da extração.

### Textos

| Token      | Light            | Dark             |
| ---------- | ---------------- | ---------------- |
| Principal  | Neutral 700 `#1F1F1F` | white `#FFFFFF` |
| Secundário | Neutral 600 `#4B4B4B` | Neutral 400 `#CACACA` |

### Tabelas

| Token     | Light            | Dark             |
| --------- | ---------------- | ---------------- |
| Cabeçalho | Neutral 700 `#1F1F1F` | white `#FFFFFF` |
| Células   | Neutral 600 `#4B4B4B` | Neutral 400 `#CACACA` |

### Fundo e Superfície

| Token      | Light                  | Dark                   |
| ---------- | ---------------------- | ----------------------- |
| Fundo      | Neutral 100 `#F5F5F5`  | black `#000000`         |
| Superfície | Neutral 50 `#FAFAFA`   | Neutral 700 `#1F1F1F`   |

### Padrão da Aplicação

Base no light = shade 600 da escala; base no dark = shade 500. Hover/pressed dos botões usam a mesma escala (ver seção Botões).

| Token      | Light                     | Dark                       |
| ---------- | -------------------------- | --------------------------- |
| Primária   | blue-600 `#2563EB`         | blue-500 `#3B82F6`          |
| Secundária | Auxiliary 600 `#FF8156`    | Auxiliary 500 `#FFA487`     |
| Sucesso    | Success 600 `#47B881`      | Success 500 `#6BC497`       |
| Erro       | Danger 600 `#F64C4C`       | Danger 500 `#EB6F70`        |
| Alerta     | Warning 600 `#FFAD0D`      | Warning 500 `#FFC62B`       |
| Informação | Primary 600 `#15C5CE`      | Primary 500 `#47CFD6`       |

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
- Utilizar rounded-sm para bordas arredondadas (4px — confirmado contra o Figma, sem alteração).
- Utilizar Hover nas linhas.
- Mudar o cursor conforme a ação do botão.
- Não utilizar cores nas bordas.

### Tamanhos e Estados (referência Figma)

O `Button` possui prop `size` (`lg` padrão, `md`, `sm`) e prop `variant`
(`primary`, `secondary`, `ghost`, `link`, `danger`), com cores de hover/pressed
extraídas do Figma usando a mesma escala de 50–700 documentada em Cores (ex.:
Primária usa 600 no estado padrão, 500 no hover, 700 no pressed).

| Size | Altura | Fonte |
| --- | --- | --- |
| `lg` (padrão) | 40px (h-10) | text-sm (o Figma indica text-base, mas foi mantido text-sm por preferência visual) |
| `md` | 36px (h-9) | text-sm |
| `sm` | 24px (h-6) | text-xs |

- `primary` / `danger`: fundo sólido, cor muda por estado (default/hover/pressed).
- `secondary`: outline neutro por padrão; borda e texto migram para a cor
  primária no hover/pressed (padrão "Outline" do Figma).
- `ghost`: sem fundo/borda; preenchimento sutil no hover/pressed.
- `link`: sem fundo/borda, apenas texto na cor primária.
- Estado disabled usa opacidade reduzida (`disabled:opacity-50`), que
  aproxima visualmente o tom pastel (shade 300) do Figma sem precisar de um
  token de cor dedicado.

### Botões da coluna Ações das tabelas

Exceção à regra "Não utilizar cores nas bordas": os botões de ação das tabelas
são ícone-only e usam borda colorida (outline) para indicar a ação, já que não
possuem texto visível.

- Utilizar padrão outline (ícone-only), formato circular (`rounded-full`,
  alinhado ao IconButton do Figma), juntamente com as cores correspondentes:
  - Visualizar - Primário.
  - Alterar - alerta.
  - Excluir - Erro.
- Os botões que entraram na coluna de acordo com as entidades terão cores diferentes (não aplicaveis agora).

### Ícones

- O uso de ícones dentro dos botões é permitido.
- Utilizar ícones à esquerda do texto.

---

## Sidebar

- Iniciar a sidebar fechada como padrão.
- Utilizar uma largura de w-18 na sidebar fechada.
- Deslizar suave a sidebar quando abrir e/ou fechar o componente.
- Utilizar Neutral 100 (`#F5F5F5`) para light-mode e Neutral 700 (`#1F1F1F`) para dark-mode.

## Inputs

- Todos possuem label.
- Placeholder discreto.
- Mensagens de erro abaixo do campo.
- Mesmo espaçamento entre campos.

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
- Modal
- Card
- Table
- Badge
- Pagination
- Toast
- Skeleton

## Notificações e loadings

- Toast será implementado como componente reutilizável próprio, sem utilizar o sonner (evita acoplamento a uma lib externa para a lógica de posicionamento responsiva).
- A padronização visual e comportamental de Toast e Skeleton (posicionamento, variantes, estilo) será definida em etapa futura.
- Não utilizar biblioteca externa para skeletons; construir o componente `Skeleton` com Tailwind (`animate-pulse`), seguindo o mesmo padrão dos demais componentes de `components/ui`.
