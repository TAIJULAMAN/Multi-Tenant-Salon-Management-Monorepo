import React from "react";

export default function ClientDetailsSkeleton() {
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

      {/* Profile Header Card Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Banner Section */}
        <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF] relative overflow-hidden" />

        {/* Header Content with Centered Avatar */}
        <div className="p-8 relative flex flex-col md:flex-row items-center justify-between gap-8 pt-20 md:pt-8">
          {/* Centered Avatar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-sm bg-[#E2E8F0]" />
          </div>

          {/* Left Stats */}
          <div className="flex gap-8 w-full md:w-1/3 justify-center md:justify-start">
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-5 h-5 rounded bg-[#E2E8F0] mb-1" />
              <div className="h-5 w-24 bg-[#E2E8F0] rounded" />
              <div className="h-3 w-16 bg-[#F1F5F9] rounded" />
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-5 h-5 rounded bg-[#E2E8F0] mb-1" />
              <div className="h-5 w-20 bg-[#E2E8F0] rounded" />
              <div className="h-3 w-14 bg-[#F1F5F9] rounded" />
            </div>
          </div>

          {/* Center Info Details */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 mt-4 md:mt-12 space-y-2">
            <div className="h-6 w-40 bg-[#E2E8F0] rounded" />
            <div className="h-3.5 w-24 bg-[#F1F5F9] rounded mb-1" />
            <div className="flex gap-2">
              <div className="h-5 w-14 bg-[#EEF2FF] rounded-full" />
              <div className="h-5 w-16 bg-[#EEF2FF] rounded-full" />
              <div className="h-5 w-12 bg-[#EEF2FF] rounded-full" />
            </div>
          </div>

          {/* Right Button */}
          <div className="flex justify-center md:justify-end w-full md:w-1/3 mt-4 md:mt-0 md:pt-12">
            <div className="h-10 w-28 bg-[#E0E7FF] rounded-lg" />
          </div>
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="w-full bg-[#EEF2FF] flex items-center justify-start md:justify-center px-4 py-3 gap-6 border-t border-[#E2E8F0] overflow-x-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-5 w-24 bg-white/80 rounded shrink-0" />
          ))}
        </div>
      </div>

      {/* Overview 4 Cards Skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-28 bg-[#E2E8F0] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-lg border border-[#E2E8F0] flex flex-col justify-center h-28 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#F1F5F9]" />
                <div className="h-3.5 w-20 bg-[#F1F5F9] rounded" />
              </div>
              <div className="h-6 w-24 bg-[#E2E8F0] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Personal Data & Full Address Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((card) => (
          <div
            key={card}
            className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-[#E2E8F0] rounded" />
              <div className="h-6 w-14 bg-[#EEF2FF] rounded" />
            </div>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {[1, 2, 3, 4].map((field) => (
                <div key={field} className="space-y-1.5">
                  <div className="h-3 w-16 bg-[#F1F5F9] rounded" />
                  <div className="h-4 w-28 bg-[#E2E8F0] rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Waivers Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-4">
        <div className="h-5 w-24 bg-[#E2E8F0] rounded mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-[#F1F5F9] rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[#F1F5F9]" />
                <div className="h-4 w-32 bg-[#E2E8F0] rounded" />
              </div>
              <div className="h-5 w-12 bg-[#F1F5F9] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
