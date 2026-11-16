import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";

interface AnalyticsHeaderProps {
  selectedAccount: string;
  setSelectedAccount: (account: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  accounts?: (string | { name: string; avatar?: string })[];
  dateRangeOptions?: string[];
}

const DEFAULT_AVATARS: Record<string, string> = {
  "Maria Rodriguez": "/avatar/icon1.png",
  "John Doe": "/avatar/icon2.png",
  "Jane Smith": "/avatar/icon3.png",
  "Shah Aman": "/avatar/icon1.png",
  "Hasan Siam": "/avatar/icon2.png",
  "Hridoy Khan": "/avatar/icon3.png",
  "Hridoy Alam": "/avatar/icon1.png",
};

function getAccountAvatar(acc: string | { name: string; avatar?: string }): string {
  if (typeof acc === "object" && acc.avatar) return acc.avatar;
  const name = typeof acc === "string" ? acc : acc.name;
  return DEFAULT_AVATARS[name] || "/avatar/icon1.png";
}

function getAccountName(acc: string | { name: string; avatar?: string }): string {
  return typeof acc === "string" ? acc : acc.name;
}

export function AnalyticsHeader({
  selectedAccount,
  setSelectedAccount,
  dateRange,
  setDateRange,
  accounts = ["Maria Rodriguez", "John Doe", "Jane Smith"],
  dateRangeOptions = [
    "Last 7 days",
    "Last 28 days",
    "Last 90 days",
    "This Week",
    "This Month",
    "This Year",
    "Last Week",
    "Last Month",
    "Custom Range",
  ],
}: AnalyticsHeaderProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 gap-4 mb-6 w-full">
      <h1 className="text-[16px] sm:text-xl font-bold text-[#1E293B]">
        Analytics
      </h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3">
        {/* Account Selector with user image */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="w-full sm:w-auto h-10 flex items-center justify-between sm:justify-start gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors bg-white cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src={getAccountAvatar(selectedAccount)}
                alt={selectedAccount}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <span className="truncate">{selectedAccount}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#94A3B8] transition-transform flex-shrink-0 ${
                isAccountOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isAccountOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-full sm:w-max min-w-[180px] bg-white border border-[#E2E8F0] rounded-lg shadow-lg overflow-hidden z-20 py-1">
              {accounts.map((acc) => {
                const accName = getAccountName(acc);
                const accAvatar = getAccountAvatar(acc);
                const isSelected = selectedAccount === accName;
                return (
                  <button
                    key={accName}
                    onClick={() => {
                      setSelectedAccount(accName);
                      setIsAccountOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F8FAFC] text-left cursor-pointer ${
                      isSelected
                        ? "text-[#635BFF] bg-[#EEF2FF]"
                        : "text-[#1E293B]"
                    }`}
                  >
                    <img
                      src={accAvatar}
                      alt={accName}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate">{accName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Date Range Selector with border */}
        <div className="w-full sm:w-44">
          <CustomSelect
            value={dateRange}
            onChange={setDateRange}
            options={dateRangeOptions}
            className="w-full"
            buttonClassName="w-full h-10 flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#1E293B] border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors bg-white"
          />
        </div>
      </div>
    </div>
  );
}
