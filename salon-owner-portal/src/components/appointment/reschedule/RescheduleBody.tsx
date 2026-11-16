"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GripVertical,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import RescheduleDayView from "./RescheduleDayView";
import RescheduleWeekView from "./RescheduleWeekView";
import RescheduleMonthView from "./RescheduleMonthView";
import {
  CalendarView,
  Service,
  StaffMember,
  ScheduledAppointment,
  Slot,
} from "./utils";

interface RescheduleBodyProps {
  activePeriod: CalendarView;
  STAFF: StaffMember[];
  SERVICES: Service[];
  SLOTS: Slot[];
  appointments: ScheduledAppointment[];
  TIME_W: number;
  ROW_H: number;
  MIN_COL: number;
  hoverCell: { sid: string; idx: number } | null;
  onOver: (e: React.DragEvent, sid: string, idx: number) => void;
  onDragEnter?: (e: React.DragEvent, sid: string, idx: number) => void;
  onDrop: (
    e: React.DragEvent,
    sid: string,
    idx: number,
    dateStr?: string
  ) => void;
  removeAppt: (idOrIndex: string | number) => void;
  currentDate: Date;
  selectedTeamIds: string[];
  onDragStart: (e: React.DragEvent, svc: Service) => void;
  onDragEnd: () => void;
  onDragStartAppt?: (e: React.DragEvent, appt: ScheduledAppointment) => void;
  selectedService?: Service | null;
  onSelectService?: (svc: Service | null) => void;
  onPlaceSelectedService?: (
    staffId: string,
    slotIdx: number,
    dateStr: string
  ) => void;
  onUpdateServices?: (services: Service[]) => void;
  isDragging?: boolean;
  draggingService?: Service | null;
  draggingAppt?: ScheduledAppointment | null;
}

interface ServiceCardProps {
  s: Service;
  isSelected: boolean;
  isBeingDragged: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent, svc: Service) => void;
  onDragEnd: () => void;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
}

