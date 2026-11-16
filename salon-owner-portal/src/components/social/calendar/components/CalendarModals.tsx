"use client";

import React from "react";
import { AddPostModal } from "../modals/AddPostModal";
import { SchedulePostModal } from "../modals/SchedulePostModal";
import ConnectSocialMediaModal from "../../ConnectSocialMediaModal";

interface CalendarModalsProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onProceedToSchedule: () => void;

  isScheduleModalOpen: boolean;
  onCloseScheduleModal: () => void;
  onConfirmSchedule: (date: string, time: string) => void;
  scheduleDate?: string;
  scheduleTime?: string;

  isConnectModalOpen: boolean;
  onCloseConnectModal: () => void;
}

export function CalendarModals({
  isAddModalOpen,
  onCloseAddModal,
  onProceedToSchedule,
  isScheduleModalOpen,
  onCloseScheduleModal,
  onConfirmSchedule,
  scheduleDate,
  scheduleTime,
  isConnectModalOpen,
  onCloseConnectModal,
}: CalendarModalsProps) {
  return (
    <>
      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onSchedule={onProceedToSchedule}
      />

      <SchedulePostModal
        isOpen={isScheduleModalOpen}
        onClose={onCloseScheduleModal}
        onConfirm={onConfirmSchedule}
        initialDate={scheduleDate}
        initialTime={scheduleTime}
      />

      <ConnectSocialMediaModal
        isOpen={isConnectModalOpen}
        onClose={onCloseConnectModal}
      />
    </>
  );
}

