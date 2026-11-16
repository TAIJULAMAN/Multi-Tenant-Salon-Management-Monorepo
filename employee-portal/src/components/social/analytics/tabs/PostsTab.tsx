"use client";

import React, { useState } from "react";
import { MOCK_ANALYTICS_POSTS } from "../../data";
import { AnalyticsPostRow } from "../../types";
import Pagination from "@/components/customComponent/Pagination";
import { ViewPostModal } from "../components/ViewPostModal";
import { AnalyticsTabProps } from "../../types";
import { PostsControls } from "../components/PostsControls";
import { PostsTable } from "../components/PostsTable";

export function PostsTab({ selectedAccount, dateRange }: AnalyticsTabProps) {
  const [postType, setPostType] = useState("All Post Types");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<AnalyticsPostRow | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredPosts = MOCK_ANALYTICS_POSTS.filter((post) => {
    const matchesType = postType === "All Post Types" || post.type === postType;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-lg flex flex-col mt-2 h-full min-h-0 p-3 sm:p-5">
      <PostsControls
        postType={postType}
        setPostType={setPostType}
        search={search}
        setSearch={setSearch}
        setCurrentPage={setCurrentPage}
      />

      <PostsTable
        paginatedPosts={paginatedPosts}
        setSelectedPost={setSelectedPost}
        setIsViewModalOpen={setIsViewModalOpen}
      />

      <div className="p-4 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <ViewPostModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
}
