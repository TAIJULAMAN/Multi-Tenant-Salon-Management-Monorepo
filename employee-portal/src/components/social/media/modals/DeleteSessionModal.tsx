import React from "react";
import { X, Trash2 } from "lucide-react";
import { MediaSession } from "../data";

interface DeleteSessionModalProps {
  session: MediaSession;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function DeleteSessionModal({ session, onClose, onDelete }: DeleteSessionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
          <Trash2 size={24} />
        </div>
        <h3 className="text-xl font-bold text-[#0A2540] mb-2">Delete Session?</h3>
        <p className="text-sm text-gray-500 mb-8 px-4">
          Are you sure you want to delete this media session for <span className="font-bold text-[#0A2540]">{session.clientName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3.5 border border-gray-200 rounded-xl font-bold text-[#0A2540] hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => {
            onDelete(session.id);
            onClose();
          }} className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}
