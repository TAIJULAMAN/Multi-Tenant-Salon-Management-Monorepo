"use client";

import React, { useState, useRef } from "react";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { MOCK_SOCIAL_POSTS } from "../data";
import { AddPostModal } from "./modals/AddPostModal";
import { SchedulePostModal } from "./modals/SchedulePostModal";
import ConnectSocialMediaModal from "../ConnectSocialMediaModal";

import CustomPageHeader from "@/components/customComponent/CustomPageHeader";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { CalendarControls } from "./components/CalendarControls";

type ViewMode = "Month" | "Week" | "Day";

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      calendarWrapperRef.current?.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleOpenAddModal = (date?: string, time?: string) => {
    setScheduleData({ date, time });
    setIsAddModalOpen(true);
  };

  const handleProceedToSchedule = () => {
    setIsAddModalOpen(false);
    setIsScheduleModalOpen(true);
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "Month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === "Week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "Month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === "Week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatHeaderDate = () => {
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

      if (startMonth === endMonth) {
        return `${startMonth} ${String(start.getDate()).padStart(2, "0")} - ${endMonth} ${String(end.getDate()).padStart(2, "0")}`;
      }
      return `${startMonth} ${String(start.getDate()).padStart(2, "0")} - ${endMonth} ${String(end.getDate()).padStart(2, "0")}`;
    }
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
          headerDate={formatHeaderDate()}
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

      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSchedule={handleProceedToSchedule}
      />

      <SchedulePostModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={(date, time) => {
          console.log("Scheduling for", date, time);
          setIsScheduleModalOpen(false);
        }}
        initialDate={scheduleData.date}
        initialTime={scheduleData.time}
      />

      <ConnectSocialMediaModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
