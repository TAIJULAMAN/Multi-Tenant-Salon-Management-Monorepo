import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomButton from "@/components/ui/CustomButton";
import CustomModal from "@/components/ui/CustomModal";

interface StagedPayment {
  id: string;
  client: string;
  amount: string;
  method: string;
  date: string;
  status: "Valid" | "Warning" | "Mapped";
}

const MOCK_STAGED: StagedPayment[] = [
  { id: "#IMP-001", client: "Chiara Ferrari", amount: "€85.00", method: "SumUp Card", date: "5 Aug 2025", status: "Valid" },
  { id: "#IMP-002", client: "Marco Bellini", amount: "€35.00", method: "Cash", date: "5 Aug 2025", status: "Valid" },
  { id: "#IMP-003", client: "Elena Bianchi", amount: "€140.00", method: "Nexi POS", date: "5 Aug 2025", status: "Mapped" },
  { id: "#IMP-004", client: "Unknown (Walk-in)", amount: "€25.00", method: "Cash", date: "4 Aug 2025", status: "Warning" },
];

export default function ImportPaymentsScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [stagedList, setStagedList] = useState<StagedPayment[]>([]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const handlePickFile = () => {
    // Simulate picking a CSV/Excel file
    setSelectedFile({
      name: "salon_pos_export_august.csv",
      size: "100 KB",
    });
    setStagedList(MOCK_STAGED);
    Alert.alert("File Selected", "Attached salon_pos_export_august.csv (4 records parsed).");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setStagedList([]);
  };

  const handleDownloadTemplate = (name: string) => {
    Alert.alert("Download Template", `${name} downloaded successfully to your device.`);
  };

  const handlePreviewTemplate = (name: string) => {
    setPreviewTemplate(name);
  };

  const handleSaveImport = () => {
    Alert.alert(
      "Import Completed",
      `Successfully imported ${stagedList.length} transactions into Salon payments ledger.`,
      [
        {
          text: "Back to Payments",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* 1. Header Bar matching Image */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtnRow}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#1E293B" />
          <Text style={styles.headerTitle}>Import Services</Text>
        </TouchableOpacity>

        {/* Breadcrumb pill */}
        <View style={styles.breadcrumbPill}>
          <Ionicons name="home-outline" size={13} color="#635BFF" />
          <Text style={styles.breadcrumbDivider}>/</Text>
          <Text style={styles.breadcrumbText}>Payments</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Hero Video / Media Banner */}
        <View style={styles.videoBannerContainer}>
          {/* Dark purple glow styled hero banner matching screenshot */}
          <View style={styles.videoBannerGradient}>
            <View style={styles.videoBannerHeader}>
              <Text style={styles.bannerBadge}>IMPORT HISTORY</Text>
              <Text style={styles.bannerStat}>● 42%   ● 28%   ● 15%</Text>
            </View>

            <View style={styles.bannerCenterContent}>
              <View style={styles.bannerTextCol}>
                <Text style={styles.bannerMainTitle}>PAYMENTS</Text>
                <Text style={styles.bannerSubTitle}>FAST!</Text>
              </View>

              {/* Play Button Overlay */}
              <TouchableOpacity
                style={styles.playButtonCircle}
                onPress={() => {
                  setIsPlayingVideo(!isPlayingVideo);
                  Alert.alert(
                    isPlayingVideo ? "Paused" : "Playing Tutorial",
                    "How to fast import POS transactions and receipts step-by-step."
                  );
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlayingVideo ? "pause" : "play"}
                  size={26}
                  color="#FFFFFF"
                  style={{ marginLeft: isPlayingVideo ? 0 : 3 }}
                />
              </TouchableOpacity>

              <View style={styles.bannerRightCol}>
                <Text style={styles.bannerCashFlowText}>CASH FLOW</Text>
                <View style={styles.miniChartBarRow}>
                  <View style={[styles.miniBar, { height: 16 }]} />
                  <View style={[styles.miniBar, { height: 26 }]} />
                  <View style={[styles.miniBar, { height: 38 }]} />
                  <View style={[styles.miniBar, { height: 48 }]} />
                </View>
              </View>
            </View>

            {/* Video bottom player bar */}
            <View style={styles.videoBottomBar}>
              <Ionicons name="play" size={12} color="#CBD5E1" />
              <View style={styles.videoProgressBar}>
                <View style={styles.videoProgressFill} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="volume-medium-outline" size={14} color="#CBD5E1" />
                <Ionicons name="expand-outline" size={14} color="#CBD5E1" />
                <Ionicons name="ellipsis-vertical" size={14} color="#CBD5E1" />
              </View>
            </View>
          </View>
        </View>

        {/* 3. Templates Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Templates</Text>

          <View style={styles.templatesGrid}>
            {/* Card 1: CSV Template */}
            <View style={styles.templateCard}>
              <View style={styles.templateIconBox}>
                <Ionicons name="document-text" size={22} color="#635BFF" />
              </View>
              <Text style={styles.templateTitle}>CSV Template</Text>
              <Text style={styles.templateMeta}>CSV • 100 KB</Text>

              <View style={styles.templateActionsRow}>
                <TouchableOpacity
                  style={styles.templateActionBtn}
                  onPress={() => handlePreviewTemplate("CSV Template")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={15} color="#635BFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.templateActionBtn}
                  onPress={() => handleDownloadTemplate("CSV Template")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={15} color="#635BFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 2: Filled CSV Example */}
            <View style={styles.templateCard}>
              <View style={styles.templateIconBox}>
                <Ionicons name="document-text" size={22} color="#635BFF" />
              </View>
              <Text style={styles.templateTitle}>Filled CSV Example</Text>
              <Text style={styles.templateMeta}>CSV • 100 KB</Text>

              <View style={styles.templateActionsRow}>
                <TouchableOpacity
                  style={styles.templateActionBtn}
                  onPress={() => handlePreviewTemplate("Filled CSV Example")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={15} color="#635BFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.templateActionBtn}
                  onPress={() => handleDownloadTemplate("Filled CSV Example")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={15} color="#635BFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Upload Data File Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeading}>Upload Data File</Text>

          <View style={styles.uploadOuterCard}>
            {selectedFile ? (
              <View style={styles.uploadedFileBox}>
                <View style={styles.uploadedFileIcon}>
                  <Ionicons name="document-text" size={24} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.uploadedFileName}>{selectedFile.name}</Text>
                  <Text style={styles.uploadedFileSize}>{selectedFile.size}</Text>
                </View>
                <TouchableOpacity onPress={handleRemoveFile} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.dropzoneContainer}
                onPress={handlePickFile}
                activeOpacity={0.8}
              >
                <View style={styles.wandIconBox}>
                  <Ionicons name="color-wand-outline" size={24} color="#635BFF" />
                </View>
                <Text style={styles.dropzoneText}>Drop here or click to browse</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 5. Parsed Records Staging Preview (if file uploaded) */}
        {stagedList.length > 0 && (
          <View style={styles.stagingSection}>
            <View style={styles.stagingHeaderRow}>
              <Text style={styles.stagingTitle}>
                Ready to Import ({stagedList.length} rows)
              </Text>
              <Text style={styles.stagingSubtitle}>Verified format</Text>
            </View>

            <View style={styles.stagedListContainer}>
              {stagedList.map((item) => (
                <View key={item.id} style={styles.stagedItemRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.stagedId}>{item.id}</Text>
                      <Text style={styles.stagedClient}>{item.client}</Text>
                    </View>
                    <Text style={styles.stagedDate}>
                      {item.date} • {item.method}
                    </Text>
                  </View>
                  <Text style={styles.stagedAmount}>{item.amount}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      item.status === "Valid" && { backgroundColor: "#DCFCE7" },
                      item.status === "Mapped" && { backgroundColor: "#E0F2FE" },
                      item.status === "Warning" && { backgroundColor: "#FEF3C7" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        item.status === "Valid" && { color: "#16A34A" },
                        item.status === "Mapped" && { color: "#0284C7" },
                        item.status === "Warning" && { color: "#D97706" },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <CustomButton
              title="Save & Import Records"
              onPress={handleSaveImport}
              variant="primary"
              style={{ marginTop: 14 }}
            />
          </View>
        )}
      </ScrollView>

      {/* Template Preview Modal */}
      <CustomModal
        visible={previewTemplate !== null}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate || "Template Preview"}
      >
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 18 }}>
            Sample columns format for {previewTemplate}:
          </Text>
          <View style={styles.previewTableBox}>
            <Text style={styles.previewTableHead}>Date | Client | Amount | Method | Salon</Text>
            <Text style={styles.previewTableRow}>2025-08-05 | Maria Rodriguez | €170.00 | Cash | Glamour Beauty</Text>
            <Text style={styles.previewTableRow}>2025-08-05 | Sofia Bianchi | €85.00 | Card | Style Studio</Text>
            <Text style={styles.previewTableRow}>2025-08-04 | Devon Lane | €120.00 | Online | Glamour Beauty</Text>
          </View>

          <CustomButton
            title="Download Template CSV"
            onPress={() => {
              const name = previewTemplate || "Template";
              setPreviewTemplate(null);
              handleDownloadTemplate(name);
            }}
            variant="primary"
            style={{ marginTop: 8 }}
          />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
  },
  breadcrumbPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  breadcrumbDivider: {
    fontSize: 11,
    color: "#94A3B8",
  },
  breadcrumbText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#635BFF",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 18,
    paddingBottom: 40,
  },
  videoBannerContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  videoBannerGradient: {
    backgroundColor: "#160B2C",
    padding: 16,
    borderRadius: 16,
    minHeight: 180,
    justifyContent: "space-between",
    position: "relative",
    borderWidth: 1,
    borderColor: "#3B2068",
  },
  videoBannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerBadge: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#A78BFA",
    letterSpacing: 0.6,
  },
  bannerStat: {
    fontSize: 10,
    fontWeight: "700",
    color: "#C4B5FD",
  },
  bannerCenterContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 14,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerMainTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  bannerSubTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#818CF8",
    lineHeight: 28,
  },
  playButtonCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  bannerRightCol: {
    alignItems: "flex-end",
    flex: 1,
  },
  bannerCashFlowText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#C4B5FD",
    marginBottom: 4,
  },
  miniChartBarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 50,
  },
  miniBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: "#A855F7",
  },
  videoBottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  videoProgressBar: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  videoProgressFill: {
    width: "40%",
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#635BFF",
  },
  sectionContainer: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
  },
  templatesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  templateCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 6,
  },
  templateIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  templateTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  templateMeta: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
  templateActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  templateActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadOuterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropzoneContainer: {
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#FAFAFF",
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  wandIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#635BFF",
  },
  uploadedFileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  uploadedFileIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadedFileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  uploadedFileSize: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  stagingSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 10,
  },
  stagingHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stagingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },
  stagingSubtitle: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },
  stagedListContainer: {
    gap: 8,
  },
  stagedItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 8,
  },
  stagedId: {
    fontSize: 12,
    fontWeight: "800",
    color: "#635BFF",
  },
  stagedClient: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  stagedDate: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 1,
  },
  stagedAmount: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: "700",
  },
  previewTableBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  previewTableHead: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 4,
  },
  previewTableRow: {
    fontSize: 10.5,
    color: "#4B5563",
  },
});
