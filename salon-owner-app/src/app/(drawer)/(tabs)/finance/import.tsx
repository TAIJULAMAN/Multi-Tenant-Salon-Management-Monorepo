import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mockImportedReceipts = [
  { id: "#REC-001", client: "Maria Rodriguez", amount: "€ 270.00", method: "Cash", date: "5 Aug 2025", taxId: "IT98234123", status: "Completed" },
  { id: "#REC-002", client: "Leslie Alexander", amount: "€ 145.00", method: "Card Terminal", date: "5 Aug 2025", taxId: "IT98234123", status: "Completed" },
  { id: "#REC-003", client: "Eleanor Pena", amount: "€ 200.00", method: "Gift Card", date: "5 Aug 2025", taxId: "IT98234123", status: "Half Printed" },
  { id: "#REC-004", client: "Jenny Wilson", amount: "€ 310.00", method: "Card Terminal", date: "4 Aug 2025", taxId: "IT98234123", status: "Completed" },
  { id: "#REC-005", client: "Devon Lane", amount: "€ 120.00", method: "Cash", date: "4 Aug 2025", taxId: "IT98234123", status: "Completed" },
  { id: "#REC-006", client: "Guy Hawkins", amount: "€ 85.00", method: "Online Payment", date: "4 Aug 2025", taxId: "IT98234123", status: "Completed" },
];

export default function ImportReceiptsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(["#REC-001", "#REC-002"]);
  const [previewItems, setPreviewItems] = useState(mockImportedReceipts);

  const toggleSelectAll = () => {
    if (selectedIds.length === previewItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(previewItems.map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleUploadMock = () => {
    setIsFileUploaded(true);
    Alert.alert("File Attached", "fiscal_receipts_august.csv attached and verified (6 records).");
  };

  const handleRemoveFile = () => {
    setIsFileUploaded(false);
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    setPreviewItems(previewItems.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    Alert.alert("Removed", "Selected receipt rows removed from preview.");
  };

  const handleCommitImport = () => {
    Alert.alert(
      "Import Complete",
      `Successfully imported ${selectedIds.length > 0 ? selectedIds.length : previewItems.length} fiscal receipts into your ledger!`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Import Receipts</Text>
          <Text style={styles.headerSub}>Batch import fiscal receipts and bank POS statements</Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Tutorial Card */}
        <View style={styles.videoCard}>
          <View style={styles.videoPlayCircle}>
            <Ionicons name="play" size={24} color="#635BFF" style={{ marginLeft: 3 }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.videoTitle}>Receipt Import Tutorial</Text>
            <Text style={styles.videoSub}>Watch how to format your POS terminal CSV with tax IDs and tender types</Text>
          </View>
        </View>

        {/* Templates Section */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Certified Templates</Text>

          <View style={styles.templatesRow}>
            <View style={styles.templateCard}>
              <View style={styles.templateIconBox}>
                <Ionicons name="document-text-outline" size={20} color="#635BFF" />
              </View>
              <Text style={styles.templateName}>CSV Statement</Text>
              <Text style={styles.templateSize}>CSV • 120 KB</Text>
              <TouchableOpacity
                style={styles.templateBtn}
                onPress={() => Alert.alert("Downloaded", "receipts_template.csv saved.")}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={14} color="#635BFF" />
                <Text style={styles.templateBtnText}>Download</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.templateCard}>
              <View style={[styles.templateIconBox, { backgroundColor: "#DCFCE7" }]}>
                <Ionicons name="grid-outline" size={20} color="#16A34A" />
              </View>
              <Text style={styles.templateName}>Excel Ledger</Text>
              <Text style={styles.templateSize}>XLSX • 150 KB</Text>
              <TouchableOpacity
                style={[styles.templateBtn, { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }]}
                onPress={() => Alert.alert("Downloaded", "receipts_ledger.xlsx saved.")}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={14} color="#16A34A" />
                <Text style={[styles.templateBtnText, { color: "#16A34A" }]}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Upload Dropzone */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Attach Ledger File</Text>

          {!isFileUploaded ? (
            <TouchableOpacity
              style={styles.dropzone}
              onPress={handleUploadMock}
              activeOpacity={0.7}
            >
              <View style={styles.dropzoneIconCircle}>
                <Ionicons name="cloud-upload-outline" size={28} color="#635BFF" />
              </View>
              <Text style={styles.dropzoneTitle}>Tap to select or drop file</Text>
              <Text style={styles.dropzoneSub}>Supports .csv, .xlsx up to 10MB</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.fileUploadedCard}>
              <View style={styles.fileUploadedIcon}>
                <Ionicons name="document-attach-outline" size={22} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>fiscal_receipts_august.csv</Text>
                <Text style={styles.fileMeta}>6 records verified • 112 KB</Text>
              </View>
              <TouchableOpacity style={styles.removeFileBtn} onPress={handleRemoveFile}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Data Preview */}
        <View style={styles.cardSection}>
          <View style={styles.previewHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Import Preview ({previewItems.length})</Text>
              <Text style={styles.previewSub}>Select receipts to register</Text>
            </View>

            <TouchableOpacity style={styles.selectAllBtn} onPress={toggleSelectAll} activeOpacity={0.7}>
              <Ionicons
                name={selectedIds.length === previewItems.length ? "checkbox" : "square-outline"}
                size={18}
                color="#635BFF"
              />
              <Text style={styles.selectAllText}>
                {selectedIds.length === previewItems.length ? "Deselect All" : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewList}>
            {previewItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.previewRow, isSelected && styles.previewRowSelected]}
                  onPress={() => toggleSelect(item.id)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                    {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.previewItemName}>{item.client}</Text>
                    <Text style={styles.previewItemMeta}>
                      {item.id} • {item.method} • {item.date}
                    </Text>
                  </View>

                  <View style={styles.previewPriceBox}>
                    <Text style={styles.previewPriceText}>{item.amount}</Text>
                    <Text style={styles.previewTaxText}>Tax: {item.taxId}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.footerActionsRow}>
          {selectedIds.length > 0 && (
            <TouchableOpacity
              style={styles.batchDeleteBtn}
              onPress={handleBatchDelete}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={styles.batchDeleteText}>Remove ({selectedIds.length})</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.commitImportBtn}
            onPress={handleCommitImport}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
            <Text style={styles.commitImportText}>
              Import {selectedIds.length > 0 ? selectedIds.length : previewItems.length} Receipts
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  videoPlayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  videoSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  templatesRow: {
    flexDirection: "row",
    gap: 12,
  },
  templateCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  templateIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  templateName: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  templateSize: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginBottom: 8,
  },
  templateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  templateBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  dropzone: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    gap: 6,
  },
  dropzoneIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dropzoneTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dropzoneSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  fileUploadedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 10,
    padding: 12,
  },
  fileUploadedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#166534",
  },
  fileMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#15803D",
    marginTop: 1,
  },
  removeFileBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  previewSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectAllText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  previewList: {
    gap: 8,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  previewRowSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  previewItemName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  previewItemMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  previewPriceBox: {
    alignItems: "flex-end",
  },
  previewPriceText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  previewTaxText: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  footerActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  batchDeleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    borderRadius: 10,
  },
  batchDeleteText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
  commitImportBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  commitImportText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
