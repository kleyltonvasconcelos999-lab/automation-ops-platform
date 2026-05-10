'use client';

import React from 'react';
import { useExecutionStore } from '@/hooks/useExecutionStore';
import { Camera, Maximize2 } from 'lucide-react';
import Image from 'next/image';

export default function BrowserPreview() {
  const { currentExecutionId, getExecution } = useExecutionStore();
  const execution = currentExecutionId ? getExecution(currentExecutionId) : null;
  const screenshots = execution?.screenshots || [];
  const lastScreenshot = screenshots[screenshots.length - 1];

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="px-4 py-4 border-b border-subtle flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          PREVIEW
        </h2>
        <button className="p-2 hover:bg-surface-hover rounded transition-colors">
          <Maximize2 className="w-4 h-4 text-subtle" />
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-surface-alt overflow-hidden relative">
        {!lastScreenshot ? (
          <div className="flex flex-col items-center justify-center text-subtle">
            <Camera className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-xs">Aguardando screenshot...</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={lastScreenshot.url}
              alt="Browser Screenshot"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 text-xs bg-surface-alt border border-subtle px-2 py-1 rounded">
              <p className="text-subtle">Frame: {screenshots.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot Gallery */}
      {screenshots.length > 0 && (
        <div className="px-3 py-3 border-t border-subtle bg-surface-alt">
          <p className="text-xs text-subtle mb-2">HISTÓRICO ({screenshots.length})</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {screenshots.map((ss, idx) => (
              <button
                key={ss.id}
                className={`flex-shrink-0 w-12 h-12 rounded border transition-all ${
                  idx === screenshots.length - 1
                    ? 'border-cyan-500 cyber-glow-sm'
                    : 'border-subtle hover:border-subtle'
                }`}
                title={`Frame ${idx + 1}`}
              >
                <img
                  src={ss.url}
                  alt={`Frame ${idx + 1}`}
                  className="w-full h-full object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
