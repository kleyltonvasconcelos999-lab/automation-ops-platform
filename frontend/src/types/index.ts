// Execution Types
export interface Execution {
  id: string;
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  progress: number;
  operatorId: string;
  error?: string;
  logs: Log[];
  screenshots: Screenshot[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  url: string;
  steps: AutomationStep[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationStep {
  id: string;
  type: 'navigate' | 'click' | 'fill' | 'wait' | 'screenshot' | 'extract' | 'condition';
  selector?: string;
  value?: string;
  timeout?: number;
  description: string;
}

// Log Types
export interface Log {
  id: string;
  executionId: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  step?: string;
  duration?: number;
}

// Screenshot Types
export interface Screenshot {
  id: string;
  executionId: string;
  timestamp: string;
  url: string;
  stepNumber: number;
}

// Session Types
export interface Session {
  id: string;
  executionId: string;
  status: 'active' | 'idle' | 'closed';
  createdAt: string;
  closedAt?: string;
  operatorId: string;
}

// Operator Types
export interface Operator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  isOnline: boolean;
  lastSeen: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  activeSessions: number;
  totalRuntime: number;
  errorRate: number;
}

// WebSocket Events
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface ExecutionUpdate {
  executionId: string;
  status: Execution['status'];
  progress: number;
  error?: string;
}

export interface LogEntry {
  executionId: string;
  log: Log;
}

export interface ScreenshotEntry {
  executionId: string;
  screenshot: Screenshot;
}
