'use client';

import React, { useState, useEffect } from 'react';

type UserRole = 'Member' | 'Manager' | 'Admin';
type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

interface Subtask {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  projectName: string;
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  hoursEstimated: number;
  hoursLogged: number;
  subtasks: Subtask[];
  comments: Comment[];
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Design Task Management Layout',
    description: 'Create responsive grid layout with proper task ordering and role permission checks.',
    projectName: 'HR Portal',
    assignedTo: 'Amreen',
    createdBy: 'Manager',
    dueDate: '2026-07-28',
    priority: 'High',
    status: 'Pending',
    hoursEstimated: 16,
    hoursLogged: 4,
    subtasks: [
      { id: 101, title: 'Draft Wireframes', isCompleted: true },
      { id: 102, title: 'Setup Component State', isCompleted: false },
    ],
    comments: [
      { id: 201, user: 'Manager', text: 'Please complete this by Tuesday.', createdAt: '2026-07-25' },
    ],
  },
  {
    id: 2,
    title: 'Setup PostgreSQL Database Schema',
    description: 'Write Prisma migration scripts and define tables for tasks and users.',
    projectName: 'IT Firm Portal',
    assignedTo: 'Mariano Armstrong',
    createdBy: 'Admin',
    dueDate: '2026-07-30',
    priority: 'Medium',
    status: 'In Progress',
    hoursEstimated: 10,
    hoursLogged: 6,
    subtasks: [],
    comments: [],
  },
  {
    id: 3,
    title: 'Fix Authentication Token Expiry',
    description: 'Resolve refresh token rotation logic in NextAuth middleware.',
    projectName: 'Auth System',
    assignedTo: 'Amreen',
    createdBy: 'Manager',
    dueDate: '2026-07-20',
    priority: 'Critical',
    status: 'Completed',
    hoursEstimated: 8,
    hoursLogged: 8,
    subtasks: [{ id: 103, title: 'Update middleware', isCompleted: true }],
    comments: [],
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [role, setRole] = useState<UserRole>('Admin');
  
  // Dynamic Logged-in User State
  const [currentUser, setCurrentUser] = useState<string>('Guest');

  // Load User from LocalStorage or Session on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userName');
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      setCurrentUser('Amreen'); // Default fallback
    }
  }, []);

  // Handler to manually update logged-in user (Testing purpose)
  const handleUserChange = () => {
    const name = prompt('Enter Logged-in User Name:', currentUser);
    if (name && name.trim()) {
      setCurrentUser(name.trim());
      localStorage.setItem('userName', name.trim());
    }
  };

  // Filter States
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  // Form Inputs
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectName: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium' as Priority,
    status: 'Pending' as TaskStatus,
    hoursEstimated: 8,
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // 1. Role Access Filter
  const roleFilteredTasks = tasks.filter((task) => {
    if (role === 'Admin') return true;
    if (role === 'Manager') return task.createdBy === 'Manager' || task.assignedTo === currentUser;
    if (role === 'Member') return task.assignedTo === currentUser;
    return true;
  });

  // 2. Tab, Search & Priority Filtering
  const finalTasks = roleFilteredTasks.filter((task) => {
    const matchesTab = activeTab === 'All' ? true : task.status === activeTab;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' ? true : task.priority === priorityFilter;

    return matchesTab && matchesSearch && matchesPriority;
  });

  // Task Reordering
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTasks.length) return;

    const temp = newTasks[index];
    newTasks[index] = newTasks[targetIndex];
    newTasks[targetIndex] = temp;
    setTasks(newTasks);
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) return;

    const newTask: Task = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      projectName: formData.projectName || 'General',
      assignedTo: formData.assignedTo,
      createdBy: role,
      dueDate: formData.dueDate || '2026-08-01',
      priority: formData.priority,
      status: formData.status,
      hoursEstimated: Number(formData.hoursEstimated) || 0,
      hoursLogged: 0,
      subtasks: [],
      comments: [],
    };

    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    resetForm();
  };

  // Update Existing Task
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
  };

  // Status Change with Subtask Constraint Check
  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    if (newStatus === 'Completed') {
      const hasUnfinishedSubtasks = targetTask.subtasks.some((st) => !st.isCompleted);
      if (hasUnfinishedSubtasks) {
        alert('Cannot mark task as completed until all subtasks are finished.');
        return;
      }
    }

    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  // Subtask Management
  const handleToggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
          ),
        };
      })
    );
  };

  const handleAddSubtask = (taskId: number) => {
    if (!newSubtaskTitle.trim()) return;

    setTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: [...t.subtasks, { id: Date.now(), title: newSubtaskTitle, isCompleted: false }],
        };
      })
    );
    setNewSubtaskTitle('');
  };

  // Comment Management
  const handleAddComment = (taskId: number) => {
    if (!newCommentText.trim()) return;

    const commentObj: Comment = {
      id: Date.now(),
      user: currentUser,
      text: newCommentText,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks(
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, comments: [...t.comments, commentObj] };
      })
    );
    setNewCommentText('');
  };

  // Delete Task
  const handleDelete = (task: Task) => {
    if (role === 'Member') return;
    if (role === 'Manager' && task.createdBy !== 'Manager') {
      alert('Managers can only delete tasks created by them.');
      return;
    }
    setTasks(tasks.filter((t) => t.id !== task.id));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectName: '',
      assignedTo: currentUser,
      dueDate: '',
      priority: 'Medium',
      status: 'Pending',
      hoursEstimated: 8,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Project & Task Management</h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
            Logged-in User: <span className="font-semibold text-blue-600">{currentUser}</span>
            <button
              onClick={handleUserChange}
              className="text-[10px] text-gray-400 underline hover:text-blue-600"
            >
              (Switch User)
            </button>
          </p>
        </div>

        {/* Role Switcher & Create Action */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-600">Access Level:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="border p-1.5 text-xs rounded bg-gray-50 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Manager">Manager (Add/Edit Own)</option>
            <option value="Member">Member (Read Assigned)</option>
          </select>

          {role !== 'Member' && (
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, assignedTo: currentUser }));
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition"
            >
              + Create New Task
            </button>
          )}
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 p-3 rounded border">
        <input
          type="text"
          placeholder="Search by title, project, assignee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 border px-3 py-1.5 text-xs rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-medium text-gray-600">Filter Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border p-1.5 text-xs rounded bg-white font-medium focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
        {(['All', 'Pending', 'In Progress', 'Completed'] as const).map((tab) => {
          const count =
            tab === 'All'
              ? roleFilteredTasks.length
              : roleFilteredTasks.filter((t) => t.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Task List Container */}
      <div className="space-y-3">
        {finalTasks.length === 0 ? (
          <div className="p-8 border rounded text-xs text-gray-500 text-center bg-gray-50">
            No matching tasks found for the current filter criteria.
          </div>
        ) : (
          finalTasks.map((task, index) => {
            const completedSubtasks = task.subtasks.filter((st) => st.isCompleted).length;
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="border rounded-lg bg-white shadow-sm hover:shadow transition overflow-hidden"
              >
                {/* Main Task Item */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column Details */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">{task.title}</span>

                      {/* Project Tag */}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                        {task.projectName}
                      </span>

                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          task.priority === 'Critical'
                            ? 'bg-purple-100 text-purple-700'
                            : task.priority === 'High'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span>
                        Assignee: <strong className="text-gray-700">{task.assignedTo}</strong>
                      </span>
                      <span>
                        Due: <strong className="text-gray-700">{task.dueDate}</strong>
                      </span>
                      <span>
                        Logged:{' '}
                        <strong className="text-gray-700">
                          {task.hoursLogged}/{task.hoursEstimated} hrs
                        </strong>
                      </span>
                      {task.subtasks.length > 0 && (
                        <span>
                          Subtasks:{' '}
                          <strong className="text-gray-700">
                            {completedSubtasks}/{task.subtasks.length}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Status Selector */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Dynamic Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className={`text-xs font-semibold px-2 py-1 rounded border ${
                        task.status === 'Completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : task.status === 'In Progress'
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-amber-50 border-amber-300 text-amber-700'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded border transition"
                    >
                      {isExpanded ? 'Hide Details' : 'Details & Activity'}
                    </button>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-xs text-blue-600 hover:underline px-1"
                    >
                      Edit
                    </button>

                    {/* Reordering Controls */}
                    <div className="flex border rounded bg-gray-50">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 border-r text-xs disabled:opacity-30 hover:bg-gray-200"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === finalTasks.length - 1}
                        className="px-2 py-1 text-xs disabled:opacity-30 hover:bg-gray-200"
                      >
                        ↓
                      </button>
                    </div>

                    {role !== 'Member' && (
                      <button
                        onClick={() => handleDelete(task)}
                        className="text-xs text-red-600 hover:underline px-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtasks & Discussions Panel */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t p-4 space-y-4">
                    {/* Subtasks Section */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 mb-2">
                        Subtasks ({completedSubtasks}/{task.subtasks.length})
                      </h4>
                      <div className="space-y-1.5 mb-2">
                        {task.subtasks.map((st) => (
                          <div key={st.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={st.isCompleted}
                              onChange={() => handleToggleSubtask(task.id, st.id)}
                              className="rounded text-blue-600 text-xs focus:ring-0"
                            />
                            <span
                              className={`text-xs ${
                                st.isCompleted
                                  ? 'line-through text-gray-400'
                                  : 'text-gray-700'
                              }`}
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 max-w-md">
                        <input
                          type="text"
                          placeholder="Add new subtask..."
                          value={newSubtaskTitle}
                          onChange={(e) => setNewSubtaskTitle(e.target.value)}
                          className="border px-2 py-1 text-xs rounded bg-white w-full focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddSubtask(task.id)}
                          className="bg-gray-800 text-white px-2 py-1 text-xs rounded hover:bg-gray-900 shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Comments & Activity Section */}
                    <div className="border-t pt-3">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">Task Activity & Comments</h4>
                      <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
                        {task.comments.length === 0 ? (
                          <p className="text-[11px] text-gray-400 italic">No comments posted yet.</p>
                        ) : (
                          task.comments.map((c) => (
                            <div key={c.id} className="bg-white p-2 rounded border text-xs">
                              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                <span className="font-semibold text-gray-700">{c.user}</span>
                                <span>{c.createdAt}</span>
                              </div>
                              <p className="text-gray-600">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="border px-2 py-1 text-xs rounded bg-white w-full focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(task.id)}
                          className="bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-blue-700 shrink-0"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4 shadow-lg border">
            <h3 className="font-bold text-base border-b pb-2">Create Task ({role} View)</h3>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Implement JWT Authentication"
                  className="w-full border p-2 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Insurance Portal"
                  className="w-full border p-2 text-xs rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write task details..."
                  className="w-full border p-2 text-xs rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Assigned To *</label>
                  <input
                    type="text"
                    required
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="e.g. Assignee Name"
                    className="w-full border p-2 text-xs rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full border p-2 text-xs rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.hoursEstimated}
                    onChange={(e) =>
                      setFormData({ ...formData, hoursEstimated: Number(e.target.value) })
                    }
                    className="w-full border p-2 text-xs rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as Priority })
                    }
                    className="w-full border p-2 text-xs rounded bg-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as TaskStatus })
                    }
                    className="w-full border p-2 text-xs rounded bg-white focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 border text-xs rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4 shadow-lg border">
            <h3 className="font-bold text-base border-b pb-2">Edit Task (#{editingTask.id})</h3>

            <form onSubmit={handleUpdateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full border p-2 text-xs rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={editingTask.assignedTo}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, assignedTo: e.target.value })
                    }
                    className="w-full border p-2 text-xs rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Logged Hours</label>
                  <input
                    type="number"
                    value={editingTask.hoursLogged}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        hoursLogged: Number(e.target.value),
                      })
                    }
                    className="w-full border p-2 text-xs rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, priority: e.target.value as Priority })
                  }
                  className="w-full border p-2 text-xs rounded bg-white focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-1.5 border text-xs rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}