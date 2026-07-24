'use client';

import React from 'react';

interface TaskOrderButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function TaskOrderButtons({ onMoveUp, onMoveDown }: TaskOrderButtonsProps) {
  return (
    <div className="inline-flex rounded-md shadow-sm border border-gray-300 ml-2">
      <button
        type="button"
        onClick={onMoveUp}
        className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 border-r border-gray-300"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
      >
        ↓
      </button>
    </div>
  );
}