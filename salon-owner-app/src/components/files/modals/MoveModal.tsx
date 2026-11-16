import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FolderData } from "../filesData";

interface MoveModalProps {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  folders: FolderData[];
  onMove: (targetFolderId: string) => void;
}

export default function MoveModal({
  visible,
  onClose,
  itemName,
  folders,
  onMove,
}: MoveModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || "1");

  const handleConfirmMove = () => {
    const target = folders.find((f) => f.id === selectedFolderId);
    onMove(selectedFolderId);
    Alert.alert("Item Moved", `"${itemName}" moved to "${target?.name || "folder"}".`);
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
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="move-outline" size={18} color="#A855F7" />
              </View>
              <Text style={styles.title}>Move to Folder</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.bodyContent}>
            <Text style={styles.itemSubtitle} numberOfLines={1}>
              Select destination for <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>"{itemName}"</Text>:
            </Text>

            <ScrollView style={styles.foldersList} showsVerticalScrollIndicator={false}>
              {folders.map((f) => {
                const isSelected = selectedFolderId === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.folderRow, isSelected && styles.folderRowSelected]}
                    onPress={() => setSelectedFolderId(f.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.folderIconBox, isSelected && styles.folderIconBoxSelected]}>
                      <Ionicons
                        name={isSelected ? "folder-open" : "folder"}
                        size={18}
                        color={isSelected ? "#635BFF" : "#64748B"}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.folderName, isSelected && styles.folderNameSelected]}>
                        {f.name}
                      </Text>
                      <Text style={styles.folderMeta}>{f.filesCount || 0} files</Text>
                    </View>

                    <Ionicons
                      name={isSelected ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={isSelected ? "#635BFF" : "#CBD5E1"}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moveBtn} onPress={handleConfirmMove} activeOpacity={0.85}>
              <Text style={styles.moveBtnText}>Move Here</Text>
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
    maxWidth: 440,
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
    backgroundColor: "#F3E8FF",
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
  bodyContent: {
    padding: 20,
    gap: 12,
  },
  itemSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  foldersList: {
    maxHeight: 240,
  },
  folderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  folderRowSelected: {
    borderColor: "#C7D2FE",
    backgroundColor: "#F5F3FF",
  },
  folderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  folderIconBoxSelected: {
    backgroundColor: "#EEF2FF",
  },
  folderName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  folderNameSelected: {
    color: "#635BFF",
  },
  folderMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
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
  moveBtn: {
    flex: 1,
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
  moveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
