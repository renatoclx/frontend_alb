# UI Guidelines

## Objetivo

Construir uma interface limpa, moderna e minimalista.
Evitar excesso de cores e informações.

---

## Estilo

- A aplicação deve possuir dark-mode.
- Design minimalista.
- Espaçamento moderado entre elementos.
- Bordas arredondadas pequenas.
- Sombras discretas.
- Evitar excesso de bordas.

---

## Cores

Cor primária:

- Azul

Cor Secundária:

- Indigo

Cor de sucesso:

- Verde

Cor de erro:

- Vermelho

Cor de alerta:

- Amarelo

---

## Botões

Botão primário

- Fundo sólido.
- Texto branco.
- Borda arredondada.
- Altura padrão.

Botão secundário

- Fundo transparente.
- Apenas borda.

Botão de perigo

- Vermelho.

Ícones

- O uso de ícones dentro dos botões é permitido (ex.: ícone à esquerda ou à direita do texto).

---

## Inputs

- Todos possuem label.
- Placeholder discreto.
- Mensagens de erro abaixo do campo.
- Mesmo espaçamento entre campos.

---

## Tabelas

- Cabeçalho destacado.
- Hover nas linhas.
- Paginação na parte inferior.

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
