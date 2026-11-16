import React from "react";
import { GripVertical, Edit2, Trash2, Plus, FileText } from "lucide-react";
import { WaiverField } from "./types";
import { FIELD_TYPES } from "./constants";

interface RequiredFieldsProps {
  fields: WaiverField[];
  isAddingField: boolean;
  setIsAddingField: (val: boolean) => void;
  handleEditField: (field: WaiverField) => void;
  handleDeleteField: (id: string) => void;
  children?: React.ReactNode; // For the modal to be passed in or rendered below
}

export default function RequiredFields({
  fields,
  isAddingField,
  setIsAddingField,
  handleEditField,
  handleDeleteField,
  children
}: RequiredFieldsProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium text-[#1E293B]">Required Fields For Signer</h3>
        {(fields.length > 0 || isAddingField) && (
          <button
            onClick={() => setIsAddingField(true)}
            className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-5 py-2 rounded-lg font-medium text-[13px] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        )}
      </div>

      {/* Empty State */}
      {!isAddingField && fields.length === 0 && (
        <div className="border border-[#E2E8F0] rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-[#64748B]" />
          </div>
          <h4 className="text-[14px] font-bold text-[#1E293B] mb-4">No fields added</h4>
          <button
            onClick={() => setIsAddingField(true)}
            className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-6 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>
      )}

      {/* Fields List & Add Form */}
      {(fields.length > 0 || isAddingField) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Existing Fields */}
          {fields.map((field) => (
            <div key={field.id} className="border border-[#E2E8F0] rounded-[16px] p-6 space-y-5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[#F8FAFC] flex items-center justify-center flex-shrink-0">
                    {FIELD_TYPES.find(t => t.value === field.type)?.icon && React.createElement(FIELD_TYPES.find(t => t.value === field.type)!.icon, { className: "w-6 h-6 text-[#64748B]" })}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-medium text-[#1E293B]">{field.label}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-medium text-[#475569] bg-[#F1F5F9] px-2.5 py-0.5 rounded-lg">{field.type}</span>
                      {field.required && (
                        <span className="text-[11px] font-medium text-[#F43F5E] bg-[#FDF2F8] px-2.5 py-0.5 rounded-lg">Required</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditField(field)}
                    className="w-9 h-9 rounded-lg bg-[#F0F9FF] text-[#38BDF8] flex items-center justify-center hover:bg-[#E0F2FE] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="w-9 h-9 rounded-lg bg-[#FDF2F8] text-[#F43F5E] flex items-center justify-center hover:bg-[#FCE7F3] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <p className="text-[12px] font-medium text-[#94A3B8] mb-1">Field Name</p>
                  <p className="text-[14px] font-medium text-[#1E293B]">{field.fieldName}</p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#94A3B8] mb-1">Placeholder</p>
                  <p className="text-[14px] font-medium text-[#1E293B]">{field.placeholder || "-"}</p>
                </div>
                {field.description && (
                  <div className="col-span-2 pt-1">
                    <p className="text-[12px] font-medium text-[#94A3B8] mb-1">Description</p>
                    <p className="text-[14px] font-medium text-[#1E293B]">{field.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {children}
        </div>
      )}
    </>
  );
}
