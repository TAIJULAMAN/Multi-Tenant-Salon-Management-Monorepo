import React from "react";
import Image from "next/image";
import { Info, MessageCircle, Heart, BarChart2, Bookmark, Share } from "lucide-react";

export function PostPreview({
  activeChannel,
  description,
  uploadedMediaUrl
}: {
  activeChannel: any;
  description: string;
  uploadedMediaUrl: string | null;
}) {
  const channelName = activeChannel?.name || "Twitter / X";
  const userHandle = activeChannel?.name ? `@${activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '')}` : "@buffer";
  const displayUser = activeChannel?.name ? activeChannel.name : "Buffer";
  const displayInitial = displayUser.charAt(0).toUpperCase();

  return (
    <div className="w-[40%] bg-[#F8FAFC] flex flex-col border-l border-[#E2E8F0]">
      <div className="p-6 border-b border-[#E2E8F0] bg-white flex items-center gap-2 shrink-0">
        <h3 className="text-[15px] font-bold text-[#1E293B]">
          {channelName} Preview
        </h3>
        <Info className="w-4 h-4 text-[#94A3B8]" />
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center bg-[#F1F5F9]">
        {/* Preview Container */}
        <div className="w-full max-w-[380px] bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E2E8F0] flex items-center justify-center shrink-0">
              <span className="text-[#64748B] font-bold text-lg">{displayInitial}</span>
            </div>
            <div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#1E293B]">
                  {displayUser}
                </span>
                <span className="text-[14px] font-medium text-[#64748B]">{userHandle}</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-[15px] text-[#1E293B] whitespace-pre-wrap mb-4 font-medium leading-relaxed">
            {description ||
              <span className="text-[#94A3B8]">Start writing or get inspired with Templates...</span>}
          </div>

          {/* Image */}
          {uploadedMediaUrl && (
            <div className="w-full rounded-xl overflow-hidden border border-[#E2E8F0] mb-4">
              <Image
                src={uploadedMediaUrl}
                alt="Preview"
                width={400}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center justify-between text-[#64748B] mt-2 px-2">
            <button className="hover:text-[#635BFF] flex items-center gap-2 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="hover:text-[#10B981] flex items-center gap-2 transition-colors">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12h3M21 12h-3M12 3v3M12 21v-3M5.636 5.636l2.122 2.122M18.364 18.364l-2.122-2.122M5.636 18.364l2.122-2.122M18.364 5.636l-2.122 2.122" />
              </svg>
            </button>
            <button className="hover:text-[#EC4899] flex items-center gap-2 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="hover:text-[#635BFF] flex items-center gap-2 transition-colors">
              <BarChart2 className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <button className="hover:text-[#635BFF] transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="hover:text-[#635BFF] transition-colors">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {!description && !uploadedMediaUrl && (
          <div className="mt-8 flex flex-col items-center opacity-60">
            <div className="w-40 h-40 bg-white shadow-sm rounded-xl flex flex-col p-5 gap-3 mb-4 border border-[#E2E8F0] relative">
              <div className="absolute -top-3 -right-3 text-[#1E293B] text-2xl">
                ✨
              </div>
              <div className="absolute -bottom-2 -left-2 text-[#1E293B] text-2xl">
                ✨
              </div>
              <div className="flex gap-3 items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-[#E2E8F0]"></div>
                <div className="h-3 w-20 bg-[#E2E8F0] rounded-full"></div>
              </div>
              <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg"></div>
            </div>
            <p className="text-[14px] text-[#64748B] font-bold">
              See your post preview here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
