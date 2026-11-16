"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";

export interface AllergyItem {
  id: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
}

interface ClientMedicalTabProps {
  allergies: AllergyItem[];
  onAddAllergy: () => void;
  onEditAllergy: (allergy: AllergyItem) => void;
  onDeleteAllergy: (allergy: AllergyItem) => void;
}

export function getSeverityCardStyles(severity: string) {
  switch (severity) {
    case "High":
      return {
        card: "bg-[#FFF1F2] border-[#FFE4E6]",
        badge: "bg-[#FFE4E6] text-[#E11D48]",
      };
    case "Medium":
      return {
        card: "bg-[#FEFCE8] border-[#FEF08A]",
        badge: "bg-[#FEF08A] text-[#CA8A04]",
      };
    case "Low":
    default:
      return {
        card: "bg-[#F0FDF4] border-[#DCFCE7]",
        badge: "bg-[#DCFCE7] text-[#16A34A]",
      };
  }
}

export default function ClientMedicalTab({
  allergies,
  onAddAllergy,
  onEditAllergy,
  onDeleteAllergy,
}: ClientMedicalTabProps) {
  const [openAllergyMenuId, setOpenAllergyMenuId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5 sm:p-7 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B] font-manrope">Medical / Personal Notes</h2>
        <button
          onClick={onAddAllergy}
          className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Allergy
        </button>
      </div>

      <div className="space-y-4">
        {allergies.map((allergy) => {
          const styles = getSeverityCardStyles(allergy.severity);
          return (
            <div
              key={allergy.id}
              className={`${styles.card} border rounded-xl p-5 shadow-sm relative group`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-[14px] font-bold text-[#1E293B]">
                  {allergy.title}
                </h4>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenAllergyMenuId(
                        openAllergyMenuId === allergy.id ? null : allergy.id,
                      )
                    }
                    className="text-[#94A3B8] hover:text-[#1E293B] p-1 -mr-1 transition-colors rounded-lg hover:bg-black/5 cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openAllergyMenuId === allergy.id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setOpenAllergyMenuId(null)}
                      />
                      <div className="absolute top-8 right-0 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 z-30 min-w-[130px] animate-in fade-in zoom-in-95 duration-150">
                        <button
                          onClick={() => {
                            onEditAllergy(allergy);
                            setOpenAllergyMenuId(null);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] hover:text-[#635BFF] rounded-lg transition-colors w-full text-left cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#635BFF]" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            onDeleteAllergy(allergy);
                            setOpenAllergyMenuId(null);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-bold text-[#F43F5E] hover:bg-[#FFF1F2] rounded-lg transition-colors w-full text-left cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#F43F5E]" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-[12px] text-[#94A3B8] font-medium leading-relaxed mb-4 max-w-[90%]">
                {allergy.description}
              </p>
              <span
                className={`inline-block ${styles.badge} px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide`}
              >
                {allergy.severity}
              </span>
            </div>
          );
        })}
        {allergies.length === 0 && (
          <div className="py-12 text-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
            <p className="text-[13px] font-medium">
              No allergies recorded for this client.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
