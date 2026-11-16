"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Info,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { AddPostHeader } from "./components/AddPostHeader";
import { AccountAvatars } from "./components/AccountAvatars";
import { MediaUploadArea } from "./components/MediaUploadArea";
import { ComposerToolbar } from "./components/ComposerToolbar";
import { LinkedChannels } from "./components/LinkedChannels";
import { PostPreview } from "./components/PostPreview";

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: () => void;
}

const ACCOUNTS = [
  {
    id: "tw",
    name: "X (Twitter)",
    platform: "tw",
    bg: "bg-black",
    iconColor: "text-white",
    icon: <Twitter className="w-4 h-4" />,
  },
  {
    id: "fb",
    name: "Facebook",
    platform: "fb",
    bg: "bg-[#1877F2]",
    iconColor: "text-white",
    icon: <Facebook className="w-4 h-4" />,
  },
  {
    id: "ig",
    name: "Instagram",
    platform: "ig",
    bg: "bg-gradient-to-tr from-[#FFD600] via-[#FF0100] to-[#D500BA]",
    iconColor: "text-white",
    icon: <Instagram className="w-4 h-4" />,
  },
  {
    id: "in",
    name: "LinkedIn",
    platform: "in",
    bg: "bg-[#0A66C2]",
    iconColor: "text-white",
    icon: <Linkedin className="w-4 h-4" />,
  },
  {
    id: "yt",
    name: "YouTube",
    platform: "yt",
    bg: "bg-[#FF0000]",
    iconColor: "text-white",
    icon: <Youtube className="w-4 h-4" />,
  },
];

const EMOJIS = ["😀", "😂", "🥰", "😎", "🤔"];

export function AddPostModal({
  isOpen,
  onClose,
  onSchedule,
}: AddPostModalProps) {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([
    "tw",
    "fb",
    "ig",
    "in",
  ]);
  const [description, setDescription] = useState("");
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    setDescription("");
    setUploadedMediaUrl(null);
    setShowEmojiPicker(false);
    setSelectedAccountIds(["tw", "fb", "ig", "in"]);
    onClose();
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((a) => a !== id);
      }
      return [...prev, id];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedMediaUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    setDescription(
      text.substring(0, start) + textToInsert + text.substring(end),
    );
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + textToInsert.length,
        start + textToInsert.length,
      );
    }, 0);
  };

  // Determine active channel for the main composer
  const activeChannel =
    selectedAccountIds.length > 0
      ? ACCOUNTS.find((a) => a.id === selectedAccountIds[0])
      : null;
  const linkedChannels = selectedAccountIds
    .slice(1)
    .map((id) => ACCOUNTS.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-[1100px] max-h-[90vh] flex flex-col relative shadow-2xl overflow-hidden font-sans border border-[#E2E8F0]">
        <AddPostHeader onClose={handleClose} />
        <div className="flex flex-1 overflow-hidden min-h-[600px]">
          <div className="w-[60%] flex flex-col border-r border-[#E2E8F0] p-6 overflow-y-auto bg-[#F8FAFC]">
            <AccountAvatars
              accounts={ACCOUNTS}
              selectedAccountIds={selectedAccountIds}
              toggleAccount={toggleAccount}
            />
            {activeChannel && (
              <div className="flex flex-col bg-white border border-[#E2E8F0] rounded-xl p-5 mb-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${activeChannel.bg}`}
                  >
                    <span
                      className={`text-[14px] font-bold ${activeChannel.iconColor}`}
                    >
                      {activeChannel.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-transparent resize-none text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none min-h-[140px] font-medium"
                      placeholder={
                        activeChannel.id === "tw"
                          ? "Start writing or get inspired with Templates..."
                          : "What would you like to share?"
                      }
                    />

                    <MediaUploadArea
                      uploadedMediaUrl={uploadedMediaUrl}
                      setUploadedMediaUrl={setUploadedMediaUrl}
                      fileInputRef={fileInputRef}
                      handleFileChange={handleFileChange}
                    />

                    <ComposerToolbar
                      emojiPickerRef={emojiPickerRef}
                      showEmojiPicker={showEmojiPicker}
                      setShowEmojiPicker={setShowEmojiPicker}
                      insertAtCursor={insertAtCursor}
                      descriptionLength={description.length}
                      emojis={EMOJIS}
                    />
                  </div>
                </div>

                {/* AI Toggle */}
                <div className="flex items-center gap-3 mt-2 pt-4 border-t border-[#F1F5F9]">
                  <span className="text-[13px] font-bold text-[#64748B] flex items-center gap-1.5">
                    AI-Generated <Info className="w-4 h-4 text-[#94A3B8]" />
                  </span>
                  <button
                    onClick={() => setAiGenerated(!aiGenerated)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${aiGenerated ? "bg-[#10B981]" : "bg-[#CBD5E1]"}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${aiGenerated ? "right-0.5" : "left-0.5"}`}
                    ></div>
                  </button>
                </div>
              </div>
            )}
            <LinkedChannels linkedChannels={linkedChannels} />
          </div>
          <PostPreview
            activeChannel={activeChannel}
            description={description}
            uploadedMediaUrl={uploadedMediaUrl}
          />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end z-10">
          <button
            onClick={() => onSchedule()}
            className="px-6 py-2.5 bg-[#635BFF] hover:bg-[#534DFD] text-white text-[14px] font-bold rounded-lg transition-colors shadow-sm shadow-[#635BFF]/30"
          >
            Continue to Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
