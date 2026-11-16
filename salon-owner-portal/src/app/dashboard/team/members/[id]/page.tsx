"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  FileText,
  User,
  Banknote,
  Clock,
  Star,
  Shield,
  Activity,
  Image,
} from "lucide-react";
import { initialMembers } from "@/components/team/data";
import RemunerationTab from "@/components/saloonOwner/team/RemunerationTab";
import AnalyticsTab from "@/components/saloonOwner/team/AnalyticsTab";
import ScheduledShiftsTab from "@/components/saloonOwner/team/ScheduledShiftsTab";
import CalendarTab from "@/components/saloonOwner/team/CalendarTab";
import ProductionTab from "@/components/saloonOwner/team/ProductionTab";
import PermissionsTab from "@/components/saloonOwner/team/PermissionsTab";
import DocumentationTab from "@/components/saloonOwner/team/DocumentationTab";
import MediaTab from "@/components/saloonOwner/team/MediaTab";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import { MemberProfileBanner } from "@/components/team/members/MemberProfileBanner";
import { MemberBasicDataTab } from "@/components/team/members/tabs/MemberBasicDataTab";
import { MemberActionsModals } from "@/components/team/members/modals/MemberActionsModals";
import MemberDetailsSkeleton from "@/components/team/members/MemberDetailsSkeleton";

export default function EmployeeDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const member = initialMembers.find((m) => m.id === id) || initialMembers[0];

  const [activeTab, setActiveTab] = useState("Basic Data");
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
  const [isReactiveModalOpen, setIsReactiveModalOpen] = useState(false);

  // Skeleton loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "Basic Data", icon: User },
    { id: "Remuneration", icon: Banknote },
    { id: "Activity in Salon", icon: Activity },
    { id: "Calendar", icon: Calendar },
    { id: "Schedules/Shifts", icon: Clock },
    { id: "Evaluation", icon: Star },
    { id: "Permissions", icon: Shield },
    { id: "Documentation", icon: FileText },
    { id: "Media", icon: Image },
  ];

  if (isLoading) {
    return <MemberDetailsSkeleton />;
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header */}
      <CustomSubPageHeader
        title={member.name}
        backUrl="/dashboard/team/members"
        breadcrumbText="Team Members"
      />

      {/* Profile Banner */}
      <MemberProfileBanner
        member={member}
        onOpenTimeOff={() => setIsTimeOffModalOpen(true)}
        onOpenTerminate={() => setIsTerminateModalOpen(true)}
        onOpenReactivate={() => setIsReactiveModalOpen(true)}
      />

      {/* Nav Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center gap-2 px-6 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-3 text-[13px] font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 -mb-[1px] ${
                  isActive
                    ? "border-[#635BFF] text-[#635BFF]"
                    : "border-transparent text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="mt-6">
        {activeTab === "Basic Data" && <MemberBasicDataTab memberId={id} />}
        {activeTab === "Remuneration" && <RemunerationTab />}
        {activeTab === "Activity in Salon" && <ProductionTab />}
        {activeTab === "Calendar" && <CalendarTab />}
        {activeTab === "Schedules/Shifts" && <ScheduledShiftsTab />}
        {activeTab === "Evaluation" && <AnalyticsTab />}
        {activeTab === "Permissions" && <PermissionsTab />}
        {activeTab === "Documentation" && <DocumentationTab />}
        {activeTab === "Media" && <MediaTab />}
      </div>

      {/* Action Modals */}
      <MemberActionsModals
        member={member}
        isTerminateOpen={isTerminateModalOpen}
        onCloseTerminate={() => setIsTerminateModalOpen(false)}
        isReactivateOpen={isReactiveModalOpen}
        onCloseReactivate={() => setIsReactiveModalOpen(false)}
        isTimeOffOpen={isTimeOffModalOpen}
        onCloseTimeOff={() => setIsTimeOffModalOpen(false)}
      />
    </div>
  );
}
