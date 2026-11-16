"use client";

import React, { useRef, useState } from "react";
import { FileText, Download, Eye, UploadCloud, Trash2 } from "lucide-react";

interface AppointmentImportUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function AppointmentImportUploader({
  selectedFile,
  onFileSelect,
}: AppointmentImportUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDropzone(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringDropzone(true);
  };

  const handleDragLeave = () => {
    setIsHoveringDropzone(false);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-8">
      {/* Video Banner Poster */}
      <div className="w-full h-[250px] sm:h-[350px] relative bg-[#F8FAFC] rounded-lg overflow-hidden shadow-sm group">
        <video
          ref={videoRef}
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          poster="/banner/banner1.png"
          className="w-full h-full object-cover cursor-pointer"
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          onEnded={() => setIsPlaying(false)}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none transition-opacity duration-300"></div>

        {/* Video Controls */}
        <div
          className={`absolute bottom-4 left-5 right-5 flex flex-col gap-2.5 transition-opacity duration-300 ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="flex items-center justify-between text-white">
            <button
              onClick={togglePlay}
              className="hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              {isPlaying ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleMute}
                className="hover:opacity-80 transition-opacity flex items-center justify-center"
              >
                {isMuted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                )}
              </button>
              <button
                onClick={toggleFullScreen}
                className="hover:opacity-80 transition-opacity flex items-center justify-center"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>

          <div
            onClick={handleProgressClick}
            className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer mt-0.5 group/progress"
          >
            <div
              className="h-full bg-white rounded-full relative transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="space-y-4">
        <h2 className="text-[14px] font-bold text-[#1E293B]">Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-[#E2E8F0] rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#635BFF] transition-colors group cursor-pointer shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#635BFF] mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-[13px] font-bold text-[#1E293B] mb-1">
              CSV Template
            </div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-4">
              CSV • 3.2 KB
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Previewing CSV Template...");
                }}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[12px] font-bold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Downloading CSV Template...");
                }}
                className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[12px] font-bold text-[#635BFF] hover:bg-[#E0E7FF] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          <div className="border border-[#E2E8F0] rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#635BFF] transition-colors group cursor-pointer shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#635BFF] mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-[13px] font-bold text-[#1E293B] mb-1">
              Filled CSV Example
            </div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-4">
              CSV • 8.4 KB
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Previewing Filled CSV Example...");
                }}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-[12px] font-bold text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Downloading Filled CSV Example...");
                }}
                className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[12px] font-bold text-[#635BFF] hover:bg-[#E0E7FF] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Zone */}
      <div className="space-y-4">
        <h2 className="text-[14px] font-bold text-[#1E293B]">Select File</h2>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
            isHoveringDropzone
              ? "border-[#635BFF] bg-[#F8F9FE]"
              : "border-[#CBD5E1] bg-[#FAFCFF] hover:border-[#94A3B8]"
          }`}
          onClick={handleBrowse}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />
          <div className="w-14 h-14 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#635BFF] mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div className="text-[14px] font-bold text-[#1E293B] mb-1">
            Choose a file or drag & drop it here
          </div>
          <p className="text-[12px] text-[#94A3B8] font-medium mb-5">
            CSV, Excel formats up to 50 MB
          </p>
          <button
            type="button"
            className="bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#1E293B] px-5 py-2 rounded-lg text-[13px] font-bold shadow-xs transition-colors"
          >
            Browse File
          </button>
        </div>

        {/* Selected File Preview Box */}
        {selectedFile && (
          <div className="border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between bg-white shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EEF2FF] text-[#635BFF] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1E293B] max-w-[200px] sm:max-w-xs truncate">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-[#94A3B8] font-medium">
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
            </div>
            <button
              onClick={() => onFileSelect(null)}
              className="text-[#94A3B8] hover:text-[#EF4444] p-1.5 rounded-lg hover:bg-[#FEE2E2]/40 transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
