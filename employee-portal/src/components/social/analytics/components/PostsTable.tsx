"use client";

import React from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { PostsTableProps } from "@/components/social/types";
import { PostTypePill } from "./PostTypePill";

export function PostsTable({
  paginatedPosts,
  setSelectedPost,
  setIsViewModalOpen,
}: PostsTableProps) {


  return (
    <div className="overflow-auto flex-1 min-h-0 border border-[#E2E8F0] rounded-xl custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[1200px] sm:min-w-[1400px]">
        <thead>
          <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
            <th className="sm:sticky sm:left-0 bg-[#F8F9FE] sm:z-10 px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[220px] min-w-[220px] sm:w-[360px] sm:min-w-[360px]">
              Posts
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Type
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Views
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Accounts reached
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] min-w-[200px]">
              Total interactions
              <div className="text-[10px] text-[#64748B] font-normal leading-tight mt-0.5">
                (likes + comments + saves
                <br />+ shares where available)
              </div>
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
              Video Views
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] whitespace-nowrap">
              Total watch time
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] min-w-[120px]">
              Engagement on
              <br />a carousel
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] min-w-[100px]">
              Reach of
              <br />
              carousel
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] min-w-[100px]">
              Swipes forward
              <br />
              (carousel)
            </th>
            <th className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] font-bold text-[#1E293B] font-manrope min-w-[100px]">
              Swipes backward
              <br />
              (carousel)
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr
              key={post.id}
              onClick={() => {
                setSelectedPost(post);
                setIsViewModalOpen(true);
              }}
              className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <td className="sm:sticky sm:left-0 bg-white sm:z-10 px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] w-[220px] min-w-[220px] sm:w-[360px] sm:min-w-[360px]">
                <div className="flex gap-3 sm:gap-4 items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-tr from-[#635BFF] to-[#F472B6] shrink-0 flex items-center justify-center text-white overflow-hidden">
                    <Image
                      src="/holographic_sphere.png"
                      alt="Post Thumbnail"
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#1E293B] line-clamp-2 leading-tight">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-[#94A3B8] font-medium">
                        {post.date}
                      </p>
                      <div className="w-5 h-5 rounded-full border border-[#635BFF] flex items-center justify-center text-[#635BFF] shrink-0">
                        <Instagram className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0]">
                <PostTypePill type={post.type} />
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.views}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.accountsReached}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.totalInteractions}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.likes}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.comments}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.saves}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.shares}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.videoViews}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.watchTime}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.engagementCarousel}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.reachCarousel}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 border-r border-[#E2E8F0] text-[13px] text-[#64748B] font-medium">
                {post.swipesForward}
              </td>
              <td className="px-3 sm:px-6 py-4 sm:py-5 text-[13px] text-[#64748B] font-medium">
                {post.swipesBackward}
              </td>
            </tr>
          ))}
          {paginatedPosts.length === 0 && (
            <tr>
              <td colSpan={15} className="px-3 sm:px-6 py-10 text-center text-sm text-[#94A3B8]">
                No posts found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
