"use client";

import React from "react";

export function PostTypePill({ type }: { type: string }) {
  switch (type) {
    case "Link":
      return (
        <span className="px-3 py-1 bg-[#E0F2FE] text-[#0284C7] rounded-full text-xs font-bold">
          Link
        </span>
      );
    case "Photo":
      return (
        <span className="px-3 py-1 bg-[#FEF9C3] text-[#CA8A04] rounded-full text-xs font-bold">
          Photo
        </span>
      );
    case "Gif":
      return (
        <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-xs font-bold">
          Gif
        </span>
      );
    case "Carousel":
      return (
        <span className="px-3 py-1 bg-[#E0E7FF] text-[#635BFF] rounded-full text-xs font-bold">
          Carousel
        </span>
      );
    case "Video":
      return (
        <span className="px-3 py-1 bg-[#CCFBF1] text-[#0D9488] rounded-full text-xs font-bold">
          Video
        </span>
      );
    default:
      return null;
  }
}
