"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import WalkInIcon from "./WalkInIcon";
import AddClientIcon from "./AddClientIcon";
import { RECENT_CLIENTS } from "@/components/appointment/data";

export default function AddAppontClinetSection({
  selectedClient,
  onSelectClient,
}: {
  selectedClient: string | null;
  onSelectClient: (id: string) => void;
}) {
  const [clientSearch, setClientSearch] = useState("");

  const filteredClients = RECENT_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl border border-[#EBEBEB] px-8 py-7 w-full font-manrope">
      {/* ── Header row ── */}
      <div className="flex items-center flex-wrap gap-2 justify-between mb-7">
        <h2 className="text-lg font-bold text-[#29343D] font-manrope">
          Client
        </h2>

        {/* Search bar — full width on right */}
        <div className="w-[316px] flex items-center gap-2.5 px-4 py-2.5 border border-[#E0E6EB] rounded-[10px] bg-white">
          <Search size={18} className="text-[#29343D] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            className="flex-1 text-sm font-manrope text-[#29343D] placeholder-[#AFAFAF] outline-none bg-transparent"
          />
        </div>
      </div>

      {/* ── Walk-In + Add New Client ── */}
      <div className="flex flex-wrap gap-[30px] mb-8">
        {/* Walk-In */}
        <button className="w-full md:w-[255px] h-[174px] flex flex-col items-center justify-center gap-4 border border-[#E8ECF0] rounded-2xl hover:border-[#635BFF] hover:bg-[#FAFAFE] transition-all cursor-pointer group">
          <div className="w-20 h-20 rounded-full bg-[#DDDBFF] flex items-center justify-center group-hover:bg-[#E0DEFF] transition-colors">
            <WalkInIcon />
          </div>
          <span className="text-[18px] font-semibold text-[#29343D]">
            Walk-In
          </span>
        </button>

        {/* Add New Client */}
        <button className="w-full md:w-[255px] h-[174px] flex flex-col items-center justify-center gap-4 border border-[#E8ECF0] rounded-2xl hover:border-[#635BFF] hover:bg-[#FAFAFE] transition-all cursor-pointer group">
          <div className="w-20 h-20 rounded-full bg-[#DDDBFF] flex items-center justify-center group-hover:bg-[#E0DEFF] transition-colors">
            <AddClientIcon />
          </div>
          <span className="text-[18px] font-semibold text-[#29343D]">
            Add New Client
          </span>
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#29343D] mb-4">
          Recently Scheduled Clients
        </p>

        <div className="grid gap-[30px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {filteredClients.map((client) => {
            const isSelected = selectedClient === client.id;
            return (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id as string)}
                className={`flex flex-col items-center justify-center gap-3 py-8 border-2 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#635BFF] bg-[#F1F2FE]"
                    : "border-[#EBEBEB] bg-white hover:border-[#635BFF] hover:bg-[#FAFAFE]"
                }`}
              >
                {/* Avatar */}
                <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden">
                  <Image
                    src={client.avatar}
                    alt={client.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Name + phone */}
                <div className="text-center px-2">
                  <p className="text-[18px] font-bold leading-snug text-[#29343D]">
                    {client.name}
                  </p>
                  <p className="text-sm text-[#98A4AE] mt-1 font-normal">
                    {client.phone}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
