/**
 * Core financial calculations for the Accountant Portal.
 * Ensures consistent, tested financial logic for payroll, VAT, revenues, and taxes.
 */

/**
 * Calculates net salary from gross salary and deductions/withholdings (ritenute/deemed).
 * Guarantees result is non-negative and rounded to 2 decimal places.
 */
export function calculateNetSalary(grossSalary: number, deemed: number): number {
  const gross = Math.max(0, Number(grossSalary) || 0);
  const deductions = Math.max(0, Number(deemed) || 0);
  const net = Math.max(0, gross - deductions);
  return parseFloat(net.toFixed(2));
}

/**
 * Calculates total employer cost for an employee given gross salary and employer contributions.
 */
export function calculateTotalCost(
  grossSalary: number,
  contributions: {
    inps?: number;
    inail?: number;
    tfr?: number;
  } = {}
): number {
  const gross = Math.max(0, Number(grossSalary) || 0);
  const inps = Math.max(0, Number(contributions.inps) || 0);
  const inail = Math.max(0, Number(contributions.inail) || 0);
  const tfr = Math.max(0, Number(contributions.tfr) || 0);

  const total = gross + inps + inail + tfr;
  return parseFloat(total.toFixed(2));
}

/**
 * Calculates VAT amount for a taxable net amount.
 * Default Italian VAT is 22% (0.22).
 */
export function calculateVatAmount(netAmount: number, vatRate: number = 0.22): number {
  const net = Math.max(0, Number(netAmount) || 0);
  const vat = net * vatRate;
  return parseFloat(vat.toFixed(2));
}

/**
 * Calculates total invoice amount including VAT.
 */
export function calculateTotalWithVat(netAmount: number, vatRate: number = 0.22): number {
  const net = Math.max(0, Number(netAmount) || 0);
  const vat = calculateVatAmount(net, vatRate);
  return parseFloat((net + vat).toFixed(2));
}

/**
 * Computes average receipt value given total revenue and receipt transaction count.
 */
export function calculateAverageReceipt(revenue: number, count: number): number {
  if (!count || count <= 0) return 0;
  const avg = Number(revenue) / count;
  return parseFloat(avg.toFixed(2));
}

/**
 * Aggregates financial items to compute sums.
 */
export function sumBy<T>(items: T[], selector: (item: T) => number): number {
  const total = items.reduce((acc, curr) => acc + (Number(selector(curr)) || 0), 0);
  return parseFloat(total.toFixed(2));
}
