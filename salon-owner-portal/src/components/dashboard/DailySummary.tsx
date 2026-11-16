"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ExportReportModal from "./ExportReportModal";
import CashRegisterSettingsModal from "./CashRegisterSettingsModal";
import NewReceiptModal from "./NewReceiptModal";
import ReceiptSuccessModal from "./ReceiptSuccessModal";
import CloseCashRegisterModal from "./CloseCashRegisterModal";
import CloseRegisterSuccessModal from "./CloseRegisterSuccessModal";
import OpenCashRegisterModal from "./OpenCashRegisterModal";
import OpenRegisterSuccessModal from "./OpenRegisterSuccessModal";
import DailySummaryHeader from "./DailySummaryHeader";
import DailySummaryMetrics from "./DailySummaryMetrics";
import DailySummaryActions from "./DailySummaryActions";

export default function DailySummary() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewReceiptModalOpen, setIsNewReceiptModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCloseRegisterModalOpen, setIsCloseRegisterModalOpen] = useState(false);
  const [isCloseSuccessModalOpen, setIsCloseSuccessModalOpen] = useState(false);
  const [isOpenRegisterModalOpen, setIsOpenRegisterModalOpen] = useState(false);
  const [isOpenSuccessModalOpen, setIsOpenSuccessModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("receiptSuccess") === "true") {
      setIsSuccessModalOpen(true);
    }
  }, [searchParams]);


  return (
    <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] h-full flex flex-col justify-between">
      <DailySummaryHeader
        isRegisterOpen={isRegisterOpen}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
      />
      <DailySummaryMetrics />
      <DailySummaryActions
        isRegisterOpen={isRegisterOpen}
        onNewReceipt={() => setIsNewReceiptModalOpen(true)}
        onCloseRegister={() => setIsCloseRegisterModalOpen(true)}
        onOpenRegister={() => setIsOpenRegisterModalOpen(true)}
      />
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <CashRegisterSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onDisconnect={() => {
          setIsRegisterOpen(false);
          setIsSettingsModalOpen(false);
        }}
      />

      <NewReceiptModal
        isOpen={isNewReceiptModalOpen}
        onClose={() => setIsNewReceiptModalOpen(false)}
      />

      <ReceiptSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
        }}
      />

      <CloseCashRegisterModal
        isOpen={isCloseRegisterModalOpen}
        onClose={() => setIsCloseRegisterModalOpen(false)}
        onConfirm={() => {
          setIsCloseRegisterModalOpen(false);
          setIsRegisterOpen(false);
          setIsCloseSuccessModalOpen(true);
        }}
      />

      <CloseRegisterSuccessModal
        isOpen={isCloseSuccessModalOpen}
        onClose={() => setIsCloseSuccessModalOpen(false)}
        onExport={() => {
          setIsCloseSuccessModalOpen(false);
          setIsExportModalOpen(true);
        }}
        onViewDashboard={() => setIsCloseSuccessModalOpen(false)}
      />

      <OpenCashRegisterModal
        isOpen={isOpenRegisterModalOpen}
        onClose={() => setIsOpenRegisterModalOpen(false)}
        onConfirm={() => {
          setIsOpenRegisterModalOpen(false);
          setIsRegisterOpen(true);
          setIsOpenSuccessModalOpen(true);
        }}
      />

      <OpenRegisterSuccessModal
        isOpen={isOpenSuccessModalOpen}
        onClose={() => setIsOpenSuccessModalOpen(false)}
        onCreateReceipt={() => {
          setIsOpenSuccessModalOpen(false);
          setIsNewReceiptModalOpen(true);
        }}
        onViewDashboard={() => setIsOpenSuccessModalOpen(false)}
      />
    </div>
  );
}
