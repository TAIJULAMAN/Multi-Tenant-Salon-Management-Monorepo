import React from "react";
import { Banknote, Ticket, CreditCard, Globe } from "lucide-react";

export const paymentMethods = [
  { id: "Cash", icon: <Banknote className="w-6 h-6" /> },
  { id: "Gift Card", icon: <Ticket className="w-6 h-6" /> },
  { id: "Card Terminal", icon: <CreditCard className="w-6 h-6" /> },
  { id: "Online Payment", icon: <Globe className="w-6 h-6" /> },
];

export const clients = [
  { id: 1, name: "Maria Rodriguez", phone: "+39 345 678 9123", avatar: "https://i.pravatar.cc/100?img=5" },
  { id: 2, name: "Maria Rodriguez", phone: "+39 345 678 9123", avatar: "https://i.pravatar.cc/100?img=9" },
  { id: 3, name: "Maria Rodriguez", phone: "+39 345 678 9123", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: 4, name: "Maria Rodriguez", phone: "+39 345 678 9123", avatar: "https://i.pravatar.cc/100?img=17" },
];

export const services = [
  { id: 1, name: "Haircut", duration: "45 min", estimatedPrice: "€ 350" },
  { id: 2, name: "Haircut", duration: "45 min", estimatedPrice: "€ 350" },
  { id: 3, name: "Haircut", duration: "45 min", estimatedPrice: "€ 350" },
  { id: 4, name: "Haircut", duration: "45 min", estimatedPrice: "€ 350" },
];
