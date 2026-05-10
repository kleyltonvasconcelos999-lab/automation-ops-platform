# 🤖 Automation Operations Platform

Central Operacional de Automação em Tempo Real - Sistema profissional de RPA com dashboard cyber/SaaS moderno.

## 🎯 Objetivo

Plataforma completa para:
- ✅ Iniciar sessões automatizadas
- ✅ Executar fluxos automáticos via navegador
- ✅ Monitorar execuções em tempo real
- ✅ Registrar logs vivos
- ✅ Controlar múltiplos processos simultaneamente
- ✅ Salvar screenshots automáticas
- ✅ Organizar filas operacionais
- ✅ Acompanhar status das execuções

## 🏗️ Arquitetura

### Frontend
- **React 18** com **Next.js 14**
- **TailwindCSS** para styling premium
- **Socket.io** para realtime
- Dashboard tipo SaaS com dark mode

### Backend
- **Node.js** com **Express.js**
- **PostgreSQL** para persistência
- **Redis** para cache e filas
- **Playwright** para automação web
- **Socket.io** para comunicação realtime

### Infraestrutura
- **Docker** + **Docker Compose**
- **VPS Linux ready**
- Escalável e modular

## 🚀 Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/kleyltonvasconcelos999-lab/automation-ops-platform.git
cd automation-ops-platform

# Configure variáveis de ambiente
cp .env.example .env

# Inicie com Docker
docker-compose up -d
```

Acesse:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Desenvolvimento Local

```bash
# Instale dependências
npm install

# Configure banco de dados
cd backend
cp .env.example .env
npm run migrate

# Inicie desenvolvimento
npm run dev
```

## 📁 Estrutura

```
automation-ops-platform/
├── frontend/                 # React/Next.js
├── backend/                  # Node.js/Express
├── docker-compose.yml
└── package.json
```

## 🔧 Funcionalidades

### Automação
- Playwright para controle de navegador
- Múltiplas sessões simultâneas
- Headless e headed mode
- Retry automático
- Timeout inteligente

### Monitoramento
- Logs em tempo real
- Screenshots automáticas
- Status de execução ao vivo
- Histórico completo

### Operacional
- Fila de tarefas
- Gerenciamento de sessões
- Controle de operadores
- Notificações via WebSocket

## 📊 Dashboard

- **Coluna Esquerda**: Lista de execuções, sessões ativas, fila
- **Centro**: Terminal de logs em realtime
- **Coluna Direita**: Navegador integrado, screenshots
- **Rodapé**: Status geral, sessões, consumo

## 🔐 Segurança

- Autenticação JWT
- Rate limiting
- Validação de entrada
- Logs de auditoria
- Isolamento de sessões

## 📈 Performance

- WebSocket para realtime
- Redis para cache
- Database indexing
- Compressão de screenshots
- Otimização de queries

## 🤝 Contribuição

Este é um projeto privado. Entre em contato para detalhes.

## 📝 Licença

MIT License - Veja LICENSE para detalhes.

---

**Desenvolvido por:** kleyltonvasconcelos999-lab
