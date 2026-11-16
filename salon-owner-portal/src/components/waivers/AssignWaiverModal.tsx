import React, { useState } from "react";
import Modal from "@/components/saloonOwner/customComponent/Modal";
import CustomSwitch from "@/components/customComponent/CustomSwitch";
import CustomInput from "@/components/customComponent/CustomInput";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { Search, Users, X, Check } from "lucide-react";
import { Client, AssignWaiverModalProps } from "./types";
import { mockClients } from "./data";

export default function AssignWaiverModal({ isOpen, onClose, waiver, assignType = "clients" }: AssignWaiverModalProps) {
  const [isDefault, setIsDefault] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);

  const toggleClient = (client: Client) => {
    if (selectedClients.find((c) => c.id === client.id)) {
      setSelectedClients(selectedClients.filter((c) => c.id !== client.id));
    } else {
      setSelectedClients([...selectedClients, client]);
    }
  };

  const removeClient = (clientId: string) => {
    setSelectedClients(selectedClients.filter((c) => c.id !== clientId));
  };

  const handleAssign = () => {
    // API call logic here
    onClose();
    setSelectedClients([]);
    setIsDefault(false);
    setSearchQuery("");
  };

  const isEmployee = assignType === "employees";
  const entityName = isEmployee ? "employees" : "clients";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign to ${isEmployee ? 'Employees' : "Client's Profiles"}`} maxWidth="max-w-[600px]">
      <div className="py-2">
        <p className="text-[14px] text-[#64748B] mb-6">
          Select which {entityName} you want to assign this waiver to, or set as default for all {entityName}.
        </p>

        {/* Set as Default Toggle */}
        <div className="bg-[#F8FAFC] rounded-[16px] p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-medium text-[#1E293B]">Set as default for all {entityName}</span>
          </div>
          <CustomSwitch checked={isDefault} onChange={setIsDefault} />
        </div>

        <div className="mb-4">
          <h3 className="text-[14px] font-medium text-[#1E293B] mb-3">Or select specific {entityName}</h3>
          <CustomInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Client List */}
        <div className="border border-[#E2E8F0] rounded-[16px] p-2 mb-6 max-h-[240px] overflow-y-auto">
          {mockClients.map((client) => {
            const isSelected = !!selectedClients.find((c) => c.id === client.id);
            return (
              <div
                key={client.id}
                onClick={() => toggleClient(client)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]"
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected
                    ? "bg-[#635BFF] border-[#635BFF]"
                    : "border-[#CBD5E1] bg-white"
                    }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-[14px] font-medium text-[#1E293B]">{client.name}</h4>
                  <p className="text-[12px] text-[#94A3B8]">{client.email}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Clients Area */}
        {selectedClients.length > 0 && (
          <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
            <h3 className="text-[14px] font-medium text-[#1E293B] mb-3">
              Selected {entityName} ({selectedClients.length})
            </h3>
            <div className="border border-[#E2E8F0] rounded-[16px] p-4 flex flex-wrap gap-2">
              {selectedClients.map((client) => (
                <div
                  key={`selected-${client.id}`}
                  className="flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]"
                >
                  <span className="text-[13px] font-medium text-[#1E293B]">{client.name}</span>
                  <button
                    onClick={() => removeClient(client.id)}
                    className="text-[#F43F5E] hover:text-red-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <CancelButton onClick={onClose} />
          <SubmitButton
            onClick={handleAssign}
            disabled={selectedClients.length === 0 && !isDefault}
            className={selectedClients.length === 0 && !isDefault ? "bg-[#F1F5F9] text-[#94A3B8] shadow-none cursor-not-allowed hover:bg-[#F1F5F9]" : ""}
          >
            {selectedClients.length > 0
              ? `Assign Now (${selectedClients.length})`
              : "Assign Now"}
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
