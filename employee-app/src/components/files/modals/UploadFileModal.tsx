import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { colors, fonts, radius, typography } from "@/constants/figmaTheme";
import { CURRENT_EMPLOYEE, FileData, fileTypeFromName, formatFileSize, stripExtension } from "../filesData";
import { FileTypeIcon } from "../FilesUI";
import FilesModal from "./FilesModal";

/** Figma 1:8645 — "Upload Files" dialog with a single drop zone. Files go into `folderId`. */
export default function UploadFileModal({
  visible,
  onClose,
  folderId,
  onUpload,
}: {
  visible: boolean;
  onClose: () => void;
  folderId: string | null;
  onUpload: (files: FileData[]) => void;
}) {
  const [picked, setPicked] = useState<FileData[]>([]);

  const browse = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: false });
      if (result.canceled) return;
      const now = Date.now();
      const next = result.assets.map((a, i) => ({
        id: `file_${now}_${i}`,
        name: stripExtension(a.name),
        type: fileTypeFromName(a.name, a.mimeType),
        size: formatFileSize(a.size),
        createdBy: CURRENT_EMPLOYEE,
        folderId,
      }));
      setPicked((prev) => [...prev, ...next]);
    } catch {
      Alert.alert("Upload Files", "Could not open the file browser.");
    }
  };

  const handleSave = () => {
    if (picked.length === 0) return;
    onUpload(picked);
    onClose();
  };

  return (
    <FilesModal
      visible={visible}
      onClose={onClose}
      title="Upload Files"
      onSave={handleSave}
      saveDisabled={picked.length === 0}
    >
      <TouchableOpacity style={styles.dropzone} onPress={browse} activeOpacity={0.8}>
        <View style={styles.iconBox}>
          <Ionicons name="duplicate-outline" size={30} color={colors.primary} />
        </View>
        <Text style={styles.dropText}>Drop here or click to browse</Text>
      </TouchableOpacity>

      {picked.length > 0 ? (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {picked.map((f) => (
            <View key={f.id} style={styles.row}>
              <FileTypeIcon type={f.type} size={32} />
              <View style={styles.rowInfo}>
                <Text style={typography.bodyStrong} numberOfLines={1}>
                  {f.name}
                </Text>
                <Text style={styles.rowMeta}>
                  {f.type} • {f.size}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPicked((prev) => prev.filter((p) => p.id !== f.id))}
                hitSlop={10}
                accessibilityLabel={`Remove ${f.name}`}
              >
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.spacer} />
      )}
    </FilesModal>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F1F2FE",
    borderWidth: 1,
    borderColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  dropText: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, color: colors.primary, textAlign: "center" },
  spacer: { height: 68 },
  list: { maxHeight: 220 },
  listContent: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowInfo: { flex: 1 },
  rowMeta: { ...typography.caption },
});
