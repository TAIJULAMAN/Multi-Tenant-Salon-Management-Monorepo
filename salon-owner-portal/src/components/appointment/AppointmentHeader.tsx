import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, EllipsisVertical, Plus } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { useOutsideClick } from "@/components/customComponent/OutsideClickFN";
import { Status, statusFilters } from "./data";

interface AppointmentHeaderProps {
  activeView: "calendar" | "table";
  setActiveView: (view: "calendar" | "table") => void;
  activeStatus: Status | "All";
  setActiveStatus: (status: Status | "All") => void;
  setCurrentPage: (page: number) => void;
  setExpandedRow: (row: number | null) => void;
}

export default function AppointmentHeader({
  activeView,
  setActiveView,
  activeStatus,
  setActiveStatus,
  setCurrentPage,
  setExpandedRow,
}: AppointmentHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsHovered, setSettingsHovered] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    right: number;
  } | null>(null);

  useEffect(() => {
    if (menuOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
  }, [menuOpen]);

  // Close on outside click
  const menuRefs = React.useMemo(() => [menuButtonRef, dropdownRef], []);
  useOutsideClick(
    menuRefs,
    () => {
      setMenuOpen(false);
      setSettingsHovered(false);
    },
    menuOpen
  );

  // Close on scroll/resize so it doesn't drift
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => {
      setMenuOpen(false);
      setSettingsHovered(false);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menuOpen]);

  return (
    <div className="bg-white rounded-xl py-4 px-4 sm:px-6 border border-[#EFF4FA]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold font-manrope text-[#29343D]">
          Appointments
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {activeView === "table" && (
            <div className="w-[100px]">
              <CustomSelect
                value={activeStatus}
                options={statusFilters}
                buttonClassName="h-[44px] text-sm font-manrope font-semibold text-[#29343D] w-full"
                onChange={(val) => {
                  setActiveStatus(val as Status | "All");
                  setCurrentPage(1);
                  setExpandedRow(null);
                }}
                align="left"
              />
            </div>
          )}
          {/* Calendar / Table toggle */}
          <div className="flex items-center border border-[#E0E6EB] rounded-[8px] overflow-hidden">
            <button
              onClick={() => setActiveView("calendar")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-manrope font-medium transition-colors cursor-pointer ${activeView === "calendar" ? "bg-[#DDDBFF] text-[#635BFF]" : "text-[#98A4AE] hover:text-[#29343D]"}`}
            >
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-manrope font-medium transition-colors cursor-pointer ${activeView === "table" ? "bg-[#DDDBFF] text-[#635BFF]" : "text-[#98A4AE] hover:text-[#29343D]"}`}
            >
              <span>Table View</span>
            </button>
          </div>

          {/* 3-dot menu button */}
          <button
            ref={menuButtonRef}
            onClick={() => {
              setMenuOpen((prev) => !prev);
              setSettingsHovered(false);
            }}
            className="w-[44px] h-[44px] flex items-center justify-center border border-[#E0E6EB] rounded-[8px] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
          >
            <EllipsisVertical size={20} color="#0A2540" />
          </button>
          {menuOpen && dropdownPos && (
            <div
              ref={dropdownRef}
              style={{
                position: "fixed",
                top: dropdownPos.top,
                right: dropdownPos.right,
                zIndex: 99999,
              }}
            >
              <div className="bg-white rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] border border-[#EFF4FA] py-1.5 min-w-[190px]">
                {/* Settings with sub-menu */}
                <div
                  className="relative flex items-center justify-between px-4 py-2.5 hover:bg-[#F4F6FA] cursor-pointer"
                  onMouseEnter={() => setSettingsHovered(true)}
                  onMouseLeave={() => setSettingsHovered(false)}
                >
                  <span className="text-sm font-manrope font-medium text-[#29343D]">
                    Settings
                  </span>
                  <ChevronRight size={15} className="text-[#98A4AE]" />

                  {settingsHovered && (
                    <div
                      className="absolute left-full top-0 ml-1 bg-white rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.12)] border border-[#EFF4FA] py-1.5 min-w-[220px]"
                      onMouseEnter={() => setSettingsHovered(true)}
                      onMouseLeave={() => setSettingsHovered(false)}
                    >
                      <Link href="/dashboard/appointment/settings">
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm font-manrope font-medium text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                          onClick={() => {
                            setMenuOpen(false);
                            setSettingsHovered(false);
                          }}
                        >
                          General settings
                        </button>
                      </Link>
                      <Link href="/dashboard/appointment/settings?tab=notifications">
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm font-manrope font-medium text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                          onClick={() => {
                            setMenuOpen(false);
                            setSettingsHovered(false);
                          }}
                        >
                          Notifications &amp; Communication
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/dashboard/appointment/import">
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm font-manrope font-medium text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    Import Appointments
                  </button>
                </Link>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm font-manrope font-medium text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  Export Data
                </button>
              </div>
            </div>
          )}

          <Link href={"/dashboard/appointment/add"}>
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] transition-colors text-white text-sm font-semibold font-manrope rounded-[8px] cursor-pointer">
              <Plus size={16} />
              <span className="hidden sm:inline">Add Appointment</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
