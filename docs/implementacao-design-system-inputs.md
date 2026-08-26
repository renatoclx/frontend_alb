# Implementação: novos componentes de formulário (Design System)

Plano quebrado em etapas pequenas e independentes (mesmo motivo do
`implementacao-auth-locobra.md`: evitar aplicar um escopo grande de uma
vez só). Cada etapa é implementada e validada antes de seguir pra
próxima.

Origem: 9 imagens de referência (specs no estilo Figma/TapTap) para:
Cascader, Checkbox, Input (variação com ícone/clear), Radio, Select,
Tabs, Textarea, Toggle/Switch, e um modelo de formulário ("Info Text")
como padrão de composição.

---

## Decisões de interpretação (não precisam ser reconfirmadas)

- **Cor de destaque**: todas as referências usam um teal/ciano para
  estados selecionado/focado/ativo. Assim como já decidimos em
  Modal/Tag/Paginação, isso é mapeado para a nossa cor **Primária**
  (azul) — os componentes não ganham uma paleta própria nova.
- **Tamanhos**: onde a imagem mostra 3 tamanhos (Input, Select,
  Textarea), reaproveita a mesma escala já usada em `Button`/`Tag`:
  `lg` 40px, `md` 36px, `sm` 24px. Tipografia: `lg` mantém `text-sm`
  (não `text-base`) — mesma exceção já decidida no `Button`, pra não
  mudar a aparência dos formulários existentes; `md`/`sm` seguem
  `text-sm`/`text-xs`.
- **Checkbox/Radio/Switch/Tabs**: as imagens não mostram variação de
  tamanho pra esses — fica um tamanho único por componente.
- **Cascader**: sem caso de uso real hoje (nenhuma entidade do projeto
  tem dado hierárquico). Implementado como componente genérico e
  reutilizável, mas com interação simplificada (clique a clique entre
  colunas, sem busca) — não é uma tela em uso agora, é infraestrutura
  pronta pra quando for necessário.
- **"Info Text" (imagem do formulário)**: não é um componente novo, é
  um *padrão de composição* — virou uma seção nova em
  `screen-patterns.md` (título + descrição + `FormSection` agrupando
  campos + grid de 2 colunas + rodapé Cancelar/Salvar), montado com os
  componentes acima.
- **Atualização da aplicação (revisado na Etapa 11 abaixo)**: o
  `ClienteForm` e o modal de Categoria foram migrados pra esse padrão
  — não ficou só como infraestrutura pronta, como o rascunho inicial
  deste documento previa.

---

## Etapa 1 — `Input`: tamanhos + ícone inicial + botão de limpar (concluída)

- Arquivo: `components/ui/input.tsx`.
- Nova prop `size` (`lg` padrão, `md`, `sm`), mesma escala do `Button`.
- Nova prop `startAdornment` (ícone à esquerda, ex.: lupa de busca),
  simétrica ao `endAdornment` que já existe (usado hoje no
  mostrar/ocultar senha do Login).
- Nova prop `clearable`: quando `true` e o campo tem valor, mostra um
  "x" à direita que limpa o campo — só ativa se não houver
  `endAdornment` customizado (evita conflito de dois ícones).

## Etapa 2 — `Checkbox` (concluída)

- Arquivo novo: `components/ui/checkbox.tsx`.
- Estados: normal, hover, checked, indeterminate, disabled.
- Prop `label` opcional (gap de 8px entre caixa e texto).
- Aplicado no Login: `Lembrar-me` passa a usar esse componente (mesmo
  comportamento visual-only já combinado).

## Etapa 3 — `Radio` (+ `RadioGroup`) (concluída)

- Arquivo novo: `components/ui/radio.tsx`.
- Círculo com ponto preenchido quando marcado; mesmo espaçamento de
  label do Checkbox (8px).
- `RadioGroup` para agrupar opções com `name` compartilhado e
  `value`/`onChange` únicos (evita cada tela reimplementar o
  agrupamento).

## Etapa 4 — `Switch` (concluída)

- Arquivo novo: `components/ui/switch.tsx`.
- Trilho de 20px de altura, thumb com 2px de inset (números exatos da
  imagem). Variante com texto "ON"/"OFF" dentro do trilho, opcional.

## Etapa 5 — `Textarea` (concluída)

- Arquivo novo: `components/ui/textarea.tsx`.
- Mesma escala de tamanho do Input (`lg`/`md`/`sm`).
- Contador de caracteres opcional (`maxLength` + exibição "6/1000").
- Redimensionável verticalmente (resize nativo do navegador).

## Etapa 6 — `Select` (concluída)

- Arquivo novo: `components/ui/select.tsx`.
- Mesma escala de tamanho do Input. Não é buscável (diferente do
  `Combobox` que já existe) — lista fixa de opções, clique pra
  escolher.
