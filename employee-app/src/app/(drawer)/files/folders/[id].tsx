import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import { colors, fonts, radius, typography } from "@/constants/figmaTheme";
import { useFilesStore } from "@/components/files/filesStore";
import { useFileActions } from "@/components/files/useFileActions";
import {
  ActionTiles,
  CheckState,
  EmptyState,
  FileCheckbox,
  FileGridCard,
  FileListRow,
  filesStyles,
  FolderCard,
  Grid,
  PageTitleBar,
  SectionCard,
  ViewMode,
  ViewModeToggle,
} from "@/components/files/FilesUI";

/**
 * Folder detail.
 * - Folder of folders (e.g. "Employees"): Upload + Create Folder tiles and a folder grid — Figma 1:7346.
 * - Folder of files (e.g. "Salaries"): Upload tile and the "Files" list — Figma 1:6519,
 *   selection mode with "Select All Files" + Delete/Download/Move — 1:6782, all selected — 1:7066.
 */
export default function FolderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { folders, files } = useFilesStore();
  const actions = useFileActions(id ?? null);

  const folder = folders.find((f) => f.id === id);
  const subfolders = folders.filter((f) => f.parentId === id);
  const folderFiles = files.filter((f) => f.folderId === id);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selecting, setSelecting] = useState(false);
  const [rawSelected, setSelected] = useState<string[]>([]);
  // Ignore selections for files that were moved/deleted meanwhile.
  const selected = rawSelected.filter((sid) => folderFiles.some((f) => f.id === sid));

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate("/(drawer)/files" as never));
  const goHome = () => router.navigate("/(drawer)/files" as never);

  if (!folder) {
    return (
      <View style={filesStyles.screen}>
        <Header />
        <ScrollView contentContainerStyle={filesStyles.scrollContent}>
          <PageTitleBar title="Folder" onBack={goBack} onHome={goHome} />
          <SectionCard>
            <EmptyState icon="folder-outline" title="Folder not found" subtitle="It may have been moved or deleted." />
          </SectionCard>
        </ScrollView>
      </View>
    );
  }

  const hasSubfolders = subfolders.length > 0;
  const showFiles = folderFiles.length > 0 || !hasSubfolders;
  const allSelected = folderFiles.length > 0 && selected.length === folderFiles.length;
  const headerCheck: CheckState = !selecting ? "unchecked" : allSelected ? "checked" : "indeterminate";

  const toggleSelecting = () => {
    if (selecting) {
      setSelecting(false);
      setSelected([]);
    } else {
      setSelecting(true);
    }
  };
  const toggleAll = () => setSelected(allSelected ? [] : folderFiles.map((f) => f.id));
  const toggleOne = (fid: string) =>
    setSelected((prev) => (prev.includes(fid) ? prev.filter((x) => x !== fid) : [...prev, fid]));
  const finishBulk = () => {
    setSelected([]);
    setSelecting(false);
  };

  const noneSelected = selected.length === 0;

  return (
    <View style={filesStyles.screen}>
      <Header />
      <ScrollView contentContainerStyle={filesStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <PageTitleBar title={folder.name} onBack={goBack} onHome={goHome} />

        <ActionTiles
          onUpload={actions.openUpload}
          onCreateFolder={hasSubfolders || folderFiles.length === 0 ? actions.openCreateFolder : undefined}
        />

        {hasSubfolders ? (
          <SectionCard>
            <Grid>
              {subfolders.map((sub) => (
                <FolderCard
                  key={sub.id}
                  folder={sub}
                  onPress={() =>
                    router.push({ pathname: "/(drawer)/files/folders/[id]", params: { id: sub.id } } as never)
                  }
                  onMenu={(e) => actions.openFolderMenu(sub, e)}
                />
              ))}
            </Grid>
          </SectionCard>
        ) : null}

        {showFiles ? (
          <SectionCard>
            <View style={filesStyles.sectionHeader}>
              <View style={styles.headerLeft}>
                {folderFiles.length > 0 ? <FileCheckbox state={headerCheck} onPress={toggleSelecting} /> : null}
                {selecting ? (
                  <TouchableOpacity onPress={toggleAll} activeOpacity={0.7}>
                    <Text style={styles.selectLink}>{allSelected ? "Unselect All Files" : "Select All Files"}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={typography.sectionTitle}>Files</Text>
                )}
              </View>
              <ViewModeToggle value={viewMode} onChange={setViewMode} />
            </View>

            {selecting ? (
              <View style={styles.bulkRow}>
                <BulkButton
                  label="Delete"
                  icon="trash-outline"
                  bg={colors.pinkSoft}
                  fg={colors.pink}
                  disabled={noneSelected}
                  onPress={() => actions.bulkDelete(selected, finishBulk)}
                />
                <BulkButton
                  label="Download"
                  icon="download-outline"
                  bg={colors.primarySoft}
                  fg={colors.primary}
                  disabled={noneSelected}
                  onPress={() =>
                    Alert.alert("Download", `Downloading ${selected.length} file${selected.length === 1 ? "" : "s"}...`)
                  }
                />
                <BulkButton
                  label="Move"
                  icon="folder-open-outline"
                  bg={colors.subtleAlt}
                  fg={colors.textDark}
                  disabled={noneSelected}
                  onPress={() => actions.bulkMove(selected, finishBulk)}
                />
              </View>
            ) : null}

            {folderFiles.length === 0 ? (
              <EmptyState icon="document-outline" title="This folder is empty" subtitle="Upload files to this folder." />
            ) : viewMode === "list" ? (
              <View style={{ gap: 16 }}>
                {folderFiles.map((file) => (
                  <FileListRow
                    key={file.id}
                    file={file}
                    onMenu={(e) => actions.openFileMenu(file, e)}
                    selectable={selecting}
                    selected={selected.includes(file.id)}
                    onToggle={() => toggleOne(file.id)}
                  />
                ))}
              </View>
            ) : (
              <Grid>
                {folderFiles.map((file) => (
                  <FileGridCard
                    key={file.id}
                    file={file}
                    onMenu={(e) => actions.openFileMenu(file, e)}
                    selectable={selecting}
                    selected={selected.includes(file.id)}
                    onToggle={() => toggleOne(file.id)}
                  />
                ))}
              </Grid>
            )}
          </SectionCard>
        ) : null}
      </ScrollView>

      {actions.element}
    </View>
  );
}

function BulkButton({
  label,
  icon,
  bg,
  fg,
  disabled,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  fg: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.bulkBtn, { backgroundColor: bg }, disabled && styles.bulkBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={16} color={fg} />
      <Text style={[typography.button, { color: fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  selectLink: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  bulkRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bulkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bulkBtnDisabled: { opacity: 0.6 },
});
