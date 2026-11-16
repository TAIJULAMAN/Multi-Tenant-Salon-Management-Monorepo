import React from "react";

export function LinkedChannels({ linkedChannels }: { linkedChannels: any[] }) {
  if (!linkedChannels || linkedChannels.length === 0) return null;
  
  return (
    <>
      {linkedChannels.map((channel) => channel && (
        <div
          key={channel.id}
          className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-3 flex items-center gap-4 shadow-sm hover:border-[#CBD5E1] transition-colors"
        >
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${channel.bg}`}
            >
              <span
                className={`text-[14px] font-bold ${channel.iconColor}`}
              >
                {channel.icon}
              </span>
            </div>
            <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#FFD600] border-2 border-white rounded-full"></div>
          </div>
          <span className="text-[15px] font-medium text-[#94A3B8] flex-1 cursor-text">
            What would you like to share?
          </span>
        </div>
      ))}
    </>
  );
}
