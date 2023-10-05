import React, { useState } from "react";

import "./App.css";

type Task = {
  name: string;
  status: "TODO" | "DONE";
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (newTask: string) => {
    setTasks((tasks: Task[]) =>
      tasks.concat([{ name: newTask, status: "TODO" }]),
    );
  };

  const deleteTask = (taskToDelete: Task) => {
    setTasks((tasks) =>
      tasks.filter((task) => task.name !== taskToDelete.name),
    );
  };

  const markTaskDone = (taskToMarkDone: Task) => {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.name === taskToMarkDone.name) {
          return { ...task, status: "DONE" };
        }
        return task;
      }),
    );
  };

  const todoTasks = tasks.filter((task) => task.status === "TODO");
  const doneTasks = tasks.filter((task) => task.status === "DONE");

  return (
    <div className="App">
      <AddTask addTask={addTask} />
      <TaskList
        tasks={todoTasks}
        deleteTask={deleteTask}
        markTaskDone={markTaskDone}
      />
      <DoneTaskList tasks={doneTasks} />
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
  markTaskDone,
}: {
  tasks: Task[];
  deleteTask: (task: Task) => void;
  markTaskDone: (task: Task) => void;
}) => {
  return (
    <div>
      {tasks.map((task) => {
        return (
          <div style={{ margin: "10px 10px" }}>
            <span style={{ marginRight: 10 }}>{task.name}</span>
            <button onClick={() => deleteTask(task)}>Delete</button>
            <button onClick={() => markTaskDone(task)}>Done</button>
          </div>
        );
      })}
    </div>
  );
};

const DoneTaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div>
      {tasks.map((task) => {
        return (
          <div style={{ margin: "10px 10px", textDecoration: "line-through" }}>
            <span style={{ marginRight: 10 }}>{task.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default App;
