"use client";

import React, { useState } from "react";
import { Check, Edit2, Trash2, AlertCircle } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import Modal from "@/components/customComponent/Modal";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";

export default function ViewServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=1",
      duration: "-",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=5",
      duration: "-",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=9",
      duration: "-",
    },
    {
      id: 4,
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=2",
      duration: "-",
    },
  ]);

  const [editingMember, setEditingMember] = useState<{
    id: number;
    duration: string;
  } | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  const handleDeleteMember = () => {
    if (memberToDelete !== null) {
      setMembers(members.filter((m) => m.id !== memberToDelete));
      setMemberToDelete(null);
    }
  };

  const handleSaveDuration = () => {
    if (editingMember) {
      setMembers(
        members.map((m) =>
          m.id === editingMember.id
            ? { ...m, duration: editingMember.duration }
            : m,
        ),
      );
      setEditingMember(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CustomSubPageHeader
        title="View Service"
        backUrl="/dashboard/services"
        breadcrumbText="Services"
      />
      <div className="py-6 w-full space-y-6">
        {/* Basic Details Section */}
        <div className="bg-white rounded-lg p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] border border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-[20px] font-bold text-[#1E293B]">Haircut</h2>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded bg-[#635BFF] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-medium text-[#475569]">
                Add it to online bookings
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
            <div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
                Category
              </p>
              <span className="inline-flex items-center bg-[#E0E7FF] text-[#635BFF] px-3 py-1 rounded-lg text-[12px] font-bold">
                Category 1
              </span>
            </div>
            <div></div>

            <div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
                Default Duration
              </p>
              <p className="text-[14px] font-bold text-[#1E293B]">15 min</p>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
                Post-break Min
              </p>
              <p className="text-[14px] font-bold text-[#1E293B]">15 min</p>
            </div>

            <div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
                Price Type
              </p>
              <p className="text-[14px] font-bold text-[#1E293B]">Fixed</p>
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
                Price
              </p>
              <p className="text-[14px] font-bold text-[#1E293B]">€ 270</p>
            </div>

            <div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">VAT</p>
              <p className="text-[14px] font-bold text-[#1E293B]">€ 70</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
              Description
            </p>
            <p className="text-[14px] font-medium text-[#1E293B] leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>

        {/* Members Required Section */}
        <div className="bg-white rounded-lg p-8 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.02)] border border-[#E2E8F0]">
          <h2 className="text-[16px] font-bold text-[#1E293B] mb-6">
            Members Required
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-[#F8FAFC] border border-transparent rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
                    <img
                      src={member.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[14px] font-bold text-[#1E293B]">
                    {member.name}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-bold text-[#1E293B]">
                      {member.duration}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Duration</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setEditingMember({
                          id: member.id,
                          duration:
                            member.duration === "-" ? "" : member.duration,
                        })
                      }
                      className="text-[#635BFF] hover:text-[#524be0] hover:bg-[#EEF2FF] transition-colors p-1.5 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setMemberToDelete(member.id)}
                      className="text-[#F43F5E] hover:text-[#E11D48] transition-colors p-1.5 rounded-lg hover:bg-[#FFE4E6]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Edit Duration Modal */}
      <Modal
        isOpen={editingMember !== null}
        onClose={() => setEditingMember(null)}
        title="Edit Duration"
        maxWidth="max-w-[400px]"
      >
        <div className="flex flex-col gap-6">
          <div className="pt-2">
            <CustomSelect
              label="Select Duration"
              value={editingMember?.duration || ""}
              onChange={(val) =>
                setEditingMember((prev) =>
                  prev ? { ...prev, duration: val } : null,
                )
              }
              options={["15m", "30m", "45m", "1h", "1h 30m", "2h"]}
              placeholder="e.g. 30m"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditingMember(null)}
              className="px-6 py-2.5 rounded-lg text-[14px] font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDuration}
              className="bg-[#635BFF] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={memberToDelete !== null}
        onClose={() => setMemberToDelete(null)}
        title="Delete Member"
        maxWidth="max-w-[400px]"
      >
        <div className="flex flex-col gap-6 pt-2">
          <div className="flex items-center gap-3 text-[#1E293B]">
            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            </div>
            <p className="text-[14px] font-medium leading-relaxed">
              Are you sure you want to remove this member from the service? This
              action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setMemberToDelete(null)}
              className="px-6 py-2.5 rounded-lg text-[14px] font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMember}
              className="bg-[#EF4444] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm"
            >
              Remove Member
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
