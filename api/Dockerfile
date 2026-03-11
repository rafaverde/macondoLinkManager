# ======================
# Etapa 1: Build
# ======================
FROM node:20-alpine AS build

WORKDIR /app

# Copia manifests
COPY package*.json ./

# Instala TODAS dependências (inclui dev)
RUN npm install

# Copia o código
COPY . .

# Copia banco Geolocation Maxmind
COPY data ./data

# Garante curl/tar para download opcional do GeoLite
RUN apk add --no-cache curl tar

# Gera Prisma Client
RUN npx prisma generate

# Builda TS → JS
RUN npm run build


# ======================
# Etapa 2: Runtime
# ======================
FROM node:20-alpine

WORKDIR /app

# Garante curl/tar para download opcional do GeoLite
RUN apk add --no-cache curl tar

# Copia apenas o necessário
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/data ./data
COPY --from=build /app/scripts ./scripts

ENV NODE_ENV=production

EXPOSE 3333

CMD ["sh", "./scripts/start-with-geolite.sh"]
