import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, typography } from "@/constants/figmaTheme";
import { FolderData } from "../filesData";
import { FolderGlyph } from "../FilesUI";
import FilesModal, { ModalInput, modalStyles } from "./FilesModal";

const ROOT_ID = "__root__";

/** Figma 1:7955 — "Move Folder" dialog: search + "Suggestions" folder list + Save. */
export default function MoveModal({
  visible,
  onClose,
  title,
  folders,
  currentParentId,
  onMove,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Valid destination folders. */
  folders: FolderData[];
  /** Where the item currently lives (null = Files root). */
  currentParentId: string | null;
  onMove: (targetFolderId: string | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list: FolderData[] = folders.filter((f) => f.id !== currentParentId);
    if (currentParentId !== null) {
      list.unshift({ id: ROOT_ID, name: "Files", createdBy: "", parentId: null });
    }
    return q ? list.filter((f) => f.name.toLowerCase().includes(q)) : list;
  }, [folders, search, currentParentId]);

  const handleSave = () => {
    if (!selected) return;
    onMove(selected === ROOT_ID ? null : selected);
    onClose();
  };

  return (
    <FilesModal visible={visible} onClose={onClose} title={title} onSave={handleSave} saveDisabled={!selected}>
      <ModalInput placeholder="Search a folder" icon="search-outline" value={search} onChangeText={setSearch} />

      <View style={styles.section}>
        <Text style={modalStyles.sectionLabel}>Suggestions</Text>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled">
          {suggestions.map((f) => {
            const isSelected = selected === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => setSelected(f.id)}
                activeOpacity={0.7}
              >
                <View style={styles.folderBox}>
                  {f.id === ROOT_ID ? (
                    <Ionicons name="home-outline" size={22} color={colors.primary} />
                  ) : (
                    <FolderGlyph size={24} />
                  )}
                </View>
                <View style={styles.info}>
                  <Text style={modalStyles.personName} numberOfLines={1}>
                    {f.name}
                  </Text>
                  {f.createdBy ? <Text style={modalStyles.personSub}>Created by {f.createdBy}</Text> : null}
                </View>
                {isSelected ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
              </TouchableOpacity>
            );
          })}
          {suggestions.length === 0 ? (
            <Text style={[typography.body, { color: colors.textMuted }]}>No folders found</Text>
          ) : null}
        </ScrollView>
      </View>
    </FilesModal>
  );
}

const styles = StyleSheet.create({
  section: { gap: 16, flexShrink: 1 },
  list: { maxHeight: 300 },
  listContent: { gap: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: radius.card },
  rowSelected: { backgroundColor: colors.primaryTint },
  folderBox: {
    width: 48,
    height: 48,
    borderRadius: radius.card,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
});
