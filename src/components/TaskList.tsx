import { useEffect, useRef, useState } from "react";
import { Task, TimeInMin } from "../App";

export const TaskList = ({
  tasks,
  filterByTag,
  deleteTask,
  markTaskDone,
  startTimer,
}: {
  tasks: Task[];
  filterByTag: string;
  deleteTask: (task: Task) => void;
  markTaskDone: (task: Task) => void;
  startTimer: (task: Task) => void;
}) => {
  const tasksFilteredByTag = !!filterByTag
    ? tasks.filter((task) => (task.tags || []).includes(filterByTag))
    : tasks;

  return (
    <div>
      {tasksFilteredByTag.map((task) => {
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
    // unfinished dragging
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
      {task.tags &&
        task.tags.map((tag) => (
          <span style={{ color: "#888", margin: 3 }}>{tag}</span>
        ))}
    </div>
  );
};

export const DoneTaskList = ({
  tasks,
  filterByTag,
}: {
  tasks: Task[];
  filterByTag: string;
}) => {
  const [showDoneTasks, setShowDoneTasks] = useState(true);

  const tasksFilteredByTag = !!filterByTag
    ? tasks.filter((task) => (task.tags || []).includes(filterByTag))
    : tasks;

  return (
    <>
      <button onClick={() => setShowDoneTasks((show) => !show)}>
        {showDoneTasks ? "hide done" : "show done"}
      </button>
      <div>
        {showDoneTasks &&
          tasksFilteredByTag.map((task) => {
            return (
              <div
                style={{ margin: "10px 10px", textDecoration: "line-through" }}
              >
                <span style={{ marginRight: 10 }}>{task.name}</span>
                <span style={{ marginRight: 10 }}>time: </span>
                <TimeInMin time={task.time} />
                {task.tags &&
                  task.tags.map((tag) => (
                    <span style={{ color: "#888", margin: 3 }}>{tag}</span>
                  ))}
              </div>
            );
          })}
      </div>
    </>
  );
};
