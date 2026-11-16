import React from "react";
import dynamic from "next/dynamic";
import CustomInput from "@/components/customComponent/CustomInput";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface BasicDetailsProps {
  waiverName: string;
  setWaiverName: (name: string) => void;
  waiverContent: string;
  setWaiverContent: (content: string) => void;
}

export default function BasicDetails({
  waiverName,
  setWaiverName,
  waiverContent,
  setWaiverContent,
}: BasicDetailsProps) {
  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-[#E2E8F0] space-y-6">
      <h2 className="text-[16px] font-bold text-[#1E293B]">Basic Details</h2>
      <CustomInput
        label="Waiver Name *"
        placeholder="Enter name"
        value={waiverName}
        onChange={setWaiverName}
      />
      <div className="space-y-2">
        <label className="text-[13px] font-bold text-[#1E293B]">Text Editor</label>
        <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
          <JoditEditor
            value={waiverContent}
            config={{
              readonly: false,
              height: 400,
              placeholder: "Start typing...",
            }}
            onBlur={(newContent) => setWaiverContent(newContent)}
          />
        </div>
      </div>
    </div>
  );
}
