"use client";

import React from "react";
import { Instagram } from "lucide-react";
import { ReelsTableProps } from "../../types";

export function ReelsTable({
  paginatedReels,
  setSelectedReel,
  setIsViewModalOpen,
}: ReelsTableProps) {
  return (
    <div className="overflow-auto flex-1 min-h-0 border border-[#E2E8F0] rounded-xl custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[1100px] sm:min-w-[1300px]">
        <thead>
          <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
            <th className="sm:sticky sm:left-0 bg-[#F8F9FE] sm:z-10 px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[220px] min-w-[220px] sm:w-[360px] sm:min-w-[360px]">
              Posts
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Views
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Accounts reached
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Likes
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Comments
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Saves
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Shares
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Total interactions
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Average watch time
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope whitespace-nowrap">
              Total watch time
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedReels.map((reel) => (
            <tr
              key={reel.id}
              onClick={() => {
                setSelectedReel(reel);
                setIsViewModalOpen(true);
              }}
              className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <td className="sm:sticky sm:left-0 bg-white sm:z-10 px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] w-[220px] min-w-[220px] sm:w-[360px] sm:min-w-[360px]">
                <div className="flex gap-3 sm:gap-4 items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#F472B6] shrink-0 flex items-center justify-center text-white overflow-hidden">
                    <img src="/holographic_sphere.png" alt="Reel Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1E293B] line-clamp-2 leading-tight">
                      {reel.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-[#94A3B8] font-medium">
                        {reel.date}
                      </p>
                      <div className="w-5 h-5 rounded-full border border-[#635BFF] flex items-center justify-center text-[#635BFF] shrink-0">
                        <Instagram className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.views}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.accountsReached}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.likes}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.comments}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.saves}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.shares}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.totalInteractions}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-semibold">
                {reel.watchTime}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] text-[#64748B] font-semibold">
                {reel.swipesBackward}
              </td>
            </tr>
          ))}
          {paginatedReels.length === 0 && (
            <tr>
              <td colSpan={10} className="px-3 sm:px-6 py-10 text-center text-sm text-[#94A3B8]">
                No reels found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
