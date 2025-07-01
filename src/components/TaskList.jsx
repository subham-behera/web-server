import React, { useState } from 'react';

const TaskList = () => {
  // State to manage tasks
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Function to handle adding a new task
  const addTask = () => {
    if (newTask) {
      setTasks([
        ...tasks,
        { id: Date.now(), name: newTask } // Use Date.now() for unique ID
      ]);
      setNewTask(''); // Reset input field
    }
  };

  // Function to handle removing a task
  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter new task"
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => removeTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
