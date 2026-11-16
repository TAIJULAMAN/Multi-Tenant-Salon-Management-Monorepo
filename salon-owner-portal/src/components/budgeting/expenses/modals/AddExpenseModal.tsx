"use client";

import React, { useState, useRef } from "react";
import { X, Calendar as CalendarIcon, Clock, ChevronDown, Repeat, Calendar } from "lucide-react";
import Image from "next/image";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any; // For editing
}

export function AddExpenseModal({ isOpen, onClose, onSave, initialData }: AddExpenseModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recurring expense state
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState(initialData?.recurringFrequency || "Monthly");
  const [recurringDay, setRecurringDay] = useState(initialData?.recurringDay || "1st of the month");
  const [expirationMode, setExpirationMode] = useState<"never" | "calendar" | "occurrences">("never");
  const [expirationDate, setExpirationDate] = useState(initialData?.expirationDate || "");
  const [expirationOccurrences, setExpirationOccurrences] = useState(initialData?.expirationOccurrences || "12");

  const isWeekly = recurringFrequency === "Weekly" || recurringFrequency === "Bi-weekly";

  const handleFrequencyChange = (freq: string) => {
    setRecurringFrequency(freq);
    if (freq === "Weekly" || freq === "Bi-weekly") {
      setRecurringDay("Every Monday");
    } else {
      setRecurringDay("1st of the month");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] max-h-[90vh] flex flex-col border border-[#E2E8F0] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h3 className="text-[17px] font-bold text-[#1E293B]">Add Expense</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* Cost & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Cost *</label>
              <input
                type="text"
                placeholder="Enter cost"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Payment Method *</label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors appearance-none cursor-pointer">
                  <option value="">Select method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Date *</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Time *</label>
              <div className="relative">
                <input
                  type="time"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Macro-categories & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Macro-categories *</label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors appearance-none cursor-pointer">
                  <option value="">Select macro-categories</option>
                  <option value="Products">Products</option>
                  <option value="Salaries">Salaries</option>
                  <option value="Utilities">Utilities</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Category *</label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors appearance-none cursor-pointer">
                  <option value="">Select category</option>
                  <option value="Staff">Staff</option>
                  <option value="Salon Equipment">Salon Equipment</option>
                  <option value="Rent">Rent</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Warranty & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Warranty *</label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors appearance-none cursor-pointer">
                  <option value="None">None</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#1E293B]">Location *</label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          {/* Payee */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#1E293B]">Payee *</label>
            <input
              type="text"
              placeholder="Enter payee"
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#1E293B]">Note</label>
            <textarea
              placeholder="Add a note"
              rows={3}
              className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors placeholder:text-[#94A3B8] resize-y"
            ></textarea>
          </div>

          {/* Recurring Expense Section */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isRecurring ? "bg-[#635BFF] text-white shadow-sm" : "bg-white border border-[#E2E8F0] text-[#94A3B8]"
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-[#1E293B]">Recurring Expense</h4>
                  <p className="text-[11px] font-medium text-[#64748B]">
                    Mark as recurring and set when and how often it pays itself
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#635BFF]"></div>
              </label>
            </div>

            {isRecurring && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* How Often */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#475569]">How often *</label>
                    <select
                      value={recurringFrequency}
                      onChange={(e) => handleFrequencyChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors cursor-pointer"
                    >
                      <option value="Weekly">Every Week</option>
                      <option value="Bi-weekly">Every 2 Weeks</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Every 3 Months</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  {/* When it pays itself */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#475569]">
                      When it pays itself {isWeekly ? "(Day of Week)" : "(Day of Month)"} *
                    </label>
                    <select
                      value={recurringDay}
                      onChange={(e) => setRecurringDay(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors cursor-pointer"
                    >
                      {isWeekly ? (
                        <>
                          <option value="Every Monday">Every Monday</option>
                          <option value="Every Tuesday">Every Tuesday</option>
                          <option value="Every Wednesday">Every Wednesday</option>
                          <option value="Every Thursday">Every Thursday</option>
                          <option value="Every Friday">Every Friday</option>
                          <option value="Every Saturday">Every Saturday</option>
                          <option value="Every Sunday">Every Sunday</option>
                        </>
                      ) : (
                        <>
                          <option value="1st of the month">1st of the month</option>
                          <option value="5th of the month">5th of the month</option>
                          <option value="6th of the month">6th of the month</option>
                          <option value="10th of the month">10th of the month</option>
                          <option value="15th of the month">15th of the month</option>
                          <option value="20th of the month">20th of the month</option>
                          <option value="25th of the month">25th of the month</option>
                          <option value="End of the month">End of the month</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Expiration Section: Choose between never, calendar, and number of occurrences */}
                <div className="pt-2 border-t border-[#E2E8F0]/70">
                  <label className="text-[11px] font-bold text-[#475569] block mb-2">
                    Expiration (Until) *
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setExpirationMode("never")}
                      className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                        expirationMode === "never"
                          ? "bg-[#EEF2FF] text-[#635BFF] border-[#635BFF]"
                          : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      Never (Ongoing)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpirationMode("calendar")}
                      className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                        expirationMode === "calendar"
                          ? "bg-[#EEF2FF] text-[#635BFF] border-[#635BFF]"
                          : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      Specific Date (Calendar)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpirationMode("occurrences")}
                      className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                        expirationMode === "occurrences"
                          ? "bg-[#EEF2FF] text-[#635BFF] border-[#635BFF]"
                          : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      Occurrences
                    </button>
                  </div>

                  {expirationMode === "calendar" && (
                    <div className="animate-in fade-in duration-150">
                      <label className="text-[10px] font-bold text-[#64748B] mb-1 block">
                        Select End Date
                      </label>
                      <input
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors cursor-pointer"
                      />
                    </div>
                  )}

                  {expirationMode === "occurrences" && (
                    <div className="animate-in fade-in duration-150 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-[#64748B] mb-1 block">
                          Number of Occurrences
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 12"
                          value={expirationOccurrences}
                          onChange={(e) => setExpirationOccurrences(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-[12px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-[#64748B] mt-5">times</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Attach */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#1E293B]">Attach receipts/invoices</label>
            <div
              className="border border-dashed border-[#635BFF] rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-white cursor-pointer hover:bg-[#F8FAFC] transition-colors relative"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1E293B]">
                  <span>{selectedFile.name}</span>
                  <span className="text-[11px] text-[#64748B]">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <Image width={40} height={40} src="/upload.svg" alt="Upload" />
                  <div className="text-[13px] font-bold text-[#635BFF]">
                    Drop here or click to browse
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={() =>
              onSave({
                isRecurring,
                recurringFrequency,
                recurringDay,
                recurringExpiration:
                  expirationMode === "never"
                    ? "Never (Ongoing)"
                    : expirationMode === "calendar"
                    ? `Expires on ${expirationDate || "selected date"}`
                    : `Expires after ${expirationOccurrences} occurrences`,
              })
            }
            className="bg-[#635BFF] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#5249ea] transition-colors shadow-sm cursor-pointer"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
