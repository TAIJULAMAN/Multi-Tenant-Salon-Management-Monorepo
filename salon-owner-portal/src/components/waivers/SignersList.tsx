import React, { useRef, useState, useEffect } from "react";
import { ChevronDown, Plus, Edit2, Trash2 } from "lucide-react";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import { Signer } from "./types";

interface SignersListProps {
  signers: Signer[];
  setSigningSignerId: (id: string | null) => void;
  deleteSigner: (id: string) => void;
  updateSigner: (id: string, updates: Partial<Signer>) => void;
  addSigner: (type: "Pre-signed" | "Recipient") => void;
}

export default function SignersList({
  signers,
  setSigningSignerId,
  deleteSigner,
  updateSigner,
  addSigner,
}: SignersListProps) {
  const [isAddSignerDropdownOpen, setIsAddSignerDropdownOpen] = useState(false);
  const addSignerDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addSignerDropdownRef.current && !addSignerDropdownRef.current.contains(e.target as Node)) {
        setIsAddSignerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddSigner = (type: "Pre-signed" | "Recipient") => {
    addSigner(type);
    setIsAddSignerDropdownOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-medium text-[#1E293B]">Signers</h3>

        <div className="relative" ref={addSignerDropdownRef}>
          <button
            onClick={() => setIsAddSignerDropdownOpen(!isAddSignerDropdownOpen)}
            className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-2 transition-colors"
          >
            Add Signer
            <ChevronDown className="w-4 h-4" />
          </button>

          {isAddSignerDropdownOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-32 bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#E2E8F0] py-2 z-10">
              <button
                onClick={() => handleAddSigner("Pre-signed")}
                className="w-full px-4 py-2 text-[13px] text-[#475569] hover:bg-[#F8FAFC] text-left transition-colors font-medium"
              >
                Pre-signed
              </button>
              <button
                onClick={() => handleAddSigner("Recipient")}
                className="w-full px-4 py-2 text-[13px] text-[#475569] hover:bg-[#F8FAFC] text-left transition-colors font-medium"
              >
                Recipient
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {signers.map((signer, index) => (
          <div key={signer.id} className={`border border-[#E2E8F0] rounded-[16px] p-6 space-y-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${signer.type === "Recipient" ? 'h-fit' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="text-[15px] font-medium text-[#1E293B]">Signer {index + 1}</h4>
                {signer.type === "Pre-signed" ? (
                  <span className="bg-[#CCFBF1] text-[#14B8A6] px-2.5 py-0.5 rounded-lg text-[11px] font-medium">Pre-signed</span>
                ) : (
                  <span className="bg-[#EEF2FF] text-[#635BFF] px-2.5 py-0.5 rounded-lg text-[11px] font-medium">Recipient</span>
                )}
              </div>
              <button
                onClick={() => deleteSigner(signer.id)}
                className="w-8 h-8 rounded-lg bg-[#FDF2F8] text-[#F43F5E] flex items-center justify-center hover:bg-[#FCE7F3] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className={`grid ${signer.type === "Pre-signed" ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
              <CustomSelect
                label="Category of Signer *"
                value={signer.category || "Owner"}
                options={["Owner", "Client", "Staff"]}
                onChange={(val) => updateSigner(signer.id, { category: val })}
              />

              {signer.type === "Pre-signed" && (
                <CustomInput
                  label="Name *"
                  placeholder="Enter name"
                  value={signer.name}
                  onChange={(val) => updateSigner(signer.id, { name: val })}
                />
              )}
            </div>

            {signer.type === "Pre-signed" && (
              <div className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-[#1E293B]">Signature</label>
                  <p className="text-[13px] text-[#94A3B8]">As a pre-signer, you must sign now during the template creation.</p>
                </div>

                {signer.signature ? (
                  <div>
                    <div className="border border-dashed border-[#14B8A6] bg-[#CCFBF1]/20 rounded-lg h-[120px] flex flex-col items-center justify-center mt-4 overflow-hidden p-2">
                      {signer.signature.startsWith('data:image') ? (
                        <img src={signer.signature} className="max-h-full max-w-full object-contain" alt="Signature" />
                      ) : (
                        <span className="text-[#14B8A6] text-3xl italic font-serif">{signer.signature}</span>
                      )}
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => setSigningSignerId(signer.id)}
                        className="px-5 py-2.5 rounded-lg text-[13px] font-medium bg-[#ECFEFF] text-[#0891B2] hover:bg-[#CFFAFE] transition-colors"
                      >
                        Edit Signature
                      </button>
                    </div>
                  </div>
                ) : signer.isDrawing ? (
                  <div>
                    <div
                      onClick={() => setSigningSignerId(signer.id)}
                      className="border border-dashed border-[#CBD5E1] rounded-lg h-[120px] flex items-center justify-center bg-white mt-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-[#635BFF] text-[13px] font-medium">Click to draw</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSigningSignerId(signer.id)}
                    className="bg-[#14B8A6] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-colors hover:bg-[#0D9488] mt-4"
                  >
                    Draw Signature
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {signers.length === 0 && (
          <div className="col-span-1 lg:col-span-2 border border-[#E2E8F0] border-dashed rounded-[16px] py-16 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-12 h-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-[#635BFF]" />
            </div>
            <h4 className="text-[14px] font-medium text-[#1E293B] mb-2">No signers added</h4>
            <p className="text-[13px] text-[#94A3B8]">Click "Add Signer" to add pre-signers or recipients to this template.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex">
        <span className="bg-[#EEF2FF] text-[#635BFF] px-4 py-2 rounded-lg text-[13px] font-medium">
          Necessary Signers: {signers.length}
        </span>
      </div>
    </>
  );
}
