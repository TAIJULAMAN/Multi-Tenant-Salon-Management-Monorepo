"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  Search,
  RotateCcw
} from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { CustomSelect } from "@/components/common/CustomSelect";
import CustomDateRangePickerWithPresets from "@/components/customComponent/CustomDateRangePickerWithPresets";
import AddGiftCardModal from "@/components/saloonOwner/financial/gifts-cards/AddGiftCardModal";
import ViewGiftCardModal from "@/components/saloonOwner/financial/gifts-cards/ViewGiftCardModal";
import DeleteGiftCardModal from "@/components/saloonOwner/financial/gifts-cards/DeleteGiftCardModal";

import { GiftCardRecord as GiftCard } from "@/components/financial/types";
import { MOCK_GIFT_CARDS } from "@/components/financial/data";

const isDateInRange = (dateStr: string, from: string, to: string) => {
  if (!from && !to) return true;
  const targetTime = new Date(dateStr).getTime();
  if (isNaN(targetTime)) return true;
  if (from) {
    const fromTime = new Date(from).setHours(0, 0, 0, 0);
    if (targetTime < fromTime) return false;
  }
  if (to) {
    const toTime = new Date(to).setHours(23, 59, 59, 999);
    if (targetTime > toTime) return false;
  }
  return true;
};

