"use client";

import React, { useState, useEffect } from "react";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import ContractAttachments from "@/components/saloonOwner/waivers/ContractAttachments";
import SignNowModal from "@/components/saloonOwner/waivers/SignNowModal";
import WaiverAddTabs from "@/components/saloonOwner/waivers/WaiverAddTabs";
import { WaiverField, Signer, ContractAttachment, AttachmentRequirement } from "@/components/waivers/types";
import RequiredFields from "@/components/saloonOwner/waivers/RequiredFields";
import SignersList from "@/components/saloonOwner/waivers/SignersList";
import AttachmentRequirements from "@/components/saloonOwner/waivers/AttachmentRequirements";
import FieldFormModal from "@/components/saloonOwner/waivers/FieldFormModal";

export default function ViewWaiverPage() {
  const [activeTab, setActiveTab] = useState("Required Fields For Signer");

  const [fields, setFields] = useState<WaiverField[]>([
    {
      id: "1",
      fieldName: "client_name",
      label: "Client Name",
      type: "Text",
      placeholder: "Enter client name",
      description: "Client's complete name",
      required: true,
    },
    {
      id: "2",
      fieldName: "client_name",
      label: "Client Name",
      type: "Text",
      placeholder: "Enter client name",
      description: "Client's complete name",
      required: true,
    }
  ]);
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

  const [signers, setSigners] = useState<Signer[]>([
    {
      id: "1",
      type: "Pre-signed",
      category: "Owner",
      name: "Owner",
      isDrawing: false,
      signature: "Vicky",
    },
    {
      id: "2",
      type: "Recipient",
      category: "Owner",
      name: "Client Name",
      isDrawing: false,
      signature: null,
    }
  ]);

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

  const [contractAttachments, setContractAttachments] = useState<ContractAttachment[]>([
    {
      id: "1",
      name: "Chamber of Commerce Certificate",
      type: "PDF",
      size: "2.1 MB",
      updatedAt: "March 15, 2020"
    }
  ]);
  const [attachmentRequirements, setAttachmentRequirements] = useState<AttachmentRequirement[]>([]);
  const [signingSignerId, setSigningSignerId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6 pb-12">
      <CustomSubPageHeader
        title="View Waiver"
        backUrl="/dashboard/waivers"
        breadcrumbText="Waiver Templates"
      />

      {/* Waiver Document Body (Read Only) */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] mb-6 shadow-sm flex flex-col">
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h2 className="text-[18px] font-bold text-[#1E293B] mb-6">Waiver Name</h2>

          <div className="space-y-6 text-[13px] text-[#94A3B8] leading-relaxed">
            <div>
              <h3 className="font-bold text-[#475569] mb-2">What is Lorem Ipsum?</h3>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#475569] mb-2">What is Lorem Ipsum?</h3>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#475569] mb-2">What is Lorem Ipsum?</h3>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
          </div>
        </div>
      </div>

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
