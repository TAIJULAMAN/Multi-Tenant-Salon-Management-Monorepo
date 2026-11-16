import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Share,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import * as DocumentPicker from "expo-document-picker";
import CustomModal from "@/components/ui/CustomModal";
import CustomInput from "@/components/ui/CustomInput";

// Interfaces matching accountant-dashboard
export interface FolderItem {
  id: string;
  name: string;
  createdBy: string;
  itemCount?: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size?: string;
  date?: string;
  createdBy: string;
  downloadUrl?: string;
}

export interface PermissionMember {
  id: string;
  name: string;
  email: string;
  role: "View Only" | "Edit Content" | "Add Folder" | "Add Files";
  avatarEmoji: string;
  avatarBg: string;
}

// Initial Mock Data exactly matching web dashboard
const INITIAL_ROOT_FOLDERS: FolderItem[] = [
  { id: "f1", name: "Employees", createdBy: "Maria Rodriguez", itemCount: 16 },
  { id: "f2", name: "Accountant", createdBy: "Maria Rodriguez", itemCount: 8 },
  { id: "f3", name: "Tax & Compliance", createdBy: "Maria Rodriguez", itemCount: 12 },
  { id: "f4", name: "Legal Contracts", createdBy: "Maria Rodriguez", itemCount: 6 },
];

const INITIAL_EMPLOYEE_SUBFOLDERS: FolderItem[] = [
  { id: "emp_1", name: "Maria Rodriguez", createdBy: "Maria Rodriguez", itemCount: 4 },
  { id: "emp_2", name: "Marco Rossi", createdBy: "Maria Rodriguez", itemCount: 3 },
  { id: "emp_3", name: "Sofia Bianchi", createdBy: "Maria Rodriguez", itemCount: 5 },
  { id: "emp_4", name: "Luca Conti", createdBy: "Maria Rodriguez", itemCount: 2 },
  { id: "emp_5", name: "Francesca Neri", createdBy: "Maria Rodriguez", itemCount: 3 },
  { id: "emp_6", name: "Giuseppe Romano", createdBy: "Maria Rodriguez", itemCount: 4 },
];

const INITIAL_CATEGORY_SUBFOLDERS: FolderItem[] = [
  { id: "cat_1", name: "Salaries", createdBy: "Maria Rodriguez", itemCount: 9 },
  { id: "cat_2", name: "Taxes", createdBy: "Maria Rodriguez", itemCount: 6 },
  { id: "cat_3", name: "Contracts", createdBy: "Maria Rodriguez", itemCount: 2 },
];

const INITIAL_ROOT_FILES: FileItem[] = [
  { id: "fi1", name: "August Salary", type: "PDF", size: "1.4 MB", date: "Aug 14, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi2", name: "Sanction", type: "PDF", size: "2.1 MB", date: "Jul 28, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi3", name: "March Salary", type: "PDF", size: "1.2 MB", date: "Apr 02, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi4", name: "May Salary", type: "PDF", size: "1.8 MB", date: "Jun 05, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi5", name: "Sanction", type: "PDF", size: "1.5 MB", date: "May 19, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi6", name: "Sanction", type: "PDF", size: "2.0 MB", date: "May 10, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi7", name: "Sanction", type: "PDF", size: "1.9 MB", date: "Apr 18, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi8", name: "Sanction", type: "PDF", size: "2.3 MB", date: "Mar 22, 2026", createdBy: "Maria Rodriguez" },
];

const INITIAL_SUBFOLDER_FILES: FileItem[] = [
  { id: "subfi1", name: "August Salary", type: "PDF", size: "1.2 MB", date: "Aug 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi2", name: "July Salary", type: "PDF", size: "1.1 MB", date: "Jul 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi3", name: "June Salary", type: "PDF", size: "1.3 MB", date: "Jun 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi4", name: "May Salary", type: "PDF", size: "1.2 MB", date: "May 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi5", name: "April Salary", type: "PDF", size: "1.0 MB", date: "Apr 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi6", name: "Sanction", type: "PDF", size: "850 KB", date: "Jul 01, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi7", name: "Signed Contract", type: "PDF", size: "2.4 MB", date: "Jan 10, 2026", createdBy: "Maria Rodriguez" },
];

