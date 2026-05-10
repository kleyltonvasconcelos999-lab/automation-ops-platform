# Backend - Automation Operations Platform

Servidor Node.js/Express com Playwright para automação web em tempo real.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

## Estrutura

```
src/
├── server.js                 # Entry point
├── config/                   # Configurações
├── api/
│   ├── routes/              # Rotas express
│   ├── controllers/         # Lógica de controle
│   └── middleware/          # Middlewares
├── services/
│   ├── automation/          # Serviço Playwright
│   ├── database/            # Serviço PostgreSQL
│   ├── redis/               # Serviço Cache
│   ├── websocket/           # Socket.io
│   ├── logs/                # Sistema de logs
│   └── notifications/       # Notificações
├── models/                  # Modelos de dados
├── migrations/              # Migrações DB
└── utils/                   # Utilitários
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Registrar
- POST `/api/auth/login` - Login
- POST `/api/auth/refresh` - Refresh token

### Executions
- GET `/api/executions` - Listar execuções
- POST `/api/executions` - Criar execução
- GET `/api/executions/:id` - Detalhes
- PATCH `/api/executions/:id` - Atualizar
- DELETE `/api/executions/:id` - Deletar

### Automations
- GET `/api/automations` - Listar automações
- POST `/api/automations` - Criar
- GET `/api/automations/:id` - Detalhes
- PATCH `/api/automations/:id` - Atualizar
- DELETE `/api/automations/:id` - Deletar

### Logs
- GET `/api/logs` - Listar logs
- GET `/api/logs/:executionId` - Logs de uma execução

### Sessions
- GET `/api/sessions` - Sessões ativas
- POST `/api/sessions/:id/stop` - Parar sessão

## WebSocket Events

### Client -> Server
- `execution:start` - Iniciar execução
- `execution:stop` - Parar execução
- `execution:pause` - Pausar execução
- `execution:resume` - Retomar execução

### Server -> Client
- `log:new` - Novo log
- `screenshot:new` - Nova screenshot
- `status:update` - Atualização de status
- `session:created` - Sessão criada
- `session:closed` - Sessão fechada
- `execution:progress` - Progresso da execução
