import { create } from 'zustand';
import { Execution, Log, Screenshot } from '@/types';

interface ExecutionStore {
  executions: Map<string, Execution>;
  currentExecutionId: string | null;
  
  setCurrentExecution: (id: string | null) => void;
  addExecution: (execution: Execution) => void;
  updateExecution: (id: string, updates: Partial<Execution>) => void;
  addLog: (executionId: string, log: Log) => void;
  addScreenshot: (executionId: string, screenshot: Screenshot) => void;
  getExecution: (id: string) => Execution | undefined;
  getExecutionLogs: (id: string) => Log[];
  getExecutionScreenshots: (id: string) => Screenshot[];
  clearExecutions: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  executions: new Map(),
  currentExecutionId: null,

  setCurrentExecution: (id) => set({ currentExecutionId: id }),

  addExecution: (execution) =>
    set((state) => {
      const newExecMap = new Map(state.executions);
      newExecMap.set(execution.id, execution);
      return { executions: newExecMap };
    }),

  updateExecution: (id, updates) =>
    set((state) => {
      const newExecMap = new Map(state.executions);
      const exec = newExecMap.get(id);
      if (exec) {
        newExecMap.set(id, { ...exec, ...updates });
      }
      return { executions: newExecMap };
    }),

  addLog: (executionId, log) =>
    set((state) => {
      const newExecMap = new Map(state.executions);
      const exec = newExecMap.get(executionId);
      if (exec) {
        newExecMap.set(executionId, {
          ...exec,
          logs: [...(exec.logs || []), log],
        });
      }
      return { executions: newExecMap };
    }),

  addScreenshot: (executionId, screenshot) =>
    set((state) => {
      const newExecMap = new Map(state.executions);
      const exec = newExecMap.get(executionId);
      if (exec) {
        newExecMap.set(executionId, {
          ...exec,
          screenshots: [...(exec.screenshots || []), screenshot],
        });
      }
      return { executions: newExecMap };
    }),

  getExecution: (id) => get().executions.get(id),

  getExecutionLogs: (id) => get().executions.get(id)?.logs || [],

  getExecutionScreenshots: (id) => get().executions.get(id)?.screenshots || [],

  clearExecutions: () => set({ executions: new Map(), currentExecutionId: null }),
}));
