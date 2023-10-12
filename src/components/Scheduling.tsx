import React, { useRef, useEffect } from "react";

export enum Scheduling {
  ALL = "all tasks",
  TODAY = "today",
  THIS_WEEK = "this week",
  THIS_MONTH = "this month",
  THIS_YEAR = "this year",
}

export const SidebarSchedulingButton = ({
  scheduling,
  setScheduling,
  currentScheduling,
}: {
  scheduling: Scheduling;
  setScheduling: React.Dispatch<React.SetStateAction<Scheduling>>;
  currentScheduling: Scheduling;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleDrop = () => console.log("dropped on: ", scheduling);
    const el = ref.current;
    if (el) {
      el.addEventListener("drop", handleDrop);
    }
    return () => {
      if (el) {
        el.removeEventListener("drop", handleDrop);
      }
    };
  }, [scheduling]);

  return (
    <p
      ref={ref}
      style={{
        fontWeight: currentScheduling === scheduling ? "bold" : "normal",
      }}
      onClick={() => setScheduling(scheduling)}
    >
      {scheduling}
    </p>
  );
};

export const SchedulingSidebar = ({
  scheduling,
  setScheduling,
}: {
  scheduling: Scheduling;
  setScheduling: React.Dispatch<React.SetStateAction<Scheduling>>;
}) => {
  return (
    <>
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
    </>
  );
};
