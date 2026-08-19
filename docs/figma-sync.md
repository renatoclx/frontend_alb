# Sincronização com o Figma (TapTap Design System)

Registro das extrações feitas via API REST do Figma (arquivo `uUpvbA0M7lBWSQuKcd8TvP`) e do que foi efetivamente aplicado no projeto. Detalhes completos das regras estão em `docs/ui-guidelines.md` — este arquivo é o histórico/justificativa da sincronização.

## Como foi extraído

O MCP nativo do Figma (Dev Mode MCP Server) só existe nos builds oficiais Windows/macOS — não roda no build Linux em uso. Os dados foram obtidos via API REST pública (`GET /v1/files/:key/nodes`) com um Personal Access Token.

---

## 1. Cores (`node-id=4-462`)

Paleta completa extraída (escalas 50→700 + black/white): Neutral, Primary, Auxiliary, Danger, Warning, Success, Infor.

**Aplicado em `app/globals.css`:**

| Token semântico | Light | Dark |
| --- | --- | --- |
| `--primary` | ~~Primary 600 `#15C5CE`~~ → `blue-600 #2563EB` (revertido, ver nota) | ~~Primary 500 `#47CFD6`~~ → `blue-500 #3B82F6` |
| `--secondary` | Auxiliary 600 `#FF8156` | Auxiliary 500 `#FFA487` |
| `--success` | Success 600 `#47B881` | Success 500 `#6BC497` |
| `--error` | Danger 600 `#F64C4C` | Danger 500 `#EB6F70` |
| `--warning` | Warning 600 `#FFAD0D` | Warning 500 `#FFC62B` |
| `--info` *(novo)* | ~~Infor 600 `#3B82F6`~~ → `Primary 600 #15C5CE` (realocado, ver nota) | ~~Infor 500 `#4BA1FF`~~ → `Primary 500 #47CFD6` |
| `--background` / `--sidebar-background` | Neutral 100 `#F5F5F5` | black `#000000` |
| `--surface` | Neutral 50 `#FAFAFA` | Neutral 700 `#1F1F1F` |
| `--foreground` / `--text-primary` / `--table-header` | Neutral 700 `#1F1F1F` | white `#FFFFFF` |
| `--text-secondary` / `--table-cell` | Neutral 600 `#4B4B4B` | Neutral 400 `#CACACA` |

Substituiu integralmente a paleta anterior (blue/indigo/tailwind stock). Nenhum componente precisou ser alterado — todos já consumiam os tokens semânticos (`bg-primary`, `text-error`, etc.), nunca classes literais do Tailwind.

**Ajuste pós-revisão visual:** depois de conferir no navegador, o teal `Primary` do
Figma foi considerado com contraste muito alto (light e dark mode) e foi
revertido para o azul (`blue-600`/`blue-500`) que já era usado antes da
sincronização — por decisão explícita do usuário. `--primary-hover`/`--primary-pressed`
também foram recalculados na escala do Tailwind blue (`500`/`700` no light,
`400`/`600` no dark) seguindo a mesma lógica de shades usada nas outras cores.
Isso deixava `--primary` (azul, `#2563EB`/`#3B82F6`) visualmente muito próximo de
`--info` (Infor, `#3B82F6`/`#4BA1FF`) — os dois tokens representam conceitos
diferentes (ação primária vs. estado informativo) e precisavam ficar distintos.

**Segundo ajuste (mesma sessão):** `--info` foi remapeado para a escala
`Primary` (teal) do Figma, que ficou sem uso depois que `--primary` virou azul.
`--info-hover`/`--info-pressed` seguem a mesma lógica de shades (500/700 no
light, 400/600 no dark) usando a escala teal. Resultado: `--primary` (azul) e
`--info` (teal) agora são visualmente distintos, e a escala teal extraída do
Figma não fica sem aproveitamento.

## 2. Tipografia (`node-id=4-1418`)

Escala extraída: H1 30/38, H2 24/32, H3 20/28, Title 18/26, Subtitle 16/24, Body 14/22, Caption 12/18. Peso Regular 400 / Medium 500.

**Aplicado em `app/globals.css`:** os tamanhos `text-base`, `text-xl` e `text-2xl` do Tailwind já coincidiam exatamente com Subtitle/H3/H2. Foram ajustadas as alturas de linha de `text-xs`, `text-sm`, `text-lg` e criado `text-3xl` para cobrir Caption/Body/Title/H1.

