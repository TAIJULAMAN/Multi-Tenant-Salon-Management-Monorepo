"use client";

import React, { useState, useRef } from "react";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { MOCK_SOCIAL_POSTS } from "../data";
import { CalendarControls } from "./components/CalendarControls";
import { CalendarModals } from "./components/CalendarModals";
import { useCalendarNavigation } from "./hooks/useCalendarNavigation";
import { ViewMode } from "./utils/calendarDateUtils";
import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import SubmitButton from "@/components/customComponent/SubmitButton";

export function CalendarManagement() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 27));
  const [viewMode, setViewMode] = useState<ViewMode>("Month");
  const [account, setAccount] = useState("All Accounts");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<{
    date?: string;
    time?: string;
  }>({});

  const calendarWrapperRef = useRef<HTMLDivElement>(null);

  const { toggleFullscreen, handlePrev, handleNext, headerDate } =
    useCalendarNavigation(
      currentDate,
      setCurrentDate,
      viewMode,
      calendarWrapperRef,
    );

  const handleOpenAddModal = (date?: string, time?: string) => {
    setScheduleData({ date, time });
    setIsAddModalOpen(true);
  };

  const handleProceedToSchedule = () => {
    setIsAddModalOpen(false);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="mb-5">
        <CustomPageHeader
          title="Calendar"
          action={
            <SubmitButton type="button" onClick={() => handleOpenAddModal()}>
              Add Post
            </SubmitButton>
          }
        />
      </div>

      {/* Main Calendar Container */}
      <div
        ref={calendarWrapperRef}
        className="flex-1 bg-white rounded-lg border border-[#E2E8F0] flex flex-col p-3 sm:p-5"
      >
        <CalendarControls
          account={account}
          setAccount={setAccount}
          onConnectAccounts={() => setIsConnectModalOpen(true)}
          onPrev={handlePrev}
          onNext={handleNext}
          headerDate={headerDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onToggleFullscreen={toggleFullscreen}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />

        {/* View Component */}
        <div className="flex-1 overflow-hidden">
          {viewMode === "Month" && (
            <MonthView
              currentDate={currentDate}
              posts={MOCK_SOCIAL_POSTS}
              onAddPost={handleOpenAddModal}
            />
          )}
          {viewMode === "Week" && (
            <WeekView
              currentDate={currentDate}
              posts={MOCK_SOCIAL_POSTS}
              onAddPost={handleOpenAddModal}
            />
          )}
          {viewMode === "Day" && (
            <DayView
              currentDate={currentDate}
              posts={MOCK_SOCIAL_POSTS}
              onAddPost={handleOpenAddModal}
            />
          )}
        </div>
      </div>

      <CalendarModals
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        onProceedToSchedule={handleProceedToSchedule}
        isScheduleModalOpen={isScheduleModalOpen}
        onCloseScheduleModal={() => setIsScheduleModalOpen(false)}
        onConfirmSchedule={(date, time) => {
          console.log("Scheduling for", date, time);
          setIsScheduleModalOpen(false);
        }}
        scheduleDate={scheduleData.date}
        scheduleTime={scheduleData.time}
        isConnectModalOpen={isConnectModalOpen}
        onCloseConnectModal={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
