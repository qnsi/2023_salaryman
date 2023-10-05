import React, { useEffect, useState } from "react";

import "./App.css";

type Task = {
  name: string;
  status: "TODO" | "DONE";
  time: number;
  scheduling: Scheduling;
};

enum Scheduling {
  ALL = "all tasks",
  TODAY = "today",
  THIS_WEEK = "this week",
  THIS_MONTH = "this month",
  THIS_YEAR = "this year",
}

const SidebarSchedulingButton = ({
  scheduling,
  setScheduling,
  currentScheduling,
}: {
  scheduling: Scheduling;
  setScheduling: React.Dispatch<React.SetStateAction<Scheduling>>;
  currentScheduling: Scheduling;
}) => {
  return (
    <p
      style={{
        fontWeight: currentScheduling === scheduling ? "bold" : "normal",
      }}
      onClick={() => setScheduling(scheduling)}
    >
      {scheduling}
    </p>
  );
};

function App() {
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useStickyState<Task[]>([], "tasks");
  const [isTimerRunning, setIsTimerRunning] = useState("");
  const [time, setTime] = useState(0);
  const [scheduling, setScheduling] = useState(Scheduling.TODAY);

  const scheduledTasks = tasks.filter((task) => {
    if (scheduling === Scheduling.ALL) return task;
    return task.scheduling === scheduling;
  });

  const addTask = (newTask: string, time: number) => {
    setTasks((tasks: Task[]) =>
      tasks.concat([
        {
          name: newTask,
          status: "TODO",
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

  return (
    <div style={{ display: "flex", flexDirection: "row" }} className="App">
      <div style={{ width: "20%" }}>
        <SidebarSchedulingButton
          scheduling={Scheduling.ALL}
          setScheduling={setScheduling}
          currentScheduling={scheduling}
        />
        <SidebarSchedulingButton
          scheduling={Scheduling.TODAY}
          setScheduling={setScheduling}
          currentScheduling={scheduling}
        />
        <SidebarSchedulingButton
          scheduling={Scheduling.THIS_WEEK}
          setScheduling={setScheduling}
          currentScheduling={scheduling}
        />
        <SidebarSchedulingButton
          scheduling={Scheduling.THIS_MONTH}
          setScheduling={setScheduling}
          currentScheduling={scheduling}
        />
        <SidebarSchedulingButton
          scheduling={Scheduling.THIS_YEAR}
          setScheduling={setScheduling}
          currentScheduling={scheduling}
        />
      </div>
      <div style={{ width: "80%", textAlign: "left" }}>
        <AddTask addTask={addTask} />
        {isTimerRunning && (
          <div>
            {isTimerRunning}
            <Stopwatch time={time} setTime={setTime} />
          </div>
        )}
        <TaskList
          tasks={todoTasks}
          deleteTask={deleteTask}
          markTaskDone={markTaskDone}
          startTimer={startTimer}
        />
        <DoneTaskList tasks={doneTasks} />
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

const TaskList = ({
  tasks,
  deleteTask,
  markTaskDone,
  startTimer,
}: {
  tasks: Task[];
  deleteTask: (task: Task) => void;
  markTaskDone: (task: Task) => void;
  startTimer: (task: Task) => void;
}) => {
  return (
    <div>
      {tasks.map((task) => {
        return (
          <div style={{ margin: "10px 10px" }}>
            <span style={{ marginRight: 10 }}>{task.name}</span>
            <span style={{ marginRight: 10 }}>
              {task.time ? task.time + "min" : ""}
            </span>
            <button onClick={() => deleteTask(task)}>Delete</button>
            <button onClick={() => startTimer(task)}>Start</button>
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
            <span style={{ marginRight: 10 }}>time: </span>
            <TimeInMin time={task.time} />
          </div>
        );
      })}
    </div>
  );
};

const TimeInMin = ({ time }: { time: number }) => {
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
