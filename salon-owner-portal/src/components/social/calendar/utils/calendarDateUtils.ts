export type ViewMode = "Month" | "Week" | "Day";

export const toggleCalendarFullscreen = (element: HTMLElement | null) => {
  if (!document.fullscreenElement) {
    element?.requestFullscreen().catch((err) => {
      console.error(`Fullscreen error: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

export const getPrevCalendarDate = (currentDate: Date, viewMode: ViewMode): Date => {
  const newDate = new Date(currentDate);
  if (viewMode === "Month") {
    newDate.setMonth(newDate.getMonth() - 1);
  } else if (viewMode === "Week") {
    newDate.setDate(newDate.getDate() - 7);
  } else {
    newDate.setDate(newDate.getDate() - 1);
  }
  return newDate;
};

export const getNextCalendarDate = (currentDate: Date, viewMode: ViewMode): Date => {
  const newDate = new Date(currentDate);
  if (viewMode === "Month") {
    newDate.setMonth(newDate.getMonth() + 1);
  } else if (viewMode === "Week") {
    newDate.setDate(newDate.getDate() + 7);
  } else {
    newDate.setDate(newDate.getDate() + 1);
  }
  return newDate;
};

export const formatCalendarHeaderDate = (
  currentDate: Date,
  viewMode: ViewMode,
): string => {
  if (viewMode === "Month") {
    return currentDate.toLocaleDateString("en-US", { month: "long" });
  }
  if (viewMode === "Week") {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const start = new Date(d.setDate(diff));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const startMonth = start.toLocaleDateString("en-US", { month: "long" });
    const endMonth = end.toLocaleDateString("en-US", { month: "long" });

    return `${startMonth} ${String(start.getDate()).padStart(2, "0")} - ${endMonth} ${String(end.getDate()).padStart(2, "0")}`;
  }
  return currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

