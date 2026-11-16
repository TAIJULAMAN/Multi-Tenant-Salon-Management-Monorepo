"use client";

import React from "react";
import { Search } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { PostsControlsProps } from "../../types";

export function PostsControls({
  postType,
  setPostType,
  search,
  setSearch,
  setCurrentPage,
}: PostsControlsProps) {
  return (
    <div className="pb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 shrink-0">
      <div className="w-full sm:w-48 flex-shrink-0">
        <CustomSelect
          value={postType}
          onChange={(val) => {
            setPostType(val);
            setCurrentPage(1);
          }}
          options={[
            "All Post Types",
            "Link",
            "Photo",
            "Gif",
            "Carousel",
            "Video",
          ]}
          className="w-full"
          buttonClassName="w-full h-10 flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors bg-white"
        />
      </div>

      <div className="relative w-full sm:max-w-[256px]">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#635BFF] transition-colors text-sm text-[#1E293B]"
        />
      </div>
    </div>
  );
}
