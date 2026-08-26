# Implementação: Rebrand LocObra + Telas de Autenticação

Plano de implementação quebrado em etapas pequenas e independentes, para
evitar rodar tudo de uma vez (uma sessão anterior travou a máquina do
usuário ao tentar aplicar o escopo inteiro em sequência). Cada etapa deve
ser implementada e validada isoladamente antes de seguir para a próxima.

Origem: pedido único do usuário para (1) renomear a aplicação para
"LocObra", (2) redesenhar a tela de Login com base numa imagem de
referência (layout split-screen, painel decorativo + formulário) e (3)
criar uma tela de Recuperação de Senha nos mesmos moldes.

Decisões já confirmadas com o usuário (não precisam ser reconfirmadas):

- Sem login com Google (OAuth) — não existirá.
- Sem link "Não tem conta? Cadastre-se" — não há fluxo de cadastro público
  no app.
- Checkbox "Lembrar-me": incluir apenas visualmente por agora, sem lógica
  de sessão temporária vs. persistente — isso fica para quando a API real
  de autenticação for integrada.
- Recuperação de senha: tela funcional (envia e chama o service), mas sem
  validar se o e-mail existe na base — isso fica para o backend real.
- Painel decorativo usa gradiente nos tokens `--primary`/`--primary-pressed`
  já definidos em `docs/ui-guidelines.md`, fixo (não muda com o tema —
  é uma peça de marca, como no app de referência).

---

## Etapa 0 — Rebrand textual e técnico (concluída)

- [x] `components/layout/header.tsx`: "ALB Locações" → "LocObra".
- [x] `app/layout.tsx`: `metadata.title`/`description` e chave do script
      anti-flash de tema → `locobra:theme`.
- [x] `hooks/use-theme.ts`: `STORAGE_KEY` → `locobra:theme`.
- [x] `hooks/use-auth.ts`: `STORAGE_KEY` → `locobra:auth-user`.
- [x] `services/auth-service.ts`: e-mail mock `admin@albmaquinas.com.br` →
      `admin@locobra.com.br`; adicionada a função `requestPasswordReset`.
- [x] `docs/implementacao-login-dashboard.md`: atualizar a menção ao
      e-mail mock para `admin@locobra.com.br`.

Não alterado (decisão explícita): pasta do repositório e `name` em
`package.json` (`"frontend"`) — são identificadores de projeto, não o
nome exibido no app.

---

## Etapa 1 — Suporte a ícone dentro do `Input` (concluída)

Necessário para o botão de mostrar/ocultar senha no Login.

- Arquivo: `components/ui/input.tsx`.
- Adicionar prop opcional `endAdornment` (ReactNode), renderizado dentro
  do wrapper relativo do campo, com padding-right condicional quando
  presente.
- Sem mudança de comportamento para quem já usa `Input` sem essa prop.

---

## Etapa 2 — Layout compartilhado de autenticação (concluída)

- Arquivo novo: `components/layout/auth-layout.tsx`.
- Split-screen: painel esquerdo decorativo (gradiente `--primary` /
  `--primary-pressed`, headline + descrição via props) + painel direito
  com o conteúdo (`children`) recebendo o formulário de cada tela.
- Responsivo: no mobile, esconde o painel esquerdo, mantém só o formulário
  (Mobile First, conforme `docs/ui-guidelines.md`).
- Dark-mode: o painel direito usa os tokens de fundo/texto já existentes
  (`bg-background`, `text-foreground`, etc.); o painel esquerdo mantém o
  gradiente fixo (peça de marca).

---

## Etapa 3 — Redesenho da tela de Login (concluída)

- Arquivo: `app/login/page.tsx`.
- Usa `AuthLayout`. Logo/wordmark "LocObra" no painel direito.
- Campos: E-mail, Senha (com `endAdornment` do ícone olho/olho-cortado do
  `lucide-react` alternando `type="text"`/`type="password"`).
- Checkbox "Lembrar-me" (visual, sem handler funcional) + link "Esqueci
  minha senha" apontando para `/recuperar-senha`.
- Botão "Entrar" reaproveitando `Button` (`variant="primary"`).
- Mantém o texto de ambiente de teste, atualizado para o e-mail novo.
- Remove: botão "Entrar com Google" e link de cadastro.

---

## Etapa 4 — Tela de Recuperação de Senha (concluída)

- Arquivo novo: `app/recuperar-senha/page.tsx`.
- Mesmo `AuthLayout`. Só campo E-mail.
- Submit chama `requestPasswordReset` (já existe em
  `services/auth-service.ts`, etapa 0). Enquanto pendente, botão em
  `isLoading`.
- Ao concluir: troca o formulário por um estado de sucesso (mensagem +
  link "Voltar para o login"), sem revelar se o e-mail existe ou não.

---

## Etapa 5 — Documentação (concluída)

- `docs/ui-guidelines.md`: nova seção "Identidade" (nome da aplicação:
  LocObra) + descrição do padrão visual do Auth Layout (split-screen,
  gradiente primário fixo, minimalista, sem Google/cadastro).
- `docs/screens.md`: nova seção "Autenticação" com Login e Recuperação de
  Senha (campos e regras: lembrar-me visual, e-mail não validado ainda).

---

## Etapa 6 — Validação final (concluída)

- `npx tsc --noEmit`: sem erros.
- Teste visual (Playwright) do Login e da Recuperação de Senha em light e
  dark mode, toggle de mostrar/ocultar senha, fluxo de sucesso da
  recuperação e responsivo mobile (painel esquerdo some, só o formulário
  fica visível) — sem erros no console em nenhum caso.
