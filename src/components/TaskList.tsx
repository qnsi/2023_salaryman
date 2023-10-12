import { useEffect, useRef, useState } from "react";
import { Task, TimeInMin } from "../App";

export const TaskList = ({
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
          <SingleTask
            task={task}
            deleteTask={deleteTask}
            markTaskDone={markTaskDone}
            startTimer={startTimer}
          />
        );
      })}
    </div>
  );
};

const SingleTask = ({
  task,
  deleteTask,
  markTaskDone,
  startTimer,
}: {
  task: Task;
  deleteTask: (task: Task) => void;
  markTaskDone: (task: Task) => void;
  startTimer: (task: Task) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDragStart = (event: DragEvent) => {
      event.dataTransfer!.effectAllowed = "move";
      event.dataTransfer?.setData("text", task.name);
      console.log("dragging started on: ", task.name);
    };
    const el = ref.current;
    if (el) {
      el.addEventListener("dragstart", handleDragStart);
    }
    return () => {
      if (el) {
        el.removeEventListener("dragstart", handleDragStart);
      }
    };
  }, [task]);

  return (
    <div ref={ref} draggable style={{ margin: "10px 10px" }}>
      <span style={{ marginRight: 10 }}>{task.name}</span>
      <span style={{ marginRight: 10 }}>
        {task.time ? task.time + "min" : ""}
      </span>
      <button onClick={() => deleteTask(task)}>Delete</button>
      <button onClick={() => startTimer(task)}>Start</button>
      <button onClick={() => markTaskDone(task)}>Done</button>
    </div>
  );
};

export const DoneTaskList = ({ tasks }: { tasks: Task[] }) => {
  const [showDoneTasks, setShowDoneTasks] = useState(true);

  return (
    <>
      <button onClick={() => setShowDoneTasks((show) => !show)}>
        {showDoneTasks ? "hide done" : "show done"}
      </button>
      <div>
        {showDoneTasks &&
          tasks.map((task) => {
            return (
              <div
                style={{ margin: "10px 10px", textDecoration: "line-through" }}
              >
                <span style={{ marginRight: 10 }}>{task.name}</span>
                <span style={{ marginRight: 10 }}>time: </span>
                <TimeInMin time={task.time} />
              </div>
            );
          })}
      </div>
    </>
  );
};
