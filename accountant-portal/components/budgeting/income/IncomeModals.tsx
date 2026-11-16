"use client";

/**
 * Re-export decomposed income modals for backward compatibility.
 * Specific modals have been extracted to components/budgeting/income/modals/
 * to improve maintainability, separation of concerns, and type safety.
 */

export { RevenueDetailModal } from "./modals/RevenueDetailModal";
export type { RevenueDetailModalProps } from "./modals/RevenueDetailModal";

export { AverageReceiptAnalysisModal } from "./modals/AverageReceiptAnalysisModal";
export type { AverageReceiptAnalysisModalProps } from "./modals/AverageReceiptAnalysisModal";

export { CashierClosureModal } from "./modals/CashierClosureModal";
export type { CashierClosureModalProps } from "./modals/CashierClosureModal";
