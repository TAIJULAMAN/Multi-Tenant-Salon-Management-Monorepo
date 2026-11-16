"use client";

import React, { useState, useRef, useEffect } from "react";
import SupportHeader from "@/components/support/SupportHeader";
import SupportContactDetails from "@/components/support/SupportContactDetails";
import SupportTicketForm from "@/components/support/SupportTicketForm";
import SupportFAQ from "@/components/support/SupportFAQ";
import { Ticket } from "@/components/support/types";
import { INITIAL_TICKETS, FAQS } from "@/components/support/data";

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?.messages]);

  const handleTicketSubmit = (
    subject: string,
    category: string,
    description: string,
    attachment: File | null,
  ) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newTicket: Ticket = {
          id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
          subject: subject,
          category: category,
          priority: "Medium",
          status: "Pending Admin",
          date: new Date().toISOString().split("T")[0],
          description: description,
          attachmentName: attachment ? attachment.name : undefined,
          messages: [
            {
              id: `m-init-${Date.now()}`,
              sender: "User",
              text: description,
              time:
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) + `, Today`,
            },
          ],
        };

        setTickets((prev) => [newTicket, ...prev]);
        resolve();
      }, 1200);
    });
  };

  return (
    <div className="space-y-6 pb-12 relative">
      <SupportHeader
        activeTicketsCount={tickets.filter((t) => t.status !== "Closed").length}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <SupportTicketForm onSubmit={handleTicketSubmit} />
          <SupportFAQ faqs={FAQS} />
        </div>
        <div className="space-y-6">
          <SupportContactDetails />
        </div>
      </div>
    </div>
  );
}