**Não aplicado:** o Figma não especifica Inter/Roboto (usa uma stack de sistema com PingFang SC para chinês, irrelevante para PT-BR). Fontes mantidas por decisão explícita.

## 3. Botões (`node-id=15-12480`)

Sistema completo: 4 estilos (`Primary`, `Outline`, `Ghost`, `Link`) × 4 estados (`Default/Hover/Pressed/Disabled`) × 3 tamanhos (`Large/Medium/Small`), com variante `Danger` equivalente.

- **Radius**: 4px em todos os tamanhos — já batia com `rounded-sm` (0.25rem) já usado no projeto. Nenhuma mudança.
- **Tamanhos**: Large `h=40 pad=8 text-base`, Medium `h=36 pad=7×8 text-sm`, Small `h=24 pad=3×4 text-xs`. O `Button` atual (`h-10`, sem prop de tamanho) já equivale ao Large.
- **Cores por estado** (Primary): Default 600 → Hover 500 → Pressed 700 → Disabled 300, texto branco fixo. Mesmo padrão de shades nas demais cores (Danger, etc.).
- **Outline/Ghost/Link**: bordas/hover em tons de Neutral; Link usa a escala Primary diretamente no texto.

**Aplicado em `app/globals.css`:** tokens `--{cor}-hover` e `--{cor}-pressed` para primary/secondary/success/error/warning/info (light e dark — os valores dark foram extrapolados pela mesma lógica de shade, já que o arquivo do Figma só define estados para o modo claro).

**Aplicado em `components/ui/button.tsx`** (etapa seguinte, aprovada separadamente):
- Nova prop `size` (`lg` padrão / `md` / `sm`), mapeando para as alturas exatas do Figma (40/36/24px). O `font-size` do `lg` foi mantido em `text-sm` (14px) por decisão explícita do usuário — o Figma indica `text-base` (16px), mas o tamanho anterior ficou melhor visualmente; `md`/`sm` seguem `text-sm`/`text-xs` como no Figma. A altura horizontal (`px-4`) do `lg` foi mantida como já estava em produção — o Figma usa 8px de padding horizontal em todos os tamanhos, mas isso não foi replicado literalmente porque o componente usa um modelo de altura fixa + padding só horizontal (diferente do Figma, que usa "hug" com padding em todos os lados); mudar para 8px deixaria os botões visivelmente mais compactos em todo o app sem necessidade.
- Novas variantes `ghost` e `link`, sem uso ainda em nenhuma tela — disponíveis para quando forem necessárias.
- `primary` e `danger` passaram a usar `hover:bg-*-hover` / `active:bg-*-pressed` no lugar do genérico `hover:opacity-90`.
- `secondary` (já era visualmente equivalente ao "Outline" do Figma) passou a mudar borda/texto para a cor primária no hover/pressed, replicando o comportamento exato do Figma. **Isso muda o hover dos botões "Cancelar"/"Fechar" existentes** (categorias, clientes, formulário de cliente): antes ficava só um leve fundo cinza, agora a borda e o texto ficam na cor primária (teal) — igual ao Figma, mas vale conferir visualmente.
- Disabled continua usando `opacity-50` (sem token de cor dedicado), como já estava decidido.

**Não aplicado:** padding horizontal literal de 8px do Figma (ver acima) e o modelo "hug" de dimensionamento — mantido o modelo de altura fixa já usado no projeto.

## 4. IconButton (mesmo arquivo do node acima)

Figma define IconButton **circular** (`radius=100`) em 3 tamanhos (40/36/24px), com Primary/Outline/Ghost preenchidos por estado.

**Aplicado em `components/ui/icon-button.tsx`:**
- Forma alterada de `rounded-sm` para `rounded-full` (decisão explícita: adotar padrão do Figma).
- Adicionado estado `active:` (pressed) com tom mais forte da mesma cor, replicando a lógica Default → Hover → Pressed do Figma.

**Não aplicado:** o Figma não define uma "cor de ação" por variante (Primária/Alerta/Erro) como o projeto usa hoje na coluna de ações das tabelas — ele varia por *estilo* (Primary sólido / Outline / Ghost neutro), não por *semântica de ação*. Mantido o esquema de cores por ação já documentado (view=primário, editar=alerta, excluir=erro), só a forma e os estados de interação vieram do Figma. Tamanho do componente (`size-8`, 32px) também não foi alterado — não corresponde a nenhum dos 3 tamanhos do Figma e não houve pedido para adicionar prop de tamanho.

