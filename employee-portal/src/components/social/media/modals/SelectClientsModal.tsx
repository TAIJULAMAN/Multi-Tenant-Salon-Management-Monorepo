import React from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";
import CustomSearch from "@/components/customComponent/CustomSearch";

interface SelectClientsModalProps {
  onClose: () => void;
  clientSearch: string;
  setClientSearch: (val: string) => void;
  filteredClientList: any[];
  selectedClients: string[];
  toggleClient: (client: string) => void;
}

export function SelectClientsModal({
  onClose,
  clientSearch,
  setClientSearch,
  filteredClientList,
  selectedClients,
  toggleClient
}: SelectClientsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400"><X size={20} /></button>
        <h3 className="text-xl font-bold text-[#0A2540] mb-6">Select Client</h3>
        
        <div className="mb-4">
          <CustomSearch
            value={clientSearch}
            onChange={setClientSearch}
            placeholder="Search by name or email..."
            className="w-full"
          />
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {filteredClientList.map((client, i) => (
            <div
              key={i}
              onClick={() => toggleClient(client.name)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors
                                    ${selectedClients.includes(client.name) ? "border-[#635BFF] bg-indigo-50/30" : "border-[#E0E6EB] hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-[#635BFF] flex items-center justify-center font-bold text-sm">
                  {client.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A2540]">{client.name}</p>
                  <p className="text-xs text-gray-400">{client.email}</p>
                </div>
              </div>
              <CustomCheckbox 
                checked={selectedClients.includes(client.name)} 
                onChange={() => toggleClient(client.name)} 
              />
            </div>
          ))}
          {filteredClientList.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">No clients found</p>
          )}
        </div>
        <button onClick={onClose} className="w-full mt-6 py-4 bg-[#635BFF] text-white font-bold rounded-xl shadow-lg">Done</button>
      </div>
    </div>
  );
}
