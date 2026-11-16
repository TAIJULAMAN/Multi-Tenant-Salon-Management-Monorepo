import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { useFilesStore } from "@/components/files/filesStore";
import { useFileActions } from "@/components/files/useFileActions";
import {
  ActionTiles,
  EmptyState,
  filesStyles,
  FolderCard,
  Grid,
  PageTitleBar,
  SectionCard,
} from "@/components/files/FilesUI";

/**
 * "View More" target from Suggested Folders: every top-level folder,
 * laid out like the folder-of-folders frame (Figma 1:7346).
 */
export default function AllFoldersScreen() {
  const router = useRouter();
  const { folders } = useFilesStore();
  const actions = useFileActions(null);
  const rootFolders = folders.filter((f) => f.parentId === null);

  return (
    <View style={filesStyles.screen}>
      <Header />
      <ScrollView contentContainerStyle={filesStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <PageTitleBar
          title="Suggested Folders"
          onBack={() => router.back()}
          onHome={() => router.navigate("/(drawer)/files" as never)}
        />

        <ActionTiles onUpload={actions.openUpload} onCreateFolder={actions.openCreateFolder} />

        <SectionCard>
          {rootFolders.length > 0 ? (
            <Grid>
              {rootFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onPress={() =>
                    router.push({ pathname: "/(drawer)/files/folders/[id]", params: { id: folder.id } } as never)
                  }
                  onMenu={(e) => actions.openFolderMenu(folder, e)}
                />
              ))}
            </Grid>
          ) : (
            <EmptyState icon="folder-outline" title="No folders yet" subtitle="Create a folder to organise your files." />
          )}
        </SectionCard>
      </ScrollView>

      {actions.element}
    </View>
  );
}
