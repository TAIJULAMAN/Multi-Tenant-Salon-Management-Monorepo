import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows, typography } from "@/constants/figmaTheme";
import { FileData, FolderData, getFileTypeColor } from "./filesData";

export type ViewMode = "list" | "grid";

/* ------------------------------------------------------------------ */
/* Glyphs                                                              */
/* ------------------------------------------------------------------ */

/** "Bold Duotone / Folders / Folder" — 50% primary folder with a solid bar. */
export function FolderGlyph({ size = 98 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Ionicons name="folder" size={size} color={colors.primary} style={{ opacity: 0.5 }} />
      <View
        style={{
          position: "absolute",
          top: size * 0.4,
          left: size * 0.5,
          width: size * 0.33,
          height: Math.max(2, size * 0.07),
          borderRadius: size * 0.04,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}

/** "File type icon" — page outline with a coloured type label. */
export function FileTypeIcon({ type, size = 40 }: { type: string; size?: number }) {
  const label = type.toUpperCase().slice(0, 4);
  return (
    <View style={{ width: size, height: size }}>
      <Ionicons
        name="document-outline"
        size={size}
        color={colors.border}
        style={{ position: "absolute", left: size * 0.08, top: 0 }}
      />
      <View style={[styles.typeLabel, { backgroundColor: getFileTypeColor(type), top: size * 0.45 }]}>
        <Text style={styles.typeLabelText}>{label}</Text>
      </View>
    </View>
  );
}

/** Stand-in for the document preview image used in the Figma grid cards. */
function DocumentThumbnail() {
  return (
    <View style={styles.thumbSheet}>
      <View style={styles.thumbHeaderRow}>
        <View style={[styles.thumbLine, { width: "40%", backgroundColor: colors.text, opacity: 0.6 }]} />
        <View style={[styles.thumbLine, { width: "22%", backgroundColor: colors.primary, opacity: 0.7 }]} />
      </View>
      <View style={[styles.thumbLine, { width: "55%" }]} />
      <View style={[styles.thumbBar, { backgroundColor: colors.primaryTint }]} />
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.thumbRow}>
          {[0, 1, 2, 3].map((c) => (
            <View key={c} style={[styles.thumbLine, { flex: 1 }]} />
          ))}
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

export function KebabButton({ onPress }: { onPress: (e: GestureResponderEvent) => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={10}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel="More actions"
    >
      <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
    </TouchableOpacity>
  );
}

export type CheckState = "unchecked" | "checked" | "indeterminate";

export function FileCheckbox({ state, onPress }: { state: CheckState; onPress?: () => void }) {
  const box =
    state === "checked" ? (
      <View style={[styles.checkFilled, { backgroundColor: colors.primary }]}>
        <Ionicons name="checkmark" size={16} color={colors.white} />
      </View>
    ) : state === "indeterminate" ? (
      <View style={[styles.checkFilled, { backgroundColor: colors.pink }]}>
        <View style={styles.indeterminateBar} />
      </View>
    ) : (
      <View style={styles.checkEmptyWrap}>
        <View style={styles.checkEmpty} />
      </View>
    );
  if (!onPress) return box;
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: state === "checked" ? true : state === "indeterminate" ? "mixed" : false }}
    >
      {box}
    </TouchableOpacity>
  );
}

export function ViewModeToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <View style={styles.toggle}>
      <TouchableOpacity
        style={[styles.toggleBtn, styles.toggleLeft, value === "list" && styles.toggleBtnActive]}
        onPress={() => onChange("list")}
        activeOpacity={0.7}
        accessibilityLabel="List view"
      >
        <Ionicons name="list" size={16} color={value === "list" ? colors.primary : colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleBtn, styles.toggleRight, value === "grid" && styles.toggleBtnActive]}
        onPress={() => onChange("grid")}
        activeOpacity={0.7}
        accessibilityLabel="Grid view"
      >
        <Ionicons name="grid-outline" size={16} color={value === "grid" ? colors.primary : colors.text} />
      </TouchableOpacity>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Page chrome                                                         */
/* ------------------------------------------------------------------ */

/** White "title" bar. With `onBack` it becomes the folder variant (back chevron + breadcrumb). */
export function PageTitleBar({
  title,
  onBack,
  onHome,
}: {
  title: string;
  onBack?: () => void;
  onHome?: () => void;
}) {
  if (!onBack) {
    return (
      <View style={[styles.card, styles.titleBar]}>
        <Text style={typography.sectionTitle}>{title}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.card, styles.titleBar, styles.titleBarRow]}>
      <View style={styles.titleLeft}>
        <TouchableOpacity onPress={onBack} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[typography.sectionTitle, { flexShrink: 1 }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <TouchableOpacity style={styles.breadcrumb} onPress={onHome} activeOpacity={0.7}>
        <Ionicons name="home-outline" size={18} color={colors.textSecondary} />
        <Text style={typography.sectionTitle}>/</Text>
        <View style={styles.breadcrumbPill}>
          <Text style={styles.breadcrumbText}>Files</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

/** "Upload" (primary) and optional "Create Folder" (primary soft) tiles. */
export function ActionTiles({ onUpload, onCreateFolder }: { onUpload: () => void; onCreateFolder?: () => void }) {
  return (
    <View style={styles.tilesRow}>
      <TouchableOpacity style={[styles.tile, { backgroundColor: colors.primary }]} onPress={onUpload} activeOpacity={0.85}>
        <Ionicons name="share-outline" size={24} color={colors.white} />
        <Text style={[styles.tileText, { color: colors.white }]}>Upload</Text>
      </TouchableOpacity>
      {onCreateFolder ? (
        <TouchableOpacity
          style={[styles.tile, { backgroundColor: colors.primarySoft }]}
          onPress={onCreateFolder}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={24} color={colors.primary} />
          <Text style={[styles.tileText, { color: colors.primary }]}>Create Folder</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.tileSpacer} />
      )}
    </View>
  );
}

export function SectionCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, styles.sectionCard, style]}>{children}</View>;
}

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */

