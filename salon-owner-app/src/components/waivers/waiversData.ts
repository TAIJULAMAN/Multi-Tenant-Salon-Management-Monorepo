export interface WaiverItem {
  id: string;
  name: string;
  signers: number;
  signedCount: string;
  lastUpdate: string;
  description?: string;
  status?: "Active" | "Draft" | "Archived";
  fieldsCount?: number;
  directLink?: string;
}

export interface WaiverSignedRecord {
  id: string;
  waiverName: string;
  signerName: string;
  signerEmail: string;
  signedDate: string;
  status: "Completed" | "Pending" | "Declined";
  documentUrl?: string;
}

export interface WaiverField {
  id: string;
  fieldName: string;
  label: string;
  type: "Text" | "Number" | "Date" | "Email" | "Telephone" | "Address" | "Text Area" | "Signature";
  placeholder: string;
  description: string;
  required: boolean;
}

export interface WaiverAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  updatedAt: string;
}

export const INITIAL_MOCK_WAIVERS: WaiverItem[] = [
  {
    id: "1",
    name: "General Service Consent & Liability Release",
    signers: 2,
    signedCount: "42 times",
    lastUpdate: "1h ago",
    description: "Standard liability waiver and medical declaration for chemical hair treatments and color services.",
    status: "Active",
    fieldsCount: 6,
    directLink: "https://glampro.app/waiver/sign/general-consent-01",
  },
  {
    id: "2",
    name: "Hair Color & Bleach Chemical Treatment Waiver",
    signers: 2,
    signedCount: "30 times",
    lastUpdate: "3h ago",
    description: "Patch test and chemical processing acknowledgement for balayage, highlights, and bleaching.",
    status: "Active",
    fieldsCount: 5,
    directLink: "https://glampro.app/waiver/sign/hair-color-waiver-02",
  },
  {
    id: "3",
    name: "Skin & Facial Treatment Medical Disclosure",
    signers: 1,
    signedCount: "18 times",
    lastUpdate: "1d ago",
    description: "Allergy questionnaire and contraindications for deep cleansing, peelings, and microdermabrasion.",
    status: "Active",
    fieldsCount: 7,
    directLink: "https://glampro.app/waiver/sign/skin-facial-03",
  },
  {
    id: "4",
    name: "Lash Extensions & Tinting Agreement",
    signers: 1,
    signedCount: "25 times",
    lastUpdate: "2d ago",
    description: "Post-care guidelines and liability agreement for semi-permanent lash application.",
    status: "Active",
    fieldsCount: 4,
    directLink: "https://glampro.app/waiver/sign/lash-extensions-04",
  },
  {
    id: "5",
    name: "Body Massage & Spa Treatment Consent",
    signers: 1,
    signedCount: "14 times",
    lastUpdate: "3d ago",
    description: "Health status confirmation and pressure preferences for massage sessions.",
    status: "Active",
    fieldsCount: 5,
    directLink: "https://glampro.app/waiver/sign/massage-spa-05",
  },
  {
    id: "6",
    name: "Nail Care & Acrylic Extensions Waiver",
    signers: 1,
    signedCount: "38 times",
    lastUpdate: "4d ago",
    description: "Sanitation agreement and fungal risk acknowledgement.",
    status: "Active",
    fieldsCount: 4,
    directLink: "https://glampro.app/waiver/sign/nail-care-06",
  },
];

export const INITIAL_SIGNED_WAIVERS: WaiverSignedRecord[] = [
  {
    id: "s_101",
    waiverName: "General Service Consent & Liability Release",
    signerName: "Elena Rostova",
    signerEmail: "elena.r@example.com",
    signedDate: "20 Aug 2025, 14:30",
    status: "Completed",
  },
  {
    id: "s_102",
    waiverName: "Hair Color & Bleach Chemical Treatment Waiver",
    signerName: "Marco Rossi",
    signerEmail: "marco.rossi@example.com",
    signedDate: "20 Aug 2025, 11:15",
    status: "Completed",
  },
  {
    id: "s_103",
    waiverName: "Skin & Facial Treatment Medical Disclosure",
    signerName: "Sophie Martin",
    signerEmail: "sophie.m@example.com",
    signedDate: "19 Aug 2025, 16:45",
    status: "Completed",
  },
  {
    id: "s_104",
    waiverName: "Lash Extensions & Tinting Agreement",
    signerName: "Chiara Ferrari",
    signerEmail: "chiara.f@example.com",
    signedDate: "19 Aug 2025, 09:20",
    status: "Pending",
  },
  {
    id: "s_105",
    waiverName: "General Service Consent & Liability Release",
    signerName: "David Miller",
    signerEmail: "david.m@example.com",
    signedDate: "18 Aug 2025, 17:00",
    status: "Completed",
  },
];

export const ALL_CLIENTS_LIST = [
  { id: "c_1", name: "Elena Rostova", email: "elena.r@example.com", phone: "+39 340 123 4567" },
  { id: "c_2", name: "Marco Rossi", email: "marco.rossi@example.com", phone: "+39 345 678 9012" },
  { id: "c_3", name: "Sophie Martin", email: "sophie.m@example.com", phone: "+39 348 901 2345" },
  { id: "c_4", name: "Chiara Ferrari", email: "chiara.f@example.com", phone: "+39 347 112 2334" },
  { id: "c_5", name: "David Miller", email: "david.m@example.com", phone: "+39 349 445 5667" },
  { id: "c_6", name: "Maria Rodriguez", email: "maria.r@example.com", phone: "+39 342 998 8776" },
];

export const ALL_EMPLOYEES_LIST = [
  { id: "e_1", name: "Sarah Jenkins", role: "Senior Stylist", email: "sarah.j@salon.com" },
  { id: "e_2", name: "Michael Torres", role: "Color Specialist", email: "michael.t@salon.com" },
  { id: "e_3", name: "Jessica Alba", role: "Esthetician", email: "jessica.a@salon.com" },
  { id: "e_4", name: "Alex Rivera", role: "Barber", email: "alex.r@salon.com" },
];
