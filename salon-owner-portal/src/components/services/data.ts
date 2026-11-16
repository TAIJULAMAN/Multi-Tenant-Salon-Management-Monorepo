import { ServiceRecord, BundleRecord, ServiceCategoryRecord, ServiceMember, BundleDetailService, BundleDetailMember } from "./types";

export const categoryStyles: Record<string, string> = {
  "Category 1": "bg-[#EEF2FF] text-[#635BFF]",
  "Category 2": "bg-[#CCFBF1] text-[#14B8A6]",
  "Category 3": "bg-[#DCFCE7] text-[#22C55E]",
  "Category 4": "bg-[#FEF9C3] text-[#EAB308]",
  "Category 5": "bg-[#FCE7F3] text-[#EC4899]",
  "Category 6": "bg-[#F1F5F9] text-[#64748B]",
};

export const availableIcons = [
  "/AddServicesIcons/brushes_7429846.svg",
  "/AddServicesIcons/cosmetic_9113822.svg",
  "/AddServicesIcons/eyebrow_6215201.svg",
  "/AddServicesIcons/face-mask_11130176.svg",
  "/AddServicesIcons/face-massage_11130220.svg",
  "/AddServicesIcons/hair-comb_6275822.svg",
  "/AddServicesIcons/hair-dryer_5165414 (1).svg",
  "/AddServicesIcons/hair-dye_6275023.svg",
  "/AddServicesIcons/lotion_8536950.svg",
  "/AddServicesIcons/makeup_7429594.svg",
  "/AddServicesIcons/rf-lifting_7429746.svg",
  "/AddServicesIcons/scissors_6275622.svg",
  "/AddServicesIcons/skin-care_7429768.svg",
  "/AddServicesIcons/stone_6316765.svg",
  "/AddServicesIcons/straighten_6275474.svg",
];

