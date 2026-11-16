"use client";

import React from "react";
import { Wallet, Calendar, Ban, Minus, Eye, RefreshCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import Pagination from "@/components/customComponent/Pagination";
import { PersonalData } from "@/components/clients/EditPersonalDataModal";
import { FullAddressData } from "@/components/clients/EditAddressModal";

interface ClientBasicDataTabProps {
  personalData: PersonalData;
  fullAddress: FullAddressData;
  onEditPersonal: () => void;
  onEditAddress: () => void;
  isMarketingConsent: boolean;
  onToggleMarketingConsent: () => void;
  currentHistoryPage: number;
  onHistoryPageChange: (page: number) => void;
}

export default function ClientBasicDataTab({
  personalData,
  fullAddress,
  onEditPersonal,
  onEditAddress,
  isMarketingConsent,
  onToggleMarketingConsent,
  currentHistoryPage,
  onHistoryPageChange,
}: ClientBasicDataTabProps) {
  const historyRows = [
    { date: "5 Aug 2023, 09:44 AM", field: "Phone", prev: "+39 455 330 212", new: "+39 556 909 212", user: "Virgie Sutton", action: "Update", actionColor: "text-[#10B981] bg-[#DCFCE7]" },
    { date: "5 Aug 2023, 09:44 AM", field: "Address", prev: "Independance Street 54/r", new: "Independance Street 54/r", user: "Virgie Sutton", action: "Update", actionColor: "text-[#10B981] bg-[#DCFCE7]" },
    { date: "5 Aug 2023, 09:44 AM", field: "Email", prev: "anna@bellavista.com", new: "anna@gmail.com", user: "Lola Ortega", action: "Update", actionColor: "text-[#10B981] bg-[#DCFCE7]" },
    { date: "5 Aug 2023, 09:44 AM", field: "Email", prev: "anna@gmail.com", new: "anna@bellavista.com", user: "Lola Ortega", action: "Update", actionColor: "text-[#10B981] bg-[#DCFCE7]" },
    { date: "5 Aug 2023, 09:44 AM", field: "Profile Creation", prev: "-", new: "-", user: "Lola Gregory", action: "Created", actionColor: "text-[#635BFF] bg-[#EEF2FF]" }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Overview Cards */}
      <div>
        <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-[#64748B]">Total Sales</span>
            </div>
            <div className="text-[1.5rem] font-bold text-[#1E293B] font-manrope mt-1">€ 23,850</div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-[#64748B]">Appointments</span>
            </div>
            <div className="text-[1.5rem] font-bold text-[#1E293B] font-manrope mt-1">18</div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#F43F5E]/10 text-[#F43F5E] flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-[#64748B]">Canceled</span>
            </div>
            <div className="text-[1.5rem] font-bold text-[#1E293B] font-manrope mt-1">1</div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAB308]/10 text-[#EAB308] flex items-center justify-center shrink-0">
                <Minus className="w-5 h-5" />
              </div>
              <span className="text-[12px] font-bold text-[#64748B]">No-Show</span>
            </div>
            <div className="text-[1.5rem] font-bold text-[#1E293B] font-manrope mt-1">0</div>
          </div>
        </div>
      </div>

      {/* Personal Data & Full Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 relative">
          <button
            type="button"
            onClick={onEditPersonal}
            className="absolute top-6 right-6 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
          >
            EDIT
          </button>
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope mb-6">Personal data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6">
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Date of birth</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{personalData.dob}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Age</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{personalData.age}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Gender</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{personalData.gender}</div>
            </div>
            <div className="hidden sm:block"></div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Telephone</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{personalData.telephone}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Email</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{personalData.email}</div>
            </div>
          </div>
        </div>

        {/* Full Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 relative">
          <button
            type="button"
            onClick={onEditAddress}
            className="absolute top-6 right-6 bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
          >
            EDIT
          </button>
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope mb-6">Full Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6">
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Address</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{fullAddress.address}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">City</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{fullAddress.city}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">Province</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{fullAddress.province}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium mb-1">CAP</div>
              <div className="text-[13px] font-bold text-[#1E293B]">{fullAddress.cap}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Waivers */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
        <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope mb-6">Waivers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="border border-[#F1F5F9] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <img src="/facebook.png" alt="Facebook" className="w-5 h-5 object-contain" />
                <img src="/instagram.png" alt="Instagram" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-[13px] font-medium text-[#635BFF]">Marketing consent</span>
            </div>
            <div
              onClick={onToggleMarketingConsent}
              className={`w-[34px] h-[18px] rounded-[6px] relative cursor-pointer transition-colors duration-200 ${isMarketingConsent ? 'bg-[#E0E7FF]' : 'bg-[#E2E8F0]'}`}
            >
              <div className={`w-3.5 h-3.5 rounded-[4px] absolute top-[2px] transition-all duration-200 ${isMarketingConsent ? 'left-[18px] bg-[#635BFF]' : 'left-[2px] bg-[#94A3B8]'}`}></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-[#F1F5F9] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/file.png" alt="File" className="w-5 h-5 object-contain" />
              <span className="text-[13px] font-medium text-[#635BFF]">Social media posting</span>
            </div>
            <button className="bg-[#F0FDFA] text-[#14B8A6] px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-[#CCFBF1] transition-colors">Sign Now</button>
          </div>

          {/* Card 3 */}
          <div className="border border-[#F1F5F9] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/file.png" alt="File" className="w-5 h-5 object-contain" />
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-[#635BFF]">Social Media</span>
                <span className="bg-[#F0FDF4] text-[#22C55E] text-[10px] font-bold px-2 py-0.5 rounded-lg">Signed</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 flex items-center justify-center bg-[#F5F3FF] text-[#635BFF] rounded-lg hover:bg-[#EDE9FE] transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 flex items-center justify-center bg-[#FFFBEB] text-[#FBBF24] rounded-lg hover:bg-[#FEF3C7] transition-colors">
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Behavior */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-6 mb-6">
        <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope mb-6">Preferences & Behavior</h3>

        <div className="space-y-8">
          {/* Preferred stylist/employee */}
          <div>
            <h4 className="text-[13px] font-bold text-[#334155] mb-4">Preferred stylist/employee</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 1, name: "Lola Ortega", role: "Staff", image: "/avatar/icon1.png", bgColor: "bg-[#FFE4E6]", alt: "Lola" },
                { id: 2, name: "Virgie Sutton", role: "Staff", image: "/avatar/icon2.png", bgColor: "bg-[#F1F5F9]", alt: "Virgie" },
                { id: 3, name: "Lois Gregory", role: "Staff", image: "/avatar/icon3.png", bgColor: "bg-[#CCFBF1]", alt: "Lois" },
              ].map((staff) => (
                <div key={staff.id} className="bg-white border border-[#F1F5F9] rounded-2xl p-6 relative shadow-sm">
                  <button className="absolute top-4 right-4 text-[#F43F5E] opacity-50 hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className={`w-[72px] h-[72px] rounded-full ${staff.bgColor} mb-4 mx-auto flex items-center justify-center overflow-hidden`}>
                    <Image src={staff.image} alt={staff.alt} width={60} height={60} className="w-[60px] h-[60px] object-cover mix-blend-multiply" />
                  </div>
                  <div className="text-[14px] font-bold text-[#1E293B] text-center mb-0.5">{staff.name}</div>
                  <div className="text-[11px] text-[#94A3B8] font-medium text-center">{staff.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="text-[13px] font-medium text-[#334155] mb-4">Services most frequently booked</h4>
              <div className="space-y-2.5">
                {[
                  { id: 1, name: "Haircuts" },
                  { id: 2, name: "Coloring" },
                  { id: 3, name: "Treatments" },
                ].map((service, index) => (
                  <div key={service.id} className="bg-[#F8FAFC] rounded-xl px-4 py-3 flex items-center gap-3 border border-[#F1F5F9]">
                    <div className="w-6 h-6 rounded-lg bg-[#635BFF] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-[12px] font-bold text-[#334155]">{service.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h4 className="text-[13px] font-medium text-[#334155] mb-4">Preferred days/times</h4>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm relative">
                <div className="space-y-4 relative">
                  <div className="absolute top-1 bottom-1 left-[70.5px] w-[1px] bg-[#E2E8F0]"></div>

                  <div className="flex items-center">
                    <div className="w-[55px] text-[11px] text-[#334155] font-medium text-right shrink-0">09:46 AM</div>
                    <div className="w-[32px] flex justify-center shrink-0 relative">
                      <div className="w-[10px] h-[10px] rounded-full bg-white border-[1.5px] border-[#635BFF] z-10 relative"></div>
                    </div>
                    <div className="text-[11px] font-medium text-[#334155]">Monday</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-[55px] text-[11px] text-[#334155] font-medium text-right shrink-0">10:00 AM</div>
                    <div className="w-[32px] flex justify-center shrink-0 relative">
                      <div className="w-[10px] h-[10px] rounded-full bg-white border-[1.5px] border-[#06B6D4] z-10 relative"></div>
                    </div>
                    <div className="text-[11px] font-medium text-[#334155]">Tuesday</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-[55px] text-[11px] text-[#334155] font-medium text-right shrink-0">12:00 AM</div>
                    <div className="w-[32px] flex justify-center shrink-0 relative">
                      <div className="w-[10px] h-[10px] rounded-full bg-white border-[1.5px] border-[#22C55E] z-10 relative"></div>
                    </div>
                    <div className="text-[11px] font-medium text-[#334155]">Thursday</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-[55px] text-[11px] text-[#334155] font-medium text-right shrink-0">09:30 AM</div>
                    <div className="w-[32px] flex justify-center shrink-0 relative">
                      <div className="w-[10px] h-[10px] rounded-full bg-white border-[1.5px] border-[#FBBF24] z-10 relative"></div>
                    </div>
                    <div className="text-[11px] font-medium text-[#334155]">Friday</div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-[55px] text-[11px] text-[#334155] font-medium text-right shrink-0">09:30 AM</div>
                    <div className="w-[32px] flex justify-center shrink-0 relative">
                      <div className="w-[10px] h-[10px] rounded-full bg-white border-[1.5px] border-[#F43F5E] z-10 relative"></div>
                    </div>
                    <div className="text-[11px] font-medium text-[#334155]">Saturday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History of Edit */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden mt-6">
        <div className="p-6 pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">History of edit</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Date / Time</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Field Changed</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Previous Value</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">New Value</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">Edited By</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#1E293B] font-manrope text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row, idx) => (
                <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors last:border-b-0">
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] text-[#64748B] font-medium">{row.date}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] text-[#1E293B] font-medium">{row.field}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] text-[#64748B] font-medium">{row.prev}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] text-[#64748B] font-medium">{row.new}</td>
                  <td className="px-6 py-4 border-r border-[#E2E8F0] text-[11px] text-[#1E293B] font-medium">{row.user}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold inline-flex items-center ${row.actionColor}`}>{row.action}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentHistoryPage}
          totalPages={2}
          totalItems={10}
          itemsPerPage={5}
          itemName="edits"
          onPageChange={onHistoryPageChange}
        />
      </div>
    </div>
  );
}
