FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema para Playwright
RUN apk add --no-cache \
    chromium \
    firefox \
    webkit \
    noto-sans \
    font-noto-cjk \
    python3 \
    make \
    g++ \
    bash

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Instalar Playwright browsers
RUN npx playwright install chromium firefox webkit

# Copiar código
COPY . .

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
