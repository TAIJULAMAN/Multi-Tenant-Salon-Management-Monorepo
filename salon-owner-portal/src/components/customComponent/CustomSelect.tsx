"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  label: string;
  value: string;
  icon?: string | React.ReactNode | null;
}

export interface CustomSelectProps {
  label?: string;
  value: string | string[];
  options: (string | CustomSelectOption)[];
  onChange: (val: any) => void;
  placeholder?: string;
  buttonClassName?: string;
  multiple?: boolean;
  align?: "left" | "right";
  placement?: "auto" | "top" | "bottom";
  className?: string;
}

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  buttonClassName,
  multiple = false,
  align = "left",
  placement = "auto",
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalized options
  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const [dropdownPos, setDropdownPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    placement: "top" | "bottom";
    maxHeight: number;
  }>({
    left: 0,
    width: 0,
    placement: "bottom",
    maxHeight: 260,
  });

  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = Math.max(
      120,
      Math.min(normalizedOptions.length * 48 + 24, 280)
    );

    let showOnTop = false;
    if (placement === "top") {
      showOnTop = true;
    } else if (placement === "bottom") {
      showOnTop = false;
    } else {
      // "auto": if there is not enough space below and more space above, show it in top
      showOnTop = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
    }

    const dropdownWidth = Math.max(rect.width, 220);
    let left = rect.left;
    if (align === "right") {
      left = rect.right - dropdownWidth;
    }
    // Constrain left inside viewport
    left = Math.max(10, Math.min(left, window.innerWidth - dropdownWidth - 10));

    const availableHeight = showOnTop
      ? Math.max(120, Math.min(260, spaceAbove - 20))
      : Math.max(120, Math.min(260, spaceBelow - 20));

    if (showOnTop) {
      setDropdownPos({
        bottom: window.innerHeight - rect.top + 6,
        left,
        width: rect.width,
        placement: "top",
        maxHeight: availableHeight,
      });
    } else {
      setDropdownPos({
        top: rect.bottom + 6,
        left,
        width: rect.width,
        placement: "bottom",
        maxHeight: availableHeight,
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node))
        return;
      setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const isMultiple = multiple || Array.isArray(value);
  const selectedValues: string[] = isMultiple
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : [];

  const singleValue = typeof value === "string" ? value : value?.[0] || "";

  // Determine button display for single or multiple
  let buttonLabel = placeholder || "Select...";
  let buttonIcon: React.ReactNode = null;

  if (isMultiple) {
    const nonAllOptions = normalizedOptions.filter((o) => o.value !== "all");
    const hasAll = selectedValues.includes("all");
    const allSelected =
      hasAll ||
      (nonAllOptions.length > 0 &&
        nonAllOptions.every((o) => selectedValues.includes(o.value)));

    if (allSelected || selectedValues.length === 0) {
      const allOpt = normalizedOptions.find((o) => o.value === "all");
      buttonLabel = allOpt ? allOpt.label : "All Team";
      buttonIcon = allOpt?.icon || null;
    } else if (selectedValues.length === 1) {
      const singleOpt = normalizedOptions.find(
        (o) => o.value === selectedValues[0] || o.label === selectedValues[0]
      );
      buttonLabel = singleOpt ? singleOpt.label : selectedValues[0];
      buttonIcon = singleOpt?.icon || null;
    } else {
      buttonLabel = `${selectedValues.filter((v) => v !== "all").length} Selected`;
      const allOpt = normalizedOptions.find((o) => o.value === "all");
      buttonIcon = allOpt?.icon || null;
    }
  } else {
    const selectedOption = normalizedOptions.find(
      (opt) => opt.value === singleValue || opt.label === singleValue
    );
    if (selectedOption) {
      buttonLabel = selectedOption.label;
      buttonIcon = selectedOption.icon || null;
    } else if (singleValue) {
      buttonLabel = singleValue;
      const hasOptionIcons = normalizedOptions.some((o) => !!o.icon);
      if (hasOptionIcons) {
        buttonIcon = "/avatar/icon1.png";
      }
    }
  }

  const handleOptionClick = (optValue: string) => {
    if (!isMultiple) {
      onChange(optValue);
      setIsOpen(false);
      return;
    }

    const nonAllOptionValues = normalizedOptions
      .filter((o) => o.value !== "all")
      .map((o) => o.value);

    let nextValues: string[];
    if (optValue === "all") {
      if (selectedValues.includes("all")) {
        nextValues = [];
      } else {
        nextValues = ["all", ...nonAllOptionValues];
      }
    } else {
      const withoutAll = selectedValues.filter((v) => v !== "all");
      if (withoutAll.includes(optValue)) {
        nextValues = withoutAll.filter((v) => v !== optValue);
      } else {
        nextValues = [...withoutAll, optValue];
        if (
          nonAllOptionValues.length > 0 &&
          nonAllOptionValues.every((v) => nextValues.includes(v))
        ) {
          nextValues = ["all", ...nextValues];
        }
      }
    }
    onChange(nextValues);
  };

  const isPlaceholder = placeholder && buttonLabel === placeholder;

  return (
    <div className={`flex flex-col gap-2 relative ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">{label}</label>
      )}
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className={
            buttonClassName ||
            `w-full flex items-center justify-between bg-white border ${
              isOpen
                ? "border-[#635BFF] ring-1 ring-[#635BFF]"
                : "border-slate-200"
            } rounded-lg px-4 py-2 text-sm ${
              isPlaceholder ? "text-slate-400" : "text-[#29343D]"
            } font-medium outline-none cursor-pointer transition-colors`
          }
        >
          <div className="flex items-center gap-2 truncate">
            {buttonIcon &&
              (typeof buttonIcon === "string" ? (
                <img
                  src={buttonIcon}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
              ) : (
                buttonIcon
              ))}
            <span className="truncate">{buttonLabel}</span>
          </div>
          <ChevronDown
            size={18}
            className={`text-slate-400 shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              className={`fixed z-[9999] bg-white rounded-xl shadow-[0px_12px_32px_rgba(0,0,0,0.12)] border border-[#EFF4FA] py-2 animate-in fade-in ${
                dropdownPos.placement === "top"
                  ? "slide-in-from-bottom-2"
                  : "slide-in-from-top-2"
              }`}
              style={{
                top:
                  dropdownPos.placement === "bottom"
                    ? dropdownPos.top
                    : undefined,
                bottom:
                  dropdownPos.placement === "top"
                    ? dropdownPos.bottom
                    : undefined,
                left: dropdownPos.left,
                minWidth: Math.max(dropdownPos.width, 220),
              }}
            >
              <div
                className="overflow-y-auto custom-scrollbar px-1"
                style={{ maxHeight: `${dropdownPos.maxHeight}px` }}
              >
                {normalizedOptions.map((option, idx) => {
                  const isChecked = isMultiple
                    ? selectedValues.includes("all") ||
                      selectedValues.includes(option.value)
                    : singleValue === option.value ||
                      singleValue === option.label;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionClick(option.value)}
                      className={`w-full flex items-center gap-3 text-left px-3 py-2.5 text-sm font-manrope font-semibold rounded-[8px] transition-colors cursor-pointer ${
                        !isMultiple && isChecked
                          ? "bg-[#EEF2FF] text-[#635BFF]"
                          : "text-[#29343D] hover:bg-[#F4F6FA]"
                      }`}
                    >
                      {/* Checkbox for multiselect */}
                      {isMultiple && (
                        <div
                          className={`w-[20px] h-[20px] rounded-[5px] flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? "bg-[#635BFF]"
                              : "border-2 border-[#E0E6EB] bg-white"
                          }`}
                        >
                          {isChecked && (
                            <Check size={12} color="white" strokeWidth={3} />
                          )}
                        </div>
                      )}

                      {/* Icon / Avatar */}
                      {option.icon &&
                        (typeof option.icon === "string" ? (
                          <img
                            src={option.icon}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          option.icon
                        ))}

                      <span className="truncate flex-1">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
