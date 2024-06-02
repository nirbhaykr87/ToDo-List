import React, { useState, useEffect } from 'react';
import './TodoList.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Avatar from 'react-avatar';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userName, setUserName] = useState('');
  const [taskPriority, setTaskPriority] = useState('low');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('priority');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '' || userName.trim() === '') return;
    const newTaskObj = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      priority: taskPriority,
      teamMember: userName.trim()
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    setUserName('');
    setTaskPriority('low');
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  
  const getAvatarUrlForPriority = (priority) => {
    switch (priority) {
      case 'high':
        return 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp';
      case 'middle':
        return 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp';
      case 'low':
        return 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp';
      default:
        return ''; 
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'priority') {
      const priorityOrder = { high: 1, middle: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.id - b.id;
  });

  return (
    <div className="todo-list">
      <h1>Task List</h1>
      <div className="controls">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name"
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
          <option value="low">Low priority</option>
          <option value="middle">Middle priority</option>
          <option value="high">High priority</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <select value={sort} onChange={handleSortChange}>
          <option value="priority">Sort by Priority</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th id="team_member">Team Member</th>
            <th>Task</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map(task => (
            <tr key={task.id} className={task.completed ? 'completed' : ''}>
              <td >
                <Avatar src={getAvatarUrlForPriority(task.priority)} name={task.teamMember} size="30" round={true} />
                {task.teamMember}
              </td>
              <td> {task.text}</td>
              <td>
                <span className={`priority ${task.priority}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                </span>
              </td>
              <td>
                <i className={`fas fa-${task.completed ? 'check-circle' : 'circle'}`} onClick={() => handleToggleComplete(task.id)}></i>
                <i className="fas fa-trash-alt" onClick={() => handleRemoveTask(task.id)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
