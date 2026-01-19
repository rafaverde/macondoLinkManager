# ======================
# Stage 1 - Build
# ======================
FROM node:20-alpine AS build

WORKDIR /app

# Copia dependências
COPY package*.json ./
RUN npm install

# Copia código fonte
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Build da aplicação (tsup → dist/)
RUN npm run build

# ======================
# Stage 2 - Runtime
# ======================
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário
COPY package*.json ./
RUN npm install --omit=dev

# Copia build e prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Porta da API
EXPOSE 3333

# Start em produção
CMD ["node", "dist/server.js"]
