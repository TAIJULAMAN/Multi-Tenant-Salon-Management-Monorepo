"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  HandCoins,
  CalendarClock,
  Clock,
  BarChart2,
  Globe,
  FolderOpen,
  LifeBuoy,
  Settings,
  ChevronDown,
  X,
  LogOut,
  ImageIcon,
  LineChart,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import LogoIcon from "@/components/svg/LogoIcon";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  const mainLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/appointment", icon: Calendar },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Remuneration", href: "/remuneration", icon: HandCoins },
    {
      name: "Shifts",
      href: "#",
      icon: CalendarClock,
      hasSubmenu: true,
      submenu: [
        {
          name: "Record Shift",
          href: "/record-shifts",
          icon: ClipboardList,
        },
        {
          name: "Work Shift",
          href: "/worked-shifts",
          icon: Clock,
        },
        {
          name: "Scheduled Shift",
          href: "/scheduled-shifts",
          icon: CalendarCheck,
        },
      ],
    },
    {
      name: "Statistics",
      href: "/statistics",
      icon: BarChart2,
    },
    {
      name: "Social Media",
      href: "#",
      icon: Globe,
      hasSubmenu: true,
      submenu: [
        {
          name: "Calendar",
          href: "/social/calendar",
          icon: Calendar,
        },
        {
          name: "Media",
          href: "/social/media",
          icon: ImageIcon,
        },
        {
          name: "Analytics",
          href: "/social/analytics",
          icon: LineChart,
        },
      ],
    },
  ];

  const otherLinks = [
    { name: "Files", href: "/files", icon: FolderOpen },
    { name: "Support", href: "/support", icon: LifeBuoy },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Log Out", href: "/login", icon: LogOut },
  ];

  const allHrefs = [
    ...mainLinks.flatMap((link) =>
      link.hasSubmenu && link.submenu
        ? link.submenu.map((s) => s.href)
        : [link.href],
    ),
    ...otherLinks.map((link) => link.href),
  ].filter((href) => href !== "#");

  const activeHref = allHrefs.reduce((longest, current) => {
    if (pathname === current || pathname.startsWith(`${current}/`)) {
      return current.length > longest.length ? current : longest;
    }
    return longest;
  }, "");

  const isPathActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    if (href === "#") return false;
    if (
      href === "/record-shifts" &&
      (pathname === "/record-shift" || pathname?.startsWith("/record-shift/"))
    ) {
      return true;
    }
    if (
      href === "/worked-shifts" &&
      (pathname === "/work-shifts" ||
        pathname === "/work-shift" ||
        pathname?.startsWith("/work-shifts/") ||
        pathname?.startsWith("/work-shift/"))
    ) {
      return true;
    }
    if (
      href === "/scheduled-shifts" &&
      (pathname === "/scheduled-shift" ||
        pathname?.startsWith("/scheduled-shift/"))
    ) {
      return true;
    }
    return href === activeHref;
  };

  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      mainLinks.forEach((link) => {
        if (link.hasSubmenu && link.submenu) {
          const isAnySubActive = link.submenu.some((sub) =>
            isPathActive(sub.href),
          );
          if (isAnySubActive) {
            initial[link.name] = true;
          }
        }
      });
      return initial;
    },
  );

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#1E293B]/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-[260px] bg-white flex flex-col h-[100dvh] overflow-y-auto scrollbar-hide z-50 shrink-0 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 sticky top-0 bg-white z-10 flex justify-between items-center">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 relative">
              <LogoIcon />
            </div>
            <span className="font-bold text-xl text-[#635BFF] font-manrope">
              Your logo
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-[#94A3B8] hover:text-[#1E293B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 pb-6 space-y-8">
          <div>
            <p className="px-4 text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider font-manrope">
              Main
            </p>
            <ul className="space-y-1">
              {mainLinks.map((link) => {
                const hasSub = link.hasSubmenu && link.submenu;
                const isSubActive = link.submenu?.some((sub) =>
                  isPathActive(sub.href),
                );
                const isActive = isPathActive(link.href) || isSubActive;
                const isSubOpen = !!openSubmenus[link.name];

                return (
                  <li key={link.name}>
                    {hasSub ? (
                      <div
                        className={`transition-all duration-200 ${
                          isSubOpen ? "bg-[#F4F6FA] rounded-lg p-2" : "space-y-1"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubmenu(link.name)}
                          className={`w-full flex items-center justify-between py-3 rounded-lg font-medium text-sm transition-all font-manrope cursor-pointer ${
                            isSubOpen
                              ? "px-2 text-[#635BFF]"
                              : `px-4 ${
                                  isActive
                                    ? "bg-[#635BFF]/10 text-[#635BFF]"
                                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                                }`
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <link.icon
                              className={`w-5 h-5 ${
                                isSubOpen || isActive
                                  ? "text-[#635BFF]"
                                  : "text-[#94A3B8]"
                              }`}
                            />
                            <span>{link.name}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isSubOpen
                                ? "rotate-180 text-[#635BFF]"
                                : "text-[#94A3B8]"
                            }`}
                          />
                        </button>

                        {isSubOpen && (
                          <ul className="mt-2 space-y-2 animate-slideDown">
                            {link.submenu.map(
                              (sub: {
                                name: string;
                                href: string;
                                icon: React.ElementType;
                              }) => {
                                const isSubItemActive = isPathActive(sub.href);
                                const SubIcon = sub.icon;
                                return (
                                  <li key={sub.name}>
                                    <Link
                                      href={sub.href}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium font-manrope transition-colors ${
                                        isSubItemActive
                                          ? "text-white bg-[#635BFF] shadow-md shadow-[#635BFF]/20"
                                          : "text-[#635BFF] bg-[#E0E4FF] hover:bg-[#D6D9FF]"
                                      }`}
                                    >
                                      {SubIcon && (
                                        <SubIcon className="w-5 h-5" />
                                      )}
                                      {sub.name}
                                    </Link>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-colors font-manrope ${
                          isActive
                            ? "bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/20"
                            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-white" : "text-[#94A3B8]"
                            }`}
                          />
                          <span>{link.name}</span>
                        </div>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="px-4 text-xs font-bold text-[#94A3B8] mb-3 uppercase tracking-wider font-manrope">
              Others
            </p>
            <ul className="space-y-1">
              {otherLinks.map((link) => {
                const isActive = isPathActive(link.href);
                const isLogOut = link.name === "Log Out";
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-colors font-manrope ${
                        isActive
                          ? "bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/20"
                          : isLogOut
                          ? "text-[#FF4C6A] hover:bg-[#FFF1F2]"
                          : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
                      }`}
                    >
                      <link.icon
                        className={`w-5 h-5 mr-3 ${
                          isActive
                            ? "text-white"
                            : isLogOut
                            ? "text-[#FF4C6A]"
                            : "text-[#94A3B8]"
                        }`}
                      />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
