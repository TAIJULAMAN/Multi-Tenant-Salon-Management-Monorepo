"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { SidebarProvider } from "@/components/common/SidebarContext";
import { ShiftsProvider } from "@/context/ShiftsContext";

const AUTH_PATHS = ["/login", "/signup"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some(
    (path) => pathname === path || pathname?.startsWith(`${path}/`)
  );

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <ShiftsProvider>
        <div className="flex h-[100dvh] bg-white font-manrope">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <Header />
            <main className="flex-1 overflow-y-auto p-5 bg-[#F4F7FB] rounded-tl-[30px]">
              {children}
            </main>
          </div>
        </div>
      </ShiftsProvider>
    </SidebarProvider>
  );
}
