import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import {
  initialPayments,
  initialReceipts,
  initialGiftCards,
  financialStatCardsData,
  PaymentRecord,
  ReceiptRecord,
  WebGiftCardRecord,
  getPaymentMethodStyle,
  getPaymentStatusStyle,
  getReceiptStatusStyle,
} from "@/components/finance/financeData";

// Modals
import AddPaymentModal from "@/components/finance/modals/AddPaymentModal";
import EditPaymentModal from "@/components/finance/modals/EditPaymentModal";
import DeletePaymentModal from "@/components/finance/modals/DeletePaymentModal";
import RefundPaymentModal from "@/components/finance/modals/RefundPaymentModal";
import CancelReceiptModal from "@/components/finance/modals/CancelReceiptModal";
import PrintReceiptModal from "@/components/finance/modals/PrintReceiptModal";
import AddReceiptModal from "@/components/finance/modals/AddReceiptModal";
import NewReceiptModal from "@/components/finance/modals/NewReceiptModal";
import ViewReceiptModal from "@/components/finance/modals/ViewReceiptModal";
import EditReceiptModal from "@/components/finance/modals/EditReceiptModal";
import DeleteReceiptModal from "@/components/finance/modals/DeleteReceiptModal";
import ViewGiftCardModal from "@/components/finance/modals/ViewGiftCardModal";
import EditGiftCardModal from "@/components/finance/modals/EditGiftCardModal";
import DeleteGiftCardModal from "@/components/finance/modals/DeleteGiftCardModal";

type FinanceTab = "Payments" | "Receipts" | "Gift Cards" | "Analytics";

