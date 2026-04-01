#!/bin/sh

set -e

echo "🚀 Iniciando ambiente Prisma + Fastify..."

LOCKFILE_HASH_FILE="node_modules/.package-lock.sha256"
CURRENT_LOCKFILE_HASH="$(sha256sum package-lock.json package.json | sha256sum | awk '{print $1}')"

# Em dev usamos volume dedicado de node_modules. Reinstala apenas quando o lockfile muda
# ou quando as dependências ainda não existem no volume.
if [ ! -x "node_modules/.bin/ts-node" ] || [ ! -f "$LOCKFILE_HASH_FILE" ] || [ "$(cat "$LOCKFILE_HASH_FILE")" != "$CURRENT_LOCKFILE_HASH" ]; then
  echo "📦 Instalando dependências do ambiente dev..."
  if npm ci; then
    echo "✅ Dependências instaladas com npm ci."
  else
    echo "⚠️ npm ci falhou por divergência de lockfile/ambiente. Tentando fallback seguro para dev..."
    npm install --package-lock=false --no-audit --no-fund
  fi
  mkdir -p node_modules
  echo "$CURRENT_LOCKFILE_HASH" > "$LOCKFILE_HASH_FILE"
else
  echo "📦 Dependências já sincronizadas com o lockfile."
fi

echo "🧬 Gerando Prisma Client..."
npx prisma generate

# Espera o banco subir e sincroniza o schema sem depender de sleep fixo.
echo "🛠️ Sincronizando schema Prisma com o banco local..."
ATTEMPTS=0
MAX_ATTEMPTS=15

until npm run prisma:push; do
  ATTEMPTS=$((ATTEMPTS + 1))

  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo "❌ Não foi possível sincronizar o schema Prisma após ${MAX_ATTEMPTS} tentativas."
    exit 1
  fi

  echo "⏳ Banco ainda não respondeu. Nova tentativa em 2s (${ATTEMPTS}/${MAX_ATTEMPTS})..."
  sleep 2
done

# Inicia o servidor com ts-node (não ts-node-dev)
exec npx ts-node --transpile-only src/server.ts
