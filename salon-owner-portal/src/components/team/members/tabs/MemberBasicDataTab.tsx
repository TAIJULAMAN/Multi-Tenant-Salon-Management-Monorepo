"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Lock } from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { MemberServiceItem } from "@/components/team/types";
import { INITIAL_MEMBER_SERVICES } from "@/components/team/data";
import { Badge } from "@/components/ui/Badge";

interface MemberBasicDataTabProps {
  memberId: string;
}

export const MemberBasicDataTab: React.FC<MemberBasicDataTabProps> = ({
  memberId,
}) => {
  const [services, setServices] = useState<MemberServiceItem[]>(
    INITIAL_MEMBER_SERVICES,
  );
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const SERVICES_PER_PAGE = 6;
  const servicesTotalPages =
    Math.ceil(services.length / SERVICES_PER_PAGE) || 1;
  const servicesPaginated = services.slice(
    (currentServicePage - 1) * SERVICES_PER_PAGE,
    currentServicePage * SERVICES_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      {/* Profile info & Personal Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-[#1E293B]">
              Profile Info
            </h3>
            <button className="bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-[#C7D2FE] transition-colors">
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
                About Me
              </div>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                Experienced hair stylist with over 5 years of professional salon
                experience.
              </p>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
                Specialties
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#EEF2FF] text-[#635BFF] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  Balayage
                </span>
                <span className="bg-[#EEF2FF] text-[#635BFF] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  Coloring
                </span>
                <span className="bg-[#EEF2FF] text-[#635BFF] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  Styling
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-[#1E293B]">
              Personal Data
            </h3>
            <button className="bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-[#C7D2FE] transition-colors">
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
                Tax ID Code
              </div>
              <div className="text-[13px] font-bold text-[#1E293B]">
                RSSMRA91B25H890Z
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
                Role
              </div>
              <div className="text-[13px] font-bold text-[#1E293B]">Staff</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
                Remuneration
              </div>
              <div className="text-[13px] font-bold text-[#1E293B]">
                Fixed (€ 3.200)
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
                IBAN
              </div>
              <div className="text-[13px] font-bold text-[#1E293B]">
                IT68 X054 ******** 125
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Address */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-bold text-[#1E293B]">Full Address</h3>
          <button className="bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-[#C7D2FE] transition-colors">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
              Address
            </div>
            <div className="text-[13px] font-bold text-[#1E293B]">
              Independence Street 567
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
              City
            </div>
            <div className="text-[13px] font-bold text-[#1E293B]">Bologna</div>
          </div>
          <div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
              Province
            </div>
            <div className="text-[13px] font-bold text-[#1E293B]">
              Bologna (BO)
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#94A3B8] font-medium mb-1">
              CAP
            </div>
            <div className="text-[13px] font-bold text-[#1E293B]">40135</div>
          </div>
        </div>
      </div>

      {/* Services Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[16px] font-bold text-[#1E293B]">Services</h3>
          <button className="bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-[#C7D2FE] transition-colors">
            Add Service
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesPaginated.map((service, idx) => {
            const originalIdx =
              (currentServicePage - 1) * SERVICES_PER_PAGE + idx;
            return (
              <div
                key={originalIdx}
                className={`flex items-center justify-between rounded-lg p-5 border transition-colors ${
                  service.active
                    ? "bg-[#F5F3FF] border-[#EDE9FE]"
                    : "bg-[#F8FAFC] border-[#F1F5F9]"
                }`}
              >
                <div>
                  <div className="text-[13px] font-bold text-[#1E293B] mb-0.5">
                    {service.name}
                  </div>
                  <div className="text-[11px] font-bold text-[#94A3B8]">
                    {service.duration}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[16px] font-bold text-[#1E293B]">
                    {service.price}
                  </div>
                  <button
                    onClick={() => {
                      const newServices = [...services];
                      newServices[originalIdx].active =
                        !newServices[originalIdx].active;
                      setServices(newServices);
                    }}
                    className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      service.active ? "bg-[#635BFF]" : "bg-[#CBD5E1]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        service.active ? "translate-x-[20px]" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="-mx-6 -mb-6 mt-6">
          <Pagination
            currentPage={currentServicePage}
            totalPages={servicesTotalPages}
            totalItems={services.length}
            itemsPerPage={SERVICES_PER_PAGE}
            itemName="services"
            onPageChange={setCurrentServicePage}
          />
        </div>
      </div>

      {/* Additional Data & Social */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-[#1E293B]">
              Additional Data
            </h3>
            <Link
              href={`/dashboard/team/members/${memberId}/edit-additional-data`}
              className="bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-[#C7D2FE] transition-colors"
            >
              Edit
            </Link>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1 uppercase tracking-wider">
                Languages
              </div>
              <div className="flex gap-2">
                <Badge variant="purple" size="sm">
                  Italian (Native)
                </Badge>
                <Badge variant="success" size="sm">
                  English (Fluent)
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1 uppercase tracking-wider">
                Direct Manager
              </div>
              <div className="text-[13px] font-bold text-[#1E293B]">
                Maria Rodriguez
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-[#1E293B]">
              Social & Access
            </h3>
            <button className="bg-[#E0E7FF] text-[#635BFF] text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-[#C7D2FE] transition-colors">
              Change Permits
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-3">
                <Facebook
                  className="w-5 h-5 text-[#1877F2]"
                  fill="currentColor"
                  strokeWidth={0}
                />
                <span className="text-[13px] font-bold text-[#1E293B]">
                  Facebook
                </span>
              </div>
              <Badge variant="warning" size="sm">
                Not Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-[#E4405F]" />
                <span className="text-[13px] font-bold text-[#1E293B]">
                  Instagram
                </span>
              </div>
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
