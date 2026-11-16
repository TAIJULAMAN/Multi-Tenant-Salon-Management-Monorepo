"use client";

import React, { useState } from "react";
import {
  User,
  Briefcase,
  ChevronDown,
  Edit2,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { MemberData } from "@/components/team/types";
import { Badge } from "@/components/ui/Badge";

interface MemberProfileBannerProps {
  member: MemberData;
  onOpenTimeOff: () => void;
  onOpenTerminate: () => void;
  onOpenReactivate: () => void;
}

export const MemberProfileBanner: React.FC<MemberProfileBannerProps> = ({
  member,
  onOpenTimeOff,
  onOpenTerminate,
  onOpenReactivate,
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const isUserActive = member.status === "Active";

  return (
    <div className="bg-white rounded-md shadow-sm border border-[#E2E8F0] flex flex-col pb-5">
      {/* Banner Image */}
      <div
        className="h-48 md:h-[220px] w-full bg-cover bg-center bg-[#C4B5FD] relative rounded-t-md overflow-hidden"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4C6F4]/50 to-[#A78BFA]/50 mix-blend-overlay" />
      </div>

      {/* Content Area */}
      <div className="relative bg-white px-6 md:px-10 flex flex-col md:flex-row justify-between items-center md:items-end pb-8 pt-32 md:pt-6 min-h-[140px] z-10">
        {/* Avatar and Info (Absolute Centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[50px] flex flex-col items-center w-64">
          <div className="w-[100px] h-[100px] rounded-full border-[5px] border-white shadow-sm overflow-hidden bg-[#FCE7F3] mb-3">
            <img
              src={member.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          <h2 className="text-[19px] font-bold text-[#1E293B]">
            {member.name}
          </h2>
          <div className="text-[13px] text-[#94A3B8] font-medium mb-2">
            Bologna, Italy
          </div>
          <Badge variant={isUserActive ? "success" : "danger"} size="sm">
            {isUserActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </div>

        {/* Left Stats */}
        <div className="flex gap-8 md:gap-14 w-full md:w-auto justify-center md:justify-start">
          <div className="flex flex-col items-center text-center">
            <User className="w-[22px] h-[22px] text-[#64748B] mb-2" />
            <div className="text-[15px] font-bold text-[#1E293B]">
              May 31, 2022
            </div>
            <div className="text-[12px] text-[#94A3B8] font-medium">
              Start Date
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Briefcase className="w-[22px] h-[22px] text-[#64748B] mb-2" />
            <div className="text-[15px] font-bold text-[#1E293B]">
              Permanent
            </div>
            <div className="text-[12px] text-[#94A3B8] font-medium">
              Contract Type
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="w-full md:w-auto flex justify-center md:justify-end mt-6 md:mt-0 relative">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="bg-[#E0E7FF] text-[#635BFF] flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#C7D2FE] transition-colors"
          >
            Actions
            <ChevronDown className="w-4 h-4" />
          </button>

          {isActionsOpen && (
            <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-[#E2E8F0] p-2 z-20">
              {isUserActive ? (
                <>
                  <button className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[#F8FAFC] rounded-lg group transition-colors">
                    <Edit2 className="w-[18px] h-[18px] text-[#64748B] group-hover:text-[#635BFF]" />
                    <span className="text-[13px] font-medium text-[#1E293B]">
                      Edit
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenTimeOff();
                      setIsActionsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[#F8FAFC] rounded-lg group transition-colors"
                  >
                    <Clock className="w-[18px] h-[18px] text-[#64748B] group-hover:text-[#635BFF]" />
                    <span className="text-[13px] font-medium text-[#1E293B]">
                      Add Time Off
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenTerminate();
                      setIsActionsOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[#FCE7F3] rounded-lg group transition-colors"
                  >
                    <XCircle className="w-[18px] h-[18px] text-[#F43F5E]" />
                    <span className="text-[13px] font-medium text-[#F43F5E]">
                      Terminate Contract
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onOpenReactivate();
                    setIsActionsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[#DCFCE7] rounded-lg group transition-colors"
                >
                  <RefreshCw className="w-[18px] h-[18px] text-[#22C55E]" />
                  <span className="text-[13px] font-medium text-[#22C55E]">
                    Reactivate Contract
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
