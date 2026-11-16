"use client";

import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { MemberData } from "@/components/team/types";

interface MemberActionsModalsProps {
  member: MemberData;
  isTerminateOpen: boolean;
  onCloseTerminate: () => void;
  isReactivateOpen: boolean;
  onCloseReactivate: () => void;
  isTimeOffOpen: boolean;
  onCloseTimeOff: () => void;
}

export const MemberActionsModals: React.FC<MemberActionsModalsProps> = ({
  member,
  isTerminateOpen,
  onCloseTerminate,
  isReactivateOpen,
  onCloseReactivate,
  isTimeOffOpen,
  onCloseTimeOff,
}) => {
  const [isRepeatChecked, setIsRepeatChecked] = useState(false);

  return (
    <>
      {/* Terminate Modal */}
      {isTerminateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCloseTerminate}
          />
          <div className="bg-white rounded-lg w-full max-w-[480px] p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-[17px] font-bold text-[#1E293B]">
                Terminate Contract
              </h2>
              <button
                onClick={onCloseTerminate}
                className="text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 space-y-4">
              <p className="text-[13px] text-[#64748B]">
                Are you sure you want to terminate contract for{" "}
                <strong className="text-[#1E293B]">{member.name}</strong>?
              </p>
              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-1.5">
                  Termination Date *
                </label>
                <input
                  type="date"
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 text-[13px] text-[#1E293B] focus:border-[#635BFF] outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseTerminate}
                className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                onClick={onCloseTerminate}
                className="px-5 py-2 bg-[#F43F5E] text-white rounded-lg text-[13px] font-bold hover:bg-[#E11D48] transition-colors"
              >
                Confirm Termination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Modal */}
      {isReactivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCloseReactivate}
          />
          <div className="bg-white rounded-lg w-full max-w-[480px] p-6 relative z-10 shadow-2xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-[17px] font-bold text-[#1E293B]">
                Reactivate Contract
              </h2>
              <button
                onClick={onCloseReactivate}
                className="text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 space-y-4">
              <p className="text-[13px] text-[#64748B]">
                Reactivate team member account and active schedule for{" "}
                <strong className="text-[#1E293B]">{member.name}</strong>.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseReactivate}
                className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                onClick={onCloseReactivate}
                className="px-5 py-2 bg-[#22C55E] text-white rounded-lg text-[13px] font-bold hover:bg-[#16A34A] transition-colors"
              >
                Confirm Reactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Off Modal */}
      {isTimeOffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCloseTimeOff}
          />
          <div className="bg-white rounded-lg w-full max-w-[550px] p-6 relative z-10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <h2 className="text-[17px] font-bold text-[#1E293B]">
                Add Time Off
              </h2>
              <button
                onClick={onCloseTimeOff}
                className="text-[#94A3B8] hover:text-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#1E293B] focus:border-[#635BFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#1E293B] mb-1.5">
                    End Date *
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#1E293B] focus:border-[#635BFF] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="repeat-modal-checkbox"
                  checked={isRepeatChecked}
                  onChange={(e) => setIsRepeatChecked(e.target.checked)}
                  className="w-4 h-4 text-[#635BFF] rounded border-[#CBD5E1]"
                />
                <label
                  htmlFor="repeat-modal-checkbox"
                  className="text-[13px] font-medium text-[#1E293B]"
                >
                  Repeat time off schedule
                </label>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-1.5">
                  Reason / Note
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-[#E2E8F0] rounded-lg p-3 text-[13px] text-[#1E293B] focus:border-[#635BFF] outline-none resize-none"
                  placeholder="Reason for time off (e.g. Paid Vacation, Medical Leave)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={onCloseTimeOff}
                className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                onClick={onCloseTimeOff}
                className="px-6 py-2 bg-[#635BFF] text-white rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
