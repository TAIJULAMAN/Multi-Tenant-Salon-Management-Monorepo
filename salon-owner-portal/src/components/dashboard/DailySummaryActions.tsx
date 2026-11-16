"use client";

import React from "react";
import { List, Play, Plus, X } from "lucide-react";
import { DailySummaryActionsProps } from "./types";

export default function DailySummaryActions({
  isRegisterOpen,
  onNewReceipt,
  onCloseRegister,
  onOpenRegister,
}: DailySummaryActionsProps) {
  return (
    <div className="bg-[#635BFF] p-4 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Box 1 */}
      <div
        onClick={onNewReceipt}
        className="bg-white rounded-lg p-4 flex flex-col justify-center cursor-pointer shadow-sm transition-transform hover:scale-[1.02]"
      >
        <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center mb-3">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-[13px] font-bold text-[#1E293B] mb-0.5">New Receipt</h4>
        <p className="text-[11px] text-[#94A3B8]">Create a new receipt</p>
      </div>

      {/* Box 2 */}
      <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 flex flex-col justify-center cursor-pointer transition-colors">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
          <List className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-[13px] font-bold text-white mb-0.5">Receipt History</h4>
        <p className="text-[10px] font-medium text-white/70">See receipt history</p>
      </div>

      {/* Box 3 */}
      <div
        onClick={() => {
          if (isRegisterOpen) {
            onCloseRegister();
          } else {
            onOpenRegister();
          }
        }}
        className="bg-white/10 hover:bg-white/20 rounded-lg p-4 flex flex-col justify-center cursor-pointer transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
          {isRegisterOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </div>
        <h4 className="text-[13px] font-bold text-white mb-0.5 leading-snug">
          {isRegisterOpen ? (
            <>Close Cash<br />Register</>
          ) : (
            <>Open New Cash<br />Register</>
          )}
        </h4>
      </div>
    </div>
  );
}
