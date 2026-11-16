import React from "react";
import Image from "next/image";
import { X, Users } from "lucide-react";
import CustomSearch from "@/components/customComponent/CustomSearch";

interface SelectProvidersModalProps {
  onClose: () => void;
  wizardProviderSearch: string;
  setWizardProviderSearch: (val: string) => void;
  ALL_PROVIDERS: any[];
  wizardProviders: string[];
  setWizardProviders: React.Dispatch<React.SetStateAction<string[]>>;
}

export function SelectProvidersModal({
  onClose,
  wizardProviderSearch,
  setWizardProviderSearch,
  ALL_PROVIDERS,
  wizardProviders,
  setWizardProviders
}: SelectProvidersModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        <h3 className="text-xl font-bold text-[#635BFF] flex items-center gap-2 mb-6">
          <Users size={20} />
          Select Service Providers
        </h3>
        
        <div className="mb-4">
          <CustomSearch
            value={wizardProviderSearch}
            onChange={setWizardProviderSearch}
            placeholder="Search employees..."
            className="w-full"
          />
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {ALL_PROVIDERS.filter(p => p.name.toLowerCase().includes(wizardProviderSearch.toLowerCase())).map((provider, i) => {
            const isSelected = wizardProviders.includes(provider.name);
            return (
              <div
                key={i}
                onClick={() => {
                  if (isSelected) setWizardProviders(prev => prev.filter(n => n !== provider.name));
                  else setWizardProviders(prev => [...prev, provider.name]);
                }}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
                            ${isSelected ? "border-[#635BFF]" : "border-gray-100 hover:border-gray-200"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    {provider.image ? (
                      <Image src={provider.image} alt={provider.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-[#635BFF] font-bold text-lg">
                        {provider.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-[#0A2540]">{provider.name}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-[#635BFF] rounded text-white flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={onClose} className="w-full mt-6 py-4 bg-[#635BFF] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
          ✓ Done
        </button>
      </div>
    </div>
  );
}
