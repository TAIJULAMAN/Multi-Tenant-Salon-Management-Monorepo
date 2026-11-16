"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import SignatureCanvas from "@/components/waivers/SignatureCanvas";

interface DocumentSignersSectionProps {
  signer2Signature: string | null;
  setSigner2Signature: (sig: string | null) => void;
}

export default function DocumentSignersSection({
  signer2Signature,
  setSigner2Signature,
}: DocumentSignersSectionProps) {
  const [signatureType, setSignatureType] = useState<
    "draw" | "type" | "upload"
  >("draw");
  const [typedName, setTypedName] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Signer 1 */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#635BFF]">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1E293B]">Signer 1</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-[11px] font-medium text-[#0D9488] bg-[#CCFBF1] rounded-lg">
                Pre-signed
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium text-white bg-[#10B981] rounded-lg">
                Signed
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">
              NAME
            </p>
            <p className="text-[14px] font-medium text-[#1E293B]">
              Mario Rossi
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">
              EMAIL
            </p>
            <p className="text-[14px] font-medium text-[#1E293B]">
              mario.rossi@email.com
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">
              CATEGORY OF SIGNER
            </p>
            <p className="text-[14px] font-medium text-[#1E293B]">Owner</p>
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider mb-2">
              SIGNATURE
            </p>
            <div className="w-full h-[150px] border border-dashed border-[#CBD5E1] rounded-[12px] flex items-center justify-center bg-[#F8FAFC]">
              <span className="font-caveat text-4xl text-gray-800 transform -rotate-2">
                Vicky
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signer 2 */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center text-[#635BFF]">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1E293B]">Signer 2</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-[11px] font-medium text-[#635BFF] bg-[#EEF2FF] rounded-lg">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">
              NAME
            </p>
            <input
              type="text"
              defaultValue="Client Name"
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#635BFF]"
            />
          </div>
          <div>
            <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider mb-1">
              CATEGORY OF SIGNER
            </p>
            <p className="text-[14px] font-medium text-[#1E293B]">Client</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-[#94A3B8] uppercase font-bold tracking-wider">
                SIGNATURE
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureType("draw")}
                  className={`text-[12px] px-2 py-1 rounded ${
                    signatureType === "draw"
                      ? "bg-[#635BFF] text-white"
                      : "text-[#64748B]"
                  }`}
                >
                  Draw
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureType("type")}
                  className={`text-[12px] px-2 py-1 rounded ${
                    signatureType === "type"
                      ? "bg-[#635BFF] text-white"
                      : "text-[#64748B]"
                  }`}
                >
                  Type
                </button>
              </div>
            </div>

            {signatureType === "draw" ? (
              <SignatureCanvas onSave={setSigner2Signature} />
            ) : (
              <div className="border border-[#E2E8F0] rounded-[12px] p-4 bg-[#F8FAFC]">
                <input
                  type="text"
                  placeholder="Type your name"
                  value={typedName}
                  onChange={(e) => {
                    setTypedName(e.target.value);
                    setSigner2Signature(e.target.value);
                  }}
                  className="w-full bg-transparent border-b border-[#CBD5E1] pb-2 text-2xl font-caveat text-gray-800 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
