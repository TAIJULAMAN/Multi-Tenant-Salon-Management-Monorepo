"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import ViewPayslipModal from "@/components/team/ViewPayslipModal";
import { SalaryRecord } from "@/components/team/types";
import {
  initialPendingSalaries,
  initialApprovedSalaries,
} from "@/components/team/data";
import { PendingSalariesTable } from "@/components/team/salaries/PendingSalariesTable";
import { ApprovedSalariesTable } from "@/components/team/salaries/ApprovedSalariesTable";
import { PaymentHistoryTable } from "@/components/team/salaries/PaymentHistoryTable";
import { SalaryPaymentWorkflowModal } from "@/components/team/salaries/SalaryPaymentWorkflowModal";

export default function SalariesPage() {
  const [activeTab, setActiveTab] = useState<"Pending Approval" | "Payment History">("Pending Approval");
  const [pendingSalaries, setPendingSalaries] = useState<SalaryRecord[]>(initialPendingSalaries);
  const [approvedSalaries, setApprovedSalaries] = useState<SalaryRecord[]>(initialApprovedSalaries);

  // Payslip Modal state
  const [selectedSalaryRecord, setSelectedSalaryRecord] = useState<SalaryRecord | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  // Expandable rows state
  const [expandedRows, setExpandedRows] = useState<string[]>(["1", "h1"]);

  // Revolut Payment Modal Workflow State (0: closed, 1: confirm, 2: 2fa, 3: processing, 4: success)
  const [paymentWorkflowStep, setPaymentWorkflowStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  const handleViewPayslip = (record: SalaryRecord) => {
    setSelectedSalaryRecord(record);
    setIsPayslipModalOpen(true);
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleApprove = (id: string) => {
    const record = pendingSalaries.find((s) => s.id === id);
    if (record) {
      setPendingSalaries((prev) => prev.filter((s) => s.id !== id));
      setApprovedSalaries((prev) => [
        ...prev,
        { ...record, status: "Approved", month: undefined },
      ]);
    }
  };

  const handleReject = (id: string) => {
    setPendingSalaries((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full space-y-6 pb-12 relative">
      {/* Top Header & Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-[1.15rem] font-bold text-[#1E293B]">Salaries</h1>
            <button className="w-full sm:w-auto justify-center bg-[#E0E7FF] hover:bg-[#C7D2FE] text-[#635BFF] px-6 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("Pending Approval")}
              className={`pb-4 text-[13px] font-bold transition-colors relative whitespace-nowrap shrink-0 ${
                activeTab === "Pending Approval"
                  ? "text-[#635BFF]"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              Pending Approval ({pendingSalaries.length})
              {activeTab === "Pending Approval" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#635BFF] rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Payment History")}
              className={`pb-4 text-[13px] font-bold transition-colors relative whitespace-nowrap shrink-0 ${
                activeTab === "Payment History"
                  ? "text-[#635BFF]"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              Payment History
              {activeTab === "Payment History" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#635BFF] rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pending Approval Tab */}
      {activeTab === "Pending Approval" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <PendingSalariesTable
            salaries={pendingSalaries}
            expandedRows={expandedRows}
            onToggleRow={toggleRow}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewPayslip={handleViewPayslip}
          />

          <ApprovedSalariesTable
            salaries={approvedSalaries}
            expandedRows={expandedRows}
            onToggleRow={toggleRow}
            onViewPayslip={handleViewPayslip}
            onStartPaymentWorkflow={() => setPaymentWorkflowStep(1)}
          />
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === "Payment History" && (
        <PaymentHistoryTable
          expandedRows={expandedRows}
          onToggleRow={toggleRow}
          onViewPayslip={handleViewPayslip}
        />
      )}

      {/* Revolut Payment Modal Workflow */}
      <SalaryPaymentWorkflowModal
        step={paymentWorkflowStep}
        onClose={() => setPaymentWorkflowStep(0)}
        onSetStep={setPaymentWorkflowStep}
      />

      {/* View Payslip Modal */}
      <ViewPayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        record={selectedSalaryRecord}
      />
    </div>
  );
}