function ServiceCard({
  s,
  isSelected,
  isBeingDragged,
  onSelect,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dragOccurredRef = useRef(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      draggable
      onDragStart={(e) => {
        dragOccurredRef.current = true;
        onDragStart(e, s);
      }}
      onDragEnd={() => {
        onDragEnd();
        setTimeout(() => {
          dragOccurredRef.current = false;
        }, 150);
      }}
      onClick={() => {
        if (dragOccurredRef.current) return;
        onSelect();
      }}
      className={`group flex items-center justify-between px-2.5 py-2 select-none cursor-grab active:cursor-grabbing hover:shadow-sm transition-all relative rounded-r-lg ${
        isBeingDragged
          ? "opacity-50 ring-2 ring-[#635BFF] bg-[#DCD6FF] scale-[0.98]"
          : isSelected
          ? "ring-2 ring-[#635BFF] bg-[#E0DCFF] shadow-sm"
          : "bg-[#ECEAFF] hover:bg-[#E4E0FF]"
      }`}
      style={
        {
          borderLeft: "3px solid #635BFF",
          WebkitUserDrag: "element",
          userSelect: "none",
        } as React.CSSProperties
      }
    >
      {/* Text and drag handle: pointer-events-none ensures child text selection doesn't break drag */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1 pointer-events-none">
        <GripVertical
          size={14}
          className="text-[#635BFF] opacity-40 group-hover:opacity-100 shrink-0 transition-opacity"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold font-manrope text-[#635BFF] leading-5 truncate">
            {s.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[12px] font-medium font-manrope text-[#635BFF] opacity-85">
              {s.duration}
            </span>
            <span className="text-[12px] text-[#635BFF] opacity-60">•</span>
            <span className="text-[12px] font-semibold font-manrope text-[#635BFF]">
              {s.price || "€ 170"}
            </span>
          </div>
        </div>
      </div>

      <div className="relative shrink-0 ml-1 pointer-events-auto">
        <button
          type="button"
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#D6D0FF] text-[#635BFF] opacity-60 hover:opacity-100 cursor-pointer transition-all"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          title="Service options"
        >
          <MoreVertical size={14} />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-xl border border-[#EFF4FA] py-1 w-[120px] animation-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(s);
              }}
              className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-[#F4F6FA] text-[#29343D] text-xs font-semibold cursor-pointer text-left"
            >
              <Edit2 size={12} className="text-[#16CDC7]" /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(s.id);
              }}
              className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-[#F4F6FA] text-[#FF6692] text-xs font-semibold cursor-pointer text-left"
            >
              <Trash2 size={12} className="text-[#FF6692]" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RescheduleBody({
  activePeriod,
  STAFF,
  SERVICES,
  SLOTS,
  appointments,
  TIME_W,
  ROW_H,
  MIN_COL,
  hoverCell,
  onOver,
  onDragEnter,
  onDrop,
  removeAppt,
  currentDate,
  selectedTeamIds,
  onDragStart,
  onDragEnd,
  onDragStartAppt,
  selectedService: extSelectedService,
  onSelectService: extOnSelectService,
  onPlaceSelectedService: extOnPlaceSelectedService,
  onUpdateServices,
  isDragging,
  draggingService,
  draggingAppt,
}: RescheduleBodyProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localServices, setLocalServices] = useState<Service[]>(SERVICES);
  const [internalSelectedService, setInternalSelectedService] =
    useState<Service | null>(null);

  // Sync with prop if updated
  useEffect(() => {
    setLocalServices(SERVICES);
  }, [SERVICES]);

  // Service Edit / Add Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState("40 min");
  const [formPrice, setFormPrice] = useState("€ 170");

  const selectedService =
    extSelectedService !== undefined
      ? extSelectedService
      : internalSelectedService;

  const handleSelectService = (svc: Service | null) => {
    if (extOnSelectService) {
      extOnSelectService(svc);
    } else {
      setInternalSelectedService((prev) => (prev?.id === svc?.id ? null : svc));
    }
  };

  const filteredStaff = STAFF.filter(
    (s) => selectedTeamIds.length === 0 || selectedTeamIds.includes(s.id)
  );

  const filteredServices = localServices.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingService(null);
    setFormName("");
    setFormDuration("40 min");
    setFormPrice("€ 170");
    setModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setFormName(s.name);
    setFormDuration(s.duration);
    setFormPrice(s.price || "€ 170");
    setModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingService) {
      const updated = localServices.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              name: formName.trim(),
              duration: formDuration.trim() || "40 min",
              price: formPrice.trim() || "€ 170",
            }
          : s
      );
      setLocalServices(updated);
      onUpdateServices?.(updated);
    } else {
      const newSvc: Service = {
        id: `s-${Date.now()}`,
        name: formName.trim(),
        duration: formDuration.trim() || "40 min",
        price: formPrice.trim() || "€ 170",
      };
      const updated = [...localServices, newSvc];
      setLocalServices(updated);
      onUpdateServices?.(updated);
    }
    setModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    const updated = localServices.filter((s) => s.id !== id);
    setLocalServices(updated);
    onUpdateServices?.(updated);
    if (selectedService?.id === id) {
      handleSelectService(null);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col md:flex-row overflow-hidden m-7 border border-[#E0E6EB] rounded-xl relative">
      {/* ── LEFT: Services panel ── */}
      <div className="shrink-0 border-r min-h-0 w-full md:w-[240px] border-[#EEF2F8] flex flex-col bg-white">
        <div className="shrink-0 border-b border-[#E0E6EB] px-4 py-4 bg-[#F8F9FA]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[15px] font-bold font-manrope text-[#29343D]">
              Available Services
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1 text-xs font-bold font-manrope text-[#635BFF] hover:text-[#4f46e5] bg-[#ECEAFF] hover:bg-[#ded9ff] px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="Add new service"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          </div>
          <p className="text-[12px] font-manrope text-[#98A4AE] mb-3 leading-tight">
            Drag or click services to schedule appointments
          </p>

          <div className="relative w-full">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A4AE]"
              size={15}
            />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E0E6EB] rounded-[8px] text-xs font-manrope focus:outline-none focus:border-[#635BFF] transition-colors placeholder:text-[#98A4AE]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#98A4AE] hover:text-[#29343D] cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Active Selection Banner */}
        {selectedService && (
          <div className="bg-[#ECEAFF] border-b border-[#D8D2FF] px-3 py-2 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles size={13} className="text-[#635BFF] shrink-0" />
              <span className="font-semibold text-[#635BFF] truncate">
                Selected: {selectedService.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectService(null)}
              className="text-[#635BFF] hover:text-[#29343D] shrink-0 p-0.5 cursor-pointer ml-1"
              title="Deselect"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8 px-2">
              <p className="text-xs font-semibold text-[#98A4AE] font-manrope">
                No services found
              </p>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs text-[#635BFF] hover:underline font-manrope font-medium cursor-pointer"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-2 text-xs text-[#635BFF] hover:underline font-manrope font-semibold cursor-pointer"
                >
                  + Add your first service
                </button>
              )}
            </div>
          ) : (
            filteredServices.map((s) => (
              <ServiceCard
                key={s.id}
                s={s}
                isSelected={selectedService?.id === s.id}
                isBeingDragged={draggingService?.id === s.id}
                onSelect={() => handleSelectService(s)}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onEdit={openEditModal}
                onDelete={handleDeleteService}
              />
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT: Calendar Grids ── */}
      {activePeriod === "Day" && (
        <RescheduleDayView
          STAFF={filteredStaff.length > 0 ? filteredStaff : STAFF}
          SERVICES={localServices}
          SLOTS={SLOTS}
          appointments={appointments}
          TIME_W={TIME_W}
          ROW_H={ROW_H}
          MIN_COL={MIN_COL}
          hoverCell={hoverCell}
          onOver={onOver}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          removeAppt={removeAppt}
          currentDate={currentDate}
          selectedService={selectedService}
          onPlaceSelectedService={extOnPlaceSelectedService}
          onDragStartAppt={onDragStartAppt}
          onDragEnd={onDragEnd}
          isDragging={isDragging}
          draggingAppt={draggingAppt}
        />
      )}

      {activePeriod === "Week" && (
        <RescheduleWeekView
          STAFF={filteredStaff.length > 0 ? filteredStaff : STAFF}
          SERVICES={localServices}
          SLOTS={SLOTS}
          appointments={appointments}
          TIME_W={TIME_W}
          ROW_H={ROW_H}
          MIN_COL={MIN_COL}
          hoverCell={hoverCell}
          onOver={onOver}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          removeAppt={removeAppt}
          currentDate={currentDate}
          selectedTeamIds={selectedTeamIds}
          selectedService={selectedService}
          onPlaceSelectedService={extOnPlaceSelectedService}
          onDragStartAppt={onDragStartAppt}
          onDragEnd={onDragEnd}
          isDragging={isDragging}
          draggingAppt={draggingAppt}
        />
      )}

      {activePeriod === "Month" && (
        <RescheduleMonthView
          STAFF={filteredStaff.length > 0 ? filteredStaff : STAFF}
          SERVICES={localServices}
          appointments={appointments}
          hoverCell={hoverCell}
          onOver={onOver}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          removeAppt={removeAppt}
          currentDate={currentDate}
          selectedTeamIds={selectedTeamIds}
          selectedService={selectedService}
          onPlaceSelectedService={extOnPlaceSelectedService}
          isDragging={isDragging}
        />
      )}

      {/* ── Add / Edit Service Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E0E6EB] w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEF2F8] bg-[#F8F9FA]">
              <h3 className="text-sm font-bold font-manrope text-[#29343D]">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#98A4AE] hover:text-[#29343D] p-1 rounded-md transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold font-manrope text-[#526B7A] mb-1.5">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haircut, Facial, Coloring"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E6EB] rounded-lg text-sm font-manrope focus:outline-none focus:border-[#635BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold font-manrope text-[#526B7A] mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 40 min"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0E6EB] rounded-lg text-sm font-manrope focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-manrope text-[#526B7A] mb-1.5">
                    Price
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. € 170"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E0E6EB] rounded-lg text-sm font-manrope focus:outline-none focus:border-[#635BFF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-[#EEF2F8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E0E6EB] rounded-lg text-xs font-semibold font-manrope text-[#526B7A] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#635BFF] hover:bg-[#5249ea] text-white rounded-lg text-xs font-semibold font-manrope transition-colors cursor-pointer shadow-sm"
                >
                  {editingService ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
