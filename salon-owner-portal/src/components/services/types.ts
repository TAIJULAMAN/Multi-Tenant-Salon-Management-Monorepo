export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  categoryStyle: string;
  duration: string;
  postBreak: string;
  price: string;
  vat: string;
  iconIndex?: number;
}

export interface BundleRecord {
  id: string;
  name: string;
  category: string;
  categoryStyle: string;
  relatedServices: number;
}

export interface ServiceCategoryRecord {
  id: string;
  name: string;
  categoryStyle: string;
  relatedServices: number;
}

export type CategoryRecord = ServiceCategoryRecord;

export interface BundleDetailService {
  id: string;
  name: string;
  duration: string;
  price: string;
}

export interface BundleDetailMember {
  id: string;
  name: string;
  avatar: string;
}

export interface ServiceMember {
  id: number;
  name: string;
  avatar: string;
}

