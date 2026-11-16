"use client";

import { useMemo, useCallback } from "react";
import {
  ViewMode,
  toggleCalendarFullscreen,
  getPrevCalendarDate,
  getNextCalendarDate,
  formatCalendarHeaderDate,
} from "../utils/calendarDateUtils";

export function useCalendarNavigation(
  currentDate: Date,
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>,
  viewMode: ViewMode,
  calendarWrapperRef: React.RefObject<HTMLDivElement | null>,
) {
  const toggleFullscreen = useCallback(() => {
    toggleCalendarFullscreen(calendarWrapperRef.current);
  }, [calendarWrapperRef]);

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => getPrevCalendarDate(prev, viewMode));
  }, [setCurrentDate, viewMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => getNextCalendarDate(prev, viewMode));
  }, [setCurrentDate, viewMode]);

  const headerDate = useMemo(() => {
    return formatCalendarHeaderDate(currentDate, viewMode);
  }, [currentDate, viewMode]);

  return {
    toggleFullscreen,
    handlePrev,
    handleNext,
    headerDate,
  };
}

