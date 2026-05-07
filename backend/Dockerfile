FROM node:22-alpine

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json ./
COPY prisma ./prisma/

# Installation des dépendances
RUN npm install

# Copie du reste de l'application
COPY . .

# Génération du client Prisma
RUN npx prisma generate

EXPOSE 5000

# Commande par défaut (surchargée par docker-compose)
CMD ["npm", "run", "dev"]
