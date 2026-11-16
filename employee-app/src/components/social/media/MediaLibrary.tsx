import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { INITIAL_MEDIA, MEDIA_TYPE_FILTERS, MEDIA_USAGE_FILTERS, MediaItem, MediaKind } from "../socialData";
import { ChipGroup, CheckState, EmptyState, FigmaCheckbox, SearchBar } from "../SocialUI";
import { OptionsSheetConfig } from "../modals/OptionsSheet";

interface MediaLibraryProps {
  onOpenOptions: (cfg: OptionsSheetConfig) => void;
}

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `Uploaded at ${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${h}:${pad(d.getMinutes())} ${ampm}`;
}

function kindFromMime(mime: string, name: string): MediaKind {
  if (mime.startsWith("video")) return "Video";
  if (mime === "image/gif" || name.toLowerCase().endsWith(".gif")) return "Gif";
  return "Photo";
}

/**
 * Media library – Figma 1:10040 (empty), 1:9907 (nothing selected, item menu),
 * 1:9652 (partial selection), 1:9780 (all selected + bulk actions).
 */
export default function MediaLibrary({ onOpenOptions }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [typeFilter, setTypeFilter] = useState(MEDIA_TYPE_FILTERS[0]);
  const [usageFilter, setUsageFilter] = useState(MEDIA_USAGE_FILTERS[0]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const q = query.trim().toLowerCase();
  const visible = items.filter((m) => {
    if (typeFilter !== MEDIA_TYPE_FILTERS[0] && m.kind !== typeFilter) return false;
    if (usageFilter === "Used" && !m.used) return false;
    if (usageFilter === "Unused" && m.used) return false;
    return !q || m.fileName.toLowerCase().includes(q);
  });

  const visibleIds = visible.map((m) => m.id);
  const selectedVisible = selected.filter((id) => visibleIds.includes(id));
  const headerState: CheckState =
    selectedVisible.length === 0
      ? "unchecked"
      : selectedVisible.length === visible.length
        ? "checked"
        : "indeterminate";

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () => setSelected(headerState === "checked" ? [] : visibleIds);

  const handleUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "video/*"],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (res.canceled) return;
    const added: MediaItem[] = res.assets.map((a, i) => ({
      id: `m_${Date.now()}_${i}`,
      fileName: a.name,
      kind: kindFromMime(a.mimeType ?? "", a.name),
      uri: a.uri,
      used: false,
      uploadedBy: "Maria",
      uploadedAt: formatNow(),
    }));
    setItems((prev) => [...added, ...prev]);
  };

  const deleteMedia = (ids: string[]) => {
    Alert.alert(
      ids.length > 1 ? "Mass Deletion" : "Delete",
      ids.length > 1
        ? `Delete ${ids.length} medias? They will be permanently removed.`
        : "This media will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setItems((prev) => prev.filter((m) => !ids.includes(m.id)));
            setSelected((prev) => prev.filter((id) => !ids.includes(id)));
          },
        },
      ],
    );
  };

  const applyMedia = (ids: string[]) => {
    setItems((prev) => prev.map((x) => (ids.includes(x.id) ? { ...x, used: true } : x)));
    setSelected([]);
    Alert.alert("Use media", ids.length > 1 ? `${ids.length} medias are ready to post.` : "The media is ready to post.");
  };

  const download = () => Alert.alert("Download", "The media is being saved to your device.");

  const openItemMenu = (m: MediaItem) =>
    onOpenOptions({
      title: m.fileName,
      options: [
        { label: "Download", icon: <Ionicons name="download-outline" size={18} color={colors.text} /> },
        { label: "Use media", icon: <Ionicons name="globe-outline" size={18} color={colors.teal} /> },
        { label: "Delete", icon: <Ionicons name="trash-outline" size={18} color={colors.pink} /> },
      ],
      onSelect: (action) => {
        if (action === "Download") download();
        if (action === "Use media") applyMedia([m.id]);
        if (action === "Delete") deleteMedia([m.id]);
      },
    });

  return (
    <View style={styles.stack}>
      {/* Filters */}
      <View style={styles.titleCard}>
        <Text style={styles.title}>Media</Text>
        <ChipGroup label="Media Type" options={MEDIA_TYPE_FILTERS} value={typeFilter} onChange={setTypeFilter} />
        <ChipGroup label="Usage" options={MEDIA_USAGE_FILTERS} value={usageFilter} onChange={setUsageFilter} />
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {/* Upload tile */}
      <TouchableOpacity style={styles.uploadTile} onPress={handleUpload} activeOpacity={0.85}>
        <Ionicons name="share-outline" size={24} color="#FFFFFF" />
        <Text style={styles.uploadText}>Upload</Text>
      </TouchableOpacity>

      {/* Library – hidden entirely when empty (1:10040) */}
      {items.length > 0 && (
        <View style={styles.listCard}>
          {visible.length === 0 ? (
            <EmptyState icon="images-outline" title="No media found" message="Try changing the filters or the search." />
          ) : (
            <>
              <View style={styles.selectionBar}>
                <View style={styles.selectAll}>
                  <FigmaCheckbox state={headerState} onPress={toggleAll} />
                  {headerState === "unchecked" ? (
                    <Text style={styles.countText}>{visible.length} medias</Text>
                  ) : (
                    <TouchableOpacity onPress={toggleAll} activeOpacity={0.7}>
                      <Text style={styles.selectLink}>
                        {headerState === "checked" ? "Unselect All Medias" : "Select All Medias"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {selectedVisible.length > 0 && (
                  <View style={styles.bulkActions}>
                    <TouchableOpacity
                      style={[styles.bulkBtn, styles.bulkDanger]}
                      onPress={() => deleteMedia(selectedVisible)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.bulkText, styles.bulkDangerText]}>Mass Deletion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.bulkBtn, styles.bulkUse]}
                      onPress={() => applyMedia(selectedVisible)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.bulkText, styles.bulkUseText]}>Use Media</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {visible.map((m) => {
                const isSelected = selected.includes(m.id);
                return (
                  <View key={m.id} style={styles.mediaCard}>
                    <View style={styles.mediaHeader}>
                      <FigmaCheckbox state={isSelected ? "checked" : "unchecked"} onPress={() => toggle(m.id)} />
                      <Text style={styles.fileName} numberOfLines={1}>
                        {m.fileName}
                      </Text>
                      <TouchableOpacity onPress={() => openItemMenu(m)} hitSlop={10}>
                        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity activeOpacity={0.9} onPress={() => toggle(m.id)}>
                      <Image source={{ uri: m.uri }} style={styles.preview} contentFit="cover" />
                      {m.kind === "Video" && (
                        <View style={styles.player} pointerEvents="none">
                          <View style={styles.playerRow}>
                            <Ionicons name="play" size={20} color="#FFFFFF" />
                            <View style={styles.playerRight}>
                              <Ionicons name="volume-high" size={20} color="#FFFFFF" />
                              <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
                              <Ionicons name="ellipsis-vertical" size={18} color="#FFFFFF" />
                            </View>
                          </View>
                          <View style={styles.progress} />
                        </View>
                      )}
                    </TouchableOpacity>

                    <View style={styles.mediaFooter}>
                      <View style={styles.labels}>
                        <View style={[styles.label, styles.labelOutline]}>
                          <Text style={[styles.labelText, { color: colors.teal }]}>Uploaded by: {m.uploadedBy}</Text>
                        </View>
                        <View style={[styles.label, { backgroundColor: m.used ? "#EBFAF0" : colors.yellowSoft }]}>
                          <Text style={[styles.labelText, { color: m.used ? colors.green : colors.yellow }]}>
                            {m.used ? "Published" : "Not published"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.uploaded}>{m.uploadedAt}</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 24,
  },
  titleCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 20,
    ...shadows.card,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  uploadTile: {
    width: 200,
    height: 104,
    borderRadius: radius.card,
    backgroundColor: colors.primary,
    padding: 20,
    gap: 16,
    ...shadows.card,
  },
  uploadText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
  },
  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 24,
  },
  selectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  selectAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  countText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  selectLink: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  bulkActions: {
    flexDirection: "row",
    gap: 12,
  },
  bulkBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  bulkText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 24,
  },
  bulkDanger: {
    backgroundColor: colors.pinkSoft,
  },
  bulkDangerText: {
    color: colors.pink,
  },
  bulkUse: {
    backgroundColor: colors.teal,
  },
  bulkUseText: {
    color: colors.white,
  },
  mediaCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 24,
    ...shadows.card,
  },
  mediaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  fileName: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  preview: {
    width: "100%",
    aspectRatio: 482 / 300,
    borderRadius: radius.card,
    backgroundColor: colors.border,
  },
  player: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    gap: 8,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progress: {
    height: 4,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  mediaFooter: {
    gap: 10,
  },
  labels: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.md,
  },
  labelOutline: {
    borderWidth: 1,
    borderColor: colors.teal,
    paddingVertical: 3,
  },
  labelText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  uploaded: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
