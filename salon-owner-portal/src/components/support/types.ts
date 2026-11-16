export interface Message {
  id: string;
  sender: "User" | "Admin";
  text: string;
  time: string;
}

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending Admin" | "Replied" | "Closed";
  date: string;
  description: string;
  attachmentName?: string;
  messages: Message[];
}

export interface SupportHeaderProps {
  activeTicketsCount: number;
}

export interface SupportTicketFormProps {
  onSubmit: (subject: string, category: string, description: string, attachment: File | null) => Promise<void> | void;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SupportFAQProps {
  faqs: FAQItem[];
}

export interface SupportAttachmentUploadProps {
  attachment: File | null;
  onFileSelect: (file: File | null) => void;
}
