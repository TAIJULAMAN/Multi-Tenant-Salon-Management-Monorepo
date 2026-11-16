"use client";

import React from "react";
import AddReceiptModal from "./AddReceiptModal";
import ViewReceiptModal from "./ViewReceiptModal";
import EditReceiptModal from "./EditReceiptModal";
import DeleteReceiptModal from "./DeleteReceiptModal";
import { ReceiptRecord } from "@/components/financial/types";

interface ReceiptsModalsProps {
  isAddOpen: boolean;
  onCloseAdd: () => void;
  onSaveAdd: (data: any) => void;
  isViewOpen: boolean;
  onCloseView: () => void;
  isEditOpen: boolean;
  onCloseEdit: () => void;
  onSaveEdit: (data: any) => void;
  isDeleteOpen: boolean;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  activePayment: ReceiptRecord | null;
}

export const ReceiptsModals: React.FC<ReceiptsModalsProps> = ({
  isAddOpen,
  onCloseAdd,
  onSaveAdd,
  isViewOpen,
  onCloseView,
  isEditOpen,
  onCloseEdit,
  onSaveEdit,
  isDeleteOpen,
  onCloseDelete,
  onConfirmDelete,
  activePayment,
}) => {
  return (
    <>
      <AddReceiptModal
        isOpen={isAddOpen}
        onClose={onCloseAdd}
        onSave={onSaveAdd}
      />
      <ViewReceiptModal
        isOpen={isViewOpen}
        onClose={onCloseView}
        receiptData={activePayment}
      />
      <EditReceiptModal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        onSave={onSaveEdit}
        initialData={activePayment}
      />
      <DeleteReceiptModal
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

