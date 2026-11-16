/**
 * Contracts domain type definitions.
 */

export type ContractType = "Full Time" | "Part Time" | "Vat collaboration" | "Stage";

export type ContractStatus = "Active" | "Inactive" | "Pending";

export interface Contract {
  id: string;
  employee: {
    name: string;
    avatar: string;
  };
  salon: {
    name: string;
    logo: string;
  };
  type: ContractType;
  startDate: string;
  endDate: string;
  status: ContractStatus;
}
