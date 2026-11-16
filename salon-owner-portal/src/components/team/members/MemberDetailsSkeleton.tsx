import React from "react";

export default function MemberDetailsSkeleton() {
  return (
    <div className="w-full space-y-6 pb-12 animate-pulse">
      {/* SubPage Header Skeleton */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E2E8F0]" />
          <div>
            <div className="h-6 w-44 bg-[#E2E8F0] rounded-md mb-1.5" />
            <div className="h-3.5 w-28 bg-[#F1F5F9] rounded" />
          </div>
        </div>
      </div>

      {/* Member Profile Banner Skeleton */}
      <div className="bg-white rounded-md shadow-sm border border-[#E2E8F0] flex flex-col pb-5 overflow-hidden">
        {/* Banner Image */}
        <div className="h-48 md:h-[220px] w-full bg-gradient-to-r from-[#EDE9FE] to-[#DDD6FE] rounded-t-md" />

        {/* Content Area */}
        <div className="relative bg-white px-6 md:px-10 flex flex-col md:flex-row justify-between items-center md:items-end pb-8 pt-32 md:pt-6 min-h-[140px]">
          {/* Avatar and Info (Absolute Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-[50px] flex flex-col items-center w-64 space-y-2">
            <div className="w-[100px] h-[100px] rounded-full border-[5px] border-white shadow-sm bg-[#E2E8F0]" />
            <div className="h-5 w-36 bg-[#E2E8F0] rounded" />
            <div className="h-3.5 w-24 bg-[#F1F5F9] rounded" />
            <div className="h-5 w-16 bg-[#ECFDF5] rounded-full" />
          </div>

          {/* Left Stats */}
          <div className="flex gap-8 md:gap-14 w-full md:w-auto justify-center md:justify-start">
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-5 h-5 rounded bg-[#E2E8F0] mb-1" />
              <div className="h-4 w-24 bg-[#E2E8F0] rounded" />
              <div className="h-3 w-16 bg-[#F1F5F9] rounded" />
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-5 h-5 rounded bg-[#E2E8F0] mb-1" />
              <div className="h-4 w-20 bg-[#E2E8F0] rounded" />
              <div className="h-3 w-14 bg-[#F1F5F9] rounded" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <div className="h-9 w-24 bg-[#F1F5F9] rounded-lg" />
            <div className="h-9 w-36 bg-[#EEF2FF] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Nav Tabs Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-5 w-24 bg-[#F1F5F9] rounded shrink-0" />
          ))}
        </div>
      </div>

      {/* Basic Data Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="h-5 w-28 bg-[#E2E8F0] rounded" />
            <div className="h-6 w-14 bg-[#EEF2FF] rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-16 bg-[#F1F5F9] rounded" />
            <div className="h-4 w-full bg-[#F8FAFC] rounded" />
            <div className="h-4 w-4/5 bg-[#F8FAFC] rounded" />
          </div>
          <div className="pt-2 flex gap-2">
            <div className="h-6 w-20 bg-[#EEF2FF] rounded-lg" />
            <div className="h-6 w-20 bg-[#EEF2FF] rounded-lg" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="h-5 w-32 bg-[#E2E8F0] rounded" />
            <div className="h-6 w-14 bg-[#EEF2FF] rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-16 bg-[#F1F5F9] rounded" />
                <div className="h-4 w-28 bg-[#E2E8F0] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