export const mockMembers: ServiceMember[] = [
  { id: 1, name: "Maria Rodriguez", avatar: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Maria Rodriguez", avatar: "https://i.pravatar.cc/100?img=5" },
  { id: 3, name: "Maria Rodriguez", avatar: "https://i.pravatar.cc/100?img=9" },
  { id: 4, name: "Maria Rodriguez", avatar: "https://i.pravatar.cc/100?img=2" },
];

export const initialServices: ServiceRecord[] = [
  { id: "1", name: "Haircut", category: "Category 1", categoryStyle: categoryStyles["Category 1"], duration: "45 min", postBreak: "15 min", price: "€ 35", vat: "€ 7", iconIndex: 0 },
  { id: "2", name: "Beard Trim", category: "Category 2", categoryStyle: categoryStyles["Category 2"], duration: "20 min", postBreak: "5 min", price: "€ 15", vat: "€ 3", iconIndex: 0 },
  { id: "3", name: "Hair Coloring", category: "Category 3", categoryStyle: categoryStyles["Category 3"], duration: "90 min", postBreak: "30 min", price: "€ 80", vat: "€ 16", iconIndex: 0 },
  { id: "4", name: "Wash & Blow Dry", category: "Category 4", categoryStyle: categoryStyles["Category 4"], duration: "30 min", postBreak: "10 min", price: "€ 25", vat: "€ 5", iconIndex: 0 },
  { id: "5", name: "Balayage", category: "Category 5", categoryStyle: categoryStyles["Category 5"], duration: "120 min", postBreak: "30 min", price: "€ 150", vat: "€ 30", iconIndex: 0 },
  { id: "6", name: "Ombre Hair Color", category: "Category 6", categoryStyle: categoryStyles["Category 6"], duration: "110 min", postBreak: "30 min", price: "€ 130", vat: "€ 26", iconIndex: 0 },
  { id: "7", name: "Perm", category: "Category 1", categoryStyle: categoryStyles["Category 1"], duration: "100 min", postBreak: "25 min", price: "€ 95", vat: "€ 19", iconIndex: 0 },
  { id: "8", name: "Hair Straightening", category: "Category 3", categoryStyle: categoryStyles["Category 3"], duration: "150 min", postBreak: "45 min", price: "€ 200", vat: "€ 40", iconIndex: 0 },
  { id: "9", name: "Keratin Treatment", category: "Category 5", categoryStyle: categoryStyles["Category 5"], duration: "120 min", postBreak: "30 min", price: "€ 180", vat: "€ 36", iconIndex: 0 },
  { id: "10", name: "Highlights", category: "Category 1", categoryStyle: categoryStyles["Category 1"], duration: "75 min", postBreak: "20 min", price: "€ 85", vat: "€ 17", iconIndex: 0 },
];

export const initialBundles: BundleRecord[] = [
  { id: "1", name: "Bundle 1", category: "Category 1", categoryStyle: "bg-[#E0E7FF] text-[#635BFF]", relatedServices: 1 },
  { id: "2", name: "Bundle 2", category: "Category 2", categoryStyle: "bg-[#CCFBF1] text-[#14B8A6]", relatedServices: 1 },
  { id: "3", name: "Bundle 3", category: "Category 3", categoryStyle: "bg-[#DCFCE7] text-[#22C55E]", relatedServices: 1 },
  { id: "4", name: "Bundle 4", category: "Category 4", categoryStyle: "bg-[#FEF9C3] text-[#EAB308]", relatedServices: 1 },
  { id: "5", name: "Bundle 5", category: "Category 5", categoryStyle: "bg-[#FCE7F3] text-[#EC4899]", relatedServices: 1 },
  { id: "6", name: "Bundle 6", category: "Category 6", categoryStyle: "bg-[#F1F5F9] text-[#64748B]", relatedServices: 1 },
  { id: "7", name: "Bundle 7", category: "Category 3", categoryStyle: "bg-[#DCFCE7] text-[#22C55E]", relatedServices: 1 },
  { id: "8", name: "Bundle 8", category: "Category 4", categoryStyle: "bg-[#FEF9C3] text-[#EAB308]", relatedServices: 1 },
  { id: "9", name: "Bundle 9", category: "Category 5", categoryStyle: "bg-[#FCE7F3] text-[#EC4899]", relatedServices: 1 },
  { id: "10", name: "Bundle 10", category: "Category 1", categoryStyle: "bg-[#E0E7FF] text-[#635BFF]", relatedServices: 1 },
];

export const initialCategories: ServiceCategoryRecord[] = [
  { id: "1", name: "Category 1", categoryStyle: "bg-[#E0E7FF] text-[#635BFF]", relatedServices: 1 },
  { id: "2", name: "Category 2", categoryStyle: "bg-[#CCFBF1] text-[#14B8A6]", relatedServices: 1 },
  { id: "3", name: "Category 3", categoryStyle: "bg-[#DCFCE7] text-[#22C55E]", relatedServices: 1 },
  { id: "4", name: "Category 4", categoryStyle: "bg-[#FEF9C3] text-[#EAB308]", relatedServices: 1 },
  { id: "5", name: "Category 5", categoryStyle: "bg-[#FCE7F3] text-[#EC4899]", relatedServices: 1 },
  { id: "6", name: "Category 6", categoryStyle: "bg-[#F1F5F9] text-[#64748B]", relatedServices: 1 },
  { id: "7", name: "Category 1", categoryStyle: "bg-[#E0E7FF] text-[#635BFF]", relatedServices: 1 },
  { id: "8", name: "Category 2", categoryStyle: "bg-[#CCFBF1] text-[#14B8A6]", relatedServices: 1 },
  { id: "9", name: "Category 3", categoryStyle: "bg-[#DCFCE7] text-[#22C55E]", relatedServices: 1 },
  { id: "10", name: "Category 4", categoryStyle: "bg-[#FEF9C3] text-[#EAB308]", relatedServices: 1 },
];

export const bundleDetailServices: BundleDetailService[] = [
  { id: "1", name: "Hair Color", duration: "15 min", price: "€ 170" },
  { id: "2", name: "Hair Color", duration: "15 min", price: "€ 170" },
  { id: "3", name: "Hair Color", duration: "15 min", price: "€ 170" },
];

export const bundleDetailMembers: BundleDetailMember[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    avatar: "https://i.pravatar.cc/100?img=9",
  },
];


