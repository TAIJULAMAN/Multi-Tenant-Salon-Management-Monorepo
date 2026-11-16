"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import {
  WHATSAPP_TEMPLATE,
  EMAIL_TEMPLATE,
  PHONE_TEMPLATE,
} from "@/components/financial/data";
import {
  WhatsAppPreview,
  EmailPreview,
  SmsPreview,
} from "./AutomationPreviews";

export function AutomationToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-lg transition-colors shrink-0 ${
        enabled ? "bg-[#635BFF]" : "bg-[#E2E8F0]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-lg bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

interface PersonalizePanelProps {
  type: "whatsapp" | "email" | "phone";
  defaultAll: boolean;
  onToggleDefaultAll: () => void;
  exceptionsCount: number;
  onOpenExceptions: () => void;
}

export function WhatsAppPersonalizeSection({
  defaultAll,
  onToggleDefaultAll,
  exceptionsCount,
  onOpenExceptions,
}: Omit<PersonalizePanelProps, "type">) {
  return (
    <div className="border-t border-[#E2E8F0] px-6 pb-6">
      <h3 className="text-[14px] font-bold text-[#1E293B] py-5">
        Personalize WhatsApp Message
      </h3>
      <div className="grid grid-cols-[1fr_340px] gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-[12px] font-semibold text-[#475569] block mb-1.5">
              Content
            </label>
            <textarea
              defaultValue={WHATSAPP_TEMPLATE}
              rows={9}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[12px] text-[#475569] resize-none outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#1E293B]">
              Default for all clients <span className="text-[#F43F5E]">*</span>
            </span>
            <AutomationToggle
              enabled={defaultAll}
              onToggle={onToggleDefaultAll}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#475569]">
              Exceptions to default
              {exceptionsCount > 0 && (
                <span className="ml-1.5 text-[11px] text-[#635BFF] font-semibold">
                  ({exceptionsCount})
                </span>
              )}
            </span>
            <button
              onClick={onOpenExceptions}
              className="text-[12px] font-semibold text-[#635BFF] hover:underline"
            >
              See list
            </button>
          </div>
        </div>
        <WhatsAppPreview />
      </div>
    </div>
  );
}

export function EmailPersonalizeSection({
  defaultAll,
  onToggleDefaultAll,
  exceptionsCount,
  onOpenExceptions,
}: Omit<PersonalizePanelProps, "type">) {
  const [emailSubject, setEmailSubject] = useState(
    "Receipt of purchase - [Salon Name]",
  );
  const [ctaEnabled, setCtaEnabled] = useState(true);
  const [showImage, setShowImage] = useState(true);

  return (
    <div className="border-t border-[#E2E8F0] px-6 pb-6">
      <h3 className="text-[14px] font-bold text-[#1E293B] py-5">
        Personalize Email Message
      </h3>
      <div className="grid grid-cols-[1fr_340px] gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#1E293B] block mb-1.5">
              Subject <span className="text-[#F43F5E]">*</span>
            </label>
            <input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[12px] text-[#475569] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#1E293B] block mb-1.5">
              Title <span className="text-[#F43F5E]">*</span>
            </label>
            <input
              defaultValue="Your Receipt Is Ready"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[12px] text-[#475569] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#1E293B] block mb-1.5">
              Content
            </label>
            <textarea
              defaultValue={EMAIL_TEMPLATE}
              rows={7}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[12px] text-[#475569] resize-none outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#1E293B]">
              Call To Action Button Content{" "}
              <span className="text-[#F43F5E]">*</span>
            </span>
            <AutomationToggle
              enabled={ctaEnabled}
              onToggle={() => setCtaEnabled((p) => !p)}
            />
          </div>
          {ctaEnabled && (
            <input
              defaultValue="View Receipt"
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[12px] text-[#475569] outline-none focus:border-[#635BFF] transition-colors"
            />
          )}
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#1E293B]">
              Show Image <span className="text-[#F43F5E]">*</span>
            </span>
            <AutomationToggle
              enabled={showImage}
              onToggle={() => setShowImage((p) => !p)}
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#1E293B] block mb-1.5">
              Attaches <span className="text-[#F43F5E]">*</span>
            </label>
            <div className="border border-[#E2E8F0] rounded-lg p-5 flex flex-col items-center gap-2 cursor-pointer hover:border-[#635BFF] transition-colors bg-[#FAFBFF]">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#635BFF]" />
              </div>
              <span className="text-[11px] text-[#635BFF] font-medium">
                Drop here or click to browse
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#1E293B]">
              Default for all clients <span className="text-[#F43F5E]">*</span>
            </span>
            <AutomationToggle
              enabled={defaultAll}
              onToggle={onToggleDefaultAll}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#475569]">
              Exceptions to default
              {exceptionsCount > 0 && (
                <span className="ml-1.5 text-[11px] text-[#635BFF] font-semibold">
                  ({exceptionsCount})
                </span>
              )}
            </span>
            <button
              onClick={onOpenExceptions}
              className="text-[12px] font-semibold text-[#635BFF] hover:underline"
            >
              See list
            </button>
          </div>
        </div>
        <EmailPreview subject={emailSubject} />
      </div>
    </div>
  );
}

export function PhonePersonalizeSection({
  defaultAll,
  onToggleDefaultAll,
  exceptionsCount,
  onOpenExceptions,
}: Omit<PersonalizePanelProps, "type">) {
  return (
    <div className="border-t border-[#E2E8F0] px-6 pb-6">
      <h3 className="text-[14px] font-bold text-[#1E293B] py-5">
        Personalize Phone Message
      </h3>
      <div className="grid grid-cols-[1fr_340px] gap-8">
        <div className="space-y-5">
          <div>
            <label className="text-[12px] font-semibold text-[#475569] block mb-1.5">
              Content
            </label>
            <textarea
              defaultValue={PHONE_TEMPLATE}
              rows={9}
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[12px] text-[#475569] resize-none outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#1E293B]">
              Default for all clients <span className="text-[#F43F5E]">*</span>
            </span>
            <AutomationToggle
              enabled={defaultAll}
              onToggle={onToggleDefaultAll}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#475569]">
              Exceptions to default
              {exceptionsCount > 0 && (
                <span className="ml-1.5 text-[11px] text-[#635BFF] font-semibold">
                  ({exceptionsCount})
                </span>
              )}
            </span>
            <button
              onClick={onOpenExceptions}
              className="text-[12px] font-semibold text-[#635BFF] hover:underline"
            >
              See list
            </button>
          </div>
        </div>
        <SmsPreview />
      </div>
    </div>
  );
}