const INITIAL_PERMISSION_MEMBERS: PermissionMember[] = [
  { id: "1", name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Edit Content", avatarEmoji: "👩", avatarBg: "#FCE7F3" },
  { id: "2", name: "Roberto Marini", email: "roberto@beautywellness.com", role: "View Only", avatarEmoji: "👨", avatarBg: "#FEF3C7" },
  { id: "3", name: "Darlene Robertson (You)", email: "darlene.accountant@harem.it", role: "Add Files", avatarEmoji: "👩‍💼", avatarBg: "#EEECFF" },
  { id: "4", name: "Marco Rossi (HR)", email: "marco.hr@elitebeauty.com", role: "Add Folder", avatarEmoji: "🧑", avatarBg: "#CCFBF1" },
];

export default function OwnerDocumentsTab() {
  // Navigation Breadcrumb State
  const [currentPath, setCurrentPath] = useState<FolderItem[]>([]);
  const [isGridView, setIsGridView] = useState(true);

  // Data State
  const [rootFolders, setRootFolders] = useState<FolderItem[]>(INITIAL_ROOT_FOLDERS);
  const [employeeSubfolders, setEmployeeSubfolders] = useState<FolderItem[]>(INITIAL_EMPLOYEE_SUBFOLDERS);
  const [categorySubfolders, setCategorySubfolders] = useState<FolderItem[]>(INITIAL_CATEGORY_SUBFOLDERS);
  const [rootFiles, setRootFiles] = useState<FileItem[]>(INITIAL_ROOT_FILES);
  const [subfolderFiles, setSubfolderFiles] = useState<FileItem[]>(INITIAL_SUBFOLDER_FILES);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [permissionMembers, setPermissionMembers] = useState<PermissionMember[]>(INITIAL_PERMISSION_MEMBERS);

  // Modals State
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDocName, setUploadDocName] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; uri: string } | null>(null);

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ id: string; type: "folder" | "file"; currentName: string } | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<{ id: string; type: "folder" | "file"; name: string } | null>(null);
  const [moveSearch, setMoveSearch] = useState("");

  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [permissionTarget, setPermissionTarget] = useState<{ id: string; name: string } | null>(null);

  // Context Menu State
  const [activeItemMenu, setActiveItemMenu] = useState<{ id: string; type: "folder" | "file"; name: string } | null>(null);

  // Determine current active folder list and file list based on path depth
  const depth = currentPath.length;

  const currentFolderList: FolderItem[] =
    depth === 0
      ? rootFolders
      : depth === 1
      ? employeeSubfolders
      : depth === 2
      ? categorySubfolders
      : [];

  const currentFileList: FileItem[] =
    depth === 0
      ? rootFiles
      : subfolderFiles;

  // Folder Drill Down
  const handleOpenFolder = (folder: FolderItem) => {
    setCurrentPath([...currentPath, folder]);
    setSelectedFileIds([]);
    setActiveItemMenu(null);
  };

  const handleGoBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1));
    setSelectedFileIds([]);
    setActiveItemMenu(null);
  };

  const handleGoToRoot = () => {
    setCurrentPath([]);
    setSelectedFileIds([]);
    setActiveItemMenu(null);
  };

  // Selection Handlers
  const handleToggleFileSelection = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiles = () => {
    if (selectedFileIds.length === currentFileList.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(currentFileList.map((f) => f.id));
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Selected",
      `Delete ${selectedFileIds.length} selected document(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (depth === 0) {
              setRootFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id)));
            } else {
              setSubfolderFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id)));
            }
            setSelectedFileIds([]);
            Alert.alert("Deleted", "Selected files were removed.");
          },
        },
      ]
    );
  };

  const handleDownloadSelected = () => {
    Alert.alert("Download", `Downloading ${selectedFileIds.length} file(s) to device storage...`);
  };

  // File Picker
  const handlePickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const sizeInMb = asset.size ? asset.size / (1024 * 1024) : 0;
        const sizeStr = asset.size
          ? sizeInMb >= 1
            ? `${sizeInMb.toFixed(2)} MB`
            : `${(asset.size / 1024).toFixed(0)} KB`
          : "1.2 MB";

        setAttachedFile({
          name: asset.name,
          size: sizeStr,
          uri: asset.uri,
        });

        if (!uploadDocName) {
          setUploadDocName(asset.name.replace(/\.[^/.]+$/, ""));
        }
      }
    } catch (err) {
      Alert.alert("Error", "Could not select document.");
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadDocName.trim()) {
      Alert.alert("Missing Name", "Please enter a name for the document.");
      return;
    }

    const newFile: FileItem = {
      id: `file_${Date.now()}`,
      name: uploadDocName,
      type: "PDF",
      size: attachedFile ? attachedFile.size : "1.4 MB",
      date: "Just now",
      createdBy: "Maria Rodriguez",
      downloadUrl: attachedFile ? attachedFile.uri : undefined,
    };

    if (depth === 0) {
      setRootFiles([newFile, ...rootFiles]);
    } else {
      setSubfolderFiles([newFile, ...subfolderFiles]);
    }

    setIsUploadModalOpen(false);
    setUploadDocName("");
    setAttachedFile(null);
    Alert.alert("Success", `"${newFile.name}" uploaded.`);
  };

  // Create Folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      Alert.alert("Missing Name", "Please enter a name for the folder.");
      return;
    }

    const newF: FolderItem = {
      id: `f_${Date.now()}`,
      name: newFolderName,
      createdBy: "Maria Rodriguez",
      itemCount: 0,
    };

    if (depth === 0) {
      setRootFolders([newF, ...rootFolders]);
    } else if (depth === 1) {
      setEmployeeSubfolders([newF, ...employeeSubfolders]);
    } else if (depth === 2) {
      setCategorySubfolders([newF, ...categorySubfolders]);
    }

    setIsCreateFolderOpen(false);
    setNewFolderName("");
    Alert.alert("Folder Created", `Folder "${newF.name}" created.`);
  };

  // Rename
  const handleRenameSubmit = () => {
    if (!renameTarget || !renameValue.trim()) return;

    if (renameTarget.type === "folder") {
      const updateList = (list: FolderItem[]) =>
        list.map((f) => (f.id === renameTarget.id ? { ...f, name: renameValue } : f));

      if (depth === 0) setRootFolders(updateList);
      else if (depth === 1) setEmployeeSubfolders(updateList);
      else if (depth === 2) setCategorySubfolders(updateList);
    } else {
      const updateFiles = (list: FileItem[]) =>
        list.map((f) => (f.id === renameTarget.id ? { ...f, name: renameValue } : f));

      if (depth === 0) setRootFiles(updateFiles);
      else setSubfolderFiles(updateFiles);
    }

    setIsRenameOpen(false);
    setRenameTarget(null);
    setRenameValue("");
    Alert.alert("Renamed", "Name updated successfully.");
  };

  // Delete
  const handleDeleteItem = (id: string, type: "folder" | "file", name: string) => {
    Alert.alert(
      `Delete ${type === "folder" ? "Folder" : "File"}`,
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (type === "folder") {
              if (depth === 0) setRootFolders((prev) => prev.filter((f) => f.id !== id));
              else if (depth === 1) setEmployeeSubfolders((prev) => prev.filter((f) => f.id !== id));
              else if (depth === 2) setCategorySubfolders((prev) => prev.filter((f) => f.id !== id));
            } else {
              if (depth === 0) setRootFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id) && f.id !== id));
              else setSubfolderFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id) && f.id !== id));
            }
            setActiveItemMenu(null);
          },
        },
      ]
    );
  };

  // Share / Download File
  const handleShareFile = async (name: string, url?: string) => {
    try {
      await Share.share({
        message: url ? `Document ${name}: ${url}` : `Document: ${name}`,
        title: name,
      });
    } catch (e: any) {
      Alert.alert("Share", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Path Breadcrumbs Bar */}
      <View style={styles.breadcrumbCard}>
        <View style={styles.breadcrumbLeft}>
          {depth > 0 ? (
            <TouchableOpacity style={styles.backBtn} onPress={handleGoBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#1F2937" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.homeBtn} onPress={handleGoToRoot} activeOpacity={0.7}>
              <Ionicons name="home-outline" size={16} color="#635BFF" />
            </TouchableOpacity>
          )}

          <View style={styles.pathWrap}>
            <Text style={styles.pathRootText} onPress={handleGoToRoot}>
              Root
            </Text>
            {currentPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <Ionicons name="chevron-forward" size={12} color="#9CA3AF" />
                <Text
                  style={[
                    styles.pathSegmentText,
                    index === currentPath.length - 1 && styles.pathSegmentTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {folder.name}
                </Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.layoutToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isGridView && styles.toggleBtnActive]}
            onPress={() => setIsGridView(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="list" size={15} color={!isGridView ? "#635BFF" : "#9CA3AF"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isGridView && styles.toggleBtnActive]}
            onPress={() => setIsGridView(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="grid" size={15} color={isGridView ? "#635BFF" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Action Cards matching web UploadActions */}
      <View style={styles.actionsGrid}>
        {/* 1. Upload Button */}
        <TouchableOpacity
          style={styles.uploadActionCard}
          onPress={() => setIsUploadModalOpen(true)}
          activeOpacity={0.85}
        >
          <Feather name="upload" size={20} color="#FFFFFF" />
          <Text style={styles.uploadActionTitle}>Upload</Text>
        </TouchableOpacity>

        {/* 2. Create Folder Button */}
        <TouchableOpacity
          style={styles.folderActionCard}
          onPress={() => setIsCreateFolderOpen(true)}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={22} color="#5C59F0" />
          <Text style={styles.folderActionTitle}>Create Folder</Text>
        </TouchableOpacity>
      </View>

      {/* FOLDERS SECTION */}
      {currentFolderList.length > 0 && (
        <View style={styles.whiteSectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionTitle}>
                {depth === 0 ? "Suggested Folders" : "Subfolders"}
              </Text>
            </View>
          </View>

          {isGridView ? (
            <View style={styles.foldersGrid}>
              {currentFolderList.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={styles.folderGridCard}
                  onPress={() => handleOpenFolder(folder)}
                  activeOpacity={0.8}
                >
                  {/* Left-aligned Icon Box with exact folder SVG */}
                  <View style={styles.folderIconBox}>
                    <ExpoImage
                      source={require("../../../assets/appImages/folder.svg")}
                      style={styles.folderSvgIcon}
                      contentFit="contain"
                    />
                  </View>

                  <Text style={styles.folderName} numberOfLines={1}>
                    {folder.name}
                  </Text>
                  <Text style={styles.folderMeta} numberOfLines={1}>
                    Created by {folder.createdBy}
                  </Text>

                  {/* Context Menu Trigger */}
                  <TouchableOpacity
                    style={styles.folderMoreBtn}
                    onPress={() =>
                      setActiveItemMenu({ id: folder.id, type: "folder", name: folder.name })
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="ellipsis-vertical" size={15} color="#94A3B8" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.foldersList}>
              {currentFolderList.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={styles.folderListItem}
                  onPress={() => handleOpenFolder(folder)}
                  activeOpacity={0.8}
                >
                  <View style={styles.folderListLeft}>
                    <View style={styles.folderListIcon}>
                      <ExpoImage
                        source={require("../../../assets/appImages/folder.svg")}
                        style={{ width: 22, height: 22 }}
                        contentFit="contain"
                      />
                    </View>
                    <View>
                      <Text style={styles.folderListName}>{folder.name}</Text>
                      <Text style={styles.folderListMeta}>
                        Created by {folder.createdBy}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.listMoreBtn}
                    onPress={() =>
                      setActiveItemMenu({ id: folder.id, type: "folder", name: folder.name })
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* FILES SECTION */}
      <View style={styles.whiteSectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>
              {depth === 0 ? "Suggested Files" : "Folder Files"}
            </Text>
          </View>

          {depth > 0 && currentFileList.length > 0 && (
            <TouchableOpacity
              style={styles.selectAllBtn}
              onPress={handleSelectAllFiles}
              activeOpacity={0.7}
            >
              <Text style={styles.selectAllText}>
                {selectedFileIds.length === currentFileList.length ? "Unselect All" : "Select All"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Multi-Selection Batch Actions Bar */}
        {selectedFileIds.length > 0 && (
          <View style={styles.batchActionsRow}>
            <Text style={styles.batchSelectedCount}>
              {selectedFileIds.length} Selected
            </Text>
            <View style={styles.batchButtonsWrap}>
              <TouchableOpacity
                style={styles.batchDeleteBtn}
                onPress={handleDeleteSelected}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={13} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.batchDeleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.batchDownloadBtn}
                onPress={handleDownloadSelected}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={13} color="#635BFF" style={{ marginRight: 4 }} />
                <Text style={styles.batchDownloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Files Grid / List */}
        {currentFileList.length === 0 ? (
          <View style={styles.emptyFolderBox}>
            <Ionicons name="folder-open-outline" size={38} color="#D1D5DB" />
            <Text style={styles.emptyFolderTitle}>This folder is empty</Text>
            <Text style={styles.emptyFolderSub}>Upload a file or create a subfolder to get started.</Text>
          </View>
        ) : isGridView ? (
          <View style={styles.filesGrid}>
            {currentFileList.map((file) => {
              const isSelected = selectedFileIds.includes(file.id);
              return (
                <View
                  key={file.id}
                  style={[styles.fileGridCard, isSelected && styles.fileGridCardSelected]}
                >
                  {/* Optional Checkbox in multi-select */}
                  {depth > 0 && (
                    <TouchableOpacity
                      style={styles.fileCheckbox}
                      onPress={() => handleToggleFileSelection(file.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={18}
                        color={isSelected ? "#635BFF" : "#9CA3AF"}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Clean White Container Box for Document Preview Graphic (Flat, No Shadow) */}
                  <View style={styles.filePreviewWhiteBox}>
                    <ExpoImage
                      source={require("../../../assets/appImages/fileImage.png")}
                      style={styles.filePreviewImage}
                      contentFit="contain"
                    />
                  </View>

                  {/* Card Bottom Details */}
                  <View style={styles.cardBottomInfoRow}>
                    <View style={styles.cardBottomTextWrap}>
                      <Text style={styles.fileNameText} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileMetaText} numberOfLines={1}>
                        {file.type} • Created by {file.createdBy}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.cardMoreBtn}
                      onPress={() =>
                        setActiveItemMenu({ id: file.id, type: "file", name: file.name })
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.filesList}>
            {currentFileList.map((file) => {
              const isSelected = selectedFileIds.includes(file.id);
              return (
                <View
                  key={file.id}
                  style={[styles.fileListItem, isSelected && styles.fileListItemSelected]}
                >
                  <View style={styles.fileListLeft}>
                    {depth > 0 && (
                      <TouchableOpacity
                        onPress={() => handleToggleFileSelection(file.id)}
                        style={{ marginRight: 8 }}
                      >
                        <Ionicons
                          name={isSelected ? "checkbox" : "square-outline"}
                          size={18}
                          color={isSelected ? "#635BFF" : "#9CA3AF"}
                        />
                      </TouchableOpacity>
                    )}
                    <View style={styles.fileListIcon}>
                      <Ionicons name="document-text" size={18} color="#635BFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileListName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileListMeta}>
                        {file.type} • Created by {file.createdBy}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.fileListRightActions}>
                    <TouchableOpacity
                      style={styles.listIconAction}
                      onPress={() => handleShareFile(file.name, file.downloadUrl)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-social-outline" size={16} color="#635BFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.listIconAction}
                      onPress={() =>
                        setActiveItemMenu({ id: file.id, type: "file", name: file.name })
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="ellipsis-vertical" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* ================= MODALS ================= */}

      {/* 1. Item Context Action Sheet Modal */}
      {activeItemMenu && (
        <CustomModal
          visible={!!activeItemMenu}
          onClose={() => setActiveItemMenu(null)}
          title={activeItemMenu.name}
        >
          <View style={styles.modalMenuContent}>
            {/* Rename */}
            <TouchableOpacity
              style={styles.modalMenuItem}
              onPress={() => {
                setRenameTarget({
                  id: activeItemMenu.id,
                  type: activeItemMenu.type,
                  currentName: activeItemMenu.name,
                });
                setRenameValue(activeItemMenu.name);
                setActiveItemMenu(null);
                setIsRenameOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={16} color="#1F2937" style={{ marginRight: 10 }} />
              <Text style={styles.modalMenuText}>Rename {activeItemMenu.type}</Text>
            </TouchableOpacity>

            {/* Move */}
            <TouchableOpacity
              style={styles.modalMenuItem}
              onPress={() => {
                setMoveTarget({
                  id: activeItemMenu.id,
                  type: activeItemMenu.type,
                  name: activeItemMenu.name,
                });
                setActiveItemMenu(null);
                setIsMoveOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="folder-open-outline" size={16} color="#1F2937" style={{ marginRight: 10 }} />
              <Text style={styles.modalMenuText}>Move to Folder</Text>
            </TouchableOpacity>

            {/* Permissions (For Folders) */}
            {activeItemMenu.type === "folder" && (
              <TouchableOpacity
                style={styles.modalMenuItem}
                onPress={() => {
                  setPermissionTarget({ id: activeItemMenu.id, name: activeItemMenu.name });
                  setActiveItemMenu(null);
                  setIsPermissionsOpen(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="people-outline" size={16} color="#1F2937" style={{ marginRight: 10 }} />
                <Text style={styles.modalMenuText}>Manage Permissions</Text>
              </TouchableOpacity>
            )}

            {/* Download */}
            <TouchableOpacity
              style={styles.modalMenuItem}
              onPress={() => {
                Alert.alert("Download", `Downloading ${activeItemMenu.name}...`);
                setActiveItemMenu(null);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={16} color="#1F2937" style={{ marginRight: 10 }} />
              <Text style={styles.modalMenuText}>Download Copy</Text>
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              style={[styles.modalMenuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                const target = { ...activeItemMenu };
                setActiveItemMenu(null);
                handleDeleteItem(target.id, target.type, target.name);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" style={{ marginRight: 10 }} />
              <Text style={[styles.modalMenuText, { color: "#EF4444", fontWeight: "700" }]}>
                Delete {activeItemMenu.type}
              </Text>
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}

      {/* 2. Create Folder Modal */}
      <CustomModal
        visible={isCreateFolderOpen}
        onClose={() => {
          setIsCreateFolderOpen(false);
          setNewFolderName("");
        }}
        title="Create New Folder"
      >
        <View style={{ paddingTop: 4 }}>
          <CustomInput
            label="Folder Name *"
            value={newFolderName}
            onChangeText={setNewFolderName}
            placeholder="e.g. Invoices 2026"
            iconName="folder-outline"
          />
          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsCreateFolderOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleCreateFolder}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSubmitBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* 3. Upload File Modal */}
      <CustomModal
        visible={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadDocName("");
          setAttachedFile(null);
        }}
        title="Upload Document"
      >
        <View style={{ paddingTop: 4 }}>
          <CustomInput
            label="Document Title *"
            value={uploadDocName}
            onChangeText={setUploadDocName}
            placeholder="e.g. Employee Agreement 2026"
            iconName="document-text-outline"
          />

          <Text style={styles.inputLabel}>Attach Document *</Text>
          {attachedFile ? (
            <View style={styles.fileAttachedBox}>
              <Ionicons name="document-text" size={24} color="#635BFF" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.attachedFileName} numberOfLines={1}>
                  {attachedFile.name}
                </Text>
                <Text style={styles.attachedFileSize}>{attachedFile.size}</Text>
              </View>
              <TouchableOpacity onPress={() => setAttachedFile(null)}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.filePickBox} onPress={handlePickFile} activeOpacity={0.8}>
              <Ionicons name="cloud-upload-outline" size={28} color="#635BFF" />
              <Text style={styles.filePickTitle}>Tap to select PDF or image</Text>
              <Text style={styles.filePickSub}>Max file size: 25MB</Text>
            </TouchableOpacity>
          )}

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsUploadModalOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleUploadSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSubmitBtnText}>Save & Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* 4. Rename Modal */}
      <CustomModal
        visible={isRenameOpen}
        onClose={() => {
          setIsRenameOpen(false);
          setRenameTarget(null);
        }}
        title={`Rename ${renameTarget?.type === "folder" ? "Folder" : "File"}`}
      >
        <View style={{ paddingTop: 4 }}>
          <CustomInput
            label="New Name *"
            value={renameValue}
            onChangeText={setRenameValue}
            placeholder="Enter new name"
          />
          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setIsRenameOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleRenameSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.modalSubmitBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      {/* 5. Move Modal */}
      <CustomModal
        visible={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        title={`Move "${moveTarget?.name}"`}
      >
        <View style={{ paddingTop: 4 }}>
          <CustomInput
            label="Search Destination Folder"
            value={moveSearch}
            onChangeText={setMoveSearch}
            placeholder="e.g. Employees, Contracts..."
            iconName="search-outline"
          />

          <Text style={styles.inputLabel}>Available Directories</Text>
          <ScrollView style={{ maxHeight: 180, marginBottom: 14 }}>
            {["Root", "Employees", "Accountant", "Tax & Compliance", "Legal Contracts"]
              .filter((name) => name.toLowerCase().includes(moveSearch.toLowerCase()))
              .map((dest, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.moveDestItem}
                  onPress={() => {
                    setIsMoveOpen(false);
                    Alert.alert("Moved", `"${moveTarget?.name}" moved to "${dest}".`);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="folder" size={18} color="#635BFF" style={{ marginRight: 8 }} />
                  <Text style={styles.moveDestName}>{dest}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.modalCancelBtn, { width: "100%" }]}
            onPress={() => setIsMoveOpen(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.modalCancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      {/* 6. Manage Permissions Modal */}
      <CustomModal
        visible={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        title={`Permissions: ${permissionTarget?.name}`}
      >
        <View style={{ paddingTop: 4 }}>
          <Text style={styles.inputLabel}>Team Access Members</Text>
          <ScrollView style={{ maxHeight: 220, marginBottom: 14 }}>
            {permissionMembers.map((member) => (
              <View key={member.id} style={styles.permMemberRow}>
                <View style={styles.permAvatarWrap}>
                  <Text style={{ fontSize: 16 }}>{member.avatarEmoji}</Text>
                </View>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.permMemberName} numberOfLines={1}>
                    {member.name}
                  </Text>
                  <Text style={styles.permMemberEmail} numberOfLines={1}>
                    {member.email}
                  </Text>
                </View>
                <View style={styles.permRoleBadge}>
                  <Text style={styles.permRoleText}>{member.role}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.modalSubmitBtn, { width: "100%" }]}
            onPress={() => {
              setIsPermissionsOpen(false);
              Alert.alert("Permissions Saved", "Access control updated.");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.modalSubmitBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 24,
  },
  breadcrumbCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  breadcrumbLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  backBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    marginRight: 6,
  },
  homeBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: "#EEECFF",
    marginRight: 6,
  },
  pathWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  pathRootText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  pathSegmentText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  pathSegmentTextActive: {
    color: "#111827",
    fontWeight: "700",
  },
  layoutToggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  uploadActionCard: {
    flex: 1,
    backgroundColor: "#5C59F0",
    borderRadius: 14,
    height: 84,
    padding: 14,
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#5C59F0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadActionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  folderActionCard: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    height: 84,
    padding: 14,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  folderActionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5C59F0",
  },
  whiteSectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  selectAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#EEECFF",
    borderRadius: 6,
  },
  selectAllText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#635BFF",
  },
  batchActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCD7FE",
  },
  batchSelectedCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  batchButtonsWrap: {
    flexDirection: "row",
    gap: 8,
  },
  batchDeleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  batchDeleteText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#EF4444",
  },
  batchDownloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  batchDownloadText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#635BFF",
  },
  foldersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  folderGridCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
  },
  folderIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  folderSvgIcon: {
    width: 24,
    height: 24,
  },
  folderName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
    paddingRight: 16,
  },
  folderMeta: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },
  folderMoreBtn: {
    position: "absolute",
    top: 10,
    right: 8,
    padding: 4,
  },
  foldersList: {
    gap: 8,
  },
  folderListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  folderListLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  folderListIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  folderListName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  folderListMeta: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  listMoreBtn: {
    padding: 4,
  },
  emptyFolderBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyFolderTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginTop: 6,
  },
  emptyFolderSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  filesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  fileGridCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  fileGridCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEECFF",
  },
  fileCheckbox: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  filePreviewWhiteBox: {
    width: "100%",
    height: 96,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  filePreviewImage: {
    width: "92%",
    height: "88%",
  },
  cardBottomInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    paddingHorizontal: 2,
  },
  cardBottomTextWrap: {
    flex: 1,
    marginRight: 4,
  },
  fileNameText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  fileMetaText: {
    fontSize: 9.5,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 2,
  },
  cardMoreBtn: {
    padding: 2,
  },
  filesList: {
    gap: 8,
  },
  fileListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  fileListItemSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEECFF",
  },
  fileListLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  fileListIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  fileListName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  fileListMeta: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  fileListRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  listIconAction: {
    padding: 4,
  },
  modalMenuContent: {
    paddingTop: 4,
  },
  modalMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalMenuText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  fileAttachedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },
  attachedFileName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1F2937",
  },
  attachedFileSize: {
    fontSize: 10,
    color: "#6B7280",
  },
  filePickBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9FF",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#635BFF",
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 14,
  },
  filePickTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
    marginTop: 4,
  },
  filePickSub: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  modalCancelBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  modalSubmitBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmitBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  moveDestItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  moveDestName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  permMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  permAvatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  permMemberName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
  },
  permMemberEmail: {
    fontSize: 10,
    color: "#6B7280",
  },
  permRoleBadge: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  permRoleText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#635BFF",
  },
});