export default function GiftsCardsPage() {
  const [cards, setCards] = useState<GiftCard[]>(MOCK_GIFT_CARDS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Custom Range Filters for Issue and Expiration
  const [issueDateLabel, setIssueDateLabel] = useState("All");
  const [issueDateFrom, setIssueDateFrom] = useState("");
  const [issueDateTo, setIssueDateTo] = useState("");

  const [expirationDateLabel, setExpirationDateLabel] = useState("All");
  const [expirationDateFrom, setExpirationDateFrom] = useState("");
  const [expirationDateTo, setExpirationDateTo] = useState("");

  const [serviceFilter, setServiceFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<GiftCard | null>(null);

  const handleAddCard = (data: any) => {
    setCards([data, ...cards]);
  };

  const handleDeleteCard = () => {
    if (activeCard) {
      setCards(cards.filter((c) => c.id !== activeCard.id));
      setActiveCard(null);
    }
    setIsDeleteModalOpen(false);
  };

  const eligibleServices = useMemo(() => {
    return Array.from(new Set(cards.map((c) => c.eligibleServices)));
  }, [cards]);

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    issueDateLabel !== "All" ||
    expirationDateLabel !== "All" ||
    serviceFilter !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setIssueDateLabel("All");
    setIssueDateFrom("");
    setIssueDateTo("");
    setExpirationDateLabel("All");
    setExpirationDateFrom("");
    setExpirationDateTo("");
    setServiceFilter("All");
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search
      const matchesSearch =
        card.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(card.amount).includes(searchQuery) ||
        card.eligibleServices.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.issueDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.expirationDate.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== "All") {
        if (statusFilter === "Used" && card.status !== "Used") return false;
        if (statusFilter === "No-Used" && card.status !== "No-Used") return false;
        if (statusFilter === "Active" && card.subStatus !== "Active") return false;
        if (statusFilter === "Expired" && card.subStatus !== "Expired") return false;
      }

      // Date of Issue Custom Range
      if (issueDateLabel !== "All" && (issueDateFrom || issueDateTo)) {
        if (!isDateInRange(card.issueDate, issueDateFrom, issueDateTo)) return false;
      }

      // Date of Expiration Custom Range
      if (expirationDateLabel !== "All" && (expirationDateFrom || expirationDateTo)) {
        if (!isDateInRange(card.expirationDate, expirationDateFrom, expirationDateTo)) return false;
      }

      // Eligible Services
      if (serviceFilter !== "All" && card.eligibleServices !== serviceFilter) return false;

      return true;
    });
  }, [
    cards,
    searchQuery,
    statusFilter,
    issueDateLabel,
    issueDateFrom,
    issueDateTo,
    expirationDateLabel,
    expirationDateFrom,
    expirationDateTo,
    serviceFilter,
  ]);

  const totalItems = filteredCards.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

  const FilterGroup = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
  }) => (
    <div className="flex-1 min-w-[140px]">
      <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5">{label}</label>
      <CustomSelect
        value={value || "All"}
        options={["All", ...options]}
        onChange={(val) => {
          onChange(val);
          setCurrentPage(1);
        }}
        className="w-full"
        buttonClassName="w-full justify-between"
        align="left"
      />
    </div>
  );

  return (
    <div className="w-full space-y-6 pb-12 font-manrope">
      {/* Top Header & Filters Container */}
      <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#1E293B]">Gifts Cards</h1>
            <p className="text-[12px] text-[#64748B] mt-1">Manage, issue and track client gift cards and certificates.</p>
          </div>
          <Link
            href="/dashboard/clients/client_1/gift-cards/add"
            className="bg-[#635BFF] hover:bg-[#524be0] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Gift Card
          </Link>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-end gap-4 pt-5 mt-6 border-t border-[#E2E8F0]">
          <FilterGroup
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={["Used", "No-Used", "Active", "Expired"]}
          />

          {/* Date of Issue - Custom Range */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5">
              Date of issue (Range)
            </label>
            <CustomDateRangePickerWithPresets
              value={issueDateLabel}
              onChange={(label, fromDate, toDate) => {
                setIssueDateLabel(label);
                setIssueDateFrom(fromDate || "");
                setIssueDateTo(toDate || "");
                setCurrentPage(1);
              }}
              placeholder="Select date range"
              className="w-full"
            />
          </div>

          {/* Date of Expiration - Custom Range */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-[#94A3B8] mb-1.5">
              Date of Expiration (Range)
            </label>
            <CustomDateRangePickerWithPresets
              value={expirationDateLabel}
              onChange={(label, fromDate, toDate) => {
                setExpirationDateLabel(label);
                setExpirationDateFrom(fromDate || "");
                setExpirationDateTo(toDate || "");
                setCurrentPage(1);
              }}
              placeholder="Select date range"
              className="w-full"
            />
          </div>

          <FilterGroup
            label="Eligible Services"
            value={serviceFilter}
            onChange={setServiceFilter}
            options={eligibleServices}
          />

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 text-[12px] font-bold text-[#F43F5E] hover:bg-[#FFF1F2] rounded-lg transition-colors border border-[#FFE4E6] flex items-center gap-1.5 h-[38px] shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Search Bar Row */}
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-[320px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by ID, amount, or services..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#635BFF] transition-colors"
            />
          </div>

          <div className="text-[12px] font-medium text-[#94A3B8]">
            Showing <span className="font-bold text-[#1E293B]">{totalItems > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-bold text-[#1E293B]">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
            <span className="font-bold text-[#1E293B]">{totalItems}</span> gift cards
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">ID</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">Date of issue</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">Date of Expiration</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">Amount</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">Eligible Services</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">Usage Limit</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">Status</th>
                <th className="py-5 px-6 text-[13px] font-bold text-[#1E293B] whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedCards.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#94A3B8] text-[13px] font-medium">
                    No gift cards found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedCards.map((card) => (
                  <tr key={card.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-6 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">{card.id}</td>
                    <td className="py-4 px-6 text-[13px] font-semibold text-[#64748B] border-r border-[#E2E8F0]">{card.issueDate}</td>
                    <td className="py-4 px-6 text-[13px] font-semibold text-[#64748B] border-r border-[#E2E8F0]">{card.expirationDate}</td>
                    <td className="py-4 px-6 text-[13px] font-extrabold text-[#1E293B] border-r border-[#E2E8F0]">€ {card.amount}</td>
                    <td className="py-4 px-6 text-[13px] font-semibold text-[#64748B] border-r border-[#E2E8F0]">{card.eligibleServices}</td>
                    <td className="py-4 px-6 text-[13px] font-semibold text-[#64748B] border-r border-[#E2E8F0]">{card.usageLimit}</td>
                    <td className="py-4 px-6 border-r border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        {card.status === "Used" ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-[#635BFF] text-[#635BFF] bg-white whitespace-nowrap">
                            Used
                          </span>
                        ) : (
                          <>
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-[#F59E0B] text-[#F59E0B] bg-white whitespace-nowrap">
                              No-Used
                            </span>
                            {card.subStatus === "Active" && (
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-[#22C55E] text-[#22C55E] bg-white whitespace-nowrap">
                                {card.subStatus}
                              </span>
                            )}
                            {card.subStatus === "Expired" && (
                              <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-[#F43F5E] text-[#F43F5E] bg-white whitespace-nowrap">
                                {card.subStatus}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/dashboard/clients/client_1/gift-cards/view/1`}
                          className="text-[#64748B] hover:text-[#635BFF] transition-colors p-1.5 rounded-lg hover:bg-[#F1F5F9] inline-flex items-center justify-center cursor-pointer"
                          title="View Gift Card"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {/* Requirement 3: Direct edit on full gift card creation/edit page */}
                        <Link
                          href={`/dashboard/clients/client_1/gift-cards/add?edit=${encodeURIComponent(
                            card.id
                          )}&amount=${card.amount}&issueDate=${encodeURIComponent(
                            card.issueDate
                          )}&expirationDate=${encodeURIComponent(
                            card.expirationDate
                          )}&services=${encodeURIComponent(
                            card.eligibleServices
                          )}&usageLimit=${card.usageLimit}`}
                          className="text-[#64748B] hover:text-[#10B981] transition-colors p-1.5 rounded-lg hover:bg-[#F1F5F9] inline-flex items-center justify-center cursor-pointer"
                          title="Edit Gift Card"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setActiveCard(card);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-[#64748B] hover:text-[#EF4444] transition-colors p-1.5 rounded-lg hover:bg-[#F1F5F9] inline-flex items-center justify-center cursor-pointer"
                          title="Delete Gift Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          itemName="gift cards"
          onPageChange={setCurrentPage}
        />
      </div>

      <AddGiftCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCard}
      />
      <ViewGiftCardModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        cardData={activeCard}
      />
      <DeleteGiftCardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCard}
      />
    </div>
  );
}
