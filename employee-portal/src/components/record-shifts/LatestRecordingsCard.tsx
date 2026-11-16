"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, Inbox } from "lucide-react";
import { RecordingRecord } from "@/context/ShiftsContext";

interface LatestRecordingsCardProps {
  recordings: RecordingRecord[];
}

export const LatestRecordingsCard: React.FC<LatestRecordingsCardProps> = ({
  recordings,
}) => {
  const hasRecordings = recordings && recordings.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 font-manrope flex flex-col justify-between min-h-[380px] hover:border-[#CBD5E1] transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#1E293B]">
            Latest Recordings
          </h2>
          <Link
            href="/worked-shifts"
            className="text-xs font-semibold text-[#635BFF] hover:text-[#5248e5] hover:underline flex items-center gap-1 mt-0.5 group transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {hasRecordings && (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EEF2FF] text-[#635BFF]">
            {recordings.length} {recordings.length === 1 ? "entry" : "entries"}
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 my-6 flex flex-col justify-center">
        {!hasRecordings ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            {/* Box Icon matching the screenshot */}
            <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-3 text-[#94A3B8]">
              <Inbox className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="text-sm font-medium text-[#94A3B8]">
              No registration yet
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-hide">
            {recordings.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#1E293B] truncate">
                      {rec.roundName}
                    </p>
                    <p className="text-[11px] font-medium text-[#64748B]">
                      {rec.date} • {rec.timeIn} - {rec.timeOut}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#EEF2FF] text-[#635BFF]">
                    {rec.duration}
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
        <span>Syncs automatically to Worked Shifts</span>
        <Clock className="w-3.5 h-3.5 text-[#CBD5E1]" />
      </div>
    </div>
  );
};

export default LatestRecordingsCard;
