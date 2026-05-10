FROM node:20-alpine

WORKDIR /app

# Install system dependencies for Playwright
RUN apk add --no-cache \
  chromium \
  firefox \
  webkit \
  python3 \
  make \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev \
  pixman-dev

COPY package*.json ./

RUN npm ci --only=production && \
  npx playwright install --with-deps

COPY src ./src
COPY .env.example .env

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "src/server.js"]
