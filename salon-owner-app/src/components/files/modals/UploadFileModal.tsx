import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FolderData, FileData } from "../filesData";

interface UploadFileModalProps {
  visible: boolean;
  onClose: () => void;
  folders: FolderData[];
  onUpload: (newFile: FileData) => void;
}

export default function UploadFileModal({
  visible,
  onClose,
  folders,
  onUpload,
}: UploadFileModalProps) {
  const [fileName, setFileName] = useState("");
  const [selectedType, setSelectedType] = useState<string>("PDF");
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || "1");
  const [fileSize, setFileSize] = useState("4.5 MB");

  const FILE_TYPES = ["PDF", "DOC", "IMG", "MP4", "MP3", "CSV", "ZIP"];

  const handleUpload = () => {
    if (!fileName.trim()) {
      Alert.alert("Required Field", "Please enter a file name.");
      return;
    }

    const newFile: FileData = {
      id: `file_${Date.now()}`,
      name: fileName.trim(),
      type: selectedType,
      size: fileSize,
      createdBy: "Maria Rodriguez",
      updatedAt: "Just now",
      folderId: selectedFolderId,
    };

    onUpload(newFile);
    setFileName("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.modalCard}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud-upload" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Upload File</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {/* File Dropzone / Select */}
            <TouchableOpacity
              style={styles.dropzone}
              onPress={() => {
                if (!fileName) setFileName("Salon_Document_" + Math.floor(Math.random() * 100));
                Alert.alert("File Selected", `Document selected ready for upload.`);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.dropzoneIconBox}>
                <Ionicons name="document-attach-outline" size={26} color="#635BFF" />
              </View>
              <Text style={styles.dropzoneTitle}>Tap to Browse Document</Text>
              <Text style={styles.dropzoneSub}>Supports PDF, DOC, Images, Videos, Audio up to 100 MB</Text>
            </TouchableOpacity>

            {/* File Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>FILE NAME *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. September Financial Report"
                placeholderTextColor="#94A3B8"
                value={fileName}
                onChangeText={setFileName}
              />
            </View>

            {/* File Type Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>FILE FORMAT</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.typesRow}>
                  {FILE_TYPES.map((t) => {
                    const isSelected = selectedType === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[styles.typeChip, isSelected && styles.typeChipActive]}
                        onPress={() => setSelectedType(t)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.typeChipText, isSelected && styles.typeChipTextActive]}>
                          {t}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Target Folder */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>DESTINATION FOLDER</Text>
              <View style={styles.foldersGrid}>
                {folders.map((f) => {
                  const isSelected = selectedFolderId === f.id;
                  return (
                    <TouchableOpacity
                      key={f.id}
                      style={[styles.folderChip, isSelected && styles.folderChipActive]}
                      onPress={() => setSelectedFolderId(f.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isSelected ? "folder-open" : "folder"}
                        size={15}
                        color={isSelected ? "#635BFF" : "#94A3B8"}
                      />
                      <Text style={[styles.folderChipText, isSelected && styles.folderChipTextActive]}>
                        {f.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} activeOpacity={0.85}>
              <Ionicons name="arrow-up-circle" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.uploadBtnText}>Upload File</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    maxHeight: 480,
  },
  bodyContent: {
    padding: 20,
    gap: 16,
  },
  dropzone: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dropzoneIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dropzoneTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  dropzoneSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    textAlign: "center",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  typesRow: {
    flexDirection: "row",
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  typeChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  typeChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  typeChipTextActive: {
    color: "#635BFF",
  },
  foldersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  folderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  folderChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  folderChipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  folderChipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  uploadBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
