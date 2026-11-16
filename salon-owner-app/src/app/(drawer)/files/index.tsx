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
import { useRouter, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FolderData,
  FileData,
  INITIAL_FOLDERS,
  INITIAL_FILES,
  getFileTypeBadgeStyle,
} from "@/components/files/filesData";

import UploadFileModal from "@/components/files/modals/UploadFileModal";
import CreateFolderModal from "@/components/files/modals/CreateFolderModal";
import RenameModal from "@/components/files/modals/RenameModal";
import MoveModal from "@/components/files/modals/MoveModal";
import ManagePermissionModal from "@/components/files/modals/ManagePermissionModal";
import DeleteConfirmModal from "@/components/files/modals/DeleteConfirmModal";
import ActionDropdownModal, { ActionDropdownItem } from "@/components/files/modals/ActionDropdownModal";

export default function FilesHomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [folders, setFolders] = useState<FolderData[]>(INITIAL_FOLDERS);
  const [files, setFiles] = useState<FileData[]>(INITIAL_FILES);

  // Modals state
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [createFolderModalVisible, setCreateFolderModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number; width?: number; height?: number } | null>(null);

  const [activeItem, setActiveItem] = useState<{ id: string; name: string; type: "file" | "folder" } | null>(null);

  const filteredFolders = useMemo(() => {
    return folders.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.createdBy.toLowerCase().includes(search.toLowerCase())
    );
  }, [folders, search]);

  const filteredFiles = useMemo(() => {
    return files.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase()) ||
      f.createdBy.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const handleCreateFolder = (newF: FolderData) => {
    setFolders([newF, ...folders]);
  };

  const handleUploadFile = (newFile: FileData) => {
    setFiles([newFile, ...files]);
  };

  const handleRenameSave = (newName: string) => {
    if (!activeItem) return;
    if (activeItem.type === "folder") {
      setFolders(folders.map((f) => (f.id === activeItem.id ? { ...f, name: newName } : f)));
    } else {
      setFiles(files.map((fl) => (fl.id === activeItem.id ? { ...fl, name: newName } : fl)));
    }
  };

  const handleMoveItem = (targetFolderId: string) => {
    if (!activeItem) return;
    if (activeItem.type === "file") {
      setFiles(files.map((fl) => (fl.id === activeItem.id ? { ...fl, folderId: targetFolderId } : fl)));
    }
  };

  const handleDeleteConfirm = () => {
    if (!activeItem) return;
    if (activeItem.type === "folder") {
      setFolders(folders.filter((f) => f.id !== activeItem.id));
    } else {
      setFiles(files.filter((fl) => fl.id !== activeItem.id));
    }
    setDeleteModalVisible(false);
    setActiveItem(null);
  };

  const openActionMenu = (
    item: { id: string; name: string; type: "file" | "folder" },
    e?: any
  ) => {
    setActiveItem(item);
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
      onPress: () => Alert.alert("Download Started", `Downloading "${activeItem?.name}"...`),
    },
    {
      id: "move",
      label: "Move",
      iconName: "move-outline",
      iconColor: "#A855F7",
      onPress: () => setMoveModalVisible(true),
    },
    ...(activeItem?.type === "file"
      ? [
          {
            id: "share",
            label: "Publish social media post",
            iconName: "share-social-outline" as const,
            iconColor: "#2DD4BF",
            onPress: () => Alert.alert("Social Post", `Preparing post with "${activeItem?.name}" attached.`),
          },
        ]
      : []),
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
        <TouchableOpacity style={styles.drawerBtn} onPress={handleOpenDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Files</Text>
          <Text style={styles.headerSubtitle}>Documents, media & salon records</Text>
        </View>

        <TouchableOpacity
          style={styles.headerUploadBtn}
          onPress={() => setUploadModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
          <Text style={styles.headerUploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search folders and documents..."
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
        {/* Quick Action Tiles */}
        <View style={styles.actionTilesRow}>
          <TouchableOpacity
            style={styles.uploadTile}
            onPress={() => setUploadModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconCircleWhite}>
              <Ionicons name="cloud-upload" size={22} color="#635BFF" />
            </View>
            <View>
              <Text style={styles.uploadTileTitle}>Upload</Text>
              <Text style={styles.uploadTileSub}>Add documents or media</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createFolderTile}
            onPress={() => setCreateFolderModalVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.tileIconCirclePurple}>
              <Ionicons name="folder-outline" size={22} color="#635BFF" />
            </View>
            <View>
              <Text style={styles.createFolderTitle}>Create Folder</Text>
              <Text style={styles.createFolderSub}>Organize your files</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Suggested Folders Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Suggested Folders</Text>
            <TouchableOpacity
              style={styles.viewMoreBtn}
              onPress={() => router.push("/(drawer)/files/folders" as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreBtnText}>View More</Text>
              <Ionicons name="chevron-forward" size={14} color="#635BFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.foldersVerticalGrid}>
            {(search.length > 0 ? filteredFolders : filteredFolders.slice(0, 4)).map((folder) => (
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
                  <Ionicons name="folder" size={52} color="#A5B4FC" />
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
                      openActionMenu({ id: folder.id, name: folder.name, type: "folder" }, e);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Suggested Files Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Suggested Files</Text>
            <View style={styles.viewModeSwitcher}>
              <TouchableOpacity
                style={[styles.viewModeBtn, viewMode === "list" && styles.viewModeBtnActive]}
                onPress={() => setViewMode("list")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="list"
                  size={16}
                  color={viewMode === "list" ? "#635BFF" : "#94A3B8"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeBtn, viewMode === "grid" && styles.viewModeBtnActive]}
                onPress={() => setViewMode("grid")}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="grid"
                  size={16}
                  color={viewMode === "grid" ? "#635BFF" : "#94A3B8"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {viewMode === "list" ? (
            /* LIST VIEW */
            <View style={styles.filesList}>
              {filteredFiles.map((file) => {
                const badge = getFileTypeBadgeStyle(file.type);
                return (
                  <View key={file.id} style={styles.fileListItem}>
                    <View style={[styles.fileTypeBadge, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon as any} size={18} color={badge.text} />
                    </View>

                    <View style={styles.fileListInfo}>
                      <Text style={styles.fileListName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileListMeta}>
                        {file.type} • {file.size} • {file.createdBy}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.kebabBtn}
                      onPress={(e) => openActionMenu({ id: file.id, name: file.name, type: "file" }, e)}
                    >
                      <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : (
            /* GRID VIEW */
            <View style={styles.filesGrid}>
              {filteredFiles.map((file) => {
                const badge = getFileTypeBadgeStyle(file.type);
                return (
                  <View key={file.id} style={styles.fileGridCard}>
                    <View style={styles.fileGridPreview}>
                      <View style={[styles.fileTypeBadgeLarge, { backgroundColor: badge.bg }]}>
                        <Ionicons name={badge.icon as any} size={28} color={badge.text} />
                      </View>
                    </View>

                    <View style={styles.fileGridFooter}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.fileGridName} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text style={styles.fileGridMeta}>
                          {file.type} • {file.size}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.kebabBtn}
                        onPress={(e) => openActionMenu({ id: file.id, name: file.name, type: "file" }, e)}
                      >
                        <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {filteredFiles.length === 0 && (
            <View style={styles.emptyFilesBox}>
              <Ionicons name="document-outline" size={38} color="#CBD5E1" />
              <Text style={styles.emptyFilesTitle}>No files found</Text>
              <Text style={styles.emptyFilesSub}>Upload your first document to store securely.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <UploadFileModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        folders={folders}
        onUpload={handleUploadFile}
      />

      <CreateFolderModal
        visible={createFolderModalVisible}
        onClose={() => setCreateFolderModalVisible(false)}
        onCreate={handleCreateFolder}
      />

      <RenameModal
        visible={renameModalVisible}
        onClose={() => {
          setRenameModalVisible(false);
          setActiveItem(null);
        }}
        currentName={activeItem?.name || ""}
        onSave={handleRenameSave}
      />

      <MoveModal
        visible={moveModalVisible}
        onClose={() => {
          setMoveModalVisible(false);
          setActiveItem(null);
        }}
        itemName={activeItem?.name || ""}
        folders={folders}
        onMove={handleMoveItem}
      />

      <ManagePermissionModal
        visible={permissionModalVisible}
        onClose={() => {
          setPermissionModalVisible(false);
          setActiveItem(null);
        }}
        itemName={activeItem?.name || ""}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setActiveItem(null);
        }}
        itemName={activeItem?.name || ""}
        itemType={activeItem?.type || "file"}
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
  drawerBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  headerUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  headerUploadBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
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
    gap: 16,
  },
  actionTilesRow: {
    flexDirection: "row",
    gap: 12,
  },
  uploadTile: {
    flex: 1,
    backgroundColor: "#635BFF",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  tileIconCircleWhite: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTileTitle: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
  },
  uploadTileSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "rgba(255, 255, 255, 0.8)",
  },
  createFolderTile: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    padding: 16,
    gap: 12,
  },
  tileIconCirclePurple: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  createFolderTitle: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#635BFF",
  },
  createFolderSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  viewMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  viewMoreBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  foldersVerticalGrid: {
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
    height: 100,
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
    fontSize: 12,
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
  viewModeSwitcher: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  viewModeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewModeBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filesList: {
    gap: 8,
  },
  fileListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  fileTypeBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fileListInfo: {
    flex: 1,
    gap: 2,
  },
  fileListName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  fileListMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  filesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  fileGridCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  fileGridPreview: {
    height: 90,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  fileTypeBadgeLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fileGridFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 4,
  },
  fileGridName: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  fileGridMeta: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  emptyFilesBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: 6,
  },
  emptyFilesTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptyFilesSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
