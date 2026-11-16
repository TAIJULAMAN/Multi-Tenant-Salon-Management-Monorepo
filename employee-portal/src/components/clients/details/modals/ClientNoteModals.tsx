"use client";

import React, { useState, useEffect } from "react";
import { X, Trash2, FileText, Download, Eye, Plus, MessageCircle, Mail, MessageSquare } from "lucide-react";
import { NoteItem } from "../tabs/ClientNotesTab";
import { CommLogItem } from "../tabs/ClientCommunicationLogTab";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; description: string; attachment?: File }) => void;
}

export function AddNoteModal({ isOpen, onClose, onSave }: AddNoteModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSave({ title, description, attachment: file || undefined });
    setTitle("");
    setDescription("");
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">Add New Note</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              required
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter note details..."
              required
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Attachment (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-[#64748B] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#EEF2FF] file:text-[#635BFF] hover:file:bg-[#E0E7FF] cursor-pointer"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#635BFF] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors shadow-sm cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ViewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteItem | null;
}

export function ViewNoteModal({ isOpen, onClose, note }: ViewNoteModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">View Note</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Title</label>
            <p className="text-[14px] font-bold text-[#1E293B]">{note.title}</p>
            {note.date && (
              <p className="text-[11px] text-[#94A3B8] font-medium mt-1">Recorded on {note.date}</p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Description</label>
            <p className="text-[13px] font-medium text-[#64748B] leading-[1.6]">
              {note.description}
            </p>
          </div>

          {note.attachmentName && (
            <div>
              <label className="block text-[12px] font-bold text-[#1E293B] mb-3">Attachments</label>
              <div className="border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#635BFF] border border-[#E2E8F0] shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#635BFF]">{note.attachmentName}</h4>
                    <p className="text-[11px] font-medium text-[#94A3B8]">Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-white text-[#635BFF] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#EEF2FF] transition-colors cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white text-[#635BFF] border border-[#E2E8F0] flex items-center justify-center hover:bg-[#EEF2FF] transition-colors cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteItem | null;
  onSave: (updated: NoteItem) => void;
}

export function EditNoteModal({ isOpen, onClose, note, onSave }: EditNoteModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onSave({ ...note, title, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">Edit Note</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
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
  );
}

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteItem | null;
  onConfirm: () => void;
}

export function DeleteNoteModal({ isOpen, onClose, note, onConfirm }: DeleteNoteModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[440px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] mx-auto mb-4">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope mb-2">Delete Note?</h3>
        <p className="text-[13px] text-[#64748B] mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-[#1E293B]">"{note.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#64748B] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] shadow-sm shadow-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
}
