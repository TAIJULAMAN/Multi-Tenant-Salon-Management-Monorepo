"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  ChevronDown,
  Plus,
  Play,
  Volume2,
  Maximize,
  MoreHorizontal
} from "lucide-react";
import UploadMediaModal from "./UploadMediaModal";
import CustomDateRangePickerWithPresets from "@/components/customComponent/CustomDateRangePickerWithPresets";

const mockMedia = [
  {
    id: 1,
    name: "SummerPromo.jpeg",
    type: "Photo",
    uploadedBy: "Maria",
    published: true,
    date: "08/25/2026",
    time: "5:06 PM",
    daysAgo: 1,
    thumbnailClass: "bg-gradient-to-br from-[#A7F3D0] via-[#C7D2FE] to-[#FBCFE8]"
  },
  {
    id: 2,
    name: "HairTutorial.mp4",
    type: "Video",
    uploadedBy: "Maria",
    published: false,
    date: "08/22/2026",
    time: "2:30 PM",
    daysAgo: 4,
    thumbnailClass: "bg-gradient-to-br from-[#F59E0B] via-[#EC4899] to-[#6366F1]"
  },
  {
    id: 3,
    name: "StylingSession.jpeg",
    type: "Photo",
    uploadedBy: "Alex",
    published: true,
    date: "08/10/2026",
    time: "11:15 AM",
    daysAgo: 16,
    thumbnailClass: "bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#E0E7FF]"
  },
  {
    id: 4,
    name: "SalonTour.mp4",
    type: "Video",
    uploadedBy: "Sarah",
    published: true,
    date: "07/28/2026",
    time: "4:45 PM",
    daysAgo: 29,
    thumbnailClass: "bg-gradient-to-br from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]"
  }
];

export default function MediaTab() {
  const [fileType, setFileType] = useState("All Type");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredMedia = mockMedia.filter((media) => {
    // Type filter
    if (fileType !== "All Type" && media.type !== fileType) return false;
    // Date filter
    if (dateRange === "Last 7 days" && media.daysAgo > 7) return false;
    if (dateRange === "Last 30 days" && media.daysAgo > 30) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 min-h-[600px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[22px] font-bold text-[#1E293B]">Media</h2>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#C7D2FE] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-[#94A3B8]">File Type</span>
          <div className="flex items-center gap-2">
            {["All Type", "Photo", "Video"].map((type) => (
              <button
                key={type}
                onClick={() => setFileType(type)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-bold border transition-colors ${fileType === type
                    ? "border-[#635BFF] text-[#635BFF] bg-white"
                    : "border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold text-[#94A3B8]">Date</span>
          <CustomDateRangePickerWithPresets
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            presets={["Last 7 days", "Last 14 days", "Last 30 days", "Last Month", "Last Year"]}
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredMedia.map((media) => (
          <div key={media.id} className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[18px] font-bold text-[#1E293B]">{media.name}</h3>
              <button className="text-[#1E293B] hover:bg-[#F1F5F9] p-1 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center flex-wrap gap-3 mb-3">
              <span className="border border-[#A5F3FC] text-[#06B6D4] text-[12px] font-medium px-3 py-1 rounded-lg">
                Uploaded by: {media.uploadedBy}
              </span>
              {media.published ? (
                <span className="bg-[#DCFCE7] text-[#22C55E] text-[12px] font-medium px-3 py-1 rounded-lg">
                  Published to social media
                </span>
              ) : (
                <span className="bg-[#FEFCE8] text-[#EAB308] text-[12px] font-medium px-3 py-1 rounded-lg">
                  Not published to social media
                </span>
              )}
            </div>

            <div className="text-[12px] text-[#94A3B8] mb-6">
              Uploaded at {media.date} {media.time}
            </div>

            <div
              className={`w-full aspect-[16/9] rounded-lg overflow-hidden ${media.thumbnailClass} relative shadow-inner flex flex-col justify-end`}
            >
              {media.type === "Photo" ? (
                <>
                  {/* Decorative abstract elements for Photo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-[#FDF4FF] to-[#E0E7FF] rounded-full blur-sm opacity-80 shadow-2xl"></div>
                  <div className="absolute top-[30%] left-[30%] w-8 h-8 bg-gradient-to-tr from-[#FDF4FF] to-[#E0E7FF] rounded-full blur-[1px] opacity-90 shadow-lg"></div>
                </>
              ) : (
                <>
                  {/* Decorative abstract overlay for Video */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 w-full h-[120px] bg-gradient-to-t from-[#7C3AED] to-transparent opacity-80 mix-blend-overlay"></div>

                  {/* Custom Video Player Overlay UI */}
                  <div className="relative z-10 w-full px-4 pb-4 flex items-center gap-4">
                    <button className="text-white hover:text-gray-200 transition-colors">
                      <Play className="w-5 h-5 fill-white" />
                    </button>

                    <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                      <div className="w-1/3 h-full bg-white rounded-full"></div>
                    </div>

                    <button className="text-white hover:text-gray-200 transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>

                    <button className="text-white hover:text-gray-200 transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>

                    <button className="text-white hover:text-gray-200 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}



      </div>
      
      {isUploadModalOpen && <UploadMediaModal onClose={() => setIsUploadModalOpen(false)} />}
    </div>
  );
}
