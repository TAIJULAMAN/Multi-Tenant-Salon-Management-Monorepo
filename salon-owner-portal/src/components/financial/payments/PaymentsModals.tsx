"use client";

import React from "react";
import AddPaymentModal from "./AddPaymentModal";
import EditPaymentModal from "./EditPaymentModal";
import DeletePaymentModal from "./DeletePaymentModal";
import RefundModal from "./RefundModal";
import CancelReceiptModal from "./CancelReceiptModal";
import PrintReceiptModal from "./PrintReceiptModal";
import ServiceReceiptModal from "./receipt/ServiceReceiptModal";
import { PaymentRecord } from "@/components/financial/types";

interface PaymentsModalsProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  isRefundModalOpen: boolean;
  setIsRefundModalOpen: (open: boolean) => void;
  isCancelReceiptModalOpen: boolean;
  setIsCancelReceiptModalOpen: (open: boolean) => void;
  isPrintReceiptModalOpen: boolean;
  setIsPrintReceiptModalOpen: (open: boolean) => void;
  isServiceReceiptOpen: boolean;
  setIsServiceReceiptOpen: (open: boolean) => void;
  activePayment: PaymentRecord | null;
  onAddPayment: (data: any) => void;
  onEditPayment: (data: any) => void;
  onDeletePayment: () => void;
}

export default function PaymentsModals({
  isAddModalOpen,
  setIsAddModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isRefundModalOpen,
  setIsRefundModalOpen,
  isCancelReceiptModalOpen,
  setIsCancelReceiptModalOpen,
  isPrintReceiptModalOpen,
  setIsPrintReceiptModalOpen,
  isServiceReceiptOpen,
  setIsServiceReceiptOpen,
  activePayment,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
}: PaymentsModalsProps) {
  return (
    <>
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddPayment}
      />
      <EditPaymentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={activePayment}
        onSave={onEditPayment}
      />
      <DeletePaymentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeletePayment}
      />
      <RefundModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        payment={activePayment}
        onIssueRefund={() => {
          setIsRefundModalOpen(false);
          if (
            activePayment?.receiptStatus === "Completed" ||
            activePayment?.receiptStatus === "Half Printed"
          ) {
            setIsCancelReceiptModalOpen(true);
          }
        }}
      />
      <CancelReceiptModal
        isOpen={isCancelReceiptModalOpen}
        onClose={() => setIsCancelReceiptModalOpen(false)}
        onConfirm={() => {
          setIsCancelReceiptModalOpen(false);
        }}
      />
      <PrintReceiptModal
        isOpen={isPrintReceiptModalOpen}
        onClose={() => setIsPrintReceiptModalOpen(false)}
        status={
          activePayment?.status === "Fully Paid" ? "received" : "not_received"
        }
        onPrint={() => {
          setIsPrintReceiptModalOpen(false);
          setIsServiceReceiptOpen(true);
        }}
      />
      <ServiceReceiptModal
        isOpen={isServiceReceiptOpen}
        onClose={() => setIsServiceReceiptOpen(false)}
        receiptData={activePayment}
      />
    </>
  );
}
