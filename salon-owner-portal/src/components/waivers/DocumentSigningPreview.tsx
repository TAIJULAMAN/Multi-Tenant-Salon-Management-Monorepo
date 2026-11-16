"use client";

import React from "react";
import { Download } from "lucide-react";

interface DocumentSigningPreviewProps {
  signer2Signature: string | null;
}

export default function DocumentSigningPreview({
  signer2Signature,
}: DocumentSigningPreviewProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-[#1E293B]">Document Name</h2>
        <button
          type="button"
          className="bg-[#EEF2FF] text-[#635BFF] px-4 py-2 rounded-lg text-[12px] font-bold flex items-center gap-2 hover:bg-[#E0E7FF] transition-colors uppercase tracking-wide cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-12 shadow-sm flex justify-center overflow-hidden h-[800px] overflow-y-auto">
        <div className="max-w-[700px] w-full">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-2xl font-bold text-[#1E293B]">Document Name</h1>
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 30L20 15L27.5 30H32.5L20 5L7.5 30H12.5Z"
                  fill="#635BFF"
                />
              </svg>
              <span className="text-[#635BFF] font-bold text-lg">
                Your logo
              </span>
            </div>
          </div>

          <div className="space-y-6 text-[14px] text-[#475569] leading-relaxed">
            <div>
              <h3 className="font-bold text-[#1E293B] mb-2">
                What is Lorem Ipsum?
              </h3>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B] mb-2">
                Why do we use it?
              </h3>
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B] mb-2">
                Where does it come from?
              </h3>
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#1E293B] mb-2">
                Where can I get some?
              </h3>
              <p>
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable.
              </p>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 gap-12">
            <div>
              <div className="border-b border-[#E2E8F0] pb-2 mb-2" />
              <p className="text-[12px] text-[#64748B] text-center">
                Mario Rossi (Owner)
              </p>
            </div>
            <div>
              <div className="border-b border-[#E2E8F0] pb-2 mb-2">
                {signer2Signature && (
                  <img
                    src={signer2Signature}
                    alt="Signature"
                    className="h-10 object-contain mx-auto"
                  />
                )}
              </div>
              <p className="text-[12px] text-[#64748B] text-center">
                Client Name (Client)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
