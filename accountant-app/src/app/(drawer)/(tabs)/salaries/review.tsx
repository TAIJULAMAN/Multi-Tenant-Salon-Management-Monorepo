import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import {
  ExtractedSalaryPacket,
  getMockSalaryPacket,
  updateMockSalaryPacket,
  MOCK_EXTRACTED_SALARIES,
  getUploadedPdf,
} from "@/data/salariesData";
import RealPdfViewer from "@/components/salaries/RealPdfViewer";

export default function ReviewSalaryPacketScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    packetId?: string;
    pdfUri?: string;
    pdfName?: string;
  }>();

  // Active uploaded PDF details
  const globalUploadedPdf = getUploadedPdf();
  const pdfUri = params.pdfUri || globalUploadedPdf?.uri;
  const pdfName =
    params.pdfName || globalUploadedPdf?.name || "Uploaded PDF Document";

  // Fetch packet
  const packetId = params.packetId || MOCK_EXTRACTED_SALARIES[0].id;
  const initialPacket =
    getMockSalaryPacket(packetId) || MOCK_EXTRACTED_SALARIES[0];

  const [packet, _setPacket] = useState<ExtractedSalaryPacket>(initialPacket);

  // Split name
  const nameParts = packet.employeeName.trim().split(/\s+/);
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [cf, setCf] = useState(packet.cf || "");
  const [period, setPeriod] = useState(packet.period || "");
  const [causale, setCausale] = useState(packet.causale || "");

  // Financial fields
  const [grossSalary, setGrossSalary] = useState(packet.grossSalary.toString());
  const [deemed, setDeemed] = useState(packet.deemed.toString());
  const [netSalary, setNetSalary] = useState(packet.netSalary.toString());
  const [tfrMonthly, setTfrMonthly] = useState(
    (packet.tfrMonthly || 0).toString()
  );
  const [trfThisYear, setTrfThisYear] = useState(packet.trfThisYear.toString());
  const [trfPrevYears, setTrfPrevYears] = useState(
    packet.trfPrevYears.toString()
  );
  const [totalTfrAmount, setTotalTfrAmount] = useState(
    packet.totalTfrAmount || "31/12/2024"
  );

  // Document Viewer State (Zoom removed from first page, pinch-to-zoom in fullscreen)
  const [docPage, setDocPage] = useState(1);
  const [totalPages, setTotalPages] = useState(packet.pagesCount || 9);
  const [isApproved, setIsApproved] = useState(packet.status === "Approved");

  // Dynamic recalculation: Gross - Deductions = Net
  const handleGrossChange = (val: string) => {
    setGrossSalary(val);
    const g = parseFloat(val) || 0;
    const d = parseFloat(deemed) || 0;
    setNetSalary(Math.max(0, g - d).toFixed(2));
  };

  const handleDeemedChange = (val: string) => {
    setDeemed(val);
    const g = parseFloat(grossSalary) || 0;
    const d = parseFloat(val) || 0;
    setNetSalary(Math.max(0, g - d).toFixed(2));
  };

  const buildUpdatedPacket = (
    statusOverride?: "Approved" | "Review"
  ): ExtractedSalaryPacket => ({
    ...packet,
    employeeName: `${firstName} ${lastName}`.trim(),
    cf: cf.toUpperCase().trim(),
    period: period.trim(),
    causale: causale.trim(),
    grossSalary: parseFloat(grossSalary) || 0,
    deemed: parseFloat(deemed) || 0,
    netSalary: parseFloat(netSalary) || 0,
    tfrMonthly: parseFloat(tfrMonthly) || 0,
    trfThisYear: parseFloat(trfThisYear) || 0,
    trfPrevYears: parseFloat(trfPrevYears) || 0,
    totalTfrAmount,
    status: statusOverride || (isApproved ? "Approved" : "Review"),
  });

  const handleSaveChanges = () => {
    const updated = buildUpdatedPacket();
    updateMockSalaryPacket(updated);
    Alert.alert("Success", "Salary packet details saved successfully.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleSaveAndApprove = () => {
    const updated = buildUpdatedPacket("Approved");
    updateMockSalaryPacket(updated);
    setIsApproved(true);
    Alert.alert(
      "Packet Approved",
      `Salary packet for ${updated.employeeName} approved.`,
      [{ text: "Back to List", onPress: () => router.back() }]
    );
  };

  const causalePresets = [
    `Stipendio ${period}`,
    "TFR",
    `Stipendio ${period} + TFR`,
    "Tredicesima",
    "Quattordicesima",
    `Premio Produzione ${period}`,
  ];

  
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* Top App Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.topBarTitleWrap}>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            Review Salary Packet
          </Text>
          <Text style={styles.topBarSubtitle} numberOfLines={1}>
            {packet.employeeName} • {packet.period}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            isApproved ? styles.statusPillApproved : styles.statusPillReview,
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              isApproved ? styles.statusTextApproved : styles.statusTextReview,
            ]}
          >
            {isApproved ? "Approved" : "Review"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= 1. UPLOADED PDF PREVIEW SECTION ================= */}
        {/* Zoom controls removed from first page as requested */}
        <View style={styles.pdfViewerCard}>
          {/* Header with Title and Preview PDF button */}
          <View style={styles.pdfViewerHeader}>
            <View style={styles.pdfHeaderLeft}>
              <Ionicons name="document-text" size={20} color="#635BFF" />
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.pdfHeaderTitle}>Pay Slip Document</Text>
                <Text style={styles.pdfHeaderSubtitle} numberOfLines={1}>
                  {pdfName}
                </Text>
              </View>
            </View>

            {/* Shifted Page Navigation to the top-right replacing Preview PDF */}
            <View style={styles.navControlsRow}>
              <TouchableOpacity
                style={[
                  styles.ctrlIconBtn,
                  docPage <= 1 && styles.ctrlDisabled,
                ]}
                disabled={docPage <= 1}
                onPress={() => setDocPage((p) => Math.max(1, p - 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={14} color="#64748B" />
              </TouchableOpacity>
              <Text style={styles.pageIndicatorText}>
                Page {docPage} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[
                  styles.ctrlIconBtn,
                  docPage >= totalPages && styles.ctrlDisabled,
                ]}
                disabled={docPage >= totalPages}
                onPress={() => setDocPage((p) => Math.min(totalPages, p + 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={14} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Real PDF Document rendered inside the card with Pinch-to-Zoom directly enabled */}
          <View style={styles.realPdfCardContainer}>
            <View style={styles.realPaperWrapper}>
              <RealPdfViewer
                sourceUri={pdfUri}
                page={docPage}
                enablePinchZoom={true}
                onLoadComplete={(num) => {
                  if (num > 0) setTotalPages(num);
                }}
                onPageChanged={(p) => setDocPage(p)}
              />
            </View>
          </View>
        </View>

        {/* ================= 2. EMPLOYEE INFORMATION CARD ================= */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={16} color="#635BFF" />
            <Text style={styles.cardTitle}>Employee Information</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Split: First Name & Last Name */}
            <View style={styles.inputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* CF (Fiscal Code) */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.labelWithConfidence}>
                <Text style={styles.label}>Codice Fiscale (CF)</Text>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidencePillText}>
                    {packet.cfConfidence || 76}% AI
                  </Text>
                </View>
              </View>
              <TextInput
                style={styles.input}
                value={cf}
                onChangeText={setCf}
                autoCapitalize="characters"
                placeholder="SPLLCA88M58F839V"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* ================= 3. PAY PERIOD CARD ================= */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={16} color="#635BFF" />
            <Text style={styles.cardTitle}>Pay Period</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.labelWithConfidence}>
              <Text style={styles.label}>Period (MM/YYYY)</Text>
              <View style={styles.confidencePill}>
                <Text style={styles.confidencePillText}>
                  {packet.periodConfidence || 83}% AI
                </Text>
              </View>
            </View>
            <TextInput
              style={styles.input}
              value={period}
              onChangeText={setPeriod}
              placeholder="08/2026"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* ================= 4. PAYMENT REASON CARD ================= */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={16} color="#635BFF" />
            <Text style={styles.cardTitle}>Causale Pagamento</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.label}>Payment Reason</Text>
            <TextInput
              style={styles.input}
              value={causale}
              onChangeText={setCausale}
              placeholder="Stipendio Agosto 2026"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>
              Quick Presets / Suggestions:
            </Text>
            <View style={styles.chipsWrap}>
              {causalePresets.map((preset) => {
                const isActive = causale.toLowerCase() === preset.toLowerCase();
                return (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setCausale(preset)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ================= 5. FINANCIAL DATA CARD ================= */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash" size={16} color="#635BFF" />
            <Text style={styles.cardTitle}>Financial Data (Live Recalculation)</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Gross Salary */}
            <View>
              <View style={styles.labelWithConfidence}>
                <Text style={styles.label}>Gross Amount (€)</Text>
                <View style={styles.confidencePillAmber}>
                  <Text style={styles.confidencePillAmberText}>
                    {packet.grossConfidence || 76}% AI
                  </Text>
                </View>
              </View>
              <TextInput
                style={styles.input}
                value={grossSalary}
                onChangeText={handleGrossChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Deductions / Deemed */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.labelWithConfidence}>
                <Text style={styles.label}>Ritenute / Deductions (€)</Text>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidencePillText}>
                    {packet.deemedConfidence || 83}% AI
                  </Text>
                </View>
              </View>
              <TextInput
                style={styles.input}
                value={deemed}
                onChangeText={handleDeemedChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Net Salary (Auto calculated) */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.labelWithConfidence}>
                <Text style={styles.label}>
                  Net Amount (€) [Gross - Deductions]
                </Text>
                <View style={styles.confidencePill}>
                  <Text style={styles.confidencePillText}>
                    {packet.netConfidence || 99}% AI
                  </Text>
                </View>
              </View>
              <TextInput
                style={[styles.input, styles.netHighlightInput]}
                value={netSalary}
                onChangeText={setNetSalary}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* TFR Monthly */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.labelWithConfidence}>
                <Text style={styles.label}>TFR Monthly Accrual (€)</Text>
                <View style={styles.confidencePillAmber}>
                  <Text style={styles.confidencePillAmberText}>
                    {packet.tfrMonthlyConfidence || 71}% AI
                  </Text>
                </View>
              </View>
              <TextInput
                style={styles.input}
                value={tfrMonthly}
                onChangeText={setTfrMonthly}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* TFR This Year */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.labelWithConfidence}>
                <Text style={styles.label}>TRF This Year (€)</Text>
                <View style={styles.confidencePillAmber}>
                  <Text style={styles.confidencePillAmberText}>
                    {packet.tfrThisYearConfidence || 71}% AI
                  </Text>
                </View>
              </View>
              <TextInput
                style={styles.input}
                value={trfThisYear}
                onChangeText={setTrfThisYear}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Split: TRF al 31/12 & Total TFR Date */}
            <View style={[styles.inputRow, { marginTop: 12 }]}>
              <View style={{ flex: 1 }}>
                <View style={styles.labelWithConfidence}>
                  <Text style={styles.label} numberOfLines={1}>
                    TRF al 31/12 (€)
                  </Text>
                  <View style={styles.confidencePillAmber}>
                    <Text style={styles.confidencePillAmberText}>
                      {packet.tfrPrevYearsConfidence || 72}%
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  value={trfPrevYears}
                  onChangeText={setTrfPrevYears}
                  keyboardType="decimal-pad"
                  placeholder="15227"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label} numberOfLines={1}>
                  Ref Date
                </Text>
                <TextInput
                  style={styles.input}
                  value={totalTfrAmount}
                  onChangeText={setTotalTfrAmount}
                  placeholder="31/12/2024"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </View>
        </View>

        {/* ================= 6. OCR METADATA CARD ================= */}
        <View style={styles.metadataCard}>
          <Text style={styles.metaTitle}>Extraction Metadata</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Payroll Vendor</Text>
            <Text style={styles.metaValue}>{packet.vendor}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Confidence Rating</Text>
            <Text style={styles.metaValue}>
              {packet.confidenceLevel || "Medium"} ({packet.confidence}%)
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Source Document</Text>
            <Text style={styles.metaValue}>{pdfName}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ================= STICKY FOOTER ACTIONS ================= */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.approveBtn, isApproved && styles.approveBtnDisabled]}
          onPress={handleSaveAndApprove}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isApproved ? "checkmark-circle" : "checkmark-circle-outline"}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.approveBtnText}>
            {isApproved ? "Approved" : "Save & Approve"}
          </Text>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  topBarTitleWrap: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  topBarSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillReview: {
    backgroundColor: "#FFFBEB",
  },
  statusPillApproved: {
    backgroundColor: "#ECFDF5",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statusTextReview: {
    color: "#D97706",
  },
  statusTextApproved: {
    color: "#059669",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // PDF Viewer Card (Zoom removed from first page)
  pdfViewerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pdfViewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  pdfHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  pdfHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  pdfHeaderSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  fullPreviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  fullPreviewBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },

  // Clean Controls Bar (NO zoom buttons here)
  viewerControlsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  navControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctrlIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: { opacity: 0.35 }, ctrlDisabled: {
    opacity: 0.4,
  },
  pageIndicatorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  uploadedFilePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  uploadedFilePillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#635BFF",
  },

  // Real PDF Preview container
  realPdfCardContainer: {
    padding: 12,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  realPaperWrapper: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 520,
    aspectRatio: 1 / 1.414,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  realPdfImage: {
    width: "100%",
    height: "100%",
  },

  // Edit Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  mappedTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  mappedTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  cardBody: {
    gap: 4,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  labelWithConfidence: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  confidencePill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  confidencePillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  confidencePillAmber: {
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  confidencePillAmberText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#D97706",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  monoInput: {
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  netHighlightInput: {
    color: "#10B981",
    fontWeight: "800",
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#C7D2FE",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  chipTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },

  // Metadata Card
  metadataCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  metaTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },

  // Bottom Action Bar
  bottomBar: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  approveBtn: {
    flex: 1.2,
    flexDirection: "row",
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  approveBtnDisabled: {
    backgroundColor: "#059669",
  },
  approveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
