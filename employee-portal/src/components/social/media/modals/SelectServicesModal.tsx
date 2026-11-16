import React from "react";
import { X } from "lucide-react";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";
import CustomSearch from "@/components/customComponent/CustomSearch";

interface SelectServicesModalProps {
  onClose: () => void;
  serviceSearch: string;
  setServiceSearch: (val: string) => void;
  filteredServiceList: string[];
  selectedServices: string[];
  toggleService: (service: string) => void;
}

export function SelectServicesModal({
  onClose,
  serviceSearch,
  setServiceSearch,
  filteredServiceList,
  selectedServices,
  toggleService
}: SelectServicesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400"><X size={20} /></button>
        <h3 className="text-xl font-bold text-[#0A2540] mb-6">Select Services</h3>
        
        <div className="mb-4">
          <CustomSearch
            value={serviceSearch}
            onChange={setServiceSearch}
            placeholder="Search services..."
            className="w-full"
          />
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {filteredServiceList.map((name, i) => (
            <div
              key={i}
              onClick={() => toggleService(name)}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors
                                    ${selectedServices.includes(name) ? "border-[#635BFF] bg-indigo-50/30" : "border-[#E0E6EB] hover:bg-gray-50"}`}
            >
              <CustomCheckbox 
                checked={selectedServices.includes(name)} 
                onChange={() => toggleService(name)} 
              />
              <div>
                <p className="text-sm font-bold text-[#0A2540]">{name}</p>
                <p className="text-xs text-gray-400">Beauty</p>
              </div>
            </div>
          ))}
          {filteredServiceList.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">No services found</p>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-indigo-50 text-[#635BFF] font-bold text-sm text-center rounded-xl">
          {selectedServices.length} services selected
        </div>
        
        <button onClick={onClose} className="w-full mt-4 py-4 bg-[#635BFF] text-white font-bold rounded-xl shadow-lg">Done</button>
      </div>
    </div>
  );
}
