import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp, Download, MoreVertical, Eye, Edit2, Plus, Trash2, Folder, Film, X } from "lucide-react";
import { MediaSession, MediaItem } from "../data";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";

export type TableAction = "view" | "edit" | "add" | "delete" | "download";

interface MediaTableRowProps {
  session: MediaSession;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAction: (action: TableAction, session: MediaSession) => void;
  selectedMediaItems: string[];
  onToggleMediaItem: (itemId: string) => void;
}

export function MediaTableRow({ session, isSelected, onToggleSelect, onAction, selectedMediaItems, onToggleMediaItem }: MediaTableRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ x: number, y: number } | null>(null);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleMenuClick = (e: React.MouseEvent) => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuCoords({ x: rect.right, y: rect.bottom });
      setMenuOpen(true);
    }
  };

  return (
    <>
      <tr className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors bg-white">
        <td className="pl-6 pr-2 py-4">
          <CustomCheckbox
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 rounded shadow-sm border border-gray-300 data-[state=checked]:bg-[#635BFF] data-[state=checked]:border-[#635BFF]"
          />
        </td>
        <td className="px-2 py-4 text-gray-400">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
        <td className="px-4 py-4 text-[13px] font-medium text-[#94A3B8]">
          {session.id}
        </td>
        <td className="px-4 py-4 text-[13px] font-semibold text-[#1E293B]">
          {session.date}
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#1E293B]">{session.clientName}</span>
            <span className="text-[11px] text-[#94A3B8]">{session.clientSubtext}</span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {session.services.map((service, idx) => (
              <span key={idx} className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#635BFF] bg-[#EEF2FF]">
                {service}
              </span>
            ))}
          </div>
        </td>
        <td className="px-4 py-4 text-[13px] font-medium text-[#64748B]">
          {session.managedBy}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2 text-[#64748B]">
            <Folder size={14} />
            <span className="text-[13px] font-medium">{session.items.length}</span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1 relative" ref={menuRef}>
            <button
              onClick={() => onAction('download', session)}
              className="p-2 text-gray-400 hover:text-[#635BFF] transition-colors rounded-lg hover:bg-indigo-50"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleMenuClick}
              className="p-2 text-gray-400 hover:text-[#635BFF] transition-colors rounded-lg hover:bg-indigo-50"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && menuCoords && typeof window !== 'undefined' && createPortal(
              <div
                ref={dropdownRef}
                className="fixed z-[100] w-[160px] bg-white rounded-xl border border-gray-100 py-2 font-manrope shadow-lg"
                style={{ top: menuCoords.y + 4, left: menuCoords.x - 160 }}
              >
                <button onClick={() => { onAction('view', session); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">
                  <Eye size={16} className="text-[#9CA3AF]" />
                  View Details
                </button>
                <button onClick={() => { onAction('edit', session); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">
                  <Edit2 size={16} className="text-[#9CA3AF]" />
                  Edit
                </button>
                <button onClick={() => { onAction('add', session); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-[#4B5563] hover:bg-gray-50 transition-colors">
                  <Plus size={16} className="text-[#9CA3AF]" />
                  Add Files
                </button>
                <button
                  onClick={() => { onAction('delete', session); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-[#F43F5E] hover:bg-[#FFF1F2] transition-colors"
                >
                  <Trash2 size={16} className="text-[#F43F5E]" />
                  Delete
                </button>
              </div>,
              document.body
            )}
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <td colSpan={9} className="px-6 py-5">
            <div className="flex flex-wrap gap-4 items-center">
              {session.items.map(item => {
                const isItemSel = selectedMediaItems.includes(item.id);
                return (
                  <div key={item.id} className="relative w-28 h-28 rounded-2xl bg-gray-100 flex flex-col justify-center items-center overflow-hidden group">
                    {item.type === 'video' && (item.src.startsWith('blob:') || item.src.match(/\.(mp4|webm|ogg)$/i)) ? (
                      <video src={`${item.src}#t=0.001`} className="absolute inset-0 w-full h-full object-cover" preload="metadata" muted playsInline />
                    ) : (
                      <Image src={item.src} alt="" fill className="object-cover" />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center z-20">
                      <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                        <button onClick={() => setLightboxItem(item)} className="w-8 h-8 rounded-full bg-white text-[#0A2540] flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => alert("Downloading " + item.fileName)} className="w-8 h-8 rounded-full bg-white text-[#0A2540] flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                          <Download size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>

                    <div
                      onClick={() => onToggleMediaItem(item.id)}
                      className={`absolute top-2 right-2 z-30 w-5 h-5 rounded flex items-center justify-center cursor-pointer shadow-sm border transition-colors ${isItemSel ? "bg-[#635BFF] border-[#635BFF]" : "bg-white border-gray-100"}`}
                    >
                      {isItemSel && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <polyline points="1.5,6 4.5,9 10.5,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {item.type === 'video' && <Film size={24} className="text-white z-10 drop-shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:opacity-0 transition-opacity" />}
                  </div>
                );
              })}
              <div onClick={() => onAction('add', session)} className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col justify-center items-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors bg-transparent">
                <Plus size={24} strokeWidth={2} className="mb-1 text-gray-300" />
                <span className="text-[12px] font-medium text-gray-400">Add</span>
              </div>
            </div>
          </td>
        </tr>
      )}

      {lightboxItem && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/95 backdrop-blur-md">
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white flex flex-col items-center gap-1 transition-colors z-50"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-5xl h-[80vh] relative flex items-center justify-center">
            {lightboxItem.type === "video" ? (
              lightboxItem.videoUrl && lightboxItem.videoUrl.includes("youtube") ? (
                <iframe
                  src={lightboxItem.videoUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full max-h-[80vh] aspect-video rounded-xl shadow-2xl bg-black border-none"
                />
              ) : (
                <video
                  src={lightboxItem.videoUrl || lightboxItem.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-xl shadow-2xl bg-black"
                />
              )
            ) : (
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.fileName || "Media"}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                width={1200}
                height={800}
                unoptimized
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
