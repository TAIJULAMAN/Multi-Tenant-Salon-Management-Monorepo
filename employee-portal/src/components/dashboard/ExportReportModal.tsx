"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSelect from "../customComponent/CustomSelect";
import SubmitButton from "../customComponent/SubmitButton";
import { ExportReportModalProps } from "./types";

export default function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
  const [range, setRange] = useState("Daily");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Report" maxWidth="max-w-[460px]" overflowVisible={true}>
      <div className="mb-8 mt-2">
        <CustomSelect
          label="Range *"
          value={range}
          options={["Daily", "Weekly", "Monthly"]}
          onChange={setRange}
        />
      </div>
      <div className="flex justify-end mt-4 sm:mt-0">
        <SubmitButton onClick={onClose} className="w-full sm:w-auto">
          Export
        </SubmitButton>
      </div>
    </Modal>
  );
}
