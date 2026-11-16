import { useState } from "react";
import { CalendarView } from "../utils";

export function useRescheduleDate(initialDate: Date = new Date(2025, 8, 2)) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [activePeriod, setActivePeriod] = useState<CalendarView>("Day");

  function fmt(d: Date) {
    if (activePeriod === "Month")
      return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (activePeriod === "Week") {
      const s = new Date(d);
      s.setDate(s.getDate() - s.getDay());
      const e = new Date(s);
      e.setDate(e.getDate() + 6);
      return `${s.toLocaleDateString("en-US", { month: "short", day: "2-digit" })} - ${e.toLocaleDateString("en-US", { month: "short", day: "2-digit" })}`;
    }
    return d
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "2-digit",
      })
      .replace(",", "");
  }

  function prev() {
    setCurrentDate((d) => {
      const nd = new Date(d);
      if (activePeriod === "Day") nd.setDate(nd.getDate() - 1);
      else if (activePeriod === "Week") nd.setDate(nd.getDate() - 7);
      else nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  }

  function next() {
    setCurrentDate((d) => {
      const nd = new Date(d);
      if (activePeriod === "Day") nd.setDate(nd.getDate() + 1);
      else if (activePeriod === "Week") nd.setDate(nd.getDate() + 7);
      else nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  }

  return {
    currentDate,
    setCurrentDate,
    activePeriod,
    setActivePeriod,
    fmt,
    prev,
    next,
  };
}
