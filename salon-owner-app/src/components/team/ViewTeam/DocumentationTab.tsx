import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "@/components/ui/CustomSwitch";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface DocItem {
  id: string;
  title: string;
  category: string;
  badgeBg: string;
  badgeText: string;
  date: string;
  size: string;
}

const INITIAL_DOCS: DocItem[] = [
  {
    id: "1",
    title: "Employment Contract",
    category: "Contract",
    badgeBg: "#E0F2FE",
    badgeText: "#0EA5E9",
    date: "Mar 15, 2020",
    size: "1.8 MB",
  },
  {
    id: "2",
    title: "Disciplinary Letter",
    category: "Disciplinary",
    badgeBg: "#FEF3C7",
    badgeText: "#D97706",
    date: "Mar 15, 2020",
    size: "420 KB",
  },
  {
    id: "3",
    title: "Fiscal Tax Certificate",
    category: "Fiscal",
    badgeBg: "#FEE2E2",
    badgeText: "#EF4444",
    date: "Mar 15, 2020",
    size: "890 KB",
  },
  {
    id: "4",
    title: "Personal ID & Documents",
    category: "Personal",
    badgeBg: "#EEF2FF",
    badgeText: "#635BFF",
    date: "Mar 15, 2020",
    size: "2.4 MB",
  },
  {
    id: "5",
    title: "Stylist Academy Certificate",
    category: "Other",
    badgeBg: "#F1F5F9",
    badgeText: "#64748B",
    date: "Mar 15, 2020",
    size: "3.1 MB",
  },
];

const CATEGORIES = ["All", "Contract", "Disciplinary", "Fiscal", "Personal", "Other"];

