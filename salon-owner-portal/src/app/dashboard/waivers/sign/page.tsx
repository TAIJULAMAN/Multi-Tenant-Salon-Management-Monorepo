"use client";

import React, { useState } from "react";
import Link from "next/link";
import DocumentSignersSection from "@/components/waivers/DocumentSignersSection";
import ContractAttachmentSection from "@/components/waivers/ContractAttachmentSection";
import DocumentSigningPreview from "@/components/waivers/DocumentSigningPreview";

export default function DocumentSigningPage() {
  const [signer2Signature, setSigner2Signature] = useState<string | null>(null);

  // Checkboxes state
  const [checks, setChecks] = useState({
    terms: false,
    documents: false,
    accurate: false,
    privacy: false,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[20px] font-semibold text-[#1E293B]">
            Document Signing
          </h1>
          <div className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 30L20 15L27.5 30H32.5L20 5L7.5 30H12.5Z"
                fill="#635BFF"
              />
            </svg>
            <span className="text-[#635BFF] font-bold text-xl">Your logo</span>
          </div>
        </div>

        {/* Signers Section */}
        <DocumentSignersSection
          signer2Signature={signer2Signature}
          setSigner2Signature={setSigner2Signature}
        />

        {/* Custom Input */}
        <div className="mb-8">
          <h2 className="text-[15px] font-bold text-[#1E293B] mb-4">
            Custom Input
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
            <label className="block text-[13px] font-medium text-[#1E293B] mb-2">
              Name *
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full md:w-1/2 border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-[#635BFF]"
            />
          </div>
        </div>

        {/* Contract Attachments & Requirement */}
        <ContractAttachmentSection />

        {/* Document Preview */}
        <DocumentSigningPreview signer2Signature={signer2Signature} />

        {/* Checkboxes */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm mb-8 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.terms}
              onChange={(e) =>
                setChecks({ ...checks, terms: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#CBD5E1] text-[#635BFF] focus:ring-[#635BFF]"
            />
            <span className="text-[14px] text-[#475569]">
              I agree to the Terms and Conditions
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.documents}
              onChange={(e) =>
                setChecks({ ...checks, documents: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#CBD5E1] text-[#635BFF] focus:ring-[#635BFF]"
            />
            <span className="text-[14px] text-[#475569]">
              I confirm that I have read and understood all documents
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.accurate}
              onChange={(e) =>
                setChecks({ ...checks, accurate: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#CBD5E1] text-[#635BFF] focus:ring-[#635BFF]"
            />
            <span className="text-[14px] text-[#475569]">
              I acknowledge that the information provided is accurate
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checks.privacy}
              onChange={(e) =>
                setChecks({ ...checks, privacy: e.target.checked })
              }
              className="w-5 h-5 rounded border-[#CBD5E1] text-[#635BFF] focus:ring-[#635BFF]"
            />
            <span className="text-[14px] text-[#475569]">
              I accept the privacy policy
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pb-12">
          <Link
            href="/dashboard/waivers"
            className="bg-[#635BFF] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#524be0] transition-colors shadow-lg shadow-[#635BFF]/30"
          >
            Save & Send
          </Link>
        </div>
      </div>
    </div>
  );
}
