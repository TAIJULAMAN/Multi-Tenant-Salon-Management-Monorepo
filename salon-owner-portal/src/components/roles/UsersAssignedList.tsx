"use client";

import React from "react";
import { Eye, Pencil } from "lucide-react";
import { UsersAssignedListProps } from "./types";

const AVATAR_BACKGROUNDS = ["bg-[#FCE7F3]", "bg-[#CCFBF1]", "bg-[#E0F2FE]", "bg-[#FEE2E2]"];

export default function UsersAssignedList({ users }: UsersAssignedListProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-6">
      <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">Users Assigned</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {users.map((user, i) => {
          const bgClass = AVATAR_BACKGROUNDS[i % AVATAR_BACKGROUNDS.length];
          return (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 p-3 border border-[#E2E8F0] rounded-lg bg-white w-full"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${bgClass}`}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 object-cover mix-blend-multiply"
                  />
                </div>
                <span className="text-[14px] font-bold text-[#1E293B]">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F0F9FF] text-[#0EA5E9] hover:bg-[#E0F2FE] transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
