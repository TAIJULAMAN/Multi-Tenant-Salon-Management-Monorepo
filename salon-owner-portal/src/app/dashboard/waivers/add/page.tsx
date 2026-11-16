"use client";

import React, { useState } from "react";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import ContractAttachments from "@/components/saloonOwner/waivers/ContractAttachments";
import SignNowModal from "@/components/saloonOwner/waivers/SignNowModal";
import WaiverAddTabs from "@/components/saloonOwner/waivers/WaiverAddTabs";
import BasicDetails from "@/components/saloonOwner/waivers/BasicDetails";
import { initialSigners } from "@/components/waivers/data";
import { WaiverField, Signer, ContractAttachment, AttachmentRequirement } from "@/components/waivers/types";
import RequiredFields from "@/components/saloonOwner/waivers/RequiredFields";
import SignersList from "@/components/saloonOwner/waivers/SignersList";
import AttachmentRequirements from "@/components/saloonOwner/waivers/AttachmentRequirements";
import FieldFormModal from "@/components/saloonOwner/waivers/FieldFormModal";

export default function AddWaiverPage() {
  const [activeTab, setActiveTab] = useState("Required Fields For Signer");
  const [waiverName, setWaiverName] = useState("");
  const [waiverContent, setWaiverContent] = useState("");
  const [fields, setFields] = useState<WaiverField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [newField, setNewField] = useState({
    fieldName: "",
    label: "",
    type: "Text",
    placeholder: "",
    description: "",
    required: false,
  });

  const handleEditField = (field: WaiverField) => {
    setNewField({ ...field });
    setEditingFieldId(field.id);
    setIsAddingField(true);
  };
  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };
  const handleSaveField = () => {
    if (!newField.fieldName || !newField.label || !newField.type || !newField.placeholder) {
      return;
    }
    if (editingFieldId) {
      setFields(
        fields.map((f) =>
          f.id === editingFieldId ? { ...newField, id: editingFieldId } as WaiverField : f
        )
      );
    } else {
      setFields([
        ...fields,
        { ...newField, id: Math.random().toString(36).substr(2, 9) } as WaiverField,
      ]);
    }
    setIsAddingField(false);
    setEditingFieldId(null);
    setNewField({
      fieldName: "",
      label: "",
      type: "Text",
      placeholder: "",
      description: "",
      required: false,
    });
  };
  const [signers, setSigners] = useState<Signer[]>(initialSigners);
  const addSigner = (type: "Pre-signed" | "Recipient") => {
    setSigners([
      ...signers,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        category: "Owner",
        name: "",
        isDrawing: false,
        signature: null,
      }
    ]);
  };

  const updateSigner = (id: string, updates: Partial<Signer>) => {
    setSigners(signers.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSigner = (id: string) => {
    setSigners(signers.filter(s => s.id !== id));
  };

  const [contractAttachments, setContractAttachments] = useState<ContractAttachment[]>([]);
  const [attachmentRequirements, setAttachmentRequirements] = useState<AttachmentRequirement[]>([]);
  const [signingSignerId, setSigningSignerId] = useState<string | null>(null);


  return (
    <div className="w-full space-y-6 pb-12">
      <CustomSubPageHeader
        title="Add Waiver"
        backUrl="/dashboard/waivers"
        breadcrumbText="Waiver Templates"
      />
      <BasicDetails
        waiverName={waiverName}
        setWaiverName={setWaiverName}
        waiverContent={waiverContent}
        setWaiverContent={setWaiverContent}
      />

      <WaiverAddTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={["Required Fields For Signer", "Signers", "Contract Attachments", "Attachment Requirement"]}
      >
        {activeTab === "Required Fields For Signer" && (
          <RequiredFields
            fields={fields}
            isAddingField={isAddingField}
            setIsAddingField={setIsAddingField}
            handleEditField={handleEditField}
            handleDeleteField={handleDeleteField}
          />
        )}
        {activeTab === "Signers" && (
          <SignersList
            signers={signers}
            setSigningSignerId={setSigningSignerId}
            deleteSigner={deleteSigner}
            updateSigner={updateSigner}
            addSigner={addSigner}
          />
        )}
        {activeTab === "Contract Attachments" && (
          <ContractAttachments
            contractAttachments={contractAttachments}
            setContractAttachments={setContractAttachments}
          />
        )}
        {activeTab === "Attachment Requirement" && (
          <AttachmentRequirements
            attachmentRequirements={attachmentRequirements}
            setAttachmentRequirements={setAttachmentRequirements}
          />
        )}
      </WaiverAddTabs>
      <div className="flex justify-end pt-4 pb-8">
        <button className="bg-[#635BFF] hover:bg-[#524be0] text-white px-8 py-3 rounded-lg font-bold text-[14px] transition-colors shadow-sm shadow-[#635BFF]/20">
          Send To
        </button>
      </div>
      <SignNowModal
        signingSignerId={signingSignerId}
        setSigningSignerId={setSigningSignerId}
        updateSigner={updateSigner}
      />

      <FieldFormModal
        isAddingField={isAddingField}
        setIsAddingField={setIsAddingField}
        editingFieldId={editingFieldId}
        setEditingFieldId={setEditingFieldId}
        newField={newField}
        setNewField={setNewField}
        handleSaveField={handleSaveField}
      />
    </div>
  );
}
