import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ElectronicReceiptItem,
  INITIAL_RECEIPTS_DATA,
  RECEIPTS_SUMMARY_KPIS,
} from "@/data/financesData";

const RECEIPTS_KPIS_CONFIG = [
  {
    id: "total",
    label: "Total",
    value: RECEIPTS_SUMMARY_KPIS.total,
    sub: "Transmitted to AdE",
    icon: "cash",
    bgColor: "#EEECFF",
    iconBg: "#635BFF",
  },
  {
    id: "media",
    label: "Media",
    value: RECEIPTS_SUMMARY_KPIS.media,
    sub: "Per fiscal doc",
    icon: "calculator",
    bgColor: "#FDF2F8",
    iconBg: "#EC4899",
  },
  {
    id: "receiptsCount",
    label: "Receipts",
    value: RECEIPTS_SUMMARY_KPIS.receiptsCount,
    sub: "Fiscalized",
    icon: "document-text",
    bgColor: "#F0FDFA",
    iconBg: "#14B8A6",
  },
  {
    id: "uniqueCustomers",
    label: "Unique Customers",
    value: RECEIPTS_SUMMARY_KPIS.uniqueCustomers,
    sub: "Registered CF/PIVA",
    icon: "people",
    bgColor: "#FFFBEB",
    iconBg: "#EAB308",
  },
];

