#!/usr/bin/env bash
# Prepara o ambiente local: .env.local + dependências. Idempotente.
#
# Uso: npm run setup   (ou ./scripts/setup.sh)
# Pré-requisito: backend já rodando (veja ../backend/scripts/setup.sh).

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "==> Criando .env.local a partir de .env.example"
  cp .env.example .env.local
fi

echo "==> Instalando dependências"
npm install

echo ""
echo "Pronto. Para subir o app: npm run dev"
echo "http://localhost:3000 — login com o usuário criado no backend"
