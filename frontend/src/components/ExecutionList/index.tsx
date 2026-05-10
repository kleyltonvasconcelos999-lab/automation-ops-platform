'use client';

import React, { useMemo } from 'react';
import { useExecutionStore } from '@/hooks/useExecutionStore';
import { CheckCircle2, AlertCircle, Clock, Play, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/50',
  running: 'bg-blue-900/20 text-blue-400 border-blue-700/50 animate-pulse',
  completed: 'bg-green-900/20 text-green-400 border-green-700/50',
  failed: 'bg-red-900/20 text-red-400 border-red-700/50',
  cancelled: 'bg-gray-800 text-gray-400 border-gray-700/50',
};

const statusIcons = {
  pending: Clock,
  running: Play,
  completed: CheckCircle2,
  failed: AlertCircle,
  cancelled: X,
};

export default function ExecutionList() {
  const { executions, currentExecutionId, setCurrentExecution } = useExecutionStore();
  const execList = useMemo(() => Array.from(executions.values()).reverse(), [executions]);

  return (
    <div className="flex flex-col h-full bg-surface-alt">
      {/* Header */}
      <div className="px-4 py-4 border-b border-subtle">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          EXECUÇÕES ATIVAS
        </h2>
        <p className="text-xs text-subtle mt-1">{execList.length} sessões em andamento</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {execList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-subtle text-xs">
            <p>Nenhuma execução</p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {execList.map((exec) => {
              const Icon = statusIcons[exec.status];
              const isActive = currentExecutionId === exec.id;

              return (
                <button
                  key={exec.id}
                  onClick={() => setCurrentExecution(exec.id)}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    isActive
                      ? 'bg-surface border-cyan-600 cyber-glow-sm'
                      : 'bg-surface-hover border-subtle hover:border-subtle'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-1 ${statusColors[exec.status].split(' ')[3]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono font-semibold truncate text-white">
                        {exec.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-subtle mt-0.5">
                        {formatDistanceToNow(new Date(exec.startedAt), { addSuffix: true })}
                      </p>
                      <div className="mt-2 w-full bg-surface rounded overflow-hidden h-1">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${exec.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-subtle mt-1">{exec.progress}%</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`status-badge ${statusColors[exec.status]} border`}>
                      {exec.status.toUpperCase()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
