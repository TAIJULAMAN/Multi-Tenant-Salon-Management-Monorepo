"use client";

import React from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { StoryTableProps } from "../../types";

export function StoryTable({
  paginatedStories,
  setSelectedStory,
  setIsViewModalOpen,
}: StoryTableProps) {
  return (
    <div className="overflow-auto flex-1 min-h-0 border border-[#E2E8F0] rounded-xl custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[850px] sm:min-w-[1000px]">
        <thead>
          <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
            <th className="sm:sticky sm:left-0 bg-[#F8F9FE] sm:z-10 px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[220px] min-w-[220px] sm:w-[360px] sm:min-w-[360px]">
              Posts
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Accounts reached
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Impressions
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Forward Taps
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Back Taps
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Replies
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope whitespace-nowrap">
              Exits
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedStories.map((story) => (
            <tr
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                setIsViewModalOpen(true);
              }}
              className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <td className="sm:sticky sm:left-0 bg-white sm:z-10 px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] w-[220px] min-w-[220px] sm:w-[360px] sm:min-w-[360px]">
                <div className="flex gap-3 sm:gap-4 items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#F472B6] shrink-0 flex items-center justify-center text-white overflow-hidden">
                    <Image
                      width={48}
                      height={60}
                      src="/holographic_sphere.png"
                      alt="Story Thumbnail"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1E293B] line-clamp-2 leading-tight">
                      {story.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-[#94A3B8] font-medium">
                        {story.date}
                      </p>
                      <div className="w-5 h-5 rounded-full border border-[#635BFF] flex items-center justify-center text-[#635BFF] shrink-0">
                        <Instagram className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {story.accountsReached}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {story.views}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {story.likes}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {story.saves}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {story.comments}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] text-[#64748B] font-semibold">
                {story.shares}
              </td>
            </tr>
          ))}
          {paginatedStories.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-3 sm:px-6 py-10 text-center text-sm text-[#94A3B8]"
              >
                No stories found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
