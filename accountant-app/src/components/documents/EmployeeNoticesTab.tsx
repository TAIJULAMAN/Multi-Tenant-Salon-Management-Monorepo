import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {
  EmployeeNoticeItem,
  MOCK_EMPLOYEE_NOTICES,
} from "@/data/documentsData";
import CustomModal from "@/components/ui/CustomModal";

const EMPLOYEE_OPTIONS = [
  "Select Employee",
  "Jane Doe",
  "John Smith",
  "Alice Johnson",
  "Bob Williams",
  "Charlie Brown",
  "Diana Prince",
  "Ethan Hunt",
];

export default function EmployeeNoticesTab() {
  const [notices, setNotices] = useState<EmployeeNoticeItem[]>(MOCK_EMPLOYEE_NOTICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Unread" | "Read">("All");

  // Selected Notice for Details Modal
  const [selectedNotice, setSelectedNotice] = useState<EmployeeNoticeItem | null>(null);

  // Send Notice Modal State matching Web
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("Select Employee");
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [sendTitle, setSendTitle] = useState("");
  const [sendDescription, setSendDescription] = useState("");

  // Upload Notice Modal State
  const [isUploadNoticeOpen, setIsUploadNoticeOpen] = useState(false);
  const [uploadNoticeTitle, setUploadNoticeTitle] = useState("");
  const [uploadNoticeRecipient, setUploadNoticeRecipient] = useState("Select Employee");
  const [uploadEmployeeDropdownOpen, setUploadEmployeeDropdownOpen] = useState(false);
  const [attachedDoc, setAttachedDoc] = useState<{ name: string; size: string } | null>(null);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.recipient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const sizeInMb = asset.size ? asset.size / (1024 * 1024) : 0;
        const sizeStr = asset.size
          ? sizeInMb >= 1
            ? `${sizeInMb.toFixed(1)} MB`
            : `${(asset.size / 1024).toFixed(0)} KB`
          : "1.2 MB";

        setAttachedDoc({ name: asset.name, size: sizeStr });
      }
    } catch (e) {
      Alert.alert("Error", "Could not pick document.");
    }
  };

  const handleSendNoticeSubmit = () => {
    if (selectedEmployee === "Select Employee") {
      Alert.alert("Missing Employee", "Please select an employee.");
      return;
    }
    if (!sendTitle.trim()) {
      Alert.alert("Missing Title", "Please enter a notice title.");
      return;
    }
    if (!sendDescription.trim()) {
      Alert.alert("Missing Description", "Please enter notice description.");
      return;
    }

    const email = `${selectedEmployee.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const newNotice: EmployeeNoticeItem = {
      id: `n_${Date.now()}`,
      title: sendTitle,
      recipient: {
        name: selectedEmployee,
        email: email,
        avatar: `https://i.pravatar.cc/150?u=${selectedEmployee.toLowerCase().replace(/\s+/g, "")}`,
        avatarEmoji: "👤",
      },
      dateSent: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      status: "Unread",
      message: sendDescription,
      attachmentName: `${sendTitle.toLowerCase().replace(/\s+/g, "_")}.pdf`,
      attachmentSize: "1.2 MB",
    };

    setNotices([newNotice, ...notices]);
    setIsSendOpen(false);
    setSelectedEmployee("Select Employee");
    setSendTitle("");
    setSendDescription("");
    setEmployeeDropdownOpen(false);
    Alert.alert("Notice Sent", `Notice sent successfully to ${newNotice.recipient.name}.`);
  };

  const handleUploadNoticeSubmit = () => {
    if (!uploadNoticeTitle.trim()) {
      Alert.alert("Missing Title", "Please enter a notice title.");
      return;
    }
    if (uploadNoticeRecipient === "Select Employee") {
      Alert.alert("Missing Employee", "Please select a target employee.");
      return;
    }
    if (!attachedDoc) {
      Alert.alert("Missing Document", "Please select a document to upload.");
      return;
    }

    const newNotice: EmployeeNoticeItem = {
      id: `n_${Date.now()}`,
      title: uploadNoticeTitle,
      recipient: {
        name: uploadNoticeRecipient,
        email: `${uploadNoticeRecipient.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        avatar: `https://i.pravatar.cc/150?u=${uploadNoticeRecipient.toLowerCase().replace(/\s+/g, "")}`,
        avatarEmoji: "📢",
      },
      dateSent: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      status: "Unread",
      message: `Please review the attached document regarding the ${uploadNoticeTitle.toLowerCase()}. It requires your attention by the end of the week.\n\nIf you have any questions, feel free to reach out to the HR department.`,
      attachmentName: attachedDoc.name,
      attachmentSize: attachedDoc.size,
    };

    setNotices([newNotice, ...notices]);
    setIsUploadNoticeOpen(false);
    setUploadNoticeTitle("");
    setUploadNoticeRecipient("Select Employee");
    setAttachedDoc(null);
    Alert.alert("Notice Uploaded", "Document published to employee notices.");
  };

  return (
    <View style={styles.container}>
      {/* Top Header Card matching web */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Employee Notices</Text>
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity
            style={styles.uploadNoticeBtn}
            onPress={() => {
              setUploadEmployeeDropdownOpen(false);
              setIsUploadNoticeOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={15} color="#6366f1" />
            <Text style={styles.uploadNoticeBtnText}>Upload Notice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendNoticeBtn}
            onPress={() => {
              setEmployeeDropdownOpen(false);
              setIsSendOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={15} color="#FFFFFF" />
            <Text style={styles.sendNoticeBtnText}>Send Notice</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Row */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={17} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notice title, recipient..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Status Filter Chips */}
      <View style={styles.statusChipsRow}>
        {(["All", "Unread", "Read"] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statusChip, statusFilter === s && styles.statusChipActive]}
            onPress={() => setStatusFilter(s)}
            activeOpacity={0.8}
          >
            <Text style={[styles.statusChipText, statusFilter === s && styles.statusChipTextActive]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notices List */}
      <View style={styles.noticesList}>
        {filteredNotices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No notices found</Text>
            <Text style={styles.emptySub}>Broadcast a new notice or adjust filters.</Text>
          </View>
        ) : (
          filteredNotices.map((notice) => (
            <View key={notice.id} style={styles.noticeCard}>
              {/* Notice Title */}
              <Text style={styles.noticeTitle} numberOfLines={2}>
                {notice.title}
              </Text>

              {/* Recipient & Metadata Row */}
              <View style={styles.noticeBodyRow}>
                {/* Recipient Info */}
                <View style={styles.recipientInfo}>
                  {notice.recipient.avatar ? (
                    <Image
                      source={{ uri: notice.recipient.avatar }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={{ fontSize: 16 }}>{notice.recipient.avatarEmoji || "👤"}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recipientName}>{notice.recipient.name}</Text>
                    <Text style={styles.recipientEmail}>{notice.recipient.email}</Text>
                  </View>
                </View>

                {/* Date & Status & Action */}
                <View style={styles.rightMetaBox}>
                  <View style={styles.dateAndStatusCol}>
                    <Text style={styles.dateSentText}>{notice.dateSent}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        notice.status === "Read"
                          ? styles.statusBadgeRead
                          : styles.statusBadgeUnread,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          notice.status === "Read"
                            ? styles.statusTextRead
                            : styles.statusTextUnread,
                        ]}
                      >
                        {notice.status}
                      </Text>
                    </View>
                  </View>

                  {/* Eye Action Button */}
                  <TouchableOpacity
                    style={styles.actionEyeBtn}
                    onPress={() => setSelectedNotice(notice)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={16} color="#6366f1" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* ================= MODALS ================= */}

      {/* 1. Notice Details Modal matching web design */}
      {selectedNotice && (
        <CustomModal
          visible={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          title="Notice Details"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10, gap: 12 }}
          >
            {/* Notice Title */}
            <Text style={styles.modalNoticeTitle}>{selectedNotice.title}</Text>

            {/* Recipient & Meta Row with border bottom */}
            <View style={styles.modalRecipientRow}>
              <View style={styles.modalRecipientLeft}>
                {selectedNotice.recipient.avatar ? (
                  <Image
                    source={{ uri: selectedNotice.recipient.avatar }}
                    style={styles.modalAvatarImage}
                  />
                ) : (
                  <View style={styles.modalAvatarFallback}>
                    <Text style={{ fontSize: 18 }}>{selectedNotice.recipient.avatarEmoji || "👤"}</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.modalRecipientName}>
                    {selectedNotice.recipient.name}
                  </Text>
                  <Text style={styles.modalRecipientEmail}>
                    {selectedNotice.recipient.email}
                  </Text>
                </View>
              </View>

              <View style={styles.modalRecipientRight}>
                <Text style={styles.modalDateText}>{selectedNotice.dateSent}</Text>
                <View
                  style={[
                    styles.modalStatusBadge,
                    selectedNotice.status === "Read"
                      ? styles.statusBadgeRead
                      : styles.statusBadgeUnread,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalStatusText,
                      selectedNotice.status === "Read"
                        ? styles.statusTextRead
                        : styles.statusTextUnread,
                    ]}
                  >
                    {selectedNotice.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Message Body */}
            <View style={styles.modalMessageBox}>
              <Text style={styles.modalMessageText}>
                Hi {selectedNotice.recipient.name.split(" ")[0]},
                {"\n\n"}
                Please review the attached document regarding the{" "}
                {selectedNotice.title.toLowerCase()}. It requires your attention
                by the end of the week.
                {"\n\n"}
                If you have any questions, feel free to reach out to the HR
                department.
              </Text>
            </View>

            {/* Attachment Section */}
            <View style={styles.modalAttachmentSection}>
              <Text style={styles.modalAttachmentHeading}>Attachments (1)</Text>
              <View style={styles.attachmentFileCard}>
                <View style={styles.attachmentFileLeft}>
                  <View style={styles.fileIconBox}>
                    <Ionicons name="document-text-outline" size={15} color="#6366f1" />
                  </View>
                  <Text style={styles.attachmentFileName} numberOfLines={1}>
                    {selectedNotice.attachmentName ||
                      `${selectedNotice.title.toLowerCase().replace(/\s+/g, "_")}.pdf`}
                  </Text>
                </View>

                <View style={styles.attachmentButtonsRow}>
                  <TouchableOpacity
                    style={styles.fileActionBtn}
                    onPress={() =>
                      Alert.alert(
                        "Preview Document",
                        `Opening ${
                          selectedNotice.attachmentName ||
                          `${selectedNotice.title.toLowerCase().replace(/\s+/g, "_")}.pdf`
                        }...`
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={13} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.fileActionBtn}
                    onPress={() =>
                      Alert.alert(
                        "Download Document",
                        `Downloading ${
                          selectedNotice.attachmentName ||
                          `${selectedNotice.title.toLowerCase().replace(/\s+/g, "_")}.pdf`
                        }...`
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="download-outline" size={13} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </CustomModal>
      )}

      {/* 2. Send Notice Modal matching Web UI Image with clean tight spacing */}
      <CustomModal
        visible={isSendOpen}
        onClose={() => {
          setIsSendOpen(false);
          setEmployeeDropdownOpen(false);
        }}
        title="Send Notice"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 4, gap: 11 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Select Employee * */}
          <View style={[styles.fieldGroup, { zIndex: 1000 }]}>
            <Text style={styles.fieldLabel}>Select Employee *</Text>
            <View style={styles.dropdownAnchorWrap}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    selectedEmployee === "Select Employee" && styles.placeholderText,
                  ]}
                >
                  {selectedEmployee}
                </Text>
                <Ionicons
                  name={employeeDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={15}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Anchored Popover List directly below */}
              {employeeDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {EMPLOYEE_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.popoverItem,
                        selectedEmployee === item && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setSelectedEmployee(item);
                        setEmployeeDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          selectedEmployee === item && styles.popoverItemTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                      {selectedEmployee === item && (
                        <Ionicons name="checkmark" size={15} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Title * */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              value={sendTitle}
              onChangeText={setSendTitle}
              placeholder="Enter Title"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Description * */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput
              style={styles.descriptionInput}
              multiline
              numberOfLines={4}
              value={sendDescription}
              onChangeText={setSendDescription}
              placeholder="Enter notice description..."
              placeholderTextColor="#94A3B8"
              textAlignVertical="top"
            />
          </View>

          {/* Modal Footer with right aligned compact Send Notice button */}
          <View style={styles.sendNoticeFooter}>
            <TouchableOpacity
              style={styles.sendNoticeSubmitBtn}
              onPress={handleSendNoticeSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.sendNoticeSubmitBtnText}>Send Notice</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomModal>

      {/* 3. Upload Notice Modal matching Web UI with compact button sizing */}
      <CustomModal
        visible={isUploadNoticeOpen}
        onClose={() => {
          setIsUploadNoticeOpen(false);
          setUploadEmployeeDropdownOpen(false);
        }}
        title="Upload Notice File"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 4, gap: 11 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Notice Title * */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Notice Title *</Text>
            <TextInput
              style={styles.textInput}
              value={uploadNoticeTitle}
              onChangeText={setUploadNoticeTitle}
              placeholder="e.g. Health & Safety Guidelines"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Target Audience / Select Employee */}
          <View style={[styles.fieldGroup, { zIndex: 900 }]}>
            <Text style={styles.fieldLabel}>Target Audience</Text>
            <View style={styles.dropdownAnchorWrap}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setUploadEmployeeDropdownOpen(!uploadEmployeeDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    uploadNoticeRecipient === "Select Employee" && styles.placeholderText,
                  ]}
                >
                  {uploadNoticeRecipient}
                </Text>
                <Ionicons
                  name={uploadEmployeeDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={15}
                  color="#64748B"
                />
              </TouchableOpacity>

              {uploadEmployeeDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {EMPLOYEE_OPTIONS.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.popoverItem,
                        uploadNoticeRecipient === item && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setUploadNoticeRecipient(item);
                        setUploadEmployeeDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          uploadNoticeRecipient === item && styles.popoverItemTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                      {uploadNoticeRecipient === item && (
                        <Ionicons name="checkmark" size={15} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Attach Notice File */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Attach Notice File</Text>
            {attachedDoc ? (
              <View style={styles.attachedFilePill}>
                <Ionicons name="document-text" size={16} color="#635BFF" style={{ marginRight: 6 }} />
                <Text style={{ flex: 1, fontSize: 11, fontWeight: "600", color: "#334155" }} numberOfLines={1}>
                  {attachedDoc.name}
                </Text>
                <TouchableOpacity onPress={() => setAttachedDoc(null)}>
                  <Ionicons name="close-circle" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.attachBtn} onPress={handlePickDocument} activeOpacity={0.8}>
                <Ionicons name="cloud-upload-outline" size={17} color="#635BFF" style={{ marginRight: 6 }} />
                <Text style={styles.attachBtnText}>Browse Notice PDF / Document</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Compact Buttons */}
          <View style={styles.modalBtnsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsUploadNoticeOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleUploadNoticeSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSubmitBtnText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 28,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  uploadNoticeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 7,
  },
  uploadNoticeBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6366f1",
  },
  sendNoticeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#6366f1",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 7,
  },
  sendNoticeBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
  },
  statusChipsRow: {
    flexDirection: "row",
    gap: 6,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },
  statusChipTextActive: {
    color: "#FFFFFF",
  },
  noticesList: {
    gap: 10,
  },
  noticeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 8,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  noticeBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#F1F5F9",
  },
  avatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  recipientName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  recipientEmail: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  rightMetaBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateAndStatusCol: {
    alignItems: "flex-end",
    gap: 3,
  },
  dateSentText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  statusBadgeRead: {
    backgroundColor: "#eafff5",
  },
  statusBadgeUnread: {
    backgroundColor: "#fffbf0",
  },
  statusText: {
    fontSize: 8.5,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statusTextRead: {
    color: "#22c55e",
  },
  statusTextUnread: {
    color: "#facc15",
  },
  actionEyeBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginTop: 6,
  },
  emptySub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },

  /* Details Modal Styles matching Web */
  modalNoticeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  modalRecipientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalRecipientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  modalAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  modalAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalRecipientName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  modalRecipientEmail: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  modalRecipientRight: {
    alignItems: "flex-end",
    gap: 3,
  },
  modalDateText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  modalStatusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  modalStatusText: {
    fontSize: 8.5,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  modalMessageBox: {
    paddingVertical: 2,
  },
  modalMessageText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    fontWeight: "500",
  },
  modalAttachmentSection: {
    gap: 6,
  },
  modalAttachmentHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  attachmentFileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 10,
    padding: 8,
  },
  attachmentFileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 6,
  },
  fileIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentFileName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
  attachmentButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  fileActionBtn: {
    width: 26,
    height: 26,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Send Notice Form Styles matching Web UI */
  fieldGroup: {
    gap: 4,
    position: "relative",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    fontSize: 12,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 80,
    fontSize: 12,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  dropdownAnchorWrap: {
    position: "relative",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    backgroundColor: "#FFFFFF",
  },
  dropdownButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1E293B",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  popoverMenu: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 4,
    zIndex: 99999,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  popoverItemActive: {
    backgroundColor: "#F4F3FF",
  },
  popoverItemText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#475569",
  },
  popoverItemTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  sendNoticeFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  sendNoticeSubmitBtn: {
    backgroundColor: "#5453E8",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5453E8",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  sendNoticeSubmitBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Upload Modal Elements */
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9FF",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingVertical: 10,
  },
  attachBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  attachedFilePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modalBtnsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  modalSubmitBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmitBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
