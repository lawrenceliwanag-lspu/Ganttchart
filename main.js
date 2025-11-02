import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Download } from 'lucide-react';

export default function GanttChartApp() {
  const [startDate, setStartDate] = useState('2025-04-01');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Requirements Analysis', days: 14 },
    { id: 2, name: 'System Designing', days: 7 },
  ]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDays, setNewTaskDays] = useState('');

  const addTask = () => {
    if (newTaskName && newTaskDays) {
      setTasks([...tasks, {
        id: Date.now(),
        name: newTaskName,
        days: parseInt(newTaskDays)
      }]);
      setNewTaskName('');
      setNewTaskDays('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id, field, value) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const calculateDates = () => {
    const start = new Date(startDate);
    const taskDates = [];
    let currentDate = new Date(start);

    tasks.forEach(task => {
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + task.days - 1);
      
      taskDates.push({
        ...task,
        startDate: new Date(currentDate),
        endDate: new Date(endDate)
      });
      
      currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() + 1);
    });

    return taskDates;
  };

  const generateDayHeaders = () => {
    if (tasks.length === 0) return [];
    
    const totalDays = tasks.reduce((sum, task) => sum + task.days, 0);
    const days = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < totalDays; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const downloadCSV = () => {
    const taskDates = calculateDates();
    const start = new Date(startDate);
    const totalDays = tasks.reduce((sum, task) => sum + task.days, 0);
    
    let csv = 'Task';
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      csv += `,${date.toLocaleDateString()}`;
    }
    csv += '\n';
    
    taskDates.forEach(task => {
      csv += `"${task.name}"`;
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        if (date >= task.startDate && date <= task.endDate) {
          csv += ',1';
        } else {
          csv += ',';
        }
      }
      csv += '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gantt_chart.csv';
    a.click();
  };

  const taskDates = calculateDates();
  const dayHeaders = generateDayHeaders();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Gantt Chart Creator (Daily)
          </h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-64"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days
                </label>
                <input
                  type="number"
                  min="1"
                  value={newTaskDays}
                  onChange={(e) => setNewTaskDays(e.target.value)}
                  placeholder="Days"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
              </div>
              <button
                onClick={addTask}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-md">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    type="number"
                    min="1"
                    value={task.days}
                    onChange={(e) => updateTask(task.id, 'days', parseInt(e.target.value) || 1)}
                    className="w-24 border border-gray-300 rounded-md px-3 py-2"
                  />
                  <span className="text-gray-600 w-16">days</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Download size={20} />
            Download CSV
          </button>
        </div>

        {tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gantt Chart Visualization</h2>
            
            <div className="min-w-max">
              <div className="flex border-b-2 border-gray-300 pb-2 mb-4">
                <div className="w-64 font-semibold text-gray-700">Task</div>
                <div className="flex gap-0.5">
                  {dayHeaders.map((date, i) => (
                    <div key={i} className="w-8 text-center text-xs font-medium text-gray-600">
                      <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {taskDates.map((task) => (
                <div key={task.id} className="flex items-center mb-3">
                  <div className="w-64 text-sm font-medium text-gray-700 pr-4">
                    {task.name}
                    <div className="text-xs text-gray-500">
                      {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {task.days} days
                    </div>
                  </div>
                  <div className="flex gap-0.5 relative h-8">
                    {dayHeaders.map((day, i) => {
                      const isActive = task.startDate <= day && task.endDate >= day;
                      
                      return (
                        <div
                          key={i}
                          className={`w-8 h-full ${
                            isActive ? 'bg-blue-500' : 'bg-gray-100'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">Project Summary</h3>
              <p className="text-sm text-gray-600">
                Total Duration: {tasks.reduce((sum, task) => sum + task.days, 0)} days
              </p>
              <p className="text-sm text-gray-600">
                End Date: {taskDates.length > 0 ? taskDates[taskDates.length - 1].endDate.toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
