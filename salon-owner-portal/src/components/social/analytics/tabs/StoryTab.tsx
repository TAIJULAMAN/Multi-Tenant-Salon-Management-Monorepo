"use client";

import React, { useState } from "react";
import { AnalyticsPostRow } from "../../types";
import { ViewPostModal } from "../components/ViewPostModal";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { AnalyticsTabProps } from "../../types";
import { StoryControls } from "../components/StoryControls";
import { StoryTable } from "../components/StoryTable";
import { MOCK_STORIES } from "../../data";

export function StoryTab({ selectedAccount, dateRange }: AnalyticsTabProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStory, setSelectedStory] = useState<AnalyticsPostRow | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredStories = MOCK_STORIES.filter((story) =>
    story.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalItems = filteredStories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStories = filteredStories.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="bg-white rounded-lg flex flex-col mt-2 h-full min-h-0 p-3 sm:p-5">
      <StoryControls
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
      />

      <StoryTable
        paginatedStories={paginatedStories}
        setSelectedStory={setSelectedStory}
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

      {/* View Story Modal */}
      <ViewPostModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedStory}
      />
    </div>
  );
}
