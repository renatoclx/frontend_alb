# Implementação: Integração com a API real (backend)

Registro da primeira integração do frontend com o backend real
(`alb_locacoes/backend`, NestJS + Prisma + PostgreSQL), feita de forma
assistida e em etapas pequenas, para servir de referência em integrações
futuras. Até aqui, `auth`, `categorias` e `clientes` viviam só como mock
em `services/*.ts`; agora conversam com a API de verdade.

---

## Ambiente

- Backend roda em `http://localhost:3333` (porta alterada de 3000 para
  não conflitar com o `next dev`, que já usava 3000).
- Frontend lê a URL da API via `NEXT_PUBLIC_API_URL` (`.env.local`,
  ignorado pelo git).
- Autenticação via JWT Bearer, sem refresh token — expira em 1h
  (`JWT_EXPIRES_IN`).
- Cidades são seedadas via `prisma/seed/seed-cities.sql` (645 municípios
  de SP); usuários não têm seed — o primeiro precisa ser criado via
  `POST /users` (rota pública).

---

## Passo 1 — Cliente HTTP base

- `utils/api-client.ts`: wrapper único sobre `fetch`, centraliza
  Content-Type, header `Authorization` e tratamento de erro
  (`ApiError`, com `status` HTTP + mensagem vinda da API).
- `utils/jwt.ts`: decodifica o payload do JWT (`sub`, `email`) sem
  validar assinatura — isso é responsabilidade da API, o frontend só
  precisa ler o id do usuário logado.
- `types/api.ts`: `PaginatedResult<T>`, o formato `{items, total, page,
  limit}` usado por toda listagem paginada da API.

## Passo 2 — Autenticação real

- `POST /auth/login` devolve só `{accessToken}`, sem dados do usuário.
  Por isso, após o login, buscamos o perfil completo via
  `GET /users/:id` (o `:id` vem do `sub` decodificado do token).
- `types/auth.ts`: novo tipo `AuthSession` (`{user, accessToken}`).
- `hooks/use-auth.ts`: guarda `AuthSession` no localStorage (chave
  `locobra:auth-session`) e expõe `getAccessToken()`, usado pelos
  services para autenticar as chamadas. A API pública do hook (`user`,
  `isAuthenticated`, `login`, `logout`) não mudou.
- `backend/src/main.ts`: `app.enableCors({ origin: 'http://localhost:3000' })`
  — sem isso, o navegador bloqueia as chamadas por CORS antes mesmo de
  chegarem à API.

## Passo 3 — Categorias

- `services/categorias-service.ts`: `GET /categories` não devolve a
  quantidade de produtos junto da categoria. Buscamos `/products`
  também (limit alto) e calculamos a contagem no cliente, agrupando por
  `categoryId`.
- Validações que antes eram checadas no mock (nome duplicado, categoria
  com produtos vinculados) agora vêm prontas da API, via `ConflictException`
  — o frontend só precisa exibir a mensagem de erro.

## Passo 4 — Clientes

O mais trabalhoso: a API usa `cityId` (UUID), não o nome da cidade como
texto livre.

- `services/cidades-service.ts`: a API não tem busca por nome, só
  paginação. Como cidades praticamente não mudam em runtime, buscamos a
  lista inteira uma vez (limit alto) e cacheamos em memória — o
  combobox filtra localmente, exatamente como no mock.
- `services/clientes-service.ts`: mapeia os campos da API
  (`name/phone/document/address/cityId`) para os nossos
  (`nome/telefone/documento/endereco/cidade`); resolve nome de cidade →
  `cityId` no create/update, e `cityId` → nome no read.
- `types/cliente.ts`: `Cliente` ganhou `cityId`; removido
  `possuiHistorico` (não existe na API — quem bloqueia a exclusão por
  histórico agora é o backend, na hora do delete).
- `components/clientes/cliente-form.tsx`: "Data de Nascimento" fica
  desabilitada no modo edição — a API não permite alterar esse campo
  depois do cadastro (regra documentada no `business-rules.md` do
  backend).

---

## Padrão adotado: "buscar tudo, filtrar no cliente"

A API pagina de verdade (`page`/`limit`), mas não tem busca por nome em
nenhum dos módulos usados até aqui. Para manter a pesquisa e a paginação
do jeito que já funcionavam (100% no cliente), os `services` pedem um
`limit` alto numa única chamada em vez de implementar paginação real
ponta a ponta. Funciona bem no volume de dados atual; vira gargalo se o
número de registros crescer muito — ver Pendências.

---

## Pendências / dívidas técnicas

- **Busca e paginação real**: a API não tem busca por nome em
  `clients`, `categories` nem `cities`. O padrão "buscar tudo" (acima)
  é uma solução temporária.
- **Recuperação de senha**: continua mockada em
  `services/auth-service.ts` — a API ainda não tem esse endpoint.

## Resolvido depois da primeira versão deste documento

- **Sessão expirada** (token com 1h, sem refresh): qualquer chamada
  autenticada que volte com 401 agora limpa a sessão
  (`utils/auth-storage.ts`) e redireciona para `/login` — tratado
  direto em `utils/api-client.ts`. Só se aplica a chamadas que já
  enviaram token; o 401 de credenciais erradas no login continua
  mostrando a mensagem normal ("Credenciais inválidas").

---

## Arquivos criados

```
utils/api-client.ts
utils/jwt.ts
utils/auth-storage.ts
types/api.ts
```

## Arquivos alterados

```
types/auth.ts              novo tipo AuthSession
services/auth-service.ts   login real + busca de perfil
hooks/use-auth.ts          guarda sessão via utils/auth-storage.ts
utils/api-client.ts        401 com token = limpa sessão e redireciona ao login
services/categorias-service.ts   API real + contagem de produtos calculada
services/cidades-service.ts      API real + cache em memória
services/clientes-service.ts     API real + mapeamento de campos, cityId e restore
types/cliente.ts           cityId adicionado, possuiHistorico removido
components/clientes/cliente-form.tsx   Data de Nascimento desabilitada na edição
app/(protected)/clientes/page.tsx   Alterar/Excluir desabilitados e Reativar
                                     para clientes inativos
backend/src/main.ts        CORS liberado para http://localhost:3000
backend/.env               PORT alterado para 3333
```
