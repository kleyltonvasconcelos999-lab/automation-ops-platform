'use client';

import React, { useEffect, useRef } from 'react';
import { useExecutionStore } from '@/hooks/useExecutionStore';
import { Terminal } from 'lucide-react';

const logLevelColors = {
  debug: 'text-cyan-400',
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
};

export default function LiveTerminal() {
  const { currentExecutionId, getExecutionLogs } = useExecutionStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const logs = currentExecutionId ? getExecutionLogs(currentExecutionId) : [];

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="px-4 py-4 border-b border-subtle">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          CONSOLE OPERACIONAL
        </h2>
        <p className="text-xs text-subtle mt-1">{logs.length} eventos registrados</p>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto font-mono text-xs p-4 space-y-1 scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="text-subtle flex items-center justify-center h-full">
            <p className="text-xs">Aguardando execução...</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`log-entry flex gap-2 ${logLevelColors[log.level]}`}>
              <span className="text-subtle shrink-0">[{formatTime(log.timestamp)}]</span>
              <span className="text-gray-400 shrink-0">[{log.level.toUpperCase()}]</span>
              <span className="flex-1 break-words">{log.message}</span>
              {log.duration && <span className="text-subtle shrink-0">({log.duration}ms)</span>}
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-t border-subtle bg-surface-alt">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-subtle">TOTAL</p>
            <p className="text-cyan-400 font-mono">{logs.length}</p>
          </div>
          <div>
            <p className="text-subtle">ERROS</p>
            <p className="text-red-400 font-mono">{logs.filter((l) => l.level === 'error').length}</p>
          </div>
          <div>
            <p className="text-subtle">AVISOS</p>
            <p className="text-yellow-400 font-mono">{logs.filter((l) => l.level === 'warn').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
