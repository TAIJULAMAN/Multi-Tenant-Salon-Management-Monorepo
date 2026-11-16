"use client";

import React from "react";
import { MessageCircle, Mail, MessageSquare } from "lucide-react";
import Modal from "@/components/customComponent/Modal";
import { CommLogItem } from "../tabs/ClientCommunicationLogTab";

interface ViewCommLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: CommLogItem | null;
}

export default function ViewCommLogModal({ isOpen, onClose, log }: ViewCommLogModalProps) {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Communication Log" maxWidth="max-w-[500px]">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            log.channel === "WhatsApp" ? "bg-[#DCFCE7] text-[#16A34A]" :
            log.channel === "Email" ? "bg-[#EEF2FF] text-[#635BFF]" :
            "bg-[#FEFCE8] text-[#EAB308]"
          }`}>
            {log.channel === "WhatsApp" && <MessageCircle className="w-5 h-5" />}
            {log.channel === "Email" && <Mail className="w-5 h-5" />}
            {log.channel === "SMS" && <MessageSquare className="w-5 h-5" />}
          </div>
          <h4 className="text-[14px] font-bold text-[#1E293B] leading-tight">{log.title}</h4>
        </div>

        {/* Informations Block */}
        <div>
          <h5 className="text-[12px] font-bold text-[#1E293B] mb-4">Informations</h5>
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div>
              <span className="block text-[11px] font-medium text-[#94A3B8] mb-1">Sent by</span>
              <div className="flex items-center gap-2">
                {log.employee !== "System" && (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=47" alt="User" className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="text-[12px] font-bold text-[#1E293B]">{log.employee}</span>
                <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold ${
                  log.source === "Staff Member" ? "border-[#635BFF] text-[#635BFF]" : "border-[#14B8A6] text-[#14B8A6]"
                }`}>
                  {log.source}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#94A3B8] mb-1">Time</span>
              <span className="text-[13px] font-medium text-[#1E293B]">{log.time}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#94A3B8] mb-1">Date</span>
              <span className="text-[13px] font-medium text-[#1E293B]">{log.date}</span>
            </div>
            <div>
              <span className="block text-[11px] font-medium text-[#94A3B8] mb-1">Status</span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block mt-0.5 ${
                log.status === "Delivered" ? "bg-[#EEF2FF] text-[#635BFF]" :
                log.status === "Sent" ? "bg-[#CCFBF1] text-[#14B8A6]" :
                log.status === "Read" ? "bg-[#DCFCE7] text-[#16A34A]" :
                "bg-[#FFE4E6] text-[#F43F5E]"
              }`}>
                {log.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content Block */}
        <div>
          <h5 className="text-[12px] font-bold text-[#1E293B] mb-4">Content</h5>
          {log.channel === "WhatsApp" || log.channel === "SMS" ? (
            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0]">
                  <img src="https://i.pravatar.cc/150?img=32" alt="Client" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] text-[#94A3B8] font-medium mb-1">Maria, 2 hours ago</div>
                  <div className="bg-[#F1F5F9] text-[#334155] text-[13px] px-4 py-2.5 rounded-lg rounded-tl-sm inline-block">
                    If I don't like something, I'll stay away from it.
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse text-right">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E2E8F0]">
                  <img src="https://i.pravatar.cc/150?img=47" alt="Staff" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[10px] text-[#94A3B8] font-medium mb-1">Staff, 1 hour ago</div>
                  <div className="bg-[#EEF2FF] text-[#635BFF] text-[13px] px-4 py-2.5 rounded-lg rounded-tr-sm inline-block text-left">
                    I sent more detailed information.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#F8F9FE] border border-[#E2E8F0] rounded-xl p-5">
              <h6 className="text-[13px] font-bold text-[#1E293B] mb-2">Message</h6>
              <p className="text-[13px] text-[#64748B] leading-[1.6]">
                Thank you for your visit! We look forward to seeing you again soon.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-[#F1F5F9]">
          <button
            onClick={onClose}
            className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