export default function DocumentationTab() {
  const [activeSubTab, setActiveSubTab] = useState<"Documents" | "Waivers">("Documents");
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Waivers Settings State
  const [allowSignCustomer, setAllowSignCustomer] = useState(true);
  const [requireSignatureOnEdit, setRequireSignatureOnEdit] = useState(false);
  const [digitalStorageCompliance, setDigitalStorageCompliance] = useState(true);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Contract");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  const filteredDocs = docs.filter((doc) => {
    if (activeCategory !== "All" && doc.category !== activeCategory) return false;
    if (searchQuery.trim() && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    Alert.alert("Delete Document", `Are you sure you want to delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setDocs(docs.filter((d) => d.id !== id)),
      },
    ]);
  };

  const handlePickDocument = () => {
    Alert.alert(
      "Select Document",
      "Choose a document from device storage",
      [
        {
          text: "Staff_Agreement_2025.pdf (1.8 MB)",
          onPress: () => {
            setSelectedFile({
              name: "Staff_Agreement_2025.pdf",
              size: "1.8 MB",
              type: "PDF",
            });
            if (!uploadTitle.trim()) {
              setUploadTitle("Staff Agreement 2025");
              setUploadCategory("Contract");
            }
          },
        },
        {
          text: "Medical_Clearance_Form.pdf (520 KB)",
          onPress: () => {
            setSelectedFile({
              name: "Medical_Clearance_Form.pdf",
              size: "520 KB",
              type: "PDF",
            });
            if (!uploadTitle.trim()) {
              setUploadTitle("Medical Clearance Form");
              setUploadCategory("Personal");
            }
          },
        },
        {
          text: "Tax_Compliance_Cert.pdf (890 KB)",
          onPress: () => {
            setSelectedFile({
              name: "Tax_Compliance_Cert.pdf",
              size: "890 KB",
              type: "PDF",
            });
            if (!uploadTitle.trim()) {
              setUploadTitle("Tax Compliance Certificate");
              setUploadCategory("Fiscal");
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleUpload = () => {
    if (!uploadTitle.trim()) {
      Alert.alert("Error", "Please enter a document title or select a file.");
      return;
    }
    const created: DocItem = {
      id: Date.now().toString(),
      title: uploadTitle.trim(),
      category: uploadCategory,
      badgeBg:
        uploadCategory === "Contract"
          ? "#E0F2FE"
          : uploadCategory === "Disciplinary"
          ? "#FEF3C7"
          : uploadCategory === "Fiscal"
          ? "#FEE2E2"
          : uploadCategory === "Personal"
          ? "#EEF2FF"
          : "#F1F5F9",
      badgeText:
        uploadCategory === "Contract"
          ? "#0EA5E9"
          : uploadCategory === "Disciplinary"
          ? "#D97706"
          : uploadCategory === "Fiscal"
          ? "#EF4444"
          : uploadCategory === "Personal"
          ? "#635BFF"
          : "#64748B",
      date: "Today",
      size: selectedFile ? selectedFile.size : "1.2 MB",
    };
    setDocs([created, ...docs]);
    setIsUploadOpen(false);
    setUploadTitle("");
    setSelectedFile(null);
    Alert.alert("Success", "Document uploaded successfully.");
  };

  return (
    <View style={styles.container}>
      {/* Sub tabs: Documents vs Waivers */}
      <View style={styles.subTabContainer}>
        <TouchableOpacity
          style={[styles.subTabButton, activeSubTab === "Documents" && styles.subTabButtonActive]}
          onPress={() => setActiveSubTab("Documents")}
          activeOpacity={0.7}
        >
          <Text style={[styles.subTabText, activeSubTab === "Documents" && styles.subTabTextActive]}>
            Documents
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTabButton, activeSubTab === "Waivers" && styles.subTabButtonActive]}
          onPress={() => setActiveSubTab("Waivers")}
          activeOpacity={0.7}
        >
          <Text style={[styles.subTabText, activeSubTab === "Waivers" && styles.subTabTextActive]}>
            Waivers
          </Text>
        </TouchableOpacity>
      </View>

      {activeSubTab === "Documents" ? (
        /* Documents Section */
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleCol}>
              <Text style={styles.cardTitle}>Personnel Documents</Text>
              <Text style={styles.cardSubtitle}>
                Employment contracts, tax and disciplinary files
              </Text>
            </View>
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => setIsUploadOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.uploadBtnText}>Upload</Text>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search document name..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Pills - Scrollable single row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsScroll}
            style={styles.categoryPillsContainer}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Document list */}
          <View style={styles.docList}>
            {filteredDocs.map((doc) => (
              <View key={doc.id} style={styles.docItem}>
                <View style={styles.docLeft}>
                  <View style={styles.docIconBox}>
                    <Ionicons name="document-text-outline" size={18} color="#635BFF" />
                  </View>
                  <View style={styles.docInfoCol}>
                    <Text style={styles.docTitle} numberOfLines={1}>
                      {doc.title}
                    </Text>
                    <View style={styles.docMetaRow}>
                      <View style={[styles.docBadge, { backgroundColor: doc.badgeBg }]}>
                        <Text style={[styles.docBadgeText, { color: doc.badgeText }]}>
                          {doc.category}
                        </Text>
                      </View>
                      <View style={styles.sizePill}>
                        <Text style={styles.sizePillText}>{doc.size}</Text>
                      </View>
                      <Text style={styles.docDateText}>{doc.date}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.docActions}>
                  <TouchableOpacity
                    style={styles.docActionIcon}
                    onPress={() => Alert.alert("Download", `Downloading ${doc.title}`)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="download-outline" size={15} color="#635BFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.docActionIcon}
                    onPress={() => handleDelete(doc.id, doc.title)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={15} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {filteredDocs.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="folder-open-outline" size={36} color="#CBD5E1" />
                <Text style={styles.emptyText}>No documents found matching filter</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        /* Waivers Section */
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleCol}>
              <Text style={styles.cardTitle}>Waivers & Consents</Text>
              <Text style={styles.cardSubtitle}>
                Manage client consent authorizations handled by this member
              </Text>
            </View>
          </View>

          <View style={styles.waiverSettingsList}>
            <View style={styles.waiverSettingRow}>
              <View style={styles.waiverSettingTextCol}>
                <Text style={styles.waiverSettingTitle}>Can Sign On Behalf of Customer</Text>
                <Text style={styles.waiverSettingDesc}>
                  Allows staff to record verbal confirmation waivers
                </Text>
              </View>
              <CustomSwitch
                value={allowSignCustomer}
                onValueChange={setAllowSignCustomer}
              />
            </View>

            <View style={styles.waiverSettingRow}>
              <View style={styles.waiverSettingTextCol}>
                <Text style={styles.waiverSettingTitle}>Require Re-signature on Changes</Text>
                <Text style={styles.waiverSettingDesc}>
                  Prompt customer if treatments or chemicals change
                </Text>
              </View>
              <CustomSwitch
                value={requireSignatureOnEdit}
                onValueChange={setRequireSignatureOnEdit}
              />
            </View>

            <View style={[styles.waiverSettingRow, { borderBottomWidth: 0 }]}>
              <View style={styles.waiverSettingTextCol}>
                <Text style={styles.waiverSettingTitle}>Compliant GDPR Storage</Text>
                <Text style={styles.waiverSettingDesc}>
                  Ensure encrypted cloud archives for audit trails
                </Text>
              </View>
              <CustomSwitch
                value={digitalStorageCompliance}
                onValueChange={setDigitalStorageCompliance}
              />
            </View>
          </View>
        </View>
      )}

      {/* Upload Document Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setSelectedFile(null);
        }}
        title="Upload Document"
      >
        <View style={styles.sheetFormContainer}>
          {/* Document File Selection Dropzone */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>DOCUMENT FILE *</Text>
            {selectedFile ? (
              <View style={styles.selectedFileBox}>
                <View style={styles.selectedFileLeft}>
                  <View style={styles.fileTypeBadge}>
                    <Ionicons name="document-text" size={18} color="#635BFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.selectedFileName} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <Text style={styles.selectedFileSize}>
                      {selectedFile.size} • Ready to upload
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.dropzone}
                onPress={handlePickDocument}
                activeOpacity={0.8}
              >
                <View style={styles.dropzoneIconCircle}>
                  <Ionicons name="cloud-upload-outline" size={22} color="#635BFF" />
                </View>
                <Text style={styles.dropzoneTitle}>Tap to select document from device</Text>
                <Text style={styles.dropzoneSubtitle}>
                  Supports PDF, DOCX, PNG, JPG (up to 25 MB)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Document Title *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Certified_Stylist_Diploma.pdf"
              placeholderTextColor="#94A3B8"
              value={uploadTitle}
              onChangeText={setUploadTitle}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <View style={styles.catSelectRow}>
              {["Contract", "Fiscal", "Disciplinary", "Personal", "Other"].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catSelectBtn, uploadCategory === cat && styles.catSelectBtnActive]}
                  onPress={() => setUploadCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.catSelectBtnText, uploadCategory === cat && styles.catSelectBtnTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={handleUpload}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  subTabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  subTabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subTabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  subTabTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  cardHeaderTitleCol: {
    flex: 1,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    flexShrink: 0,
    marginTop: 2,
  },
  uploadBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  categoryPillsContainer: {
    marginBottom: 16,
  },
  categoryPillsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  categoryPillActive: {
    backgroundColor: "#EEF2FF",
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  categoryPillTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  docList: {
    gap: 10,
  },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  docLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  docIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  docInfoCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  docTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  docMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  docBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  docBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  sizePill: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sizePillText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#334155",
  },
  docDateText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  docActions: {
    flexDirection: "row",
    gap: 6,
    flexShrink: 0,
  },
  docActionIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  waiverSettingsList: {
    gap: 14,
  },
  waiverSettingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  waiverSettingTextCol: {
    flex: 1,
  },
  waiverSettingTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  waiverSettingDesc: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  sheetFormContainer: {
    gap: 14,
    paddingBottom: 8,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#334155",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  dropzone: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dropzoneIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  dropzoneTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },
  dropzoneSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    textAlign: "center",
  },
  selectedFileBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 10,
    padding: 12,
  },
  selectedFileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    gap: 10,
  },
  fileTypeBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedFileName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#166534",
  },
  selectedFileSize: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#15803D",
    marginTop: 2,
  },
  catSelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catSelectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  catSelectBtnActive: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  catSelectBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  catSelectBtnTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  sheetModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  sheetCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  sheetCancelText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  sheetSaveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSaveText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
