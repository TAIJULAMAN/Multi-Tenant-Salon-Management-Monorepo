import React from 'react';
import { FileText, Image as ImageIcon, Video, Music, FileSpreadsheet, Archive, File } from "lucide-react";

interface FileIconProps {
  type: string;
  className?: string;
}

export default function FileIcon({ type, className = "w-20 h-20 text-[#94A3B8]" }: FileIconProps) {
  const iconProps = { className, strokeWidth: 1.5 };
  switch (type?.toUpperCase()) {
    case 'PDF':
    case 'DOC':
    case 'DOCX':
    case 'TXT':
      return <FileText {...iconProps} />;
    case 'IMG':
    case 'PNG':
    case 'JPG':
    case 'JPEG':
      return <ImageIcon {...iconProps} />;
    case 'MP4':
    case 'MOV':
    case 'AVI':
      return <Video {...iconProps} />;
    case 'MP3':
    case 'WAV':
      return <Music {...iconProps} />;
    case 'CSV':
    case 'XLS':
    case 'XLSX':
      return <FileSpreadsheet {...iconProps} />;
    case 'ZIP':
    case 'RAR':
      return <Archive {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
}
