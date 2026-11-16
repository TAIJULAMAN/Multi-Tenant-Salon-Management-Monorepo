import React from "react";
import Modal from "@/components/customComponent/Modal";
import CustomInput from "@/components/customComponent/CustomInput";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomSwitch from "@/components/customComponent/CustomSwitch";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { FIELD_TYPES } from "./constants";

interface FieldFormModalProps {
  isAddingField: boolean;
  setIsAddingField: (isOpen: boolean) => void;
  editingFieldId: string | null;
  setEditingFieldId: (id: string | null) => void;
  newField: any;
  setNewField: (field: any) => void;
  handleSaveField: () => void;
}

export default function FieldFormModal({
  isAddingField,
  setIsAddingField,
  editingFieldId,
  setEditingFieldId,
  newField,
  setNewField,
  handleSaveField,
}: FieldFormModalProps) {
  return (
    <Modal
      isOpen={isAddingField}
      onClose={() => {
        setIsAddingField(false);
        setEditingFieldId(null);
        setNewField({ fieldName: "", label: "", type: "Text", placeholder: "", description: "", required: false });
      }}
      title={editingFieldId ? "Edit Field" : "Add New Field"}
      maxWidth="max-w-[650px]"
      overflowVisible={true}
    >
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <CustomInput
            label="Field Name *"
            placeholder="Enter field name"
            value={newField.fieldName}
            onChange={(val) => setNewField({ ...newField, fieldName: val })}
          />
          <CustomInput
            label="Label *"
            placeholder="Enter label"
            value={newField.label}
            onChange={(val) => setNewField({ ...newField, label: val })}
          />
          <CustomSelect
            label="Field Type *"
            value={newField.type}
            options={FIELD_TYPES.map(t => t.value)}
            onChange={(val) => setNewField({ ...newField, type: val })}
            placeholder="Select Field Type"
          />
          <CustomInput
            label="Placeholder *"
            placeholder="Enter placeholder"
            value={newField.placeholder}
            onChange={(val) => setNewField({ ...newField, placeholder: val })}
          />
        </div>

        <div className="flex items-center gap-3">
          <CustomSwitch
            checked={newField.required}
            onChange={(checked) => setNewField({ ...newField, required: checked })}
          />
          <span className="text-[14px] font-medium text-[#1E293B]">Required Field</span>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <CancelButton
            onClick={() => {
              setIsAddingField(false);
              setEditingFieldId(null);
              setNewField({ fieldName: "", label: "", type: "Text", placeholder: "", description: "", required: false });
            }}
          />
          <SubmitButton onClick={handleSaveField}>
            Save Field
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
