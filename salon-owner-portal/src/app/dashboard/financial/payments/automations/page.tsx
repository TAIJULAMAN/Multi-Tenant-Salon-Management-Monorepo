"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { PaymentTab, PersonalizeType } from "@/components/financial/types";
import {
  WhatsAppIcon,
  EmailIcon,
  PhoneIcon,
} from "@/components/financial/payments/automations/AutomationPreviews";
import { ExceptionsModal } from "@/components/financial/payments/automations/ExceptionsModal";
import {
  AutomationToggle,
  WhatsAppPersonalizeSection,
  EmailPersonalizeSection,
  PhonePersonalizeSection,
} from "@/components/financial/payments/automations/PersonalizeSections";

export default function AutomationsPage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("Cash Payment");
  const [personalize, setPersonalize] = useState<PersonalizeType>("whatsapp");

  // Per-channel automation enabled
  const [channels, setChannels] = useState({
    whatsapp: true,
    email: false,
    phone: false,
  });

  // Default for all clients per channel
  const [defaultAll, setDefaultAll] = useState({
    whatsapp: true,
    email: true,
    phone: true,
  });

  // Exceptions modal state
  const [exceptionsOpen, setExceptionsOpen] = useState(false);
  const [activeExceptionType, setActiveExceptionType] = useState<
    "whatsapp" | "email" | "phone"
  >("whatsapp");
  const [exceptions, setExceptions] = useState<{
    whatsapp: string[];
    email: string[];
    phone: string[];
  }>({
    whatsapp: ["1", "3"],
    email: [],
    phone: ["2"],
  });

  const openExceptions = (type: "whatsapp" | "email" | "phone") => {
    setActiveExceptionType(type);
    setExceptionsOpen(true);
  };

  const saveExceptions = (ids: string[]) => {
    setExceptions((p) => ({ ...p, [activeExceptionType]: ids }));
  };

  const tabs: PaymentTab[] = [
    "Cash Payment",
    "Card Payments",
    "Online Payments",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#94A3B8]">
        <Link
          href="/dashboard"
          className="hover:text-[#635BFF] transition-colors flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <Link
          href="/dashboard/financial/payments"
          className="hover:text-[#635BFF] transition-colors"
        >
          Payments
        </Link>
        <span>/</span>
        <span className="text-[#635BFF] font-semibold">Automations</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/financial/payments"
          className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8F9FE] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#475569]" />
        </Link>
        <div>
          <h1 className="text-[20px] font-bold text-[#1E293B]">
            Payment Automations
          </h1>
          <p className="text-[12px] text-[#94A3B8]">
            Configure automated notifications and receipts sent upon transaction
            completion
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 text-[13px] font-bold border-b-2 transition-colors -mb-[1px] ${
                activeTab === tab
                  ? "border-[#635BFF] text-[#635BFF]"
                  : "border-transparent text-[#94A3B8] hover:text-[#475569]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Channel Cards Row */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* WhatsApp Card */}
          <div
            className={`border rounded-lg p-5 flex flex-col justify-between transition-all ${
              personalize === "whatsapp"
                ? "border-[#635BFF] bg-[#FAFBFF] shadow-sm"
                : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center shadow-sm">
                  <WhatsAppIcon />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    WhatsApp
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Send via WhatsApp
                  </div>
                </div>
              </div>
              <AutomationToggle
                enabled={channels.whatsapp}
                onToggle={() =>
                  setChannels((p) => ({ ...p, whatsapp: !p.whatsapp }))
                }
              />
            </div>
            <button
              onClick={() =>
                setPersonalize(personalize === "whatsapp" ? null : "whatsapp")
              }
              className={`w-full py-2 rounded-lg text-[12px] font-bold transition-colors ${
                personalize === "whatsapp"
                  ? "bg-[#635BFF] text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
              }`}
            >
              {personalize === "whatsapp" ? "Editing Template" : "Personalize"}
            </button>
          </div>

          {/* Email Card */}
          <div
            className={`border rounded-lg p-5 flex flex-col justify-between transition-all ${
              personalize === "email"
                ? "border-[#635BFF] bg-[#FAFBFF] shadow-sm"
                : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#635BFF] flex items-center justify-center shadow-sm">
                  <EmailIcon />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    Email
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Send via Email
                  </div>
                </div>
              </div>
              <AutomationToggle
                enabled={channels.email}
                onToggle={() => setChannels((p) => ({ ...p, email: !p.email }))}
              />
            </div>
            <button
              onClick={() =>
                setPersonalize(personalize === "email" ? null : "email")
              }
              className={`w-full py-2 rounded-lg text-[12px] font-bold transition-colors ${
                personalize === "email"
                  ? "bg-[#635BFF] text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
              }`}
            >
              {personalize === "email" ? "Editing Template" : "Personalize"}
            </button>
          </div>

          {/* Phone / SMS Card */}
          <div
            className={`border rounded-lg p-5 flex flex-col justify-between transition-all ${
              personalize === "phone"
                ? "border-[#635BFF] bg-[#FAFBFF] shadow-sm"
                : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-sm">
                  <PhoneIcon />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    SMS / Phone
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Send via Text Message
                  </div>
                </div>
              </div>
              <AutomationToggle
                enabled={channels.phone}
                onToggle={() => setChannels((p) => ({ ...p, phone: !p.phone }))}
              />
            </div>
            <button
              onClick={() =>
                setPersonalize(personalize === "phone" ? null : "phone")
              }
              className={`w-full py-2 rounded-lg text-[12px] font-bold transition-colors ${
                personalize === "phone"
                  ? "bg-[#635BFF] text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
              }`}
            >
              {personalize === "phone" ? "Editing Template" : "Personalize"}
            </button>
          </div>
        </div>

        {/* Personalization Panels */}
        {personalize === "whatsapp" && (
          <WhatsAppPersonalizeSection
            defaultAll={defaultAll.whatsapp}
            onToggleDefaultAll={() =>
              setDefaultAll((p) => ({ ...p, whatsapp: !p.whatsapp }))
            }
            exceptionsCount={exceptions.whatsapp.length}
            onOpenExceptions={() => openExceptions("whatsapp")}
          />
        )}

        {personalize === "email" && (
          <EmailPersonalizeSection
            defaultAll={defaultAll.email}
            onToggleDefaultAll={() =>
              setDefaultAll((p) => ({ ...p, email: !p.email }))
            }
            exceptionsCount={exceptions.email.length}
            onOpenExceptions={() => openExceptions("email")}
          />
        )}

        {personalize === "phone" && (
          <PhonePersonalizeSection
            defaultAll={defaultAll.phone}
            onToggleDefaultAll={() =>
              setDefaultAll((p) => ({ ...p, phone: !p.phone }))
            }
            exceptionsCount={exceptions.phone.length}
            onOpenExceptions={() => openExceptions("phone")}
          />
        )}
      </div>

      {/* Save Settings footer */}
      {personalize && (
        <div className="flex justify-end">
          <button className="bg-[#635BFF] hover:bg-[#524be0] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm shadow-[#635BFF]/20">
            Save Settings
          </button>
        </div>
      )}

      {/* Exceptions Modal */}
      <ExceptionsModal
        isOpen={exceptionsOpen}
        onClose={() => setExceptionsOpen(false)}
        selected={exceptions[activeExceptionType]}
        onSave={saveExceptions}
      />
    </div>
  );
}
