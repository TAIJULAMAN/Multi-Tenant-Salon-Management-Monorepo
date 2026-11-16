import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FolderData,
  INITIAL_FOLDERS,
} from "@/components/files/filesData";

import CreateFolderModal from "@/components/files/modals/CreateFolderModal";
import RenameModal from "@/components/files/modals/RenameModal";
import ManagePermissionModal from "@/components/files/modals/ManagePermissionModal";
import DeleteConfirmModal from "@/components/files/modals/DeleteConfirmModal";
import ActionDropdownModal, { ActionDropdownItem } from "@/components/files/modals/ActionDropdownModal";

export default function AllFoldersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState<FolderData[]>(INITIAL_FOLDERS);

  const [createFolderModalVisible, setCreateFolderModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number; width?: number; height?: number } | null>(null);

  const [activeFolder, setActiveFolder] = useState<FolderData | null>(null);

  const filteredFolders = useMemo(() => {
    return folders.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.createdBy.toLowerCase().includes(search.toLowerCase())
    );
  }, [folders, search]);

  const handleCreateFolder = (newF: FolderData) => {
    setFolders([newF, ...folders]);
  };

  const handleRenameSave = (newName: string) => {
    if (!activeFolder) return;
    setFolders(folders.map((f) => (f.id === activeFolder.id ? { ...f, name: newName } : f)));
  };

  const handleDeleteConfirm = () => {
    if (!activeFolder) return;
    setFolders(folders.filter((f) => f.id !== activeFolder.id));
    setDeleteModalVisible(false);
    setActiveFolder(null);
  };

  const openActionMenu = (folder: FolderData, e?: any) => {
    setActiveFolder(folder);
    if (e?.currentTarget?.measureInWindow) {
      e.currentTarget.measureInWindow((x: number, y: number, width: number, height: number) => {
        setAnchorPos({ x, y, width, height });
        setDropdownModalVisible(true);
      });
    } else if (e?.nativeEvent?.pageX) {
      setAnchorPos({
        x: e.nativeEvent.pageX - 10,
        y: e.nativeEvent.pageY,
        width: 20,
        height: 20,
      });
      setDropdownModalVisible(true);
    } else {
      setAnchorPos(null);
      setDropdownModalVisible(true);
    }
  };

  const dropdownItems: ActionDropdownItem[] = [
    {
      id: "rename",
      label: "Rename",
      iconName: "pencil-outline",
      iconColor: "#38BDF8",
      onPress: () => setRenameModalVisible(true),
    },
    {
      id: "download",
      label: "Download",
      iconName: "download-outline",
      iconColor: "#64748B",
      onPress: () => Alert.alert("Download Started", `Preparing zip for "${activeFolder?.name}"...`),
    },
    {
      id: "move",
      label: "Move",
      iconName: "move-outline",
      iconColor: "#A855F7",
      onPress: () => Alert.alert("Move Folder", `Moving "${activeFolder?.name}" directory...`),
    },
    {
      id: "permission",
      label: "Manage Permission",
      iconName: "people-outline",
      iconColor: "#FBBF24",
      onPress: () => setPermissionModalVisible(true),
    },
    {
      id: "delete",
      label: "Delete",
      iconName: "trash-outline",
      iconColor: "#F43F5E",
      textColor: "#F43F5E",
      onPress: () => setDeleteModalVisible(true),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#635BFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>All Folders</Text>
          <Text style={styles.headerSubtitle}>{folders.length} directories</Text>
        </View>

        <TouchableOpacity
          style={styles.newFolderBtn}
          onPress={() => setCreateFolderModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#635BFF" />
          <Text style={styles.newFolderBtnText}>New Folder</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search folders..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.foldersGrid}>
          {filteredFolders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={styles.folderCard}
              onPress={() =>
                router.push({
                  pathname: "/(drawer)/files/folders/[id]" as any,
                  params: { id: folder.id, name: folder.name },
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.folderPreviewBox}>
                <Ionicons name="folder" size={54} color="#A5B4FC" />
              </View>

              <View style={styles.folderCardFooter}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.folderCardName} numberOfLines={1}>
                    {folder.name}
                  </Text>
                  <Text style={styles.folderCardSub}>
                    {folder.filesCount || 0} files • {folder.createdBy}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.kebabBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    openActionMenu(folder, e);
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredFolders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="folder-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No folders found</Text>
            <Text style={styles.emptySub}>Create a new folder to organize files.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <CreateFolderModal
        visible={createFolderModalVisible}
        onClose={() => setCreateFolderModalVisible(false)}
        onCreate={handleCreateFolder}
      />

      <RenameModal
        visible={renameModalVisible}
        onClose={() => {
          setRenameModalVisible(false);
          setActiveFolder(null);
        }}
        currentName={activeFolder?.name || ""}
        onSave={handleRenameSave}
      />

      <ManagePermissionModal
        visible={permissionModalVisible}
        onClose={() => {
          setPermissionModalVisible(false);
          setActiveFolder(null);
        }}
        itemName={activeFolder?.name || ""}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setActiveFolder(null);
        }}
        itemName={activeFolder?.name || ""}
        itemType="folder"
        onConfirm={handleDeleteConfirm}
      />

      <ActionDropdownModal
        visible={dropdownModalVisible}
        onClose={() => setDropdownModalVisible(false)}
        items={dropdownItems}
        anchorPosition={anchorPos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  newFolderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  newFolderBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  foldersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  folderCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  folderPreviewBox: {
    height: 105,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  folderCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 4,
  },
  folderCardName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  folderCardSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  kebabBtn: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptySub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
