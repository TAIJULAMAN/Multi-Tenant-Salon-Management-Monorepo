"use client";

import React, { useState } from "react";
import { MOCK_REELS } from "../../data";
import { AnalyticsPostRow } from "../../types";
import { ViewPostModal } from "../components/ViewPostModal";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { AnalyticsTabProps } from "../../types";
import { ReelsControls } from "../components/ReelsControls";
import { ReelsTable } from "../components/ReelsTable";

export function ReelsTab({ selectedAccount, dateRange }: AnalyticsTabProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReel, setSelectedReel] = useState<AnalyticsPostRow | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const itemsPerPage = 10;

  // Filter reels based on search query
  const filteredReels = MOCK_REELS.filter((reel) =>
    reel.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredReels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReels = filteredReels.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-lg flex flex-col mt-2 h-full min-h-0 p-3 sm:p-5">
      <ReelsControls
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
      />

      <ReelsTable
        paginatedReels={paginatedReels}
        setSelectedReel={setSelectedReel}
        setIsViewModalOpen={setIsViewModalOpen}
      />

      {/* Pagination Footer */}
      <div className="p-4 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* View Post/Reel Modal */}
      <ViewPostModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedReel}
      />
    </div>
  );
}
