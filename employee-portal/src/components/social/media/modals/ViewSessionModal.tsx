import React from "react";
import Image from "next/image";
import { X, Film } from "lucide-react";
import { MediaSession } from "../data";

interface ViewSessionModalProps {
  session: MediaSession;
  onClose: () => void;
}

export function ViewSessionModal({ session, onClose }: ViewSessionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
        <h3 className="text-2xl font-bold text-[#0A2540] mb-8">Session Details</h3>

        <div className="space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Client</p>
              <p className="text-lg font-bold text-[#0A2540]">{session.clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-lg font-bold text-[#0A2540]">{session.date}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[#0A2540] mb-3">Services Provided</p>
            <div className="flex gap-2 flex-wrap">
              {session.services.map((s: string) => (
                <span key={s} className="px-3 py-1.5 bg-indigo-50 text-[#635BFF] rounded-lg text-xs font-bold">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-[#0A2540] mb-3">Notes & Details</p>
            <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">{session.clientSubtext}</p>
          </div>

          <div>
            <p className="text-sm font-bold text-[#0A2540] mb-3">Media Files ({session.items.length})</p>
            <div className="grid grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {session.items.map(file => (
                <div key={file.id} className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                  {file.type === 'video' && (file.src.startsWith('blob:') || file.src.match(/\.(mp4|webm|ogg)$/i)) ? (
                    <video src={file.src} className="absolute inset-0 w-full h-full object-cover" preload="metadata" muted playsInline />
                  ) : (
                    <Image src={file.src} alt={file.fileName || "Media"} fill className="object-cover" />
                  )}
                  {file.type === 'video' && <Film size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10 drop-shadow-md" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full mt-8 py-4 bg-[#635BFF] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity">Close Details</button>
      </div>
    </div>
  );
}
