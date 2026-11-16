import { X, Trash2 } from "lucide-react";
import React from "react";

interface DeleteAppointmentModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAppointmentModal({ onClose, onConfirm }: DeleteAppointmentModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onMouseDown={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#F0F2F5]">
          <h2 className="text-lg font-bold text-[#29343D]">Delete Appointment</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F4F6FA] rounded-full text-[#98A4AE] transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFF5F7] flex items-center justify-center mx-auto text-[#FF6692]">
            <Trash2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#29343D] mb-1">Are you sure?</h3>
            <p className="text-sm text-[#526B7A]">
              This action cannot be undone. This appointment will be permanently deleted.
            </p>
          </div>
        </div>
        
        <div className="px-6 py-5 bg-[#F8F9FA] flex items-center justify-end gap-3 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#29343D] bg-white border border-[#E0E6EB] rounded-lg hover:bg-[#F4F6FA] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#FF6692] rounded-lg hover:bg-[#ff4d80] transition-colors shadow-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
