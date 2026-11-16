"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search, Repeat } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";
import { AddExpenseModal } from "@/components/budgeting/expenses/modals/AddExpenseModal";
import { RecurringPayment } from "@/components/budgeting/types";
import { INITIAL_RECURRING_PAYMENTS } from "@/components/budgeting/data";
import { RecurringPaymentsStats } from "@/components/budgeting/recurring-payments/RecurringPaymentsStats";
import { RecurringPaymentsTable } from "@/components/budgeting/recurring-payments/RecurringPaymentsTable";
import { EditRecurringPaymentModal } from "@/components/budgeting/recurring-payments/modals/EditRecurringPaymentModal";
import { DeleteRecurringPaymentModal } from "@/components/budgeting/recurring-payments/modals/DeleteRecurringPaymentModal";

export default function RecurringPaymentsPage() {
  const [payments, setPayments] = useState<RecurringPayment[]>(INITIAL_RECURRING_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [frequencyFilter, setFrequencyFilter] = useState("All Frequencies");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<RecurringPayment | null>(null);
  const [deletePayment, setDeletePayment] = useState<RecurringPayment | null>(null);

  const filteredPayments = payments.filter((item) => {
    const matchesSearch =
      item.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.macroCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Statuses" || item.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesFrequency =
      frequencyFilter === "All Frequencies" || item.frequency.toLowerCase() === frequencyFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesFrequency;
  });

  const handleToggleStatus = (id: string) => {
    setPayments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Active" ? "Paused" : "Active";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredPayments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPayments.map((p) => p.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmEdit = (updated: RecurringPayment) => {
    setPayments((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditPayment(null);
  };

  const handleConfirmDelete = () => {
    if (!deletePayment) return;
    setPayments((prev) => prev.filter((p) => p.id !== deletePayment.id));
    setSelectedIds((prev) => prev.filter((i) => i !== deletePayment.id));
    setDeletePayment(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/budgeting"
            className="p-2 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] text-[#64748B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#1E293B]">Recurring Payments</h1>
              <span className="bg-[#EEF2FF] text-[#635BFF] text-[12px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" />
                Automated
              </span>
            </div>
            <p className="text-[13px] text-[#64748B]">
              Manage fixed regular salon subscriptions, rents, utilities, and repeated expenses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#635BFF] hover:bg-[#524be0] text-white text-[13px] font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-[#635BFF]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Recurring Expense</span>
        </button>
      </div>

      {/* Stats Summary */}
      <RecurringPaymentsStats payments={payments} />

      {/* Main Content Area */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by payee, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] font-medium text-[#1E293B] placeholder-[#94A3B8] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="w-40">
              <CustomSelect
                options={["All Statuses", "Active", "Paused"]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            <div className="w-40">
              <CustomSelect
                options={["All Frequencies", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Yearly"]}
                value={frequencyFilter}
                onChange={setFrequencyFilter}
              />
            </div>

            {(searchTerm || statusFilter !== "All Statuses" || frequencyFilter !== "All Frequencies") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All Statuses");
                  setFrequencyFilter("All Frequencies");
                }}
                className="text-[12px] font-bold text-[#635BFF] hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Payments Table */}
        <RecurringPaymentsTable
          payments={filteredPayments}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onToggleStatus={handleToggleStatus}
          onEdit={(item) => setEditPayment(item)}
          onDelete={(item) => setDeletePayment(item)}
        />

        {/* Table Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-[12px] text-[#94A3B8]">
          <span>Showing {filteredPayments.length} of {payments.length} recurring schedules</span>
          <span className="font-medium text-[#64748B]">All dates formatted in DD/MM/YYYY</span>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={() => setIsAddModalOpen(false)}
        />
      )}

      {editPayment && (
        <EditRecurringPaymentModal
          payment={editPayment}
          onClose={() => setEditPayment(null)}
          onSave={handleConfirmEdit}
        />
      )}

      {deletePayment && (
        <DeleteRecurringPaymentModal
          payment={deletePayment}
          onClose={() => setDeletePayment(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
