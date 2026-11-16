"use client";

import React, { useState } from "react";
import { MessageCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { SupportTicketFormProps } from "./types";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomTextarea from "@/components/customComponent/CustomTextarea";
import SupportAttachmentUpload from "./SupportAttachmentUpload";
import CustomAlert from "@/components/customComponent/CustomAlert";

export default function SupportTicketForm({ onSubmit }: SupportTicketFormProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Technical Issue");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(subject, category, description, attachment);
      setSuccessMessage(true);
      setSubject("");
      setDescription("");
      setAttachment(null);
      setTimeout(() => setSuccessMessage(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center rounded-lg px-1">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] font-manrope">Contact Admin Support</h2>
          <p className="text-xs text-[#64748B]">Fill out this form to initiate a support thread with our platform administrator.</p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 animate-fadeIn">
          <CustomAlert
            icon={CheckCircle2}
            iconColor="#10B981"
            bgColor="#ECFDF5"
            borderColor="#D1FAE5"
            textColor="#065F46"
          >
            <div>
              <h4 className="font-bold text-sm">Support Ticket Submitted!</h4>
              <p className="text-xs text-[#047857] mt-0.5">
                Your request was received successfully. You can monitor the ticket and chat with the admin in the ticket panel.
              </p>
            </div>
          </CustomAlert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CustomSelect
            label="Issue Category"
            value={category}
            onChange={setCategory}
            options={[
              "Technical Issue",
              "Billing & Subscriptions",
              "Account Settings",
              "Feedback & Suggestions",
              "Other",
            ]}
          />
          <CustomInput
            label="Subject"
            required
            placeholder="e.g., Styling menu not loading on mobile view"
            value={subject}
            onChange={setSubject}
          />
        </div>

        <CustomTextarea
          label="Describe the Issue"
          required
          placeholder="Provide as much detail as possible. If it is a technical issue, include the steps to reproduce it."
          value={description}
          onChange={setDescription}
          rows={5}
        />

        <SupportAttachmentUpload
          attachment={attachment}
          onFileSelect={setAttachment}
        />

        <div className="pt-2">
          <SubmitButton
            disabled={isSubmitting}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3.5 disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending support request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Request</span>
              </>
            )}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