export default function FinancesReceiptsTab() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<ElectronicReceiptItem[]>(INITIAL_RECEIPTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  // Filtered receipts
  const filteredReceipts = receipts.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filteredReceipts.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentReceipts = filteredReceipts.slice(startIndex, startIndex + PAGE_SIZE);

  const handleViewReceipt = (receipt: ElectronicReceiptItem) => {
    router.push({
      pathname: "/(drawer)/(tabs)/finances/view-receipt",
      params: {
        code: receipt.code,
        client: receipt.clientName,
        salon: receipt.salon,
        amount: receipt.amount.toString(),
        date: receipt.date,
        method: receipt.method,
      },
    } as any);
  };

  const handlePrint = (receipt: ElectronicReceiptItem) => {
    Alert.alert("Print Receipt", `Sending receipt ${receipt.code} to thermal / cloud printer...`);
  };

  const getMethodBadgeStyle = (method: ElectronicReceiptItem["method"]) => {
    switch (method) {
      case "Cash":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "Card Terminal":
        return { bg: "#E0F2FE", text: "#0284C7" };
      case "Gift Card":
        return { bg: "#F3E8FF", text: "#9333EA" };
      case "Online Payment":
        return { bg: "#FEF3C7", text: "#D97706" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const getStatusBadgeStyle = (status: ElectronicReceiptItem["status"]) => {
    switch (status) {
      case "Issued":
        return { bg: "#4F46E5", text: "#FFFFFF" };
      case "Draft":
        return { bg: "#F59E0B", text: "#FFFFFF" };
      case "Canceled":
        return { bg: "#E11D48", text: "#FFFFFF" };
      default:
        return { bg: "#6B7280", text: "#FFFFFF" };
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Card with White BG and ONLY Export Button */}
      <View style={styles.headerCard}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Fiscal Receipts</Text>
          <Text style={styles.headerSubtitle}>
            Italian RT Telemetry & Agenzia delle Entrate SDI archive
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => Alert.alert("Export", "Exporting XML/PDF receipts archive...")}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={14} color="#635BFF" style={{ marginRight: 5 }} />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* 2. KPI Summary Metrics (Colored with icons matching other tabs) */}
      <View style={styles.kpiGrid}>
        {RECEIPTS_KPIS_CONFIG.map((kpi) => (
          <View
            key={kpi.id}
            style={[styles.kpiCard, { backgroundColor: kpi.bgColor }]}
          >
            <View style={styles.kpiTopRow}>
              <View style={[styles.kpiIconWrap, { backgroundColor: kpi.iconBg }]}>
                <Ionicons name={kpi.icon as any} size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiSub}>{kpi.sub}</Text>
          </View>
        ))}
      </View>

      {/* 3. Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by receipt code, customer, email..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={(txt) => {
            setSearchQuery(txt);
            setCurrentPage(1);
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 4. Receipts List (Cards) */}
      <View style={styles.cardsList}>
        {filteredReceipts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={36} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No receipts found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search criteria.</Text>
          </View>
        ) : (
          currentReceipts.map((receipt) => {
            const methodSty = getMethodBadgeStyle(receipt.method);
            const statusSty = getStatusBadgeStyle(receipt.status);

            return (
              <View key={receipt.id || receipt.code} style={styles.receiptCard}>
                {/* Header: Code & Salon on Left, Amount on Right */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.codeIconBox}>
                      <Ionicons name="receipt" size={15} color="#635BFF" />
                    </View>
                    <View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.codeText}>{receipt.code}</Text>
                        <Text style={styles.salonText}>{receipt.salon}</Text>
                      </View>
                      <Text style={styles.dateText}>{receipt.date}</Text>
                    </View>
                  </View>

                  <Text style={styles.amountText}>
                    € {receipt.amount.toFixed(2)}
                  </Text>
                </View>

                {/* Badges Row: Method & Status */}
                <View style={styles.cardBadgesRow}>
                  <View style={[styles.badgePill, { backgroundColor: methodSty.bg }]}>
                    <Text style={[styles.badgePillText, { color: methodSty.text }]}>
                      {receipt.method}
                    </Text>
                  </View>

                  <View style={[styles.badgePill, { backgroundColor: statusSty.bg }]}>
                    <Text style={[styles.badgePillText, { color: statusSty.text }]}>
                      {receipt.status}
                    </Text>
                  </View>
                </View>

                {/* Customer Details Box */}
                <View style={styles.customerBox}>
                  <View style={styles.personRow}>
                    <View style={[styles.personIcon, { backgroundColor: "#FDF2F8" }]}>
                      <Ionicons name="person" size={13} color="#DB2777" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.customerLabel}>Customer</Text>
                      <Text style={styles.customerName}>{receipt.clientName}</Text>
                      <Text style={styles.customerMeta}>{receipt.clientEmail}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.viewInvoiceBtn}
                    onPress={() => handleViewReceipt(receipt)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="eye-outline" size={14} color="#635BFF" style={{ marginRight: 4 }} />
                    <Text style={styles.viewInvoiceBtnText}>View Receipt Doc</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.printBtn}
                    onPress={() => handlePrint(receipt)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="print-outline" size={16} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 5. Pagination */}
      <View style={styles.paginationCard}>
        <Text style={styles.paginationText}>
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + PAGE_SIZE, filteredReceipts.length)} of{" "}
          {filteredReceipts.length} receipts
        </Text>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={12} color={currentPage === 1 ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pageNumBtn, currentPage === 1 && styles.pageNumBtnActive]}
            onPress={() => setCurrentPage(1)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageNumText, currentPage === 1 && styles.pageNumTextActive]}>1</Text>
          </TouchableOpacity>

          {totalPages > 1 && (
            <TouchableOpacity
              style={[styles.pageNumBtn, currentPage === 2 && styles.pageNumBtnActive]}
              onPress={() => setCurrentPage(2)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pageNumText, currentPage === 2 && styles.pageNumTextActive]}>2</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(2)}
            disabled={currentPage === totalPages}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={12} color={currentPage === totalPages ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  headerTitleWrap: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 15,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  kpiGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  kpiCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  kpiTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  kpiIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 9.5,
    color: "#6B7280",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: "#111827",
  },
  cardsList: {
    gap: 10,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  receiptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  codeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  codeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#635BFF",
  },
  salonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  dateText: {
    fontSize: 10.5,
    color: "#6B7280",
    marginTop: 1,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  customerBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  personIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  customerLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  customerName: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#111827",
  },
  customerMeta: {
    fontSize: 10,
    color: "#6B7280",
  },
  cardActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
  },
  viewInvoiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewInvoiceBtnText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#635BFF",
  },
  printBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  paginationText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageNumBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumBtnActive: {
    backgroundColor: "#635BFF",
  },
  pageNumText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  pageNumTextActive: {
    color: "#FFFFFF",
  },
});