## 5. ButtonGroup (`node-id=15-17842`)

Componente novo no Figma (grupo de botões segmentados, tipo toggle group), com variantes `Basic` e `Icon only`. **Não existe hoje no projeto** e não está na lista de componentes do `ui-guidelines.md`.

**Decisão explícita:** não criar o componente agora — registrado aqui para referência futura, caso surja uma tela que precise dele.

## 6. Ícones (`node-id=293-21694`)

Biblioteca de ícones própria do TapTap (SVGs proprietários), organizada em categorias (Arrows, Base, Charts, Edit, Suggest), grid de 24×24px.

**Não aplicado:** o projeto usa `lucide-react`; migrar para o set proprietário do Figma trocaria toda a dependência de ícones, fora do escopo pedido. Confirmado apenas que 24px (tamanho padrão do grid Figma) já é o tamanho padrão do `lucide-react` — nenhuma ação necessária.

## 7. Sombras (`node-id=4-1339`) — pendente

A API do Figma retornou `429 Too Many Requests` com `Retry-After` de ~4,6 dias (limite de cota do plano do token, não um throttle de curto prazo). Não foi possível extrair esse node nesta sessão.

**Próximos passos:** repetir a extração quando o limite resetar, ou gerar um novo token/plano com cota maior. Nenhuma alteração de sombra foi feita no projeto.

---

## Resumo do que mudou de fato no código

| Arquivo | Mudança |
| --- | --- |
| `app/globals.css` | Paleta de cores substituída (Neutral/Primary/Auxiliary/Danger/Warning/Success/Infor do Figma); novo token `--info`; escala tipográfica (`text-xs/sm/lg/3xl`) ajustada; novos tokens `--{cor}-hover`/`--{cor}-pressed` para os estados dos botões. |
| `components/ui/icon-button.tsx` | Forma `rounded-sm` → `rounded-full`; adicionado estado `active:` (pressed). |
| `components/ui/button.tsx` | Nova prop `size` (`lg`/`md`/`sm`); novas variantes `ghost` e `link`; `primary`/`danger`/`secondary` passaram a ter cores de hover/pressed exatas do Figma em vez de opacidade genérica. |
| `docs/ui-guidelines.md` | Tabelas de cores, escala de textos e seção de botões (tamanhos/estados) atualizadas para refletir os novos valores e a origem (Figma). |
| `docs/figma-sync.md` *(este arquivo)* | Novo — histórico da sincronização. |

## Impactos possíveis

- Todo o app muda de paleta visualmente (azul/índigo → teal/laranja), já que os tokens são globais.
- Os botões de ação das tabelas (`IconButton`) ficam circulares em vez de quadrados.
- Botões `variant="secondary"` (Cancelar/Fechar) mudam de comportamento no hover: borda e texto passam a ficar na cor primária (teal) em vez de um leve fundo cinza.
- Botão padrão (`size="lg"`) mantém `text-sm` (14px), a mesma altura (40px) e o mesmo padding horizontal (16px) de antes — nenhuma mudança visual de texto no botão padrão.
- Nenhuma mudança na API de `IconButton`; `Button` ganhou as props `size` (opcional, default mantém o comportamento visual de altura) e as novas variantes `ghost`/`link` (opt-in, nenhum call site existente foi alterado).
- Build e type-check (`next build`) validados sem erros após as mudanças. Não foi possível verificar visualmente em navegador nesta sessão (ferramenta de browser não disponível) — recomenda-se conferir o hover dos botões `secondary` em `npm run dev`.

## Pendências em aberto

- Node de sombras bloqueado por rate limit da API do Figma (retomar quando resetar ou com um token de plano com cota maior).
- `ButtonGroup` especificado no Figma mas não implementado (sem uso no app hoje).
- Padding horizontal literal do Figma (8px) não aplicado ao `size="lg"` — mantido `px-4` (16px) já usado em produção; `md`/`sm` usam padding proporcional (`px-3`/`px-2`), não os valores exatos do Figma (7×8 / 3×4), pela diferença de modelo de dimensionamento explicada na seção 3.
