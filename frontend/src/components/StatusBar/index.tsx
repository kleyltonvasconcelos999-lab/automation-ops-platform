'use client';

import React, { useMemo } from 'react';
import { useExecutionStore } from '@/hooks/useExecutionStore';
import { Zap, Users, Activity, Wifi } from 'lucide-react';
import useWebSocket from '@/hooks/useWebSocket';

export default function StatusBar() {
  const { socket, isConnected } = useWebSocket();
  const { executions } = useExecutionStore();

  const stats = useMemo(() => {
    const execList = Array.from(executions.values());
    return {
      total: execList.length,
      running: execList.filter((e) => e.status === 'running').length,
      completed: execList.filter((e) => e.status === 'completed').length,
      failed: execList.filter((e) => e.status === 'failed').length,
    };
  }, [executions]);

  return (
    <div className="bg-surface-alt border-t border-subtle px-4 py-3">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
        {/* WebSocket Status */}
        <div className="flex items-center gap-2">
          <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
          <div>
            <p className="text-subtle">CONEXÃO</p>
            <p className={isConnected ? 'text-green-400 font-mono' : 'text-red-400 font-mono'}>
              {isConnected ? 'ONLINE' : 'OFFLINE'}
            </p>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-subtle">SESSÕES</p>
            <p className="text-cyan-400 font-mono">{stats.total}</p>
          </div>
        </div>

        {/* Running */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-subtle">EM EXECUÇÃO</p>
            <p className="text-blue-400 font-mono">{stats.running}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <div>
            <p className="text-subtle">SUCESSO</p>
            <p className="text-green-400 font-mono">{stats.completed}</p>
          </div>
        </div>

        {/* Failed */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div>
            <p className="text-subtle">FALHAS</p>
            <p className="text-red-400 font-mono">{stats.failed}</p>
          </div>
        </div>

        {/* System */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-subtle">OPERADOR</p>
            <p className="text-purple-400 font-mono">ONLINE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
