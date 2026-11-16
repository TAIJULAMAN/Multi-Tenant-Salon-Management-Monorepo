import React from "react";

export type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "purple"
  | "neutral";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
  danger: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]",
  warning: "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF08A]",
  info: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
  purple: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]",
  neutral: "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-[#16A34A]",
  danger: "bg-[#DC2626]",
  warning: "bg-[#CA8A04]",
  info: "bg-[#0284C7]",
  purple: "bg-[#7C3AED]",
  neutral: "bg-[#64748B]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
};

/**
 * Standard Unified Badge component for statuses, tags, and pills across the portal.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
