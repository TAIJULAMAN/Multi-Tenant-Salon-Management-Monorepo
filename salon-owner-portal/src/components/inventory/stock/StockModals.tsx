"use client";

import React from "react";
import AddStockModal from "@/components/inventory/stock/AddStockModal";
import EditStockModal from "@/components/inventory/stock/EditStockModal";
import DeleteStockModal from "@/components/inventory/stock/DeleteStockModal";
import { StockMovement } from "@/components/inventory/types";

interface StockModalsProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onSaveAddStock: (data: any) => void;

  isEditModalOpen: boolean;
  onCloseEditModal: () => void;
  onSaveEditStock: (data: any) => void;
  activeStock: StockMovement | null;

  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
}

export default function StockModals({
  isAddModalOpen,
  onCloseAddModal,
  onSaveAddStock,
  isEditModalOpen,
  onCloseEditModal,
  onSaveEditStock,
  activeStock,
  isDeleteModalOpen,
  onCloseDeleteModal,
  onConfirmDelete,
}: StockModalsProps) {
  return (
    <>
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onSave={onSaveAddStock}
      />
      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        onSave={onSaveEditStock}
        initialData={activeStock}
      />
      <DeleteStockModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
