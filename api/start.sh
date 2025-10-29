#!/bin/sh

echo "🚀 Iniciando ambiente Prisma + Fastify..."

# Garante que dependências e client estão prontos
npm install
npx prisma generate

# Espera o banco subir (simples delay para evitar race condition)
sleep 5

# Inicia o servidor com ts-node (não ts-node-dev)
npx ts-node --transpile-only src/server.ts
