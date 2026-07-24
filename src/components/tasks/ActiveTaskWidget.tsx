'use client';

import React from 'react';
import { Task } from '@/types/task';

interface ActiveTaskWidgetProps {
  task: Task | null;
  onComplete: (taskId: number) => void;
}

export default function ActiveTaskWidget({ task, onComplete }: ActiveTaskWidgetProps) {
  if (!task) return null;

  return (
    <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Active Task (Highest Order)
          </span>
          <h3 className="text-lg font-bold text-gray-800">{task.name}</h3>
          <p className="text-sm text-gray-600">Assigned To: {task.assigned_to}</p>
        </div>
        <button
          onClick={() => onComplete(task.id)}
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
        >
          Mark as Completed
        </button>
      </div>
    </div>
  );
}