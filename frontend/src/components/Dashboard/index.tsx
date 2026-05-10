import React, { useEffect } from 'react';
import ExecutionList from '@/components/ExecutionList';
import LiveTerminal from '@/components/LiveTerminal';
import BrowserPreview from '@/components/BrowserPreview';
import StatusBar from '@/components/StatusBar';
import useWebSocket from '@/hooks/useWebSocket';
import { useExecutionStore } from '@/hooks/useExecutionStore';

export default function Dashboard() {
  const { subscribe } = useWebSocket();
  const { addExecution, updateExecution, addLog, addScreenshot } = useExecutionStore();

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubExecution = subscribe('execution:update', (data) => {
      updateExecution(data.executionId, data);
    });

    const unsubLog = subscribe('log:new', (data) => {
      addLog(data.executionId, data.log);
    });

    const unsubScreenshot = subscribe('screenshot:new', (data) => {
      addScreenshot(data.executionId, data.screenshot);
    });

    const unsubExecution2 = subscribe('execution:started', (data) => {
      addExecution(data);
    });

    return () => {
      unsubExecution?.();
      unsubLog?.();
      unsubScreenshot?.();
      unsubExecution2?.();
    };
  }, [subscribe, updateExecution, addLog, addScreenshot, addExecution]);

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Main Content Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-3-responsive h-full gap-0">
          {/* Left Sidebar - Executions List */}
          <div className="hidden lg:block border-r border-subtle bg-surface-alt overflow-hidden">
            <ExecutionList />
          </div>

          {/* Center - Live Terminal */}
          <div className="flex flex-col border-r border-subtle overflow-hidden">
            <LiveTerminal />
          </div>

          {/* Right Sidebar - Browser Preview */}
          <div className="hidden lg:flex flex-col border-l border-subtle bg-surface-alt overflow-hidden">
            <BrowserPreview />
          </div>
        </div>
      </div>

      {/* Status Bar - Footer */}
      <StatusBar />
    </div>
  );
}
