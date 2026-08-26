# Implementação: layout base, login e dashboard inicial

Este documento registra a primeira entrega do frontend: fundamentos visuais,
autenticação mockada e o shell de layout (header + sidebar), usados para
validar o design system antes de existir uma API real ou os módulos de
negócio (clientes, equipamentos, contratos).

Não é uma especificação (isso continua em `frontend-architecture.md`,
`frontend-rules.md` e `ui-guidelines.md`) — é um registro do que foi
construído e por quê, útil como referência de estudo de React/Next.

---

## O que foi implementado

- Tokens de tema (cores primária/secundária/sucesso/erro/alerta) com suporte
  a dark mode manual (alternável, não só preferência do sistema).
- Componentes base: `Button`, `Input`, `Card`, `ThemeToggle`.
- Layout do dashboard: `Header`, `Sidebar` (recolhível no desktop, drawer no
  mobile) e `DashboardShell`, que os combina.
- Autenticação mockada (sem API ainda): tela de login, sessão persistida no
  navegador, rota `/dashboard` protegida.

## Arquivos criados

```
types/auth.ts                      tipos User e LoginCredentials
services/auth-service.ts           login() mockado
hooks/use-auth.ts                  estado de sessão (usuário logado)
hooks/use-theme.ts                 estado de tema (claro/escuro)
utils/cn.ts                        helper para combinar classes Tailwind condicionais
components/ui/button.tsx
components/ui/input.tsx
components/ui/card.tsx
components/ui/theme-toggle.tsx
components/layout/header.tsx
components/layout/sidebar.tsx
components/layout/dashboard-shell.tsx
app/login/page.tsx
app/dashboard/layout.tsx           guarda de rota + monta o DashboardShell
app/dashboard/page.tsx             página placeholder
```

## Arquivos alterados

```
app/globals.css     tokens de cor + dark mode por classe (.dark) em vez de media query
app/layout.tsx       script anti-flash de tema
app/page.tsx          passou a redirecionar para /login
docs/ui-guidelines.md  removida contradição sobre paleta de cores; liberado uso de ícones em botões
```

---

## Conceitos de React/Next usados (resumo objetivo)

### Server Components por padrão
Toda página/componente no App Router é um Server Component a menos que tenha
`"use client"` no topo. `app/dashboard/page.tsx` é Server Component (não
precisa de estado nem de hooks). Já `Header`, `Sidebar`, `LoginPage` etc.
usam `"use client"` porque dependem de estado, eventos de clique ou hooks do
React — coisas que só existem no navegador.

### `redirect()` vs `useRouter().replace()`
- `app/page.tsx` usa `redirect()` do `next/navigation` dentro de um Server
  Component — o redirecionamento acontece no servidor, sem JS no cliente.
- `LoginPage` e `DashboardLayout` usam `useRouter().replace()` porque a
  decisão de redirecionar depende de estado que só existe no cliente
  (`localStorage`, via `useAuth`).

### `useSyncExternalStore`
`useAuth` e `useTheme` sincronizam estado do React com uma fonte de dados
que vive **fora** do React: `localStorage` e a classe CSS do `<html>`.

A tentação natural seria `useState` + `useEffect` (ler no mount, guardar em
state). Isso foi tentado em `use-auth.ts` e o eslint acusou o erro
`set-state-in-effect`: chamar `setState` dentro de um `useEffect` de mount
causa uma renderização extra desnecessária (o componente renderiza uma vez
"vazio", depois o efeito roda e força outra renderização com o valor real).

`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` resolve
isso nativamente:
- `getSnapshot` diz qual é o valor atual.
- `subscribe` registra quem deve ser avisado quando o valor mudar.
- `getServerSnapshot` é o valor usado durante a renderização no servidor
  (onde `localStorage`/`document` não existem).

Essa é a API que o próprio React recomenda para "ler algo de fora do React"
(bibliotecas de state management como Redux/Zustand usam a mesma por baixo).

### Evitar flash de tema errado (FOUC)
O tema poderia ser aplicado só via React (`useEffect` setando a classe
`dark`), mas isso pintaria a tela primeiro no tema claro e só depois trocaria
para escuro — um "flash" visível. A solução (`app/layout.tsx`) é um
`<script>` inline, colocado no `<head>`, que roda **antes** do React
hidratar a página e já aplica a classe `dark` certa. É por isso que o
`<html>` tem `suppressHydrationWarning`: o React esperaria que o HTML do
servidor batesse exatamente com o do cliente, mas esse script
intencionalmente altera o `<html>` antes da hidratação.

### CSS variables + `@theme` do Tailwind v4
As cores não são fixas nas classes (`bg-blue-600`), e sim variáveis CSS
(`--primary`, `--background` etc.) redefinidas dentro de `:root.dark`. O
bloco `@theme inline` no `globals.css` expõe essas variáveis como classes
utilitárias do Tailwind (`bg-primary`, `text-error`...). Vantagem: trocar o
tema é só alternar uma classe no `<html>`; nenhum componente precisa saber
que o tema mudou.

---

## Autenticação mock — como funciona hoje

1. `services/auth-service.ts` simula uma chamada de API: espera 600ms e
   valida contra um usuário fixo (`admin@locobra.com.br` / `senha123`).
2. `hooks/use-auth.ts` chama esse service, guarda o usuário retornado no
   `localStorage` e notifica a aplicação.
3. `app/dashboard/layout.tsx` verifica `isAuthenticated`; se falso, redireciona
   para `/login`.
4. `app/login/page.tsx` verifica o oposto: se já autenticado, manda para
   `/dashboard`.

Quando a API real existir, a mudança fica isolada em `auth-service.ts` — o
hook, as páginas e os componentes não precisam mudar.

## Tema — como funciona hoje

1. Primeira visita: o script em `app/layout.tsx` lê `localStorage`; se não
   houver escolha salva, usa `prefers-color-scheme` do sistema operacional.
2. Ao clicar no `ThemeToggle` (presente no `Header` e na tela de login):
   `hooks/use-theme.ts` alterna a classe `dark` no `<html>` e salva a
   escolha no `localStorage`.
3. A partir daí, a escolha manual do usuário prevalece — mudanças de tema do
   sistema operacional deixam de ser refletidas automaticamente (padrão
   comum em apps com toggle manual).

---

## Pendências / próximos passos

- Nenhum módulo de negócio (clientes, equipamentos, contratos) foi criado —
  aguardando definição de telas/fluxos.
- Autenticação é 100% mock; falta o contrato da API real de login.
- Componentes `Modal`, `Table`, `Badge`, `Pagination`, `Toast` (listados em
  `ui-guidelines.md`) ainda não foram construídos — só o que este recorte
  precisou.
