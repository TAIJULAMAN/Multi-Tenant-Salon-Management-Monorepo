"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Edit2, Trash2, X, ChevronDown } from "lucide-react";

export interface AllergyItem {
  id: number;
  title: string;
  description: string;
  severity: "Mild" | "Moderate" | "Severe";
}

interface ClientMedicalTabProps {
  onOpenAddAllergy: () => void;
}

const INITIAL_ALLERGIES: AllergyItem[] = [
  {
    id: 1,
    title: "Fragrances Allergie",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    severity: "Mild",
  },
  {
    id: 2,
    title: "Fragrances Allergie",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    severity: "Moderate",
  },
  {
    id: 3,
    title: "Fragrances Allergie",
    description:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    severity: "Severe",
  },
];

export default function ClientMedicalTab({
  onOpenAddAllergy,
}: ClientMedicalTabProps) {
  const [allergies, setAllergies] = useState<AllergyItem[]>(INITIAL_ALLERGIES);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<AllergyItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AllergyItem | null>(null);

  const getCardStyles = (severity: "Mild" | "Moderate" | "Severe") => {
    switch (severity) {
      case "Mild":
        return {
          container: "bg-[#F8F9FE] border-[#A5B4FC]",
          badge: "bg-[#635BFF] text-white",
        };
      case "Moderate":
        return {
          container: "bg-[#FEFCE8] border-[#FDE047]",
          badge: "bg-[#FACC15] text-white",
        };
      case "Severe":
        return {
          container: "bg-[#FFF1F2] border-[#FDA4AF]",
          badge: "bg-[#FB7185] text-white",
        };
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setAllergies((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    setAllergies((prev) => prev.filter((item) => item.id !== deletingItem.id));
    setDeletingItem(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-5 sm:p-7 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B] font-manrope">
          Medical / Personal Notes
        </h2>
        <button
          type="button"
          onClick={onOpenAddAllergy}
          className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Allergie
        </button>
      </div>

      <div className="space-y-4">
        {allergies.length === 0 ? (
          <div className="text-center py-12 text-[#94A3B8] text-[13px] font-medium border border-dashed border-[#E2E8F0] rounded-lg">
            No medical or allergy notes recorded yet.
          </div>
        ) : (
          allergies.map((item) => {
            const styles = getCardStyles(item.severity);
            const isMenuOpen = openMenuId === item.id;

            return (
              <div
                key={item.id}
                className={`${styles.container} border rounded-lg p-5 shadow-sm relative group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-[14px] font-bold text-[#1E293B]">
                    {item.title}
                  </h4>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : item.id)
                      }
                      className="text-[#94A3B8] hover:text-[#1E293B] p-1 -mr-1 transition-colors cursor-pointer rounded-md hover:bg-black/5"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Action Dropdown Menu */}
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-8 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-1 z-20 min-w-[130px] animate-in fade-in zoom-in-95 duration-150">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditingItem({ ...item });
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#64748B] hover:text-[#635BFF] hover:bg-[#EEF2FF] rounded-md transition-colors w-full text-left cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeletingItem(item);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-[#EF4444] hover:bg-[#FEE2E2] rounded-md transition-colors w-full text-left cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-[12px] text-[#94A3B8] font-medium leading-relaxed mb-4 max-w-[90%]">
                  {item.description}
                </p>

                <span
                  className={`inline-block ${styles.badge} px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm`}
                >
                  {item.severity}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Allergy Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
                Edit Allergie Note
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
                  Severity *
                </label>
                <div className="relative">
                  <select
                    value={editingItem.severity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        severity: e.target.value as "Mild" | "Moderate" | "Severe",
                      })
                    }
                    className="appearance-none w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all bg-white pr-10 cursor-pointer"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#635BFF] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-[420px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-[17px] font-bold text-[#1E293B] font-manrope mb-2">
              Delete Allergie Note
            </h3>
            <p className="text-[13px] text-[#64748B] mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-[#1E293B]">"{deletingItem.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-[#EF4444] text-white px-5 py-2 rounded-lg text-[13px] font-bold hover:bg-[#DC2626] transition-colors shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
