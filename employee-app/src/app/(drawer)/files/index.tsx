import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { typography } from "@/constants/figmaTheme";
import { useFilesStore } from "@/components/files/filesStore";
import { useFileActions } from "@/components/files/useFileActions";
import {
  ActionTiles,
  EmptyState,
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

/** Figma 1:6093 (grid) / 1:6308 (list) — Files home. */
export default function FilesHomeScreen() {
  const router = useRouter();
  const { folders, files } = useFilesStore();
  const actions = useFileActions(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const rootFolders = folders.filter((f) => f.parentId === null);
  const suggestedFolders = rootFolders.slice(0, 4);
  const suggestedFiles = files.filter((f) => f.folderId === null);

  const openFolder = (id: string) =>
    router.push({ pathname: "/(drawer)/files/folders/[id]", params: { id } } as never);

  return (
    <View style={filesStyles.screen}>
      <Header />
      <ScrollView contentContainerStyle={filesStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <PageTitleBar title="Files" />

        <ActionTiles onUpload={actions.openUpload} onCreateFolder={actions.openCreateFolder} />

        <SectionCard>
          <View style={filesStyles.sectionHeader}>
            <Text style={typography.sectionTitle}>Suggested Folders</Text>
            <TouchableOpacity
              style={filesStyles.outlineBtn}
              onPress={() => router.push("/(drawer)/files/folders" as never)}
              activeOpacity={0.7}
            >
              <Text style={filesStyles.outlineBtnText}>View More</Text>
            </TouchableOpacity>
          </View>
          {suggestedFolders.length > 0 ? (
            <Grid>
              {suggestedFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onPress={() => openFolder(folder.id)}
                  onMenu={(e) => actions.openFolderMenu(folder, e)}
                />
              ))}
            </Grid>
          ) : (
            <EmptyState icon="folder-outline" title="No folders yet" subtitle="Create a folder to organise your files." />
          )}
        </SectionCard>

        <SectionCard>
          <View style={filesStyles.sectionHeader}>
            <Text style={typography.sectionTitle}>Suggested Files</Text>
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </View>
          {suggestedFiles.length === 0 ? (
            <EmptyState icon="document-outline" title="No files yet" subtitle="Upload your first document." />
          ) : viewMode === "grid" ? (
            <Grid>
              {suggestedFiles.map((file) => (
                <FileGridCard key={file.id} file={file} onMenu={(e) => actions.openFileMenu(file, e)} />
              ))}
            </Grid>
          ) : (
            <View style={{ gap: 16 }}>
              {suggestedFiles.map((file) => (
                <FileListRow key={file.id} file={file} onMenu={(e) => actions.openFileMenu(file, e)} />
              ))}
            </View>
          )}
        </SectionCard>
      </ScrollView>

      {actions.element}
    </View>
  );
}
