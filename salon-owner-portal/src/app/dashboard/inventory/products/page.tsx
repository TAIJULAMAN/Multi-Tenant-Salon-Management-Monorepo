"use client";

import React, { useState, useEffect } from "react";
import ProductsFilterHeader from "@/components/inventory/products/ProductsFilterHeader";
import ProductsTable from "@/components/inventory/products/ProductsTable";
import ProductsModals from "@/components/inventory/products/ProductsModals";
import { MOCK_PRODUCTS } from "@/components/inventory/data";
import { InventoryProduct } from "@/components/inventory/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<InventoryProduct[]>(MOCK_PRODUCTS);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<InventoryProduct | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePriority, setActivePriority] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddProduct = (data: any) => {
    setProducts([data, ...products]);
  };

  const handleEditProduct = (data: any) => {
    setProducts(products.map((p) => (p.id === data.id ? data : p)));
  };

  const handleDeleteProduct = () => {
    if (activeProduct) {
      setProducts(products.filter((p) => p.id !== activeProduct.id));
      setActiveProduct(null);
    }
    setIsDeleteModalOpen(false);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesPriority =
      activePriority === "All" || product.priority === activePriority;
    const matchesStatus =
      activeStatus === "All" || product.status === activeStatus;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, activePriority, activeStatus, itemsPerPage]);

  return (
    <div className="w-full space-y-6 pb-12">
      <ProductsFilterHeader
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activePriority={activePriority}
        onPriorityChange={setActivePriority}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        onAddProduct={() => setIsAddModalOpen(true)}
      />

      <ProductsTable
        products={paginatedProducts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onEdit={(prod) => {
          setActiveProduct(prod);
          setIsEditModalOpen(true);
        }}
        onDelete={(prod) => {
          setActiveProduct(prod);
          setIsDeleteModalOpen(true);
        }}
      />

      <ProductsModals
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        onSaveAddProduct={handleAddProduct}
        isViewModalOpen={isViewModalOpen}
        onCloseViewModal={() => setIsViewModalOpen(false)}
        activeProduct={activeProduct}
        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onSaveEditProduct={handleEditProduct}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteProduct}
      />
    </div>
  );
}
