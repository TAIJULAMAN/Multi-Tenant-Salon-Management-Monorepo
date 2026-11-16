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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  FileData,
  INITIAL_FILES,
  INITIAL_FOLDERS,
  getFileTypeBadgeStyle,
} from "@/components/files/filesData";

import UploadFileModal from "@/components/files/modals/UploadFileModal";
import RenameModal from "@/components/files/modals/RenameModal";
import MoveModal from "@/components/files/modals/MoveModal";
import ManagePermissionModal from "@/components/files/modals/ManagePermissionModal";
import DeleteConfirmModal from "@/components/files/modals/DeleteConfirmModal";
import ActionDropdownModal, { ActionDropdownItem } from "@/components/files/modals/ActionDropdownModal";

export default function FolderDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const folderId = (params.id as string) || "1";
  const folderName = (params.name as string) || "Folder";

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const [files, setFiles] = useState<FileData[]>(
    INITIAL_FILES.map((f, i) => ({ ...f, folderId: folderId, id: `f_${folderId}_${i + 1}` }))
  );

  // Modals state
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number; width?: number; height?: number } | null>(null);

  const [activeFile, setActiveFile] = useState<FileData | null>(null);

  const filteredFiles = useMemo(() => {
    return files.filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  const toggleSelect = (id: string) => {
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds(selectedFileIds.filter((i) => i !== id));
    } else {
      setSelectedFileIds([...selectedFileIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFileIds.length === filteredFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(filteredFiles.map((f) => f.id));
    }
  };

  const handleUploadFile = (newFile: FileData) => {
    setFiles([{ ...newFile, folderId }, ...files]);
  };

  const handleRenameSave = (newName: string) => {
    if (!activeFile) return;
    setFiles(files.map((fl) => (fl.id === activeFile.id ? { ...fl, name: newName } : fl)));
  };

  const handleMoveFile = (targetFolderId: string) => {
    if (!activeFile) return;
    setFiles(files.filter((fl) => fl.id !== activeFile.id));
  };

  const handleDeleteConfirm = () => {
    if (selectedFileIds.length > 0) {
      setFiles(files.filter((fl) => !selectedFileIds.includes(fl.id)));
      setSelectedFileIds([]);
    } else if (activeFile) {
      setFiles(files.filter((fl) => fl.id !== activeFile.id));
    }
    setDeleteModalVisible(false);
    setActiveFile(null);
  };

  const openActionMenu = (file: FileData, e?: any) => {
    setActiveFile(file);
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
      onPress: () => Alert.alert("Download Started", `Downloading "${activeFile?.name}"...`),
    },
    {
      id: "move",
      label: "Move",
      iconName: "move-outline",
      iconColor: "#A855F7",
      onPress: () => setMoveModalVisible(true),
    },
    {
      id: "share",
      label: "Publish social media post",
      iconName: "share-social-outline",
      iconColor: "#2DD4BF",
      onPress: () => Alert.alert("Social Media", `Preparing post with "${activeFile?.name}" attached.`),
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
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {folderName}
          </Text>
          <Text style={styles.headerSubtitle}>{files.length} documents</Text>
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

      {/* Action Toolbar */}
      <View style={styles.selectionToolbar}>
        <View style={styles.selectionActionsRow}>
          <TouchableOpacity
            style={styles.selectAllBtn}
            onPress={handleSelectAll}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                selectedFileIds.length > 0 && selectedFileIds.length === filteredFiles.length
                  ? "checkbox"
                  : selectedFileIds.length > 0
                  ? "remove-circle"
                  : "square-outline"
              }
              size={18}
              color="#635BFF"
            />
            <Text style={styles.selectAllText}>
              {selectedFileIds.length > 0 ? `${selectedFileIds.length} Selected` : "Select All"}
            </Text>
          </TouchableOpacity>

          {selectedFileIds.length > 0 && (
            <TouchableOpacity
              style={styles.selectionActionBtnDelete}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Ionicons name="trash-outline" size={15} color="#EF4444" />
              <Text style={[styles.selectionActionText, { color: "#EF4444" }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.viewModeSwitcher}>
          <TouchableOpacity
            style={[styles.viewModeBtn, viewMode === "list" && styles.viewModeBtnActive]}
            onPress={() => setViewMode("list")}
            activeOpacity={0.7}
          >
            <Ionicons name="list" size={16} color={viewMode === "list" ? "#635BFF" : "#94A3B8"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeBtn, viewMode === "grid" && styles.viewModeBtnActive]}
            onPress={() => setViewMode("grid")}
            activeOpacity={0.7}
          >
            <Ionicons name="grid" size={16} color={viewMode === "grid" ? "#635BFF" : "#94A3B8"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search files in ${folderName}...`}
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
        {viewMode === "list" ? (
          /* LIST VIEW */
          <View style={styles.filesList}>
            {filteredFiles.map((file) => {
              const badge = getFileTypeBadgeStyle(file.type);
              const isSelected = selectedFileIds.includes(file.id);

              return (
                <TouchableOpacity
                  key={file.id}
                  style={[styles.fileListItem, isSelected && styles.fileListItemSelected]}
                  onPress={() => toggleSelect(file.id)}
                  activeOpacity={0.7}
                >
                  <TouchableOpacity style={styles.checkboxBtn} onPress={() => toggleSelect(file.id)}>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={18}
                      color={isSelected ? "#635BFF" : "#94A3B8"}
                    />
                  </TouchableOpacity>

                  <View style={[styles.fileTypeBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={18} color={badge.text} />
                  </View>

                  <View style={styles.fileListInfo}>
                    <Text style={styles.fileListName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileListMeta}>
                      {file.type} • {file.size} • {file.updatedAt || file.createdBy}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.kebabBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      openActionMenu(file, e);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          /* GRID VIEW */
          <View style={styles.filesGrid}>
            {filteredFiles.map((file) => {
              const badge = getFileTypeBadgeStyle(file.type);
              const isSelected = selectedFileIds.includes(file.id);

              return (
                <TouchableOpacity
                  key={file.id}
                  style={[styles.fileGridCard, isSelected && styles.fileGridCardSelected]}
                  onPress={() => toggleSelect(file.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.fileGridPreview}>
                    <View style={[styles.fileTypeBadgeLarge, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon as any} size={28} color={badge.text} />
                    </View>
                    <View style={styles.gridSelectCorner}>
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={18}
                        color={isSelected ? "#635BFF" : "#94A3B8"}
                      />
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
                      onPress={(e) => {
                        e.stopPropagation();
                        openActionMenu(file, e);
                      }}
                    >
                      <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {filteredFiles.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Folder is empty</Text>
            <Text style={styles.emptySub}>Upload documents directly into this folder.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <UploadFileModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        folders={INITIAL_FOLDERS}
        onUpload={handleUploadFile}
      />

      <RenameModal
        visible={renameModalVisible}
        onClose={() => {
          setRenameModalVisible(false);
          setActiveFile(null);
        }}
        currentName={activeFile?.name || ""}
        onSave={handleRenameSave}
      />

      <MoveModal
        visible={moveModalVisible}
        onClose={() => {
          setMoveModalVisible(false);
          setActiveFile(null);
        }}
        itemName={activeFile?.name || ""}
        folders={INITIAL_FOLDERS}
        onMove={handleMoveFile}
      />

      <ManagePermissionModal
        visible={permissionModalVisible}
        onClose={() => {
          setPermissionModalVisible(false);
          setActiveFile(null);
        }}
        itemName={activeFile?.name || ""}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setActiveFile(null);
        }}
        itemName={
          selectedFileIds.length > 0
            ? `${selectedFileIds.length} files`
            : activeFile?.name || ""
        }
        itemType="file"
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
  headerUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  headerUploadBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  selectionToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#C7D2FE",
  },
  selectionCountText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  selectionActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectionActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  selectionActionBtnDelete: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  selectionActionText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  viewModeSwitcher: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  viewModeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
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
  selectAllBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  selectAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectAllText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
    gap: 10,
  },
  fileListItemSelected: {
    borderColor: "#C7D2FE",
    backgroundColor: "#F5F3FF",
  },
  fileTypeBadge: {
    width: 36,
    height: 36,
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
  fileGridCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  fileGridPreview: {
    height: 90,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    position: "relative",
  },
  gridSelectCorner: {
    position: "absolute",
    top: 6,
    right: 6,
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
