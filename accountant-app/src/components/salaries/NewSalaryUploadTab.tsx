import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedSalon } from "@/redux/slices/salonSlice";
import {
  ExtractedSalaryPacket,
  MOCK_EXTRACTED_SALARIES,
  subscribeToSalaryPackets,
  setUploadedPdf,
  UploadedPdfFileInfo,
} from "@/data/salariesData";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface NewSalaryUploadTabProps {
  onSuccess: () => void;
}


const SALON_UPLOAD_LIST = [
  {
    id: "1",
    name: "Glamour Beauty",
    fullName: "Glamour Beauty Roma",
    image: require("../../../assets/salons/RecentActivity1.png"),
  },
  {
    id: "2",
    name: "Style Studio",
    fullName: "Style Studio Milano",
    image: require("../../../assets/salons/RecentActivity2.png"),
  },
  {
    name: "Chic Hair & Beauty",
    fullName: "Chic Hair & Beauty",
    image: require("../../../assets/salons/RecentActivity1.png"),
  },
];

export default function NewSalaryUploadTab({ onSuccess }: NewSalaryUploadTabProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux Global Salon Selection
  const { selectedSalon } = useSelector((state: RootState) => state.salon);

  // 1: Upload PDF, 2: Extract & Review, 3: Finalize
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // File State
  const [attachedFile, setAttachedFile] = useState<UploadedPdfFileInfo | null>({
    name: "cedolini_agosto_2026.pdf",
    size: "2.4 MB",
  });

  // Extraction State
  const [isExtracting, setIsExtracting] = useState(false);
  const [salaries, setSalaries] = useState<ExtractedSalaryPacket[]>(MOCK_EXTRACTED_SALARIES);

  // Sync state when packets are updated from review screen
  useEffect(() => {
    const unsubscribe = subscribeToSalaryPackets((updatedPackets) => {
      setSalaries(updatedPackets);
    });
    return unsubscribe;
  }, []);

  // Step 2 Controls State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingPacket, setEditingPacket] = useState<ExtractedSalaryPacket | null>(null);
  const [editingCausalePacket, setEditingCausalePacket] = useState<ExtractedSalaryPacket | null>(null);
  const [tempCausale, setTempCausale] = useState("");

  // Step 3 Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  const isSalonActive = selectedSalon !== "All Salons";

  // Step Navigation Check
  const canGoToStep = (targetStep: number) => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return salaries.length > 0;
    if (targetStep === 3) return salaries.length > 0;
    return false;
  };

  // Step 1: File Pick
  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled) {
        const asset = res.assets[0];
        const sizeInMb = asset.size ? asset.size / (1024 * 1024) : 0;
        const sizeStr = asset.size
          ? sizeInMb >= 1
            ? `${sizeInMb.toFixed(2)} MB`
            : `${(asset.size / 1024).toFixed(0)} KB`
          : "2.4 MB";

        const fileInfo: UploadedPdfFileInfo = {
          name: asset.name,
          size: sizeStr,
          uri: asset.uri,
        };

        setAttachedFile(fileInfo);
        setUploadedPdf(fileInfo);
      }
    } catch (e) {
      Alert.alert("Error", "Could not select file.");
    }
  };

  // Step 1: Extract Data
  const handleStartExtraction = () => {
    if (!attachedFile) {
      Alert.alert("No File", "Please choose a Cedolini PDF file first.");
    } else {
      setIsExtracting(true);
      setTimeout(() => {
        setIsExtracting(false);
        setSalaries(MOCK_EXTRACTED_SALARIES);
        setStep(2);
      }, 1800);
    }
  };

  // Step 2: Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === salaries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(salaries.map((s) => s.id));
    }
  };

  const handleApproveSelected = () => {
    setSalaries((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, status: "Approved" } : s
      )
    );
    setSelectedIds([]);
  };

  const handleApproveSingle = (id: string) => {
    setSalaries((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Approved" } : s))
    );
  };

  // Step 2: Causale Edit
  const handleOpenEditCausale = (packet: ExtractedSalaryPacket) => {
    setEditingCausalePacket(packet);
    setTempCausale(packet.causale);
  };

  const handleSaveCausale = () => {
    if (!editingCausalePacket || !tempCausale.trim()) return;
    setSalaries((prev) =>
      prev.map((s) =>
        s.id === editingCausalePacket.id ? { ...s, causale: tempCausale.trim() } : s
      )
    );
    setEditingCausalePacket(null);
  };

  // Save Full Packet from Review Modal
  const handleSavePacketChanges = (updatedPacket: ExtractedSalaryPacket, shouldApprove = false) => {
    setSalaries((prev) =>
      prev.map((s) =>
        s.id === updatedPacket.id
          ? {
              ...updatedPacket,
              status: shouldApprove ? "Approved" : updatedPacket.status,
            }
          : s
      )
    );
    setEditingPacket(null);
  };

  // Step 3: Finalize and Submit
  const handleSubmitSalaries = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessSheet(true);
    }, 1500);
  };

  const handleSuccessDone = () => {
    setShowSuccessSheet(false);
    onSuccess();
  };

  const approvedCount = salaries.filter((s) => s.status === "Approved").length;
  const reviewCount = salaries.filter((s) => s.status === "Review").length;

  return (
    <View style={styles.container}>
      {/* 3-Step Wizard Header Bar matching SalaryUploadSteps.tsx */}
      <View style={styles.wizardBar}>
        {[
          {
            num: 1,
            title: "Upload PDF",
            desc: "Upload pay slip files",
            icon: "document-text-outline" as const,
          },
          {
            num: 2,
            title: "Extract & Review",
            desc: "Auto-extract and verify data",
            icon: "scan-outline" as const,
          },
          {
            num: 3,
            title: "Finalize",
            desc: "Confirm and submit",
            icon: "checkmark-done-circle-outline" as const,
          },
        ].map((s) => {
          const isActive = step === s.num;
          const isClickable = canGoToStep(s.num);

          return (
            <TouchableOpacity
              key={s.num}
              style={[
                styles.wizardStep,
                isActive && styles.wizardStepActive,
                !isClickable && styles.wizardStepDisabled,
              ]}
              disabled={!isClickable}
              onPress={() => isClickable && setStep(s.num as any)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.wizardIconBox,
                  isActive && styles.wizardIconBoxActive,
                  step > s.num && styles.wizardIconBoxCompleted,
                ]}
              >
                {step > s.num ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name={s.icon}
                    size={16}
                    color={isActive ? "#FFFFFF" : "#64748B"}
                  />
                )}
              </View>

              <View style={styles.wizardStepTextWrap}>
                <Text
                  style={[
                    styles.wizardStepTitle,
                    isActive && styles.wizardStepTitleActive,
                  ]}
                  numberOfLines={1}
                >
                  {s.title}
                </Text>
                <Text style={styles.wizardStepDesc} numberOfLines={1}>
                  {s.desc}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ================= STEP 1: UPLOAD PDF ================= */}
      {step === 1 && (
        <View style={styles.contentCard}>
          {/* Salon Selection Step if All Salons is selected (matches SalonSelectionWarning.tsx) */}
          {!isSalonActive ? (
            <View style={styles.salonSelectionContainer}>
              <View style={styles.salonSelectionHeader}>
                <Text style={styles.salonSelectionTitle}>Select a Salon</Text>
                <Text style={styles.salonSelectionSubtitle}>
                  To proceed with the upload, you must select a specific salon.{"\n"}
                  You cannot upload files when "All Salons" is active.
                </Text>
              </View>

              <View style={styles.salonCardsList}>
                {SALON_UPLOAD_LIST.map((salon) => (
                  <TouchableOpacity
                    key={salon.name}
                    style={styles.salonSelectionCard}
                    onPress={() => dispatch(setSelectedSalon(salon.fullName))}
                    activeOpacity={0.7}
                  >
                    <View style={styles.salonCardLeft}>
                      <View style={styles.salonCardImageWrap}>
                        <Image
                          source={salon.image}
                          style={styles.salonCardImage}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.salonCardTextWrap}>
                        <Text style={styles.salonCardName}>{salon.name}</Text>
                        <Text style={styles.salonCardSub}>Click to select</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.step1Wrap}>
              {/* Active Salon Banner with Change Option */}
              <View style={styles.activeSalonBanner}>
                <View style={styles.activeSalonLeft}>
                  <Ionicons name="business" size={16} color="#635BFF" />
                  <Text style={styles.activeSalonName}>{selectedSalon}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => dispatch(setSelectedSalon("All Salons"))}
                  style={styles.changeSalonBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.changeSalonText}>Change</Text>
                </TouchableOpacity>
              </View>
              {/* Drop PDF Area matching SalaryUploadStep1.tsx */}
              <View style={styles.dropZoneHeader}>
                <Text style={styles.dropTitle}>Drop PDF</Text>
                <Text style={styles.dropSubtitle}>
                  You can upload multiple employees in one PDF file
                </Text>
              </View>

              {/* Upload Drop Area */}
              <TouchableOpacity
                style={styles.dropBox}
                onPress={handlePickDocument}
                activeOpacity={0.8}
              >
                <View style={styles.dropIconWrap}>
                  <Ionicons name="cloud-upload-outline" size={36} color="#635BFF" />
                </View>
                <Text style={styles.dropBoxTitle}>Choose a file or tap to browse</Text>
                <Text style={styles.dropBoxSubtitle}>
                  PDF format up to 50MB (Wolters Kluwer, Zucchetti, TeamSystem)
                </Text>

                <View style={styles.browseButton}>
                  <Text style={styles.browseButtonText}>Browse File</Text>
                </View>
              </TouchableOpacity>

              {/* Sizing Info Badges matching SizingInfoBadges.tsx */}
              <View style={styles.badgesRow}>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>PDF only</Text>
                </View>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Max 50MB</Text>
                </View>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Multiple employees supported</Text>
                </View>
              </View>

              {/* Uploaded File Item matching UploadedFilesList.tsx */}
              {attachedFile && (
                <View style={styles.uploadedFileRow}>
                  <View style={styles.pdfIconWrap}>
                    <Ionicons name="document-text" size={24} color="#635BFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.uploadedFileName} numberOfLines={1}>
                      {attachedFile.name}
                    </Text>
                    <Text style={styles.uploadedFileSize}>{attachedFile.size} • Ready for OCR</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setAttachedFile(null);
                      setUploadedPdf(null);
                    }}
                    style={styles.deleteFileBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Extract Action Button */}
              <CustomButton
                title={isExtracting ? "Extracting salary data..." : "Extract Salary Data (OCR)"}
                onPress={handleStartExtraction}
                variant="primary"
                disabled={isExtracting || !attachedFile}
                style={{ marginTop: 8 }}
              />

              {/* Extracting Overlay matching ExtractingOverlay.tsx */}
              {isExtracting && (
                <View style={styles.extractingOverlay}>
                  <ActivityIndicator size="large" color="#635BFF" />
                  <Text style={styles.extractingTitle}>Extracting salary data...</Text>
                  <Text style={styles.extractingSubtitle}>
                    Processing pay slips with OCR engine...
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* ================= STEP 2: EXTRACT & REVIEW ================= */}
      {step === 2 && (
        <View style={styles.contentCard}>
          {/* Extract Status Banner matching ExtractStatusBanner.tsx */}
          <View style={styles.statusBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusBannerTitle}>
                {salaries.length} salary packets extracted from {salaries.length} pages
              </Text>
              <Text style={styles.statusBannerSub}>
                Review and approve each packet before finalizing
              </Text>
            </View>
            <View style={styles.statusBannerBadge}>
              <Text style={styles.statusBannerCount}>
                {approvedCount}/{salaries.length}
              </Text>
              <Text style={styles.statusBannerLabel}>Approved</Text>
            </View>
          </View>

          {/* Action Bar: Bulk Approve & Select All */}
          <View style={styles.step2ActionBar}>
            <Text style={styles.packetsTitle}>
              Extracted Salary Packets ({salaries.length})
            </Text>

            <View style={styles.actionControls}>
              {selectedIds.length > 0 && (
                <TouchableOpacity
                  style={styles.bulkApproveBtn}
                  onPress={handleApproveSelected}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={14} color="#059669" />
                  <Text style={styles.bulkApproveText}>
                    Approve ({selectedIds.length})
                  </Text>
                </TouchableOpacity>
              )}

              {/* Select All */}
              <TouchableOpacity
                style={styles.selectAllBtn}
                onPress={toggleSelectAll}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    selectedIds.length === salaries.length && salaries.length > 0
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={18}
                  color={
                    selectedIds.length === salaries.length && salaries.length > 0
                      ? "#635BFF"
                      : "#94A3B8"
                  }
                />
                <Text style={styles.selectAllText}>Select All</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Exact Salary Packet Cards matching Dashboard Screenshot 1:1 */}
          <View style={styles.listWrap}>
            {salaries.map((s) => {
              const isSelected = selectedIds.includes(s.id);
              const isApproved = s.status === "Approved";

              return (
                <View
                  key={s.id}
                  style={[
                    styles.exactPacketCard,
                    isSelected && styles.exactPacketCardSelected,
                  ]}
                >
                  {/* Top Row: Checkbox, Avatar, Name & Subtitle, Status Badge */}
                  <View style={styles.cardHeaderTopRow}>
                    <View style={styles.avatarAndInfoRow}>
                      <TouchableOpacity
                        onPress={() => toggleSelect(s.id)}
                        activeOpacity={0.7}
                        style={[
                          styles.checkboxSquare,
                          isSelected && styles.checkboxSquareSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>

                      <View style={styles.avatarContainer}>
                        <Text style={{ fontSize: 20 }}>{s.avatarEmoji}</Text>
                      </View>

                      <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={styles.employeeMainName} numberOfLines={1}>
                          {s.employeeName}
                        </Text>
                        <Text style={styles.employeeSubtitle}>
                          {s.pagesCount || 9} pages • {s.period}
                        </Text>
                      </View>
                    </View>

                    {/* Status Badge */}
                    <View
                      style={[
                        styles.exactStatusBadge,
                        isApproved ? styles.exactStatusBadgeApproved : styles.exactStatusBadgeReview,
                      ]}
                    >
                      <Text
                        style={[
                          styles.exactStatusBadgeText,
                          isApproved ? styles.exactStatusTextApproved : styles.exactStatusTextReview,
                        ]}
                      >
                        {s.status}
                      </Text>
                    </View>
                  </View>

                  {/* Packet Details Key-Value List with lines */}
                  <View style={styles.detailsListBlock}>
                    {/* Period */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Period</Text>
                      <Text style={styles.detailValueBold}>{s.period}</Text>
                    </View>

                    {/* Causale */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Causale</Text>
                      <TouchableOpacity
                        style={styles.causaleLinkRow}
                        onPress={() => handleOpenEditCausale(s)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.causaleLinkText} numberOfLines={1}>
                          {s.causale}
                        </Text>
                        <Ionicons name="create-outline" size={15} color="#635BFF" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>

                    {/* Net */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Net</Text>
                      <View style={styles.netPillBadge}>
                        <Text style={styles.netPillText}>€ {s.netSalary.toFixed(2)}</Text>
                      </View>
                    </View>

                    {/* Deemed */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Deemed</Text>
                      <View style={styles.deemedPillBadge}>
                        <Text style={styles.deemedPillText}>€ {s.deemed.toFixed(2)}</Text>
                      </View>
                    </View>

                    {/* Gross */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Gross</Text>
                      <View style={styles.grossPillBadge}>
                        <Text style={styles.grossPillText}>€ {s.grossSalary.toFixed(2)}</Text>
                      </View>
                    </View>

                    {/* TRF This Year */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>TRF This Year</Text>
                      <Text style={styles.detailValueBold}>€ {s.trfThisYear.toFixed(2)}</Text>
                    </View>

                    {/* TRF al 31/12/24 */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>TRF al 31/12/24</Text>
                      <Text style={styles.detailValueBold}>€ {s.trfPrevYears.toLocaleString()}</Text>
                    </View>

                    {/* CF */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>CF</Text>
                      <Text style={styles.detailValueMono}>{s.cf}</Text>
                    </View>
                  </View>

                  {/* Confidence & Mapped Status Row */}
                  <View style={styles.mappingConfidenceRow}>
                    <View style={styles.confidenceWarnBox}>
                      <Ionicons name="warning-outline" size={14} color="#D97706" />
                      <Text style={styles.confidenceWarnText}>
                        {s.confidenceLevel || "Medium"} ({s.confidence}%)
                      </Text>
                    </View>
                    <Text style={styles.mappedStatusText}>
                      {s.mapped ? "Mapped" : "Unmapped"}
                    </Text>
                  </View>

                  {/* Vendor Label */}
                  <Text style={styles.vendorSubtitle}>Vendor: {s.vendor}</Text>

                  {/* Action Buttons: Review & Approve */}
                  <View style={styles.bottomButtonsRow}>
                    <TouchableOpacity
                      style={styles.exactReviewBtn}
                      onPress={() => {
                        router.push({
                          pathname: "/(drawer)/(tabs)/salaries/review",
                          params: {
                            packetId: s.id,
                            pdfUri: attachedFile?.uri || "",
                            pdfName: attachedFile?.name || "",
                          },
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={16} color="#635BFF" />
                      <Text style={styles.exactReviewBtnText}>Review</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.exactApproveBtn,
                        isApproved && styles.exactApproveBtnDisabled,
                      ]}
                      onPress={() => !isApproved && handleApproveSingle(s.id)}
                      disabled={isApproved}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={16}
                        color={isApproved ? "#059669" : "#10B981"}
                      />
                      <Text
                        style={[
                          styles.exactApproveBtnText,
                          isApproved && styles.exactApproveTextDisabled,
                        ]}
                      >
                        {isApproved ? "Approved" : "Approve"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Step 2 Footer Navigation matching dashboard */}
          <View style={styles.stepFooter}>
            <TouchableOpacity
              style={styles.secondaryNavBtn}
              onPress={() => setStep(1)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryNavBtnText}>Upload Different File</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryNavBtn}
              onPress={() => setStep(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryNavBtnText}>Continue to Finalize</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= STEP 3: FINALIZE ================= */}
      {step === 3 && (
        <View style={styles.contentCard}>
          {/* Summary Card matching SalarySummaryCard.tsx */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>File</Text>
                <Text style={styles.summaryFileValue} numberOfLines={1}>
                  {attachedFile?.name || "cedolini_agosto_2026.pdf"}
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Packets</Text>
                <View style={styles.summaryTotalBadge}>
                  <Text style={styles.summaryTotalText}>{salaries.length}</Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Approved</Text>
                <View style={styles.summaryApprovedBadge}>
                  <Text style={styles.summaryApprovedText}>{approvedCount}</Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Needs Review</Text>
                <View style={styles.summaryReviewBadge}>
                  <Text style={styles.summaryReviewText}>{reviewCount}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Approved Packets Table / Cards matching ApprovedPacketsTable.tsx */}
          <View style={styles.approvedTableCard}>
            <Text style={styles.tableTitle}>Approved Packets Breakdown</Text>

            {salaries.map((s, index) => (
              <View key={s.id} style={{ marginBottom: 12 }}>
                <View style={styles.tableItemRow}>
                  <View style={styles.tableAvatar}>
                    <Text style={{ fontSize: 16 }}>{s.avatarEmoji}</Text>
                  </View>

                  <View style={{ flex: 1, marginHorizontal: 8 }}>
                    <Text style={styles.tableName}>{s.employeeName}</Text>
                    <Text style={styles.tableCausale}>
                      {s.period} • {s.causale}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.tableStatusPill,
                      s.status === "Approved" ? styles.exactStatusBadgeApproved : styles.exactStatusBadgeReview,
                    ]}
                  >
                    <Text
                      style={[
                        styles.exactStatusBadgeText,
                        s.status === "Approved" ? styles.exactStatusTextApproved : styles.exactStatusTextReview,
                      ]}
                    >
                      {s.status}
                    </Text>
                  </View>
                </View>

                {/* All Financial Columns for each person matching ApprovedPacketsTable.tsx */}
                <View style={styles.tableFiguresGrid}>
                  <View style={styles.tableFigBlock}>
                    <Text style={styles.tableFigLabel}>Deductions</Text>
                    <View style={styles.deemedPillBadgeSmall}>
                      <Text style={styles.deemedPillTextSmall}>€ {s.deemed.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.tableFigBlock}>
                    <Text style={styles.tableFigLabel}>Gross</Text>
                    <View style={styles.grossPillBadgeSmall}>
                      <Text style={styles.grossPillTextSmall}>€ {s.grossSalary.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.tableFigBlock}>
                    <Text style={styles.tableFigLabel}>Net</Text>
                    <View style={styles.netPillBadgeSmall}>
                      <Text style={styles.netPillTextSmall}>€ {s.netSalary.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.tableFigBlock}>
                    <Text style={styles.tableFigLabel}>TRF This Year</Text>
                    <View style={styles.tfrBadgeSmall}>
                      <Text style={styles.tfrBadgeSmallText}>€ {s.trfThisYear.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.tableFigBlock}>
                    <Text style={styles.tableFigLabel}>TRF al 31/12</Text>
                    <View style={styles.tfrPrevBadgeSmall}>
                      <Text style={styles.tfrPrevBadgeSmallText}>€ {s.trfPrevYears.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>

                {index < salaries.length - 1 && <View style={styles.tableDivider} />}
              </View>
            ))}
          </View>

          {/* Step 3 Action Footer matching dashboard */}
          <View style={styles.step3Footer}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={styles.backReviewBtn}
                onPress={() => setStep(2)}
                activeOpacity={0.8}
              >
                <Text style={styles.backReviewBtnText}>Back to Review</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportJsonBtn}
                onPress={() => {
                  Alert.alert("Export", "JSON payroll payload generated.");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.exportJsonBtnText}>Export JSON</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.sendOwnerBtn}
              onPress={handleSubmitSalaries}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendOwnerBtnText}>Send to Owner for Approval</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================= MODALS & BOTTOM SHEETS ================= */}

      {/* 1. Edit Causale Bottom Sheet matching EditCausaleModal.tsx */}
      <CustomBottomSheet
        visible={!!editingCausalePacket}
        onClose={() => setEditingCausalePacket(null)}
        title="Edit Causale Description"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalSubText}>
            Customize the payment causale description for {editingCausalePacket?.employeeName} ({editingCausalePacket?.period}).
          </Text>

          <CustomInput
            label="Payment Causale *"
            value={tempCausale}
            onChangeText={setTempCausale}
            placeholder="Stipendio Agosto 2026"
          />

          <Text style={styles.presetLabel}>Suggestions / Quick Presets:</Text>
          <View style={styles.presetsRow}>
            {[
              `Stipendio ${editingCausalePacket?.period || "Mese"}`,
              "TFR",
              `Stipendio ${editingCausalePacket?.period || "Mese"} + TFR`,
              "Tredicesima",
              "Quattordicesima",
              `Acconto Stipendio ${editingCausalePacket?.period || "Mese"}`,
              `Premio Produzione ${editingCausalePacket?.period || "Mese"}`,
            ].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={styles.presetChip}
                onPress={() => setTempCausale(preset)}
                activeOpacity={0.7}
              >
                <Text style={styles.presetChipText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setEditingCausalePacket(null)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Causale"
              onPress={handleSaveCausale}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </CustomBottomSheet>

      {/* 2. Success Popup Bottom Sheet matching SuccessModal.tsx */}
      <CustomBottomSheet
        visible={showSuccessSheet}
        onClose={handleSuccessDone}
        title="Success!"
      >
        <View style={styles.successSheetContent}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark-circle" size={56} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Salary Packets Dispatched</Text>
          <Text style={styles.successMessage}>
            {salaries.length} salary packets sent to owner for approval!
          </Text>

          <TouchableOpacity
            style={styles.successActionBtn}
            onPress={handleSuccessDone}
            activeOpacity={0.8}
          >
            <Text style={styles.successActionBtnText}>Go to Pending Salaries</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({

  // Salon Selection (Select a Salon Step)
  salonSelectionContainer: {
    paddingVertical: 8,
    alignItems: "center",
    width: "100%",
  },
  salonSelectionHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  salonSelectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  salonSelectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  salonCardsList: {
    width: "100%",
    gap: 12,
  },
  salonSelectionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  salonCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  salonCardImageWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  salonCardImage: {
    width: "100%",
    height: "100%",
  },
  salonCardTextWrap: {
    flex: 1,
  },
  salonCardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  salonCardSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 2,
  },
  activeSalonBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  activeSalonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  activeSalonName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  changeSalonBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#EEECFF",
  },
  changeSalonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },

  container: {
    flex: 1,
  },
  wizardBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 8,
  },
  wizardStep: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  wizardStepActive: {
    backgroundColor: "#F5F4FF",
    borderColor: "#C7D2FE",
  },
  wizardStepDisabled: {
    opacity: 0.5,
  },
  wizardIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  wizardIconBoxActive: {
    backgroundColor: "#635BFF",
  },
  wizardIconBoxCompleted: {
    backgroundColor: "#10B981",
  },
  wizardStepTextWrap: {
    flex: 1,
  },
  wizardStepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  wizardStepTitleActive: {
    color: "#1E293B",
  },
  wizardStepDesc: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  warningContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  warningIconWrap: {
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 6,
  },
  warningText: {
    fontSize: 13,
    color: "#B45309",
    textAlign: "center",
    lineHeight: 18,
  },
  step1Wrap: {
    position: "relative",
  },
  dropZoneHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  dropTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },
  dropSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  dropBox: {
    borderWidth: 2,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FDFDFF",
  },
  dropIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  dropBoxTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  dropBoxSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginVertical: 18,
  },
  infoBadge: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  infoBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  uploadedFileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  pdfIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  uploadedFileName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  uploadedFileSize: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  deleteFileBtn: {
    padding: 6,
  },
  extractingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  extractingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 14,
  },
  extractingSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  statusBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
  },
  statusBannerSub: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
  },
  statusBannerBadge: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  statusBannerCount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#065F46",
  },
  statusBannerLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#047857",
    textTransform: "uppercase",
    marginTop: 2,
  },
  step2ActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  packetsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  actionControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bulkApproveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  bulkApproveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  listWrap: {
    gap: 16,
  },

  // EXACT CARD STYLES MATCHING THE ATTACHED SCREENSHOT
  exactPacketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  exactPacketCardSelected: {
    borderColor: "#635BFF",
    borderWidth: 1.5,
    backgroundColor: "#FAFAFF",
  },
  cardHeaderTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  avatarAndInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxSquare: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxSquareSelected: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FBCFE8",
  },
  employeeMainName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  employeeSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  exactStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  exactStatusBadgeReview: {
    backgroundColor: "#FFFBEB",
  },
  exactStatusBadgeApproved: {
    backgroundColor: "#ECFDF5",
  },
  exactStatusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  exactStatusTextReview: {
    color: "#D97706",
  },
  exactStatusTextApproved: {
    color: "#059669",
  },

  // Key-value Details Block
  detailsListBlock: {
    marginTop: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F8FAFC",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },
  detailValueBold: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  detailValueMono: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "monospace",
    color: "#1E293B",
    letterSpacing: 0.5,
  },
  causaleLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 200,
  },
  causaleLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  netPillBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  netPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
  deemedPillBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deemedPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#EF4444",
  },
  grossPillBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  grossPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2563EB",
  },

  // Confidence & Mapped
  mappingConfidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  confidenceWarnBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  confidenceWarnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  mappedStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  vendorSubtitle: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 8,
  },

  // Bottom action buttons: Review & Approve
  bottomButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  exactReviewBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEECFF",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  exactReviewBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  exactApproveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  exactApproveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#059669",
  },
  exactApproveBtnDisabled: {
    backgroundColor: "#F1F5F9",
    opacity: 0.8,
  },
  exactApproveTextDisabled: {
    color: "#059669",
  },

  stepFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryNavBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryNavBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  primaryNavBtn: {
    flex: 1,
    backgroundColor: "#635BFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryNavBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  summaryFileValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1E293B",
  },
  summaryTotalBadge: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  summaryTotalText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  summaryApprovedBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  summaryApprovedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  summaryReviewBadge: {
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  summaryReviewText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  approvedTableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },
  tableItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  tableAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  tableName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  tableCausale: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  tableStatusPill: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tableFiguresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 8,
    gap: 6,
  },
  tableFigBlock: {
    alignItems: "flex-start",
  },
  tableFigLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  deemedPillBadgeSmall: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  deemedPillTextSmall: {
    fontSize: 10,
    fontWeight: "800",
    color: "#EF4444",
  },
  grossPillBadgeSmall: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  grossPillTextSmall: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
  },
  netPillBadgeSmall: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  netPillTextSmall: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
  },
  tfrBadgeSmall: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tfrBadgeSmallText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4F46E5",
  },
  tfrPrevBadgeSmall: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tfrPrevBadgeSmallText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#334155",
  },
  tableDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginTop: 12,
  },
  step3Footer: {
    flexDirection: "column",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
  },
  backReviewBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  backReviewBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  exportJsonBtn: {
    flex: 1,
    backgroundColor: "#EEECFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  exportJsonBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  sendOwnerBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  sendOwnerBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalSubText: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 18,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 8,
    marginBottom: 6,
  },
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  presetChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  presetChipActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#C7D2FE",
  },
  presetChipText: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "500",
  },
  presetChipTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  sheetButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 10,
  },
  successSheetContent: {
    alignItems: "center",
    paddingVertical: 16,
    width: "100%",
  },
  successIconWrap: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  successMessage: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },
  successActionBtn: {
    backgroundColor: "#635BFF",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  successActionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
