import React from 'react';

interface FileBadgeProps {
  type: string;
}

export default function FileBadge({ type }: FileBadgeProps) {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'PDF':
      case 'PPT':
        return 'bg-[#FCE7F3] text-[#DB2777]';
      case 'DOC':
        return 'bg-[#DBEAFE] text-[#2563EB]';
      case 'MP4':
      case 'MP3':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'IMG':
        return 'bg-[#CCFBF1] text-[#0D9488]';
      case 'ZIP':
        return 'bg-[#F1F5F9] text-[#475569]';
      case 'CSV':
        return 'bg-[#D1FAE5] text-[#059669]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B]';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${getBadgeStyle(type)}`}>
      {type}
    </span>
  );
}
