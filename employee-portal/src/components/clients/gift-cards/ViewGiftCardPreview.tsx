"use client";

import React from "react";
import Image from "next/image";

export default function ViewGiftCardPreview() {
  return (
    <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 sticky top-6">
      <h2 className="text-[14px] font-bold text-[#1E293B] mb-6">Preview</h2>

      <div className="space-y-6">
        <div className="relative w-full h-56">
          <Image
            src="/images/gift-card-blue-empty.png"
            alt="Gift Card Preview Front"
            fill
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
        <div className="relative w-full h-56">
          <Image
            src="/boucher/giftCard.png"
            alt="Gift Card Preview Back"
            fill
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
