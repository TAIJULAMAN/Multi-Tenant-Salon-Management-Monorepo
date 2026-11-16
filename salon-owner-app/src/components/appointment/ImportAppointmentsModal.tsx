import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CalAppointment } from "./types";
import Avatar from "@/components/Avatar";

interface Props {
  visible: boolean;
  onClose: () => void;
  onImportSuccess: (imported: CalAppointment[]) => void;
}

const sampleImportData: CalAppointment[] = [
  {
    id: `imp-1-${Date.now()}`,
    staffId: "st1",
    clientName: "David Miller",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    clientPhone: "+1 555 492 1122",
    service: "Haircut & Blowdry",
    startTime: "15:00",
    endTime: "16:00",
    duration: "60 min",
    price: "€ 50",
    status: "Confirmed",
    paymentStatus: "Paid",
    notes: "Imported via CSV file.",
    date: "2026-02-13",
  },
  {
    id: `imp-2-${Date.now()}`,
    staffId: "st2",
    clientName: "Chloe Martin",
    clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    clientPhone: "+1 555 831 9901",
    service: "Anti-Aging Firming Facial",
    startTime: "12:30",
    endTime: "13:45",
    duration: "75 min",
    price: "€ 170",
    status: "Booked",
    paymentStatus: "Unpaid",
    notes: "First time client imported.",
    date: "2026-02-13",
  },
  {
    id: `imp-3-${Date.now()}`,
    staffId: "st3",
    clientName: "Alexander Wright",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    clientPhone: "+1 555 902 4433",
    service: "Beard Trim & Grooming",
    startTime: "16:15",
    endTime: "17:00",
    duration: "45 min",
    price: "€ 35",
    status: "Booked",
    paymentStatus: "Paid",
    notes: "Imported schedule.",
    date: "2026-02-13",
  },
];

export default function ImportAppointmentsModal({
  visible,
  onClose,
  onImportSuccess,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    sampleImportData.map((d) => d.id)
  );
  const [fileAttached, setFileAttached] = useState(true);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sampleImportData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sampleImportData.map((d) => d.id));
    }
  };

  const handleCommit = () => {
    const toImport = sampleImportData.filter((d) => selectedIds.includes(d.id));
    if (toImport.length === 0) {
      Alert.alert("Selection Required", "Please select at least one appointment to import.");
      return;
    }
    onImportSuccess(toImport);
    Alert.alert(
      "Import Complete",
      `Successfully added ${toImport.length} appointments to your schedule!`,
      [{ text: "Done", onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={22} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Import Appointments</Text>
            <Text style={styles.headerSub}>CSV / Excel Schedule Batch Import</Text>
          </View>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* File Upload Dropzone Card */}
          <View style={styles.dropzoneCard}>
            <View style={styles.dropzoneIconCircle}>
              <Ionicons name="cloud-upload" size={28} color="#635BFF" />
            </View>
            <Text style={styles.dropzoneTitle}>
              {fileAttached ? "appointments_export_feb2026.csv" : "Select CSV / XLSX File"}
            </Text>
            <Text style={styles.dropzoneSubtitle}>
              {fileAttached
                ? "3 valid appointment records detected"
                : "Drag and drop or tap to browse your device files"}
            </Text>

            <View style={styles.dropzoneActions}>
              <TouchableOpacity
                style={styles.browseFileBtn}
                onPress={() => {
                  setFileAttached(true);
                  setSelectedIds(sampleImportData.map((d) => d.id));
                  Alert.alert("File Parsed", "Loaded 3 appointment records ready for import.");
                }}
              >
                <Ionicons name="document-attach-outline" size={16} color="#635BFF" />
                <Text style={styles.browseFileBtnText}>
                  {fileAttached ? "Re-upload File" : "Choose File"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadTemplateBtn}
                onPress={() =>
                  Alert.alert(
                    "Template Ready",
                    "Standard appointment CSV header template format: Date, StartTime, EndTime, Client, Service, Staff, Price, Status"
                  )
                }
              >
                <Ionicons name="download-outline" size={16} color="#4B5563" />
                <Text style={styles.downloadTemplateBtnText}>CSV Template</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preview Table Header */}
          <View style={styles.previewHeaderRow}>
            <View>
              <Text style={styles.previewSectionTitle}>Records Preview</Text>
              <Text style={styles.previewSectionSub}>
                Selected: {selectedIds.length} of {sampleImportData.length}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.selectAllBtn}
              onPress={toggleSelectAll}
            >
              <Text style={styles.selectAllText}>
                {selectedIds.length === sampleImportData.length
                  ? "Deselect All"
                  : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Records List */}
          <View style={styles.recordsList}>
            {sampleImportData.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.recordCard,
                    isSelected && styles.recordCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => toggleSelect(item.id)}
                >
                  <View style={styles.checkboxContainer}>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={20}
                      color={isSelected ? "#635BFF" : "#9CA3AF"}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.recordTopRow}>
                      <Avatar
                        name={item.clientName}
                        uri={item.clientAvatar}
                        size={22}
                      />
                      <Text style={styles.recordClientName}>{item.clientName}</Text>
                      <View style={styles.recordStatusBadge}>
                        <Text style={styles.recordStatusText}>{item.status}</Text>
                      </View>
                    </View>

                    <Text style={styles.recordServiceText}>{item.service}</Text>

                    <View style={styles.recordMetaRow}>
                      <Text style={styles.recordTime}>
                        {item.startTime} - {item.endTime} ({item.duration})
                      </Text>
                      <Text style={styles.recordPrice}>{item.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.importBtn}
            onPress={handleCommit}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.importBtnText}>
              Import {selectedIds.length} Appointments
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  titleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  headerSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  dropzoneCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#DDD6FE",
    borderStyle: "dashed",
    padding: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  dropzoneIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  dropzoneTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  dropzoneSubtitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  dropzoneActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  browseFileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EDE9FE",
  },
  browseFileBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#635BFF",
  },
  downloadTemplateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  downloadTemplateBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#4B5563",
  },
  previewHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  previewSectionTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  previewSectionSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
  },
  selectAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  selectAllText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#635BFF",
  },
  recordsList: {
    gap: 10,
  },
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  recordCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#FAF5FF",
  },
  checkboxContainer: {
    marginRight: 10,
  },
  recordTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recordClientName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#1F2937",
    flex: 1,
  },
  recordStatusBadge: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recordStatusText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9.5,
    color: "#635BFF",
    textTransform: "uppercase",
  },
  recordServiceText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#4B5563",
    marginTop: 2,
  },
  recordMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  recordTime: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    color: "#9CA3AF",
  },
  recordPrice: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#1F2937",
  },
  bottomBar: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  cancelBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#6B7280",
  },
  importBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  importBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
});
