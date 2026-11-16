"use client";

import React, { useState, useEffect } from "react";
import StockFilterHeader from "@/components/inventory/stock/StockFilterHeader";
import StockTable from "@/components/inventory/stock/StockTable";
import StockModals from "@/components/inventory/stock/StockModals";
import { MOCK_STOCKS } from "@/components/inventory/data";
import { StockMovement } from "@/components/inventory/types";

export default function StockPage() {
  const [stocks, setStocks] = useState<StockMovement[]>(MOCK_STOCKS);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeStock, setActiveStock] = useState<StockMovement | null>(null);

  const [activeMovement, setActiveMovement] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleAddStock = (data: any) => {
    setStocks([data, ...stocks]);
  };

  const handleEditStock = (data: any) => {
    setStocks(stocks.map((s) => (s.id === data.id ? data : s)));
  };

  const handleDeleteStock = () => {
    if (activeStock) {
      setStocks(stocks.filter((s) => s.id !== activeStock.id));
      setActiveStock(null);
    }
    setIsDeleteModalOpen(false);
  };

  const filteredStocks = stocks.filter((stock) => {
    const matchesMovement =
      activeMovement === "All" ||
      (activeMovement === "Stock In" && stock.type === "In") ||
      (activeMovement === "Stock Out" && stock.type === "Out");
    const matchesStatus =
      activeStatus === "All" || stock.status === activeStatus;
    const matchesCategory = activeCategory === "All";
    return matchesMovement && matchesStatus && matchesCategory;
  });

  const totalItems = filteredStocks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStocks = filteredStocks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeMovement, activeCategory, activeStatus, itemsPerPage]);

  return (
    <div className="w-full space-y-6 pb-12">
      <StockFilterHeader
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        onAddMovement={() => setIsAddModalOpen(true)}
      />

      <StockTable
        stocks={paginatedStocks}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onEdit={(stock) => {
          setActiveStock(stock);
          setIsEditModalOpen(true);
        }}
        onDelete={(stock) => {
          setActiveStock(stock);
          setIsDeleteModalOpen(true);
        }}
      />

      <StockModals
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        onSaveAddStock={handleAddStock}
        isEditModalOpen={isEditModalOpen}
        onCloseEditModal={() => setIsEditModalOpen(false)}
        onSaveEditStock={handleEditStock}
        activeStock={activeStock}
        isDeleteModalOpen={isDeleteModalOpen}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteStock}
      />
    </div>
  );
}
