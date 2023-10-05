import React, { useState } from "react";

import "./App.css";

type Task = {
  name: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (newTask: string) => {
    setTasks((tasks: Task[]) => tasks.concat([{ name: newTask }]));
  };

  const deleteTask = (taskToDelete: Task) => {
    setTasks((tasks) =>
      tasks.filter((task) => task.name !== taskToDelete.name),
    );
  };

  return (
    <div className="App">
      <AddTask addTask={addTask} />
      <TaskList tasks={tasks} deleteTask={deleteTask} />
    </div>
  );
}

const AddTask = ({ addTask }: { addTask: (newTask: string) => void }) => {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    setNewTask("");
    addTask(newTask);
  };

  return (
    <div style={{ margin: "10px 10px" }}>
      <input
        value={newTask}
        onChange={(event) => setNewTask(event.currentTarget.value)}
      />
      <button onClick={handleAddTask}>Add task</button>
    </div>
  );
};

const TaskList = ({
  tasks,
  deleteTask,
}: {
  tasks: Task[];
  deleteTask: (task: Task) => void;
}) => {
  return (
    <div>
      {tasks.map((task) => {
        return (
          <div style={{ margin: "10px 10px" }}>
            <span style={{ marginRight: 10 }}>{task.name}</span>
            <button onClick={() => deleteTask(task)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default App;
