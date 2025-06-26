import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { eventData } from '../data/eventData';

const TaskManager = ({ eventType }) => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');

  const aiLoadedRef = useRef(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${eventType}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [eventType]);

  useEffect(() => {
    localStorage.setItem(`tasks_${eventType}`, JSON.stringify(tasks));
  }, [tasks, eventType]);

  useEffect(() => {
    if (!eventType || aiLoadedRef.current) return;

    setLoading(true);
    setError('');

    axios
      .post('http://localhost:5000/api/ai/tasks', { eventType })
      .then((response) => {
        const aiTasks = response.data.tasks || eventData[eventType]?.tasks || [];
        const newTasks = aiTasks
          .filter((text) => !tasks.some((task) => task.text === text))
          .map((text, index) => ({
            id: Date.now() + index,
            text,
            completed: false,
            priority: 'Medium',
          }));
        setTasks((prev) => [...prev, ...newTasks]);
        setLoading(false);
        aiLoadedRef.current = true;
      })
      .catch(() => {
        const defaultTasks = eventData[eventType]?.tasks || [];
        const newTasks = defaultTasks
          .filter((text) => !tasks.some((task) => task.text === text))
          .map((text, index) => ({
            id: Date.now() + index,
            text,
            completed: false,
            priority: 'Medium',
          }));
        setTasks((prev) => [...prev, ...newTasks]);
        setError('Failed to load AI tasks. Using defaults.');
        setLoading(false);
        aiLoadedRef.current = true;
      });
  }, [eventType, tasks]);

  const addTask = () => {
    if (!taskInput.trim()) {
      setError('Please enter a task.');
      return;
    }
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskInput,
        completed: false,
        priority: 'Medium',
      },
    ]);
    setTaskInput('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) {
      setError('Task cannot be empty.');
      return;
    }
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, text: editText, priority: editPriority } : task
    ));
    setEditingTaskId(null);
    setEditText('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
    setError('');
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="task-manager p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Task Manager</h2>

      {loading && <p className="text-blue-600 mb-2">Loading AI tasks...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a task..."
          className="flex-1 p-2 border rounded"
        />
        <button onClick={addTask} className="bg-indigo-600 text-white px-4 rounded">Add</button>
      </div>

      <div className="mb-4 flex gap-2">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {completedCount > 0 && (
          <button onClick={clearCompleted} className="text-red-600 text-sm ml-auto">
            Clear Completed
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <li key={task.id} className="p-3 border rounded flex justify-between items-center">
            {editingTaskId === task.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                  className="flex-1 p-2 border rounded mr-2"
                  autoFocus
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button onClick={() => saveEdit(task.id)} className="text-green-600 ml-2">Save</button>
                <button onClick={cancelEdit} className="text-gray-600 ml-2">Cancel</button>
              </>
            ) : (
              <>
                <div className="flex items-center flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="mr-2"
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.text}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {task.priority}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditing(task)} className="text-indigo-600">Edit</button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-600">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