- Painel de opções via `createPortal`, mesmo mecanismo de
  posicionamento do `DropdownMenu` (evita o bug de scroll que já
  corrigimos lá).
- Largura mínima = 2× a altura do campo (regra explícita na imagem).

## Etapa 7 — `Tabs` (concluída)

- Arquivo novo: `components/ui/tabs.tsx`.
- Tamanhos `default`/`sm`. Indicador de aba ativa: sublinhado na cor
  Primária (a imagem usa um gradiente rosa/roxo — vira sólido
  Primária, mesma decisão de cor do topo deste documento).

## Etapa 8 — `Cascader` (concluída)

- Arquivo novo: `components/ui/cascader.tsx`.
- Trigger mostra o caminho selecionado ("Item 1 / Item 3 / Item 3") +
  seta. Ao abrir, mostra colunas progressivas (uma por nível), cada
  clique revela a próxima coluna. Fecha e aplica ao chegar numa folha.

## Etapa 9 — Documentação (concluída)

- `docs/ui-guidelines.md`: uma seção por componente novo (Checkbox,
  Radio, Switch, Textarea, Select, Tabs, Cascader), seguindo o mesmo
  formato das seções já existentes (Tags, Modais); `Componentes` ganha
  os novos nomes na lista.
- `docs/screen-patterns.md`: nova seção "Formulários" com o padrão de
  composição da imagem "Info Text" (title/description, Section, grid
  de 2 colunas, rodapé Descartar/Salvar).

## Etapa 10 — Validação final (concluída)

- `npx tsc --noEmit`: sem erros.
- Teste visual de todos os componentes numa página temporária
  (`app/ds-preview`, removida depois do teste) em light e dark mode:
  Input (tamanhos, ícone, clear, erro), Checkbox, Radio, Switch,
  Textarea, Select, Cascader, Tabs.
- Bug encontrado e corrigido durante o teste: o Checkbox indeterminado
  não estava preenchendo o fundo nem setando a propriedade real
  `indeterminate` do DOM (só mudava o ícone) — ficava com o traço
  invisível (branco sobre fundo claro). Corrigido em
  `components/ui/checkbox.tsx`.
- Confirmado: Login com o novo `Checkbox` funcionando normalmente.

## Etapa 11 — Aplicar o padrão de Formulários nos formulários existentes (concluída)

Correção de rota: as etapas 1–10 deixaram os componentes prontos mas
sem aplicar o padrão de composição nos formulários que já existem.
Aplicado depois, a pedido — e ajustado de novo depois de feedback
direto (ver Etapa 12).

- `components/clientes/cliente-form.tsx`: campos obrigatórios (Nome,
  Telefone, Documento, Endereço, Cidade) marcados com `required`.
- `app/(protected)/categorias/page.tsx`: campo Nome do modal "Nova
  Categoria" marcado com `required`.
- `components/ui/input.tsx`, `textarea.tsx`, `select.tsx`,
  `combobox.tsx`: prop `required` passa a exibir um asterisco vermelho
  ao lado do label automaticamente (usado pelos formulários acima e
  válido para qualquer formulário futuro). Aproveitado para corrigir
  um bug pré-existente no `Combobox`: o input não tinha `w-full`.

## Etapa 12 — Correções depois de feedback direto (concluída)

Três problemas apontados depois da Etapa 11:

1. **Border-radius grande demais**: `rounded-lg` (8px) era usado nos
   componentes de formulário novos (e, na verdade, já era o padrão
   pré-existente em `Card`, `Modal`, `Toast`, `Skeleton`, `Combobox`
   antes deste trabalho). A doc já confirmava `rounded-sm` (4px) contra
   o Figma pro `Button`. Padronizado **todo o app** pra `rounded-sm` —
   não só os componentes de formulário, pra não trocar uma
   inconsistência por outra.
2. **`ClienteForm` não deveria ter sido separado em `FormSection`**:
   revertido pra um grid único, sem títulos de seção.
   `components/ui/form-section.tsx` foi removido (ficou sem nenhum uso
   depois da reversão — nenhum formulário do app hoje é longo o
   suficiente pra justificar).
3. **Telefone, Documento e Data de Nascimento podiam ser menores**: o
   grid do `ClienteForm` deixou de ser 2 colunas iguais e virou um
   grid de 12 colunas — Nome/E-mail/Endereço/Cidade ocupam 6/12 (metade),
   Telefone/Documento/Data de Nascimento ocupam 4/12 cada (um terço),
   ficando visivelmente mais estreitos e cabendo os três na mesma
   linha.

`docs/screen-patterns.md` (seção Formulários) e `docs/ui-guidelines.md`
(lista de Componentes) atualizados pra remover a menção a
`FormSection`/Sections e documentar o grid de larguras variáveis.
