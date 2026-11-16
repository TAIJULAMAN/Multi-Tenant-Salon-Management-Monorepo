import React from "react";
import { X } from "lucide-react";

interface CustomCloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: number;
}

export default function CustomCloseButton({
  onClick,
  className = "absolute top-6 right-6 text-slate-500 hover:text-slate-800 transition-colors",
  size = 20,
}: CustomCloseButtonProps) {
  return (
    <button onClick={onClick} className={className}>
      <X size={size} />
    </button>
  );
}
