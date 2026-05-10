# 🚀 Central Operacional de Automação em Tempo Real

Plataforma profissional de automação operacional com dashboard SaaS premium, monitoramento em tempo real e execução automatizada de fluxos via navegador.

## 📋 Features

✅ **Dashboard Premium** - Interface SaaS moderna com dark mode
✅ **Automação em Tempo Real** - Playwright/Selenium para RPA
✅ **Monitoramento Live** - WebSocket para updates instantâneos
✅ **Terminal Cyber** - Console de logs com colorização
✅ **Múltiplas Sessões** - Processamento paralelo escalável
✅ **Screenshots Automáticas** - Captura e preview em tempo real
✅ **Gerenciamento de Filas** - Fila operacional completa
✅ **Sistema de Logs** - Registro completo com filtros
✅ **OCR/Documentos** - Análise de imagens e PDFs
✅ **Webhooks/APIs** - Integrações externas

## 🛠 Stack Tecnológico

- **Frontend**: React 18, Next.js 14, TailwindCSS, Socket.io
- **Backend**: Node.js, Express, Socket.io
- **Automação**: Playwright, Puppeteer
- **Banco de Dados**: PostgreSQL
- **Realtime**: WebSocket (Socket.io)
- **Deploy**: Docker, Docker Compose

## 📦 Estrutura do Projeto

```
automation-ops-platform/
├── frontend/          # React/Next.js (port 3000)
├── backend/           # Node.js/Express (port 5000)
├── docker-compose.yml # Orquestração de containers
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/kleyltonvasconcelos999-lab/automation-ops-platform.git
cd automation-ops-platform

# Instale dependências
npm install

# Configure variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Inicie em desenvolvimento
npm run dev
```

### Com Docker

```bash
# Build das imagens
npm run docker:build

# Inicie os containers
npm run docker:up

# Acesse
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api/docs
```

## 📖 Documentação

- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)
- [API Documentation](./docs/API.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Guia de Uso](./docs/USAGE.md)

## 🎨 Visual

### Cores
- 🟢 Verde: Sucesso
- 🔴 Vermelho: Erro
- 🟡 Amarelo: Alerta
- 🔵 Azul: Realtime
- ⚫ Dark: Background principal

### Componentes
- Dashboard com 3 colunas
- Lista de Execuções (esquerda)
- Terminal Live (centro)
- Browser Integrado (direita)
- Status Bar (rodapé)

## 🔧 Configuração

Veja `.env.example` em cada pasta para variáveis de ambiente.

## 📝 Licença

MIT

## 👤 Autor

kleyltonvasconcelos999-lab
