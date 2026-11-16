"use client";

import React from "react";
import AddProductModal from "@/components/inventory/products/AddProductModal";
import ViewProductModal from "@/components/inventory/products/ViewProductModal";
import EditProductModal from "@/components/inventory/products/EditProductModal";
import DeleteProductModal from "@/components/inventory/products/DeleteProductModal";
import { InventoryProduct } from "@/components/inventory/types";

interface ProductsModalsProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onSaveAddProduct: (data: any) => void;

  isViewModalOpen: boolean;
  onCloseViewModal: () => void;
  activeProduct: InventoryProduct | null;

  isEditModalOpen: boolean;
  onCloseEditModal: () => void;
  onSaveEditProduct: (data: any) => void;

  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
}

export default function ProductsModals({
  isAddModalOpen,
  onCloseAddModal,
  onSaveAddProduct,
  isViewModalOpen,
  onCloseViewModal,
  activeProduct,
  isEditModalOpen,
  onCloseEditModal,
  onSaveEditProduct,
  isDeleteModalOpen,
  onCloseDeleteModal,
  onConfirmDelete,
}: ProductsModalsProps) {
  return (
    <>
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        onSave={onSaveAddProduct}
      />
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={onCloseViewModal}
        productData={activeProduct}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        onSave={onSaveEditProduct}
        initialData={activeProduct}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
