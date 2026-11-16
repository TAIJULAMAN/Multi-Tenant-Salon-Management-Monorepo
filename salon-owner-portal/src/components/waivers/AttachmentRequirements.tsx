import React, { useState } from "react";
import { Plus, Trash2, File, FileText, ImageIcon } from "lucide-react";
import CustomInput from "@/components/customComponent/CustomInput";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";
import { AttachmentRequirement } from "./types";

interface AttachmentRequirementsProps {
  attachmentRequirements: AttachmentRequirement[];
  setAttachmentRequirements: (reqs: AttachmentRequirement[]) => void;
}

export default function AttachmentRequirements({
  attachmentRequirements,
  setAttachmentRequirements,
}: AttachmentRequirementsProps) {
  const [isAddingRequirement, setIsAddingRequirement] = useState(false);
  const [newRequirement, setNewRequirement] = useState({ name: "", types: [] as string[] });

  const handleSaveRequirement = () => {
    if (!newRequirement.name || newRequirement.types.length === 0) return;
    setAttachmentRequirements([
      ...attachmentRequirements,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newRequirement.name,
        types: newRequirement.types,
      }
    ]);
    setNewRequirement({ name: "", types: [] });
    setIsAddingRequirement(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#1E293B]">Attachment Requirement</h3>
        <button
          onClick={() => setIsAddingRequirement(true)}
          className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-4 py-2 rounded-lg font-medium text-[13px] flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add attachment requirement
        </button>
      </div>

      <div className="space-y-6">
        {attachmentRequirements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attachmentRequirements.map((req) => (
              <div key={req.id} className="border border-[#E2E8F0] rounded-[12px] p-4 bg-white flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <File className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#1E293B] leading-tight mb-1">{req.name}</p>
                    <p className="text-[12px] text-[#94A3B8] font-medium uppercase">{req.types.join(", ")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setAttachmentRequirements(attachmentRequirements.filter(r => r.id !== req.id))}
                  className="w-10 h-10 rounded-lg bg-[#FDF2F8] text-[#F43F5E] flex items-center justify-center hover:bg-[#FCE7F3] transition-colors flex-shrink-0 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isAddingRequirement && (
          <div className="border border-[#E2E8F0] rounded-[16px] p-6 bg-white shadow-sm space-y-6 relative">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-bold text-[#1E293B]">Requirement {attachmentRequirements.length + 1}</h4>
              <button
                onClick={() => setIsAddingRequirement(false)}
                className="text-[#F43F5E] hover:bg-[#FDF2F8] p-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="md:w-1/3">
                <CustomInput
                  label="Name *"
                  placeholder="Enter name"
                  value={newRequirement.name}
                  onChange={(val) => setNewRequirement({ ...newRequirement, name: val })}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-[#1E293B]">Types Accepted *</label>
                  <p className="text-[12px] text-[#94A3B8]">Select one or more</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* PDF Documents */}
                  <label className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between transition-colors ${newRequirement.types.includes('pdf') ? 'border-[#635BFF] bg-[#EEF2FF]/30' : 'border-[#E2E8F0] bg-[#F8FAFC]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FDF2F8] flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#F43F5E]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1E293B]">PDF Documents</p>
                        <div className="mt-1 flex gap-1">
                          <span className="bg-[#FDF2F8] text-[#F43F5E] text-[10px] font-bold px-2 py-0.5 rounded uppercase">pdf</span>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      className="w-5 h-5 rounded-[6px] flex flex-shrink-0 items-center justify-center transition-colors"
                      checked={newRequirement.types.includes('pdf')}
                      onChange={(checked) => {
                        if (checked) setNewRequirement({ ...newRequirement, types: Array.from(new Set([...newRequirement.types, 'pdf'])) });
                        else setNewRequirement({ ...newRequirement, types: newRequirement.types.filter(t => t !== 'pdf') });
                      }}
                    />
                  </label>

                  {/* Documents */}
                  <label className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between transition-colors ${newRequirement.types.some(t => ['docx', 'doc'].includes(t)) ? 'border-[#635BFF] bg-[#EEF2FF]/30' : 'border-[#E2E8F0] bg-[#F8FAFC]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#635BFF]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1E293B]">Documents</p>
                        <div className="mt-1 flex gap-1">
                          <span className="bg-[#EEF2FF] text-[#635BFF] text-[10px] font-bold px-2 py-0.5 rounded uppercase">docx</span>
                          <span className="bg-[#EEF2FF] text-[#635BFF] text-[10px] font-bold px-2 py-0.5 rounded uppercase">doc</span>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      className="w-5 h-5 rounded-[6px] flex flex-shrink-0 items-center justify-center transition-colors"
                      checked={newRequirement.types.some(t => ['docx', 'doc'].includes(t))}
                      onChange={(checked) => {
                        if (checked) setNewRequirement({ ...newRequirement, types: Array.from(new Set([...newRequirement.types, 'docx', 'doc'])) });
                        else setNewRequirement({ ...newRequirement, types: newRequirement.types.filter(t => !['docx', 'doc'].includes(t)) });
                      }}
                    />
                  </label>

                  {/* Images */}
                  <label className={`cursor-pointer border rounded-lg p-4 flex items-center justify-between transition-colors ${newRequirement.types.some(t => ['png', 'jpg', 'jpeg'].includes(t)) ? 'border-[#635BFF] bg-[#EEF2FF]/30' : 'border-[#E2E8F0] bg-[#F8FAFC]'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#CCFBF1] flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-[#14B8A6]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1E293B]">Images</p>
                        <div className="mt-1 flex gap-1">
                          <span className="bg-[#CCFBF1] text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded uppercase">png</span>
                          <span className="bg-[#CCFBF1] text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded uppercase">jpg</span>
                          <span className="bg-[#CCFBF1] text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded uppercase">jpeg</span>
                        </div>
                      </div>
                    </div>
                    <CustomCheckbox
                      className="w-5 h-5 rounded-[6px] flex flex-shrink-0 items-center justify-center transition-colors"
                      checked={newRequirement.types.some(t => ['png', 'jpg', 'jpeg'].includes(t))}
                      onChange={(checked) => {
                        if (checked) setNewRequirement({ ...newRequirement, types: Array.from(new Set([...newRequirement.types, 'png', 'jpg', 'jpeg'])) });
                        else setNewRequirement({ ...newRequirement, types: newRequirement.types.filter(t => !['png', 'jpg', 'jpeg'].includes(t)) });
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveRequirement}
                className="border border-[#E2E8F0] text-[#635BFF] hover:bg-[#F8FAFC] px-6 py-2 rounded-lg font-medium text-[13px] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
