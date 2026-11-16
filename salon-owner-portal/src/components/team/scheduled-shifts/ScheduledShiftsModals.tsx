"use client";

import React, { useState } from "react";
import EditShiftModal from "@/components/team/EditShiftModal";
import DeleteShiftModal from "@/components/team/DeleteShiftModal";
import AddTimeOffModal from "@/components/team/AddTimeOffModal";
import AddBlockedTimeModal from "@/components/team/AddBlockedTimeModal";
import AddClosedPeriodModal from "@/components/team/AddClosedPeriodModal";
import AddShiftModal from "@/components/team/AddShiftModal";
import CustomSelect from "@/components/customComponent/CustomSelect";
import Modal from "@/components/customComponent/Modal";

interface ScheduledShiftsModalsProps {
  isEditModalOpen: boolean;
  onCloseEditModal: () => void;
  onSaveEdit: (startTime: string, endTime: string) => void;
  activeShiftForEdit: {
    memberId: string;
    dayIndex: number;
    time: string;
  } | null;

  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;

  isTimeOffModalOpen: boolean;
  onCloseTimeOffModal: () => void;

  isBlockedTimeModalOpen: boolean;
  onCloseBlockedTimeModal: () => void;

  isClosedPeriodModalOpen: boolean;
  onCloseClosedPeriodModal: () => void;
  onSaveClosedPeriod: (
    startDate: string,
    endDate: string,
    reason: string,
  ) => void;

  isAddShiftModalOpen: boolean;
  onCloseAddShiftModal: () => void;

  isExportModalOpen: boolean;
  onCloseExportModal: () => void;
}

export default function ScheduledShiftsModals({
  isEditModalOpen,
  onCloseEditModal,
  onSaveEdit,
  activeShiftForEdit,
  isDeleteModalOpen,
  onCloseDeleteModal,
  onConfirmDelete,
  isTimeOffModalOpen,
  onCloseTimeOffModal,
  isBlockedTimeModalOpen,
  onCloseBlockedTimeModal,
  isClosedPeriodModalOpen,
  onCloseClosedPeriodModal,
  onSaveClosedPeriod,
  isAddShiftModalOpen,
  onCloseAddShiftModal,
  isExportModalOpen,
  onCloseExportModal,
}: ScheduledShiftsModalsProps) {
  const [exportFormat, setExportFormat] = useState("CSV");

  return (
    <>
      <EditShiftModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        onSave={onSaveEdit}
        initialTime={activeShiftForEdit?.time}
      />

      <DeleteShiftModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
      />

      <AddTimeOffModal
        isOpen={isTimeOffModalOpen}
        onClose={onCloseTimeOffModal}
      />

      <AddBlockedTimeModal
        isOpen={isBlockedTimeModalOpen}
        onClose={onCloseBlockedTimeModal}
        onSave={() => {}}
      />

      <AddClosedPeriodModal
        isOpen={isClosedPeriodModalOpen}
        onClose={onCloseClosedPeriodModal}
        onSave={onSaveClosedPeriod}
      />

      <AddShiftModal
        isOpen={isAddShiftModalOpen}
        onClose={onCloseAddShiftModal}
      />

      <Modal
        isOpen={isExportModalOpen}
        onClose={onCloseExportModal}
        title="Export Data"
        maxWidth="max-w-[400px]"
      >
        <div className="flex flex-col gap-5 pt-2">
          <div>
            <CustomSelect
              label="Format"
              value={exportFormat}
              onChange={setExportFormat}
              options={["CSV", "PDF", "Excel"]}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={onCloseExportModal}
              className="bg-[#635BFF] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm cursor-pointer"
            >
              Download
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