export function FolderCard({
  folder,
  onPress,
  onMenu,
}: {
  folder: FolderData;
  onPress: () => void;
  onMenu: (e: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity style={styles.folderCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.folderPreview}>
        <FolderGlyph size={64} />
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.itemNameRow}>
          <Text style={[typography.bodyStrong, styles.flex1]} numberOfLines={1}>
            {folder.name}
          </Text>
          <KebabButton onPress={onMenu} />
        </View>
        <Text style={styles.metaText} numberOfLines={2}>
          Created by {folder.createdBy}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function FileGridCard({
  file,
  onMenu,
  selectable,
  selected,
  onToggle,
}: {
  file: FileData;
  onMenu: (e: GestureResponderEvent) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.fileGridCard}
      activeOpacity={selectable ? 0.8 : 1}
      onPress={selectable ? onToggle : undefined}
      disabled={!selectable}
    >
      <View style={styles.filePreview}>
        <DocumentThumbnail />
        {selectable ? (
          <View style={styles.gridCheck}>
            <FileCheckbox state={selected ? "checked" : "unchecked"} onPress={onToggle} />
          </View>
        ) : null}
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.itemNameRow}>
          <Text style={[typography.bodyStrong, styles.flex1]} numberOfLines={1}>
            {file.name}
          </Text>
          <KebabButton onPress={onMenu} />
        </View>
        <Text style={styles.metaText} numberOfLines={3}>
          {file.type} • Created by {file.createdBy}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function FileListRow({
  file,
  onMenu,
  selectable,
  selected,
  onToggle,
}: {
  file: FileData;
  onMenu: (e: GestureResponderEvent) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.fileListRow}
      activeOpacity={selectable ? 0.8 : 1}
      onPress={selectable ? onToggle : undefined}
      disabled={!selectable}
    >
      {selectable ? <FileCheckbox state={selected ? "checked" : "unchecked"} onPress={onToggle} /> : null}
      <FileTypeIcon type={file.type} />
      <View style={styles.listInfo}>
        <View style={styles.itemNameRow}>
          <Text style={[typography.bodyStrong, styles.flex1]} numberOfLines={1}>
            {file.name}
          </Text>
          <KebabButton onPress={onMenu} />
        </View>
        <Text style={styles.metaText} numberOfLines={2}>
          {file.type} • {file.size} • Created by {file.createdBy}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function EmptyState({ icon, title, subtitle }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={36} color={colors.textMuted} />
      <Text style={typography.bodyStrong}>{title}</Text>
      <Text style={[typography.body, { color: colors.textMuted, textAlign: "center" }]}>{subtitle}</Text>
    </View>
  );
}

/** Two-column wrap used for folder and file grids. */
export function Grid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

export const filesStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  outlineBtnText: { ...typography.button, color: colors.primary, textAlign: "center" },
});

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    ...shadows.card,
  },
  titleBar: { paddingVertical: 16, paddingHorizontal: 16 },
  titleBarRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  titleLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  breadcrumb: { flexDirection: "row", alignItems: "center", gap: 8 },
  breadcrumbPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  breadcrumbText: { ...typography.body, color: colors.primary },

  tilesRow: { flexDirection: "row", gap: 16 },
  tile: {
    flex: 1,
    minHeight: 104,
    borderRadius: radius.card,
    padding: 20,
    gap: 16,
    ...shadows.card,
  },
  tileSpacer: { flex: 1 },
  tileText: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },

  sectionCard: { padding: 16, gap: 16 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },

  folderCard: {
    width: "48%",
    backgroundColor: colors.canvas,
    borderRadius: radius.card,
    padding: 12,
    gap: 16,
  },
  folderPreview: {
    aspectRatio: 209 / 148,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: { gap: 8 },
  itemNameRow: { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 24 },
  metaText: { ...typography.body, color: colors.textMuted },

  fileGridCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 12,
    gap: 20,
    ...shadows.card,
  },
  filePreview: {
    aspectRatio: 209 / 148,
    backgroundColor: colors.canvas,
    borderRadius: radius.card,
    overflow: "hidden",
    alignItems: "center",
    paddingTop: 14,
  },
  gridCheck: { position: "absolute", top: 8, left: 8 },
  thumbSheet: {
    width: "82%",
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingTop: 8,
    gap: 4,
  },
  thumbHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  thumbLine: { height: 3, borderRadius: 2, backgroundColor: colors.border },
  thumbBar: { height: 6, borderRadius: 2, marginTop: 2 },
  thumbRow: { flexDirection: "row", gap: 4 },

  fileListRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    ...shadows.card,
  },
  listInfo: { flex: 1, gap: 4 },

  typeLabel: {
    position: "absolute",
    left: 0,
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  typeLabelText: { fontFamily: fonts.bold, fontSize: 8, lineHeight: 11, color: colors.white },

  checkFilled: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  indeterminateBar: { width: 12, height: 2, borderRadius: 1, backgroundColor: colors.white },
  checkEmptyWrap: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  checkEmpty: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.textMuted,
    backgroundColor: colors.white,
  },

  toggle: { flexDirection: "row" },
  toggleBtn: {
    width: 48,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  toggleLeft: { borderTopLeftRadius: radius.md, borderBottomLeftRadius: radius.md },
  toggleRight: { borderTopRightRadius: radius.md, borderBottomRightRadius: radius.md, marginLeft: -1 },
  toggleBtnActive: { backgroundColor: colors.canvas },

  empty: { alignItems: "center", paddingVertical: 32, gap: 8 },
});
