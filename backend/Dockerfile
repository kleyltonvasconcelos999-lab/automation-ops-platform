FROM node:18-alpine

WORKDIR /app

# Instala browser dependencies
RUN apk add --no-cache \
    chromium \
    firefox \
    wget \
    python3 \
    make \
    g++

# Copia package files
COPY package*.json ./

# Instala dependencies
RUN npm install --production

# Copia source code
COPY src ./src
COPY .env.example ./.env

# Expoe porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Inicia aplicação
CMD ["node", "src/server.js"]
