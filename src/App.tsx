import React, { useRef, useEffect, useState } from "react";

import "./App.css";
import { DoneTaskList, TaskList } from "./components/TaskList";
import { Scheduling, SchedulingSidebar } from "./components/Scheduling";
import { TagsSidebar } from "./components/TagsSidebar";

export type Task = {
  name: string;
  tags: string[];
  status: "TODO" | "DONE";
  time: number;
  scheduling: Scheduling;
};

function App() {
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useStickyState<Task[]>([], "tasks");
  const [isTimerRunning, setIsTimerRunning] = useState("");
  const [filterByTag, setFilterByTag] = useState("");
  const [time, setTime] = useState(0);
  const [scheduling, setScheduling] = useState(Scheduling.TODAY);

  const scheduledTasks = tasks.filter((task) => {
    if (scheduling === Scheduling.ALL) return task;
    return task.scheduling === scheduling;
  });

  const parseProjectsFromTaskName = (taskName: string): [string, string[]] => {
    const firstTagIndex = taskName.indexOf("#");
    const tagFound = firstTagIndex > 0;

    if (tagFound) {
      const cleanedTaskName = taskName.substring(0, firstTagIndex);
      const tagsString = taskName.substring(firstTagIndex);
      const tags = tagsString.split(" ");

      return [cleanedTaskName, tags];
    } else {
      return [taskName, []];
    }
  };

  const addTask = (newTask: string, time: number) => {
    const [cleanedTaskName, tags] = parseProjectsFromTaskName(newTask);
    setTasks((tasks: Task[]) =>
      tasks.concat([
        {
          name: cleanedTaskName,
          status: "TODO",
          tags,
          time,
          scheduling,
        },
      ]),
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
          return { ...task, time, status: "DONE" };
        }
        return task;
      }),
    );
    stopTimer();
  };

  const updateTask = (
    taskToUpdate: Task,
    newTaskName: string,
    newTags: string[],
  ) => {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.name === taskToUpdate.name) {
          return { ...task, name: newTaskName, tags: newTags };
        }
        return task;
      }),
    );
  };

  const startTimer = (task: Task) => {
    setTime(0);
    setIsTimerRunning(task.name);
  };

  const stopTimer = () => {
    setTime(0);
    setIsTimerRunning("");
  };

  const todoTasks = scheduledTasks.filter((task) => task.status === "TODO");
  const doneTasks = scheduledTasks.filter((task) => task.status === "DONE");
  const allTags = [...new Set(scheduledTasks.map((task) => task.tags).flat())];

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className="App">
      <div style={{ width: "20%" }}>
        <SchedulingSidebar
          setScheduling={setScheduling}
          scheduling={scheduling}
        />
      </div>
      <div style={{ width: "60%", textAlign: "left" }}>
        <AddTask addTask={addTask} />
        {isTimerRunning && (
          <div>
            {isTimerRunning}
            <Stopwatch time={time} setTime={setTime} />
          </div>
        )}
        <TaskList
          tasks={todoTasks}
          filterByTag={filterByTag}
          deleteTask={deleteTask}
          markTaskDone={markTaskDone}
          sendUpdateTask={updateTask}
          startTimer={startTimer}
        />
        <DoneTaskList tasks={doneTasks} filterByTag={filterByTag} />
      </div>
      <div style={{ width: "20%", textAlign: "left" }}>
        <TagsSidebar
          tags={allTags}
          filterByTag={filterByTag}
          setFilterByTag={setFilterByTag}
        />
      </div>
    </div>
  );
}

const AddTask = ({
  addTask,
}: {
  addTask: (newTask: string, time: number) => void;
}) => {
  const [newTask, setNewTask] = useState("");
  const [newTaskTime, setNewTaskTime] = useState(0);

  const handleAddTask = () => {
    addTask(newTask, newTaskTime);
    setNewTask("");
    setNewTaskTime(0);
  };

  const handleNewTaskTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTaskTime(Number(event.currentTarget.value));
  };

  return (
    <div style={{ margin: "10px 10px" }}>
      <input
        placeholder={"task name"}
        value={newTask}
        onChange={(event) => setNewTask(event.currentTarget.value)}
      />
      <input
        placeholder={"time in minutes"}
        value={newTaskTime}
        type={"number"}
        onChange={handleNewTaskTimeChange}
      />
      <button onClick={handleAddTask}>Add task</button>
    </div>
  );
};

export const TimeInMin = ({ time }: { time: number }) => {
  return (
    <>
      {Math.floor(time / 60)}:{time % 60}
    </>
  );
};

const Stopwatch = ({
  time,
  setTime,
}: {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [running, setRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (running) {
      setRunning(true);
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!running && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, setTime]);

  return (
    <p>
      <TimeInMin time={time} />
    </p>
  );
};

function useStickyState<Type>(
  defaultValue: Type,
  key: string,
): [Type, React.Dispatch<React.SetStateAction<Type>>] {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? (JSON.parse(stickyValue) as Type)
      : defaultValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default App;
