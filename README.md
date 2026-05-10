# 🚀 Automation Operations Platform

Central Operacional de Automação em Tempo Real - Uma plataforma profissional para monitoramento e execução de processos automatizados com visual premium estilo SaaS.

## ✨ Características

- 🎯 **Automação RPA** com Playwright/Selenium
- 📊 **Dashboard Premium** estilo SaaS cyber
- 📱 **Monitoramento em Tempo Real** com WebSocket
- 🖥️ **Browser Integrado** para visualização ao vivo
- 📸 **Screenshots Automáticas** com histórico
- 📝 **Terminal Cyber** com logs vivos
- ⚡ **Processamento Paralelo** de múltiplas sessões
- 🎨 **Dark Mode** com animações suaves
- 🔍 **OCR/Documentos** para análise de imagens
- 🔐 **Autenticação JWT** segura
- 📲 **Integrações** WhatsApp API e Webhooks

## 🏗️ Stack Tecnológico

### Frontend
- **React 18** + **Next.js 14**
- **TailwindCSS** para styling
- **Socket.io Client** para realtime
- **Zustand** para state management
- **Framer Motion** para animações

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** para persistência
- **Redis** para cache/sessões
- **Playwright** para automação
- **Socket.io** para WebSocket
- **TypeScript** para type safety

### DevOps
- **Docker** + **Docker Compose**
- **Linux VPS** ready

## 📁 Estrutura do Projeto

```
.
├── frontend/              # React/Next.js app
├── backend/               # Node.js/Express API
├── docker-compose.yml     # Orquestração de containers
├── .env.example          # Variáveis de ambiente
└── README.md             # Este arquivo
```

## 🚀 Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/kleyltonvasconcelos999-lab/automation-ops-platform.git
cd automation-ops-platform

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie os containers
docker-compose up -d

# Acesse a aplicação
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Desenvolvimento Local

```bash
# Instale dependências
cd backend && npm install
cd ../frontend && npm install
cd ..

# Configure .env
cp .env.example .env

# Inicie o PostgreSQL e Redis (você pode usar Docker para isso)
# docker-compose up postgres redis -d

# Inicie em modo desenvolvimento
npm run dev
```

## 📖 Documentação

- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)
- [API Documentation](./backend/docs/API.md)
- [Database Schema](./backend/docs/SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🔐 Segurança

- JWT Authentication
- CORS Protection
- Rate Limiting
- Input Validation
- SQL Injection Prevention
- XSS Protection

## 📝 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👤 Autor

kleyltonvasconcelos999-lab

---

**Feito com ❤️ para automação operacional profissional**
