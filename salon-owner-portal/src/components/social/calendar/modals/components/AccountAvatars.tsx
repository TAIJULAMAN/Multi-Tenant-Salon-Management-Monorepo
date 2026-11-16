import React from "react";

export function AccountAvatars({ accounts, selectedAccountIds, toggleAccount }: { 
  accounts: any[]; 
  selectedAccountIds: string[]; 
  toggleAccount: (id: string) => void; 
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {accounts.map((account) => {
        const isSelected = selectedAccountIds.includes(account.id);
        return (
          <button
            key={account.id}
            onClick={() => toggleAccount(account.id)}
            className="relative focus:outline-none shrink-0 group transition-transform hover:scale-105"
            title={account.name}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all border ${isSelected
                ? `${account.bg} border-transparent shadow-md`
                : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
            >
              <span
                className={`text-[20px] font-bold ${isSelected ? account.iconColor : "text-[#94A3B8]"}`}
              >
                {account.icon}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