export default function FinanceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FinanceTab>("Payments");
  const [refreshing, setRefreshing] = useState(false);

  // Datasets
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>(initialReceipts);
  const [giftCards, setGiftCards] = useState<WebGiftCardRecord[]>(initialGiftCards);

  // Filters
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [receiptStatusFilter, setReceiptStatusFilter] = useState("All");
  const [giftCardStatusFilter, setGiftCardStatusFilter] = useState("All");

  // Pagination for Gift Cards
  const [giftCardPage, setGiftCardPage] = useState(1);
  const itemsPerPage = 5;

  // Payment modals
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<PaymentRecord | null>(null);
  const [refundingPayment, setRefundingPayment] = useState<PaymentRecord | null>(null);
  const [cancellingReceiptPayment, setCancellingReceiptPayment] = useState<PaymentRecord | null>(null);
  const [printingPayment, setPrintingPayment] = useState<PaymentRecord | null>(null);

  // Receipt modals
  const [isAddReceiptOpen, setIsAddReceiptOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<ReceiptRecord | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<ReceiptRecord | null>(null);
  const [deletingReceipt, setDeletingReceipt] = useState<ReceiptRecord | null>(null);

  // Gift Card modals
  const [viewingGiftCard, setViewingGiftCard] = useState<WebGiftCardRecord | null>(null);
  const [editingGiftCard, setEditingGiftCard] = useState<WebGiftCardRecord | null>(null);
  const [deletingGiftCard, setDeletingGiftCard] = useState<WebGiftCardRecord | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleExportCSV = () => {
    Alert.alert("Export Financial Ledger", `Exporting ${payments.length} payments, ${receipts.length} receipts, and ${giftCards.length} gift cards to CSV...`);
  };

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.client.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search) ||
      p.teamMember.name.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "All" || p.method === methodFilter;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesReceipt = receiptStatusFilter === "All" || p.receiptStatus === receiptStatusFilter;
    return matchesSearch && matchesMethod && matchesStatus && matchesReceipt;
  });

  // Filtered Receipts
  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.client.name.toLowerCase().includes(search.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = receiptStatusFilter === "All" || r.status === receiptStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Gift Cards
  const filteredGiftCards = giftCards.filter((g) => {
    const matchesSearch =
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.eligibleServices.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      giftCardStatusFilter === "All" ||
      (giftCardStatusFilter === "Used" && g.status === "Used") ||
      (giftCardStatusFilter === "Active" && g.subStatus === "Active") ||
      (giftCardStatusFilter === "Expired" && g.subStatus === "Expired");
    return matchesSearch && matchesStatus;
  });

  const totalGiftCardPages = Math.ceil(filteredGiftCards.length / itemsPerPage) || 1;
  const paginatedGiftCards = filteredGiftCards.slice((giftCardPage - 1) * itemsPerPage, giftCardPage * itemsPerPage);

  return (
    <View style={styles.container}>
      <Header />

      {/* TOP HUB HEADER */}
      <View style={styles.topHubHeader}>
        <View style={styles.hubHeaderContainer}>
          <View style={styles.hubTitleRow}>
            <View style={styles.hubTitleCol}>
              <Text style={styles.hubTitle} numberOfLines={1}>Finance</Text>
              <Text style={styles.hubSubtitle} numberOfLines={1}>
                Payments, receipts, gift cards & revenue
              </Text>
            </View>

            {/* Action Buttons matching Web */}
            <View style={styles.topActionsRow}>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => router.push("/(drawer)/(tabs)/finance/automations" as any)}
                activeOpacity={0.75}
              >
                <Ionicons name="flash-outline" size={16} color="#635BFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => router.push("/(drawer)/(tabs)/finance/import" as any)}
                activeOpacity={0.75}
              >
                <Ionicons name="cloud-upload-outline" size={16} color="#635BFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportBtn}
                onPress={handleExportCSV}
                activeOpacity={0.75}
              >
                <Ionicons name="download-outline" size={14} color="#635BFF" />
                <Text style={styles.exportBtnText}>Export</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setIsAddPaymentOpen(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.addBtnText}>Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4 Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {(["Payments", "Receipts", "Gift Cards", "Analytics"] as FinanceTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* MAIN CONTENT BODY */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ========================================================================= */}
        {/* TAB 1: PAYMENTS */}
        {/* ========================================================================= */}
        {activeTab === "Payments" && (
          <View style={styles.tabSection}>
            {/* Stat Cards Carousel / Grid */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statCardsScroll}
            >
              {financialStatCardsData.map((card) => (
                <View key={card.id} style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <View style={[styles.statIconBox, { backgroundColor: card.iconBg }]}>
                      <Ionicons name={card.iconName} size={18} color={card.iconColor} />
                    </View>
                    <Text style={styles.statCardTitle}>{card.title}</Text>
                  </View>
                  <Text style={styles.statCardValue}>{card.value}</Text>
                  <Text
                    style={[
                      styles.statCardChange,
                      { color: card.isPositive ? "#16A34A" : "#D97706" },
                    ]}
                  >
                    {card.change}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Method Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsScroll}
            >
              {["All", "Cash", "Card Terminal", "Gift Card", "Online Payment"].map((m) => {
                const isSelected = methodFilter === m;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipActive,
                    ]}
                    onPress={() => setMethodFilter(m)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by client, ID or stylist..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Payments List Count */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listCountText}>
                Showing <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>{filteredPayments.length}</Text> transactions
              </Text>
              <TouchableOpacity
                style={styles.automationsQuickBtn}
                onPress={() => router.push("/(drawer)/(tabs)/finance/automations" as any)}
                activeOpacity={0.7}
              >
                <Ionicons name="flash-outline" size={13} color="#635BFF" />
                <Text style={styles.automationsQuickBtnText}>Automations</Text>
              </TouchableOpacity>
            </View>

            {/* Payments Cards List */}
            <View style={styles.cardsList}>
              {filteredPayments.map((payment) => {
                const mStyle = getPaymentMethodStyle(payment.method);
                const sStyle = getPaymentStatusStyle(payment.status);
                const rStyle = getReceiptStatusStyle(payment.receiptStatus);

                return (
                  <TouchableOpacity
                    key={payment.id}
                    style={styles.paymentCard}
                    onPress={() => router.push(`/(drawer)/(tabs)/finance/${payment.id.replace('#','')}` as any)}
                    activeOpacity={0.8}
                  >
                    {/* Top Row: Client Info & Txn ID */}
                    <View style={styles.paymentCardTop}>
                      <Avatar name={payment.client.name} uri={payment.client.avatar} size={40} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.clientName}>{payment.client.name}</Text>
                        <Text style={styles.clientMeta}>{payment.date} • {payment.teamMember.name}</Text>
                      </View>
                      <View style={styles.txnIdBadge}>
                        <Text style={styles.txnIdText}>{payment.id}</Text>
                      </View>
                    </View>

                    {/* Middle Row: Amount & Statuses */}
                    <View style={styles.paymentCardMid}>
                      <View style={styles.amountBox}>
                        <Text style={styles.amountLabel}>Total Paid</Text>
                        <Text style={styles.amountValue}>{payment.amount}</Text>
                      </View>

                      <View style={styles.badgesCol}>
                        <View style={styles.badgesRow}>
                          <View style={[styles.methodBadge, { backgroundColor: mStyle.bg }]}>
                            <Ionicons name={mStyle.icon as any} size={12} color={mStyle.text} />
                            <Text style={[styles.methodBadgeText, { color: mStyle.text }]}>
                              {payment.method}
                            </Text>
                          </View>

                          <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
                            <Text style={[styles.statusBadgeText, { color: sStyle.text }]}>
                              {payment.status}
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.receiptPill, { backgroundColor: rStyle.bg, borderColor: rStyle.border }]}>
                          <Text style={[styles.receiptPillText, { color: rStyle.text }]}>
                            Receipt: {payment.receiptStatus}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Bottom Actions Row */}
                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => setPrintingPayment(payment)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="print-outline" size={14} color="#635BFF" />
                        <Text style={styles.cardActionBtnText}>Receipt</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => setRefundingPayment(payment)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="refresh-outline" size={14} color="#D97706" />
                        <Text style={[styles.cardActionBtnText, { color: "#D97706" }]}>Refund</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cardActionBtn}
                        onPress={() => setEditingPayment(payment)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil-outline" size={14} color="#475569" />
                        <Text style={[styles.cardActionBtnText, { color: "#475569" }]}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteMiniBtn}
                        onPress={() => setDeletingPayment(payment)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: RECEIPTS */}
        {/* ========================================================================= */}
        {activeTab === "Receipts" && (
          <View style={styles.tabSection}>
            {/* Banner with Add Button */}
            <View style={styles.subBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subBannerTitle}>Fiscal Receipts</Text>
                <Text style={styles.subBannerSubtitle}>Manage electronic and thermal receipts</Text>
              </View>
              <TouchableOpacity
                style={styles.bannerActionBtn}
                onPress={() => setIsAddReceiptOpen(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.bannerActionBtnText}>Add Receipt</Text>
              </TouchableOpacity>
            </View>

            {/* Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsScroll}
            >
              {["All", "Completed", "Half Printed", "Not Issued"].map((st) => {
                const isSelected = receiptStatusFilter === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.filterChip, isSelected && styles.filterChipActive]}
                    onPress={() => setReceiptStatusFilter(st)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Receipts Cards */}
            <View style={styles.cardsList}>
              {filteredReceipts.map((receipt) => {
                const rStyle = getReceiptStatusStyle(receipt.status);
                const mStyle = getPaymentMethodStyle(receipt.method);

                return (
                  <View key={receipt.id} style={styles.receiptCard}>
                    <View style={styles.receiptCardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.receiptNumText}>{receipt.receiptNumber}</Text>
                        <Text style={styles.receiptClientText}>
                          {receipt.client.name} • {receipt.date}
                        </Text>
                      </View>
                      <View style={[styles.receiptPill, { backgroundColor: rStyle.bg, borderColor: rStyle.border }]}>
                        <Text style={[styles.receiptPillText, { color: rStyle.text }]}>{receipt.status}</Text>
                      </View>
                    </View>

                    <View style={styles.receiptCardMid}>
                      <View>
                        <Text style={styles.receiptMidLabel}>Tax ID</Text>
                        <Text style={styles.receiptMidVal}>{receipt.taxId}</Text>
                      </View>
                      <View>
                        <Text style={styles.receiptMidLabel}>Method</Text>
                        <Text style={[styles.receiptMidVal, { color: mStyle.text }]}>{receipt.method}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.receiptMidLabel}>Amount</Text>
                        <Text style={styles.receiptAmountVal}>{receipt.amount}</Text>
                      </View>
                    </View>

                    {/* Receipt Card Actions */}
                    <View style={styles.receiptActionsRow}>
                      <TouchableOpacity
                        style={styles.receiptActionBtn}
                        onPress={() => setViewingReceipt(receipt)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="eye-outline" size={14} color="#635BFF" />
                        <Text style={styles.receiptActionBtnText}>View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.receiptActionBtn}
                        onPress={() => setEditingReceipt(receipt)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil-outline" size={14} color="#475569" />
                        <Text style={[styles.receiptActionBtnText, { color: "#475569" }]}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteMiniBtn}
                        onPress={() => setDeletingReceipt(receipt)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GIFT CARDS MATCHING EXACT WEB TABLE IN IMAGE 1 */}
        {/* ========================================================================= */}
        {activeTab === "Gift Cards" && (
          <View style={styles.tabSection}>
            {/* Header with Title and Add Gift Card button matching Web */}
            <View style={styles.subBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subBannerTitle}>Gifts Cards</Text>
                <Text style={styles.subBannerSubtitle}>Manage voucher codes, usage limits and validity</Text>
              </View>
              <TouchableOpacity
                style={styles.bannerActionBtn}
                onPress={() => router.push("/(drawer)/(tabs)/finance/gift-cards/add" as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.bannerActionBtnText}>Add Gift Card</Text>
              </TouchableOpacity>
            </View>

            {/* Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsScroll}
            >
              {["All", "Active", "Expired", "Used"].map((st) => {
                const isSelected = giftCardStatusFilter === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.filterChip, isSelected && styles.filterChipActive]}
                    onPress={() => setGiftCardStatusFilter(st)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Gift Cards List matching Image 1 Table */}
            <View style={styles.cardsList}>
              {paginatedGiftCards.map((card, idx) => (
                <View key={card.id + idx} style={styles.giftCardRowCard}>
                  {/* Row 1: ID, Usage limit & Status badges */}
                  <View style={styles.giftCardRowTop}>
                    <View style={styles.giftCardIdBox}>
                      <Text style={styles.giftCardIdText}>{card.id}</Text>
                    </View>

                    <View style={styles.usageLimitCircle}>
                      <Text style={styles.usageLimitText}>{card.usageLimit}</Text>
                    </View>

                    <View style={styles.statusBadgesRow}>
                      {card.status === "Used" ? (
                        <View style={styles.usedPill}>
                          <Text style={styles.usedPillText}>Used</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", gap: 4 }}>
                          <View style={styles.noUsedPill}>
                            <Text style={styles.noUsedPillText}>No-Used</Text>
                          </View>
                          {card.subStatus === "Active" && (
                            <View style={styles.activePill}>
                              <Text style={styles.activePillText}>Active</Text>
                            </View>
                          )}
                          {card.subStatus === "Expired" && (
                            <View style={styles.expiredPill}>
                              <Text style={styles.expiredPillText}>Expired</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Row 2: Dates, Eligible Services & Amount */}
                  <View style={styles.giftCardRowMid}>
                    <View>
                      <Text style={styles.gcMidLabel}>Date of issue</Text>
                      <Text style={styles.gcMidVal}>{card.issueDate}</Text>
                    </View>

                    <View>
                      <Text style={styles.gcMidLabel}>Date of Expiration</Text>
                      <Text style={styles.gcMidVal}>{card.expirationDate}</Text>
                    </View>

                    <View>
                      <Text style={styles.gcMidLabel}>Eligible</Text>
                      <Text style={styles.gcMidVal}>{card.eligibleServices}</Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.gcMidLabel}>Amount</Text>
                      <Text style={styles.gcAmountVal}>€ {card.amount}</Text>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.giftCardRowActions}>
                    <TouchableOpacity
                      style={styles.gcActionBtn}
                      onPress={() => setViewingGiftCard(card)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={14} color="#635BFF" />
                      <Text style={styles.gcActionBtnText}>View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.gcActionBtn}
                      onPress={() => setEditingGiftCard(card)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil-outline" size={14} color="#475569" />
                      <Text style={[styles.gcActionBtnText, { color: "#475569" }]}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteMiniBtn}
                      onPress={() => setDeletingGiftCard(card)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Pagination Controls matching Web */}
            <View style={styles.paginationRow}>
              <Text style={styles.showingText}>
                Showing <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>1</Text> to{" "}
                <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>{paginatedGiftCards.length}</Text> of{" "}
                <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>{filteredGiftCards.length}</Text> gift cards
              </Text>

              <View style={styles.pageButtons}>
                <TouchableOpacity
                  style={[styles.pageBtn, giftCardPage === 1 && styles.pageBtnDisabled]}
                  disabled={giftCardPage === 1}
                  onPress={() => setGiftCardPage(giftCardPage - 1)}
                >
                  <Text style={styles.pageBtnText}>&lt; Previous</Text>
                </TouchableOpacity>

                <View style={[styles.pageNumberBtn, styles.pageNumberActive]}>
                  <Text style={styles.pageNumberTextActive}>{giftCardPage}</Text>
                </View>

                {totalGiftCardPages > 1 && (
                  <View style={styles.pageNumberBtn}>
                    <Text style={styles.pageNumberText}>2</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.pageBtn, giftCardPage >= totalGiftCardPages && styles.pageBtnDisabled]}
                  disabled={giftCardPage >= totalGiftCardPages}
                  onPress={() => setGiftCardPage(giftCardPage + 1)}
                >
                  <Text style={styles.pageBtnText}>Next &gt;</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ANALYTICS & REPORTS */}
        {/* ========================================================================= */}
        {activeTab === "Analytics" && (
          <View style={styles.tabSection}>
            <Text style={styles.sectionHeading}>Financial Health & Performance</Text>

            {/* Revenue vs Expenses Chart Card */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartTitle}>Revenue vs Expenses</Text>
                  <Text style={styles.chartSubtitle}>Comparison for current fiscal quarter</Text>
                </View>
                <View style={styles.growthBadge}>
                  <Text style={styles.growthBadgeText}>+18.4% Net Margin</Text>
                </View>
              </View>

              <View style={styles.comparisonGrid}>
                <View style={styles.compBox}>
                  <Text style={styles.compLabel}>Total Gross Revenue</Text>
                  <Text style={[styles.compVal, { color: "#16A34A" }]}>€ 48,250.00</Text>
                </View>
                <View style={styles.compBox}>
                  <Text style={styles.compLabel}>Total Salon Expenses</Text>
                  <Text style={[styles.compVal, { color: "#EF4444" }]}>€ 14,800.00</Text>
                </View>
              </View>

              <View style={styles.barProgressTrack}>
                <View style={[styles.barProgressFill, { width: "76%", backgroundColor: "#16A34A" }]} />
                <View style={[styles.barProgressFill, { width: "24%", backgroundColor: "#EF4444" }]} />
              </View>
            </View>

            {/* Payment Method Distribution */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Payment Method Distribution</Text>
              <Text style={styles.chartSubtitle}>Transaction volume share per tender type</Text>

              <View style={styles.methodBreakdownList}>
                {[
                  { name: "Card Terminal POS", share: "48%", val: "€ 23,160", color: "#0D9488" },
                  { name: "Cash Transactions", share: "28%", val: "€ 13,510", color: "#16A34A" },
                  { name: "Online Web Bookings", share: "16%", val: "€ 7,720", color: "#D97706" },
                  { name: "Gift Cards & Vouchers", share: "8%", val: "€ 3,860", color: "#635BFF" },
                ].map((item, idx) => (
                  <View key={idx} style={styles.catBarItem}>
                    <View style={styles.catBarLabelRow}>
                      <Text style={styles.catBarName}>{item.name}</Text>
                      <Text style={styles.catBarVal}>{item.val} ({item.share})</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: item.share as any, backgroundColor: item.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Expense Categories Breakdown */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Expense Breakdown</Text>
              <Text style={styles.chartSubtitle}>Monthly salon operations budget</Text>

              <View style={styles.methodBreakdownList}>
                {[
                  { name: "Staff Payroll & Salaries", share: "52%", val: "€ 7,696", color: "#635BFF" },
                  { name: "Color & Inventory Products", share: "22%", val: "€ 3,256", color: "#EC4899" },
                  { name: "Salon Rent & Utilities", share: "16%", val: "€ 2,368", color: "#3B82F6" },
                  { name: "Marketing & Software", share: "10%", val: "€ 1,480", color: "#EAB308" },
                ].map((item, idx) => (
                  <View key={idx} style={styles.catBarItem}>
                    <View style={styles.catBarLabelRow}>
                      <Text style={styles.catBarName}>{item.name}</Text>
                      <Text style={styles.catBarVal}>{item.val} ({item.share})</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: item.share as any, backgroundColor: item.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* ALL MODALS */}
      {/* ========================================================================= */}
      {/* Add Payment Modal (Exact web fields) */}
      <AddPaymentModal
        visible={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        onSave={(newPayment) => {
          setPayments([newPayment, ...payments]);
          Alert.alert("Success", `Payment #${newPayment.id} recorded successfully!`);
        }}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        visible={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        payment={editingPayment}
        onSave={(updated) => {
          setPayments(payments.map((p) => (p.id === updated.id ? updated : p)));
          Alert.alert("Success", "Payment updated!");
        }}
      />

      {/* Delete Payment Modal */}
      <DeletePaymentModal
        visible={!!deletingPayment}
        onClose={() => setDeletingPayment(null)}
        paymentId={deletingPayment?.id}
        amount={deletingPayment?.amount}
        onConfirm={() => {
          if (deletingPayment) {
            setPayments(payments.filter((p) => p.id !== deletingPayment.id));
            Alert.alert("Deleted", "Payment record removed.");
            setDeletingPayment(null);
          }
        }}
      />

      {/* Refund Modal */}
      <RefundPaymentModal
        visible={!!refundingPayment}
        onClose={() => setRefundingPayment(null)}
        payment={refundingPayment}
        onConfirmRefund={(refAmount, reason) => {
          if (refundingPayment) {
            setPayments(
              payments.map((p) =>
                p.id === refundingPayment.id
                  ? { ...p, status: "Not Paid" as const, notes: `Refunded ${refAmount}: ${reason}` }
                  : p
              )
            );
            Alert.alert("Refund Processed", `Refund of ${refAmount} processed for #${refundingPayment.id}.`);
            setRefundingPayment(null);
          }
        }}
      />

      {/* Print Receipt Modal */}
      <PrintReceiptModal
        visible={!!printingPayment}
        onClose={() => setPrintingPayment(null)}
        payment={printingPayment}
        onNavigateToReceiptView={() => {
          if (printingPayment) {
            router.push(`/(drawer)/(tabs)/finance/${printingPayment.id.replace('#','')}/receipt` as any);
          }
        }}
      />

      {/* New Receipt Modal */}
      <NewReceiptModal
        visible={isAddReceiptOpen}
        onClose={() => setIsAddReceiptOpen(false)}
      />

      {/* View Receipt Modal */}
      <ViewReceiptModal
        visible={!!viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        receipt={viewingReceipt}
      />

      {/* Edit Receipt Modal */}
      <EditReceiptModal
        visible={!!editingReceipt}
        onClose={() => setEditingReceipt(null)}
        receipt={editingReceipt}
        onSave={(updated) => {
          setReceipts(receipts.map((r) => (r.id === updated.id ? updated : r)));
          Alert.alert("Success", "Receipt updated!");
        }}
      />

      {/* Delete Receipt Modal */}
      <DeleteReceiptModal
        visible={!!deletingReceipt}
        onClose={() => setDeletingReceipt(null)}
        receiptNumber={deletingReceipt?.receiptNumber}
        amount={deletingReceipt?.amount}
        onConfirm={() => {
          if (deletingReceipt) {
            setReceipts(receipts.filter((r) => r.id !== deletingReceipt.id));
            Alert.alert("Deleted", "Receipt deleted.");
            setDeletingReceipt(null);
          }
        }}
      />

      {/* View Gift Card Modal */}
      <ViewGiftCardModal
        visible={!!viewingGiftCard}
        onClose={() => setViewingGiftCard(null)}
        giftCard={viewingGiftCard}
      />

      {/* Edit Gift Card Modal */}
      <EditGiftCardModal
        visible={!!editingGiftCard}
        onClose={() => setEditingGiftCard(null)}
        giftCard={editingGiftCard}
        onSave={(updated) => {
          setGiftCards(giftCards.map((g) => (g.id === updated.id ? updated : g)));
          Alert.alert("Success", "Gift card updated!");
        }}
      />

      {/* Delete Gift Card Modal */}
      <DeleteGiftCardModal
        visible={!!deletingGiftCard}
        onClose={() => setDeletingGiftCard(null)}
        cardCode={deletingGiftCard?.id}
        onConfirm={() => {
          if (deletingGiftCard) {
            setGiftCards(giftCards.filter((g) => g.id !== deletingGiftCard.id));
            Alert.alert("Deleted", "Gift card removed.");
            setDeletingGiftCard(null);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHubHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingTop: 10,
  },
  hubHeaderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  hubTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  hubTitleCol: {
    flex: 1,
    paddingRight: 4,
  },
  hubTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  hubSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  topActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 9,
    height: 34,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  tabsScroll: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },
  tabButton: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#635BFF",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabSection: {
    gap: 14,
  },
  statCardsScroll: {
    gap: 10,
    paddingBottom: 2,
  },
  statCard: {
    width: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 4,
  },
  statCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statCardTitle: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    flex: 1,
  },
  statCardValue: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statCardChange: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  categoryChipsScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  listCountText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  automationsQuickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  automationsQuickBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  cardsList: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clientName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  clientMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  txnIdBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  txnIdText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  paymentCardMid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  amountBox: {
    gap: 1,
  },
  amountLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  amountValue: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  badgesCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 6,
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  methodBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  receiptPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  receiptPillText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cardActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardActionBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  deleteMiniBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },

  // Receipts styles
  subBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subBannerTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subBannerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  bannerActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bannerActionBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  receiptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 10,
  },
  receiptCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  receiptNumText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  receiptClientText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  receiptCardMid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  receiptMidLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  receiptMidVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 1,
  },
  receiptAmountVal: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    marginTop: 1,
  },
  receiptActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  receiptActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  receiptActionBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Gift Cards styles matching Image 1
  giftCardRowCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 10,
  },
  giftCardRowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  giftCardIdBox: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  giftCardIdText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  usageLimitCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  usageLimitText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  statusBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  usedPill: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  usedPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  noUsedPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  noUsedPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#D97706",
  },
  activePill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activePillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#22C55E",
  },
  expiredPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F43F5E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  expiredPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  giftCardRowMid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  gcMidLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  gcMidVal: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginTop: 2,
  },
  gcAmountVal: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    marginTop: 2,
  },
  giftCardRowActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  gcActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  gcActionBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  paginationRow: {
    paddingVertical: 10,
    gap: 12,
    alignItems: "center",
  },
  showingText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  pageButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  pageNumberBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumberActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  pageNumberText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  pageNumberTextActive: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Analytics
  sectionHeading: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  chartSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  growthBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  growthBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  comparisonGrid: {
    flexDirection: "row",
    gap: 10,
  },
  compBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 2,
  },
  compLabel: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  compVal: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
  },
  barProgressTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  barProgressFill: {
    height: "100%",
  },
  methodBreakdownList: {
    gap: 10,
  },
  catBarItem: {
    gap: 4,
  },
  catBarLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catBarName: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  catBarVal: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  barTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
