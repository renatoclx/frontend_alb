# Padrão de Formulários

## Objetivo

Definir o padrão visual e estrutural dos formulários da aplicação.

Todos os formulários devem seguir estas regras para manter consistência entre telas.

Padrão validado a partir do formulário de Cliente (`components/clientes/cliente-form.tsx`) — adoção do padrão visual do shadcn/ui (ver `docs/ui-guidelines.md`).

---

# Estrutura do formulário

Todo formulário de página inteira (fora de modal) deve seguir esta ordem:

1. Título da tela (`h1`, sem subtítulo/descrição abaixo — deixa a tela mais compacta).
2. Painel (`Card`) contendo o formulário.
3. Dentro do painel: campos agrupados por seção.
4. Rodapé do painel: ações (Cancelar, Salvar).

Espaçamento entre o título e o painel: **16px** (`gap-4`).

Exemplo:

```
Cadastro de Cliente

┌──────────────────────────────────────────-┐
│ Dados pessoais                            │
│ ────────────────────────────────────────  │
│ Nome                                      │
│ [________________________________]        │
│                                           │
│ Documento              Data nascimento    │
│ [______________]       [______________]   │
│                                           │
│ Contato                                   │
│ ────────────────────────────────────────  │
│ Telefone                Email             │
│ [______________]       [______________]   │
│                                           │
│                            Cancelar Salvar│
└──────────────────────────────────────────-┘
```

---

# Painel (Card)

- O painel deve ter um tamanho fixo dentro da aplicação, recebendo o overflow quando necessário.
- Este overflow deve ser no painel, e não no browser.
- No mobile, esta regra pode ser pensada de melhor forma para melhor UX
- O formulário sempre partirá do princípio de estar centralizado.
- As regras para distribuição e layout de formulário partira do arquivo `screens.md`.
- O `Card` deve ocupar **toda a largura disponível** do container da página.
- (`w-full`) — nunca usar `max-w-*` diretamente no `Card`.
- Rodapé do painel:
  - Botões alinhados à direita (`justify-end`), sem linha divisória separando do restante do formulário.
  - Botões devem se posicionar no bottom em relação ao painel, deixando eles próximos a borda do painel

---

# Campos

- Altura obrigatória de **48px** (`size="xl"`) para todo campo dentro de um
  formulário — `Input`, `Textarea`, `Select`, `Combobox`, `Cascader` — e
  também para os botões do rodapé (`Button` também usa `xl`). Fora de
  formulários, os tamanhos padrão (`lg`/`md`/`sm`) continuam valendo (ver
  `docs/ui-guidelines.md`).
- Todo campo possui label. Campo obrigatório marca a label com asterisco
  vermelho (prop `required`).
- Mensagem de erro de validação aparece abaixo do campo correspondente.
- Checkbox/Radio/Switch sempre pelos componentes dedicados (`Checkbox`,
  `RadioGroup`, `Switch`) — nunca input nativo.

---

# Agrupamento e grid

- Campos são agrupados por seção lógica (`FormSection`), cada uma com
  título e divisor.
- Grid de 2 colunas dentro de cada seção (equivalente a 12 colunas, 6/12
  por campo):
  - Campo de texto livre (nome, endereço, descrição) ocupa a linha
    inteira (12/12 — `sm:col-span-2`).
  - Campos curtos ou pareados (documento, datas, preços, quantidades)
    ocupam meia largura (6/12), lado a lado.
- Espaçamento: **24px** (`gap-6`) entre campos dentro de uma seção;
  **32px** (`gap-8`) entre seções.

---
