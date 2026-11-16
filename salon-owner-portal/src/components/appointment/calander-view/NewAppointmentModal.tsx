"use client";

import React, { useState } from "react";
import {
  AppStatus,
  CalAppointment,
} from "@/@types/salon-owner/CalAppointment.type";
import NewAppointmentModalHeader from "./NewAppointmentModalHeader";
import NewAppointmentModalFooter from "./NewAppointmentModalFooter";
import NewAppointmentClientStep from "./NewAppointmentClientStep";
import NewAppointmentServicesStep from "./NewAppointmentServicesStep";
import NewAppointmentStatusStep from "./NewAppointmentStatusStep";
import NewAppointmentSuccessStep from "./NewAppointmentSuccessStep";
import {
  DUMMY_CLIENTS,
  DUMMY_SERVICES,
  INITIAL_CLIENT_NOTES_MAP,
} from "@/components/appointment/data";
import {
  BookingOrderItem,
  ClientNoteItem,
} from "@/components/appointment/types";

export default function NewAppointmentModal({
  memberId,
  startTime,
  endTime,
  date,
  teamMembers,
  onClose,
  onConfirm,
}: {
  memberId: string;
  startTime: string;
  endTime: string;
  date: Date;
  teamMembers: { id: string; name: string; avatar: string }[];
  onClose: () => void;
  onConfirm: (data: CalAppointment[]) => void;
}) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientPhoto, setNewClientPhoto] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [bookingOrder, setBookingOrder] = useState<BookingOrderItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AppStatus>("Booked");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<
    "Paid" | "Partially Paid" | "Unpaid"
  >("Unpaid");
  const [associatedReceipt, setAssociatedReceipt] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");

  const [showGiftDetails, setShowGiftDetails] = useState(false);
  const [showNoteDetails, setShowNoteDetails] = useState(true);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [clientNotesMap, setClientNotesMap] = useState<
    Record<string, ClientNoteItem[]>
  >(INITIAL_CLIENT_NOTES_MAP);

  const selectedClient = DUMMY_CLIENTS.find((c) => c.id === selectedClientId);

  const currentNotes = selectedClientId
    ? clientNotesMap[selectedClientId] ||
      (selectedClient?.notes
        ? [
            {
              id: "initial",
              text: selectedClient.notes,
              date: "15 Aug 2025, 10:30 AM",
              author: "Staff",
            },
          ]
        : [])
    : [];

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedClientId) return;
    const newNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      date: "Just now",
      author: "You",
    };
    setClientNotesMap((prev) => ({
      ...prev,
      [selectedClientId]: [
        newNote,
        ...(prev[selectedClientId] ||
          (selectedClient?.notes
            ? [
                {
                  id: "init",
                  text: selectedClient.notes,
                  date: "15 Aug 2025, 10:30 AM",
                  author: "Staff",
                },
              ]
            : [])),
      ],
    }));
    setNewNoteText("");
    setIsAddingNote(false);
    setShowAllNotes(true);
  };

  const handleAddNewClient = () => {
    if (newClientName) {
      const newId = "new-" + Date.now();
      DUMMY_CLIENTS.push({
        id: newId,
        name: newClientName,
        email: newClientEmail,
        phone: newClientPhone,
        photo: newClientPhoto || "",
        notes: "",
        giftCards: 0,
        giftCardDetails: null,
      });
      setSelectedClientId(newId);
      setIsAddingNewClient(false);
      setNewClientName("");
      setNewClientEmail("");
      setNewClientPhone("");
    }
  };

  const totalDurationMins = selectedServiceIds.reduce((acc, id) => {
    const srv = DUMMY_SERVICES.find((s) => s.id === id);
    if (!srv) return acc;
    const mins = parseInt(srv.duration.replace("m", "")) || 0;
    return acc + mins;
  }, 0);

  const formattedTotalDuration =
    totalDurationMins > 0
      ? `${Math.floor(totalDurationMins / 60)}h ${totalDurationMins % 60}min`
      : "0 min";

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleServiceToggle = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds((prev) => prev.filter((sid) => sid !== id));
      setBookingOrder((prev) => prev.filter((item) => item.serviceId !== id));
    } else {
      setSelectedServiceIds((prev) => [...prev, id]);
      setBookingOrder((prev) => {
        let newStartTime = startTime;
        if (prev.length > 0) {
          const lastOrder = prev[prev.length - 1];
          if (lastOrder.endTime) {
            newStartTime = lastOrder.endTime;
          }
        }

        const srv = DUMMY_SERVICES.find((s) => s.id === id);
        const mins = srv ? parseInt(srv.duration.replace("m", "")) || 0 : 0;
        const startMins = timeToMinutes(newStartTime);
        const newEndTime = minutesToTime(startMins + mins);

        return [
          ...prev,
          {
            serviceId: id,
            employeeId: memberId,
            startTime: newStartTime,
            endTime: newEndTime,
          },
        ];
      });
    }
  };

  const updateServiceEmployee = (serviceId: string, empId: string) => {
    setBookingOrder((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId ? { ...item, employeeId: empId } : item
      )
    );
  };

  const updateServiceTime = (
    serviceId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setBookingOrder((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId ? { ...item, [field]: value } : item
      )
    );
  };

  const [currentStep, setCurrentStep] = useState(1);
  const isStep1Valid = Boolean(
    selectedClientId || (isAddingNewClient && newClientName)
  );
  const isStep2Valid = selectedServiceIds.length > 0;
  const isStep3Valid = Boolean(selectedStatus);
  const isValid = isStep1Valid && isStep2Valid;

  const handleConfirm = () => {
    if (!isValid || !isStep3Valid) return;
    setCurrentStep(4);
  };

  const handleFinalize = () => {
    const clientName = isAddingNewClient
      ? newClientName
      : selectedClient?.name || "";

    const groupId = `group-${Date.now()}`;
    const totalSplits = bookingOrder.length;
    const totalStartTime = bookingOrder[0]?.startTime || startTime;
    const totalEndTime =
      bookingOrder[bookingOrder.length - 1]?.endTime || endTime;

    const newAppts: CalAppointment[] = bookingOrder.map((order, index) => {
      return {
        id: `appt-${Date.now()}-${index}`,
        date: date,
        startTime: order.startTime || startTime,
        endTime: order.endTime || endTime,
        clientName,
        service:
          DUMMY_SERVICES.find((s) => s.id === order.serviceId)?.name || "",
        employeeId: order.employeeId || memberId,
        employeeName:
          teamMembers.find((m) => m.id === (order.employeeId || memberId))
            ?.name || "",
        status: selectedStatus,
        duration:
          DUMMY_SERVICES.find((s) => s.id === order.serviceId)?.duration || "",
        price:
          DUMMY_SERVICES.find((s) => s.id === order.serviceId)?.price || "",
        groupId: totalSplits > 1 ? groupId : undefined,
        splitIndex: totalSplits > 1 ? index + 1 : undefined,
        totalSplits: totalSplits > 1 ? totalSplits : undefined,
        totalStartTime: totalSplits > 1 ? totalStartTime : undefined,
        totalEndTime: totalSplits > 1 ? totalEndTime : undefined,
        paymentStatus: selectedPaymentStatus,
        associatedReceipt:
          selectedPaymentStatus === "Paid" ? associatedReceipt : undefined,
      };
    });

    onConfirm(newAppts);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#29343D]/60 backdrop-blur-sm p-4 font-manrope"
      onMouseDown={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[12px] shadow-2xl w-full max-w-[700px] min-h-[600px] max-h-[94vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <NewAppointmentModalHeader
          currentStep={currentStep}
          date={date}
          onClose={onClose}
          onFinalize={handleFinalize}
        />

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {currentStep === 1 && (
            <NewAppointmentClientStep
              selectedClientId={selectedClientId}
              setSelectedClientId={setSelectedClientId}
              selectedClient={selectedClient}
              isAddingNewClient={isAddingNewClient}
              setIsAddingNewClient={setIsAddingNewClient}
              isClientDropdownOpen={isClientDropdownOpen}
              setIsClientDropdownOpen={setIsClientDropdownOpen}
              clientSearch={clientSearch}
              setClientSearch={setClientSearch}
              newClientName={newClientName}
              setNewClientName={setNewClientName}
              newClientEmail={newClientEmail}
              setNewClientEmail={setNewClientEmail}
              newClientPhone={newClientPhone}
              setNewClientPhone={setNewClientPhone}
              newClientPhoto={newClientPhoto}
              setNewClientPhoto={setNewClientPhoto}
              onAddNewClient={handleAddNewClient}
              currentNotes={currentNotes}
              showNoteDetails={showNoteDetails}
              setShowNoteDetails={setShowNoteDetails}
              showAllNotes={showAllNotes}
              setShowAllNotes={setShowAllNotes}
              isAddingNote={isAddingNote}
              setIsAddingNote={setIsAddingNote}
              newNoteText={newNoteText}
              setNewNoteText={setNewNoteText}
              onAddNote={handleAddNote}
              showGiftDetails={showGiftDetails}
              setShowGiftDetails={setShowGiftDetails}
            />
          )}

          {currentStep === 2 && (
            <NewAppointmentServicesStep
              serviceSearch={serviceSearch}
              setServiceSearch={setServiceSearch}
              selectedServiceIds={selectedServiceIds}
              handleServiceToggle={handleServiceToggle}
              formattedTotalDuration={formattedTotalDuration}
              bookingOrder={bookingOrder}
              updateServiceTime={updateServiceTime}
              updateServiceEmployee={updateServiceEmployee}
              teamMembers={teamMembers}
            />
          )}

          {currentStep === 3 && (
            <NewAppointmentStatusStep
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPaymentStatus={selectedPaymentStatus}
              setSelectedPaymentStatus={setSelectedPaymentStatus}
              associatedReceipt={associatedReceipt}
              setAssociatedReceipt={setAssociatedReceipt}
              appointmentNote={appointmentNote}
              setAppointmentNote={setAppointmentNote}
            />
          )}

          {currentStep === 4 && <NewAppointmentSuccessStep />}
        </div>

        <NewAppointmentModalFooter
          currentStep={currentStep}
          onClose={onClose}
          onBack={() => setCurrentStep(currentStep - 1)}
          onNext={() => setCurrentStep(currentStep + 1)}
          onConfirm={handleConfirm}
          onFinalize={handleFinalize}
          isStep1Valid={isStep1Valid}
          isStep2Valid={isStep2Valid}
          isStep3Valid={isStep3Valid}
          isValid={isValid}
        />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
