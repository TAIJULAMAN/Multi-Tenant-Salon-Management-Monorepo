"use client";

import React from "react";
import { ViewGiftCardData } from "./types";

interface ViewGiftCardDetailsProps {
  data: ViewGiftCardData;
}

export default function ViewGiftCardDetails({ data }: ViewGiftCardDetailsProps) {
  return (
    <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-8">
      <h2 className="text-[16px] font-bold text-[#1E293B] mb-8">
        Gift Card Details
      </h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">
              How many gift cards do you want to create?
            </p>
            <p className="text-[14px] font-bold text-[#1E293B]">{data.numCards}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">Amount</p>
            <div className="flex items-center gap-3">
              <p className="text-[14px] font-bold text-[#1E293B]">{data.amount}</p>
              {data.isAmountHidden && (
                <span className="text-[10px] font-bold text-[#F43F5E] bg-[#FFE4E6] px-2 py-0.5 rounded border border-[#F43F5E]/20">
                  Hidden
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">Salon Name</p>
            <p className="text-[14px] font-bold text-[#1E293B]">{data.salonName}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">Website</p>
            <p className="text-[14px] font-bold text-[#1E293B]">{data.website}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#94A3B8] mb-1">Address</p>
          <p className="text-[14px] font-bold text-[#1E293B]">{data.address}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">
              Date of issue
            </p>
            <p className="text-[14px] font-bold text-[#1E293B]">
              {data.dateOfIssue}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">
              Date of Expiration
            </p>
            <p className="text-[14px] font-bold text-[#1E293B]">
              {data.dateOfExpiration}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#94A3B8] mb-1">Usage Limit</p>
          <p className="text-[14px] font-bold text-[#1E293B]">{data.usageLimit}</p>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#94A3B8] mb-2">
            Eligible Services
          </p>
          <div className="flex flex-wrap gap-2">
            {data.eligibleServices.map((service, i) => (
              <span
                key={i}
                className="bg-[#EEF2FF] text-[#635BFF] text-[12px] font-medium px-3 py-1.5 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">
              Receiver Name
            </p>
            <p className="text-[14px] font-bold text-[#1E293B]">
              {data.receiverName}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#94A3B8] mb-1">
              Gifter Name
            </p>
            <p className="text-[14px] font-bold text-[#1E293B]">
              {data.gifterName}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-medium text-[#94A3B8] mb-1">Message</p>
          <p className="text-[13px] text-[#334155] leading-relaxed">
            {data.message}
          </p>
        </div>
      </div>
    </div>
  );
}
