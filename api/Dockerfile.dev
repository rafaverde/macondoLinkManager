# Etapa 1: imagem base
FROM node:lts-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Gera o Prisma Client dentro da imagem
RUN npx prisma generate

# Expõe a porta da API
EXPOSE 3333

# Comando padrão (sobrescrito pelo docker-compose)
CMD ["npm", "run", "dev"]
