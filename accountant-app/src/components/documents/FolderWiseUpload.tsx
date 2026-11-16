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
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import CustomModal from "@/components/ui/CustomModal";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";

// Interfaces
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
  size: string;
  date: string;
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

// Initial Data matching accountant-dashboard
const INITIAL_ROOT_FOLDERS: FolderItem[] = [
  { id: "f1", name: "Employees", createdBy: "Maria Rodriguez", itemCount: 16 },
  { id: "f2", name: "Accountant", createdBy: "Maria Rodriguez", itemCount: 8 },
  { id: "f3", name: "Tax & Compliance", createdBy: "Maria Rodriguez", itemCount: 12 },
  { id: "f4", name: "Legal Contracts", createdBy: "Maria Rodriguez", itemCount: 6 },
  { id: "f5", name: "Salon Licenses", createdBy: "Maria Rodriguez", itemCount: 4 },
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
  { id: "cat_1", name: "Salaries & Payroll", createdBy: "Maria Rodriguez", itemCount: 9 },
  { id: "cat_2", name: "Tax F24 Receipts", createdBy: "Maria Rodriguez", itemCount: 6 },
  { id: "cat_3", name: "Employment Contracts", createdBy: "Maria Rodriguez", itemCount: 2 },
];

const INITIAL_ROOT_FILES: FileItem[] = [
  { id: "fi1", name: "August Salary Slip.pdf", type: "PDF", size: "1.4 MB", date: "Aug 14, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi2", name: "Workplace Health Sanction.pdf", type: "PDF", size: "2.1 MB", date: "Jul 28, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi3", name: "March Salary Overview.pdf", type: "PDF", size: "1.2 MB", date: "Apr 02, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi4", name: "May Salary Register.pdf", type: "PDF", size: "1.8 MB", date: "Jun 05, 2026", createdBy: "Maria Rodriguez" },
  { id: "fi5", name: "INPS Compliance Certificate.pdf", type: "PDF", size: "3.5 MB", date: "May 19, 2026", createdBy: "Maria Rodriguez" },
];

const INITIAL_SUBFOLDER_FILES: FileItem[] = [
  { id: "subfi1", name: "August Salary Statement.pdf", type: "PDF", size: "1.2 MB", date: "Aug 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi2", name: "July Salary Statement.pdf", type: "PDF", size: "1.1 MB", date: "Jul 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi3", name: "June Salary Statement.pdf", type: "PDF", size: "1.3 MB", date: "Jun 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi4", name: "May Salary Statement.pdf", type: "PDF", size: "1.2 MB", date: "May 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi5", name: "April Salary Statement.pdf", type: "PDF", size: "1.0 MB", date: "Apr 15, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi6", name: "Q2 Performance Commission.pdf", type: "PDF", size: "850 KB", date: "Jul 01, 2026", createdBy: "Maria Rodriguez" },
  { id: "subfi7", name: "Signed Contract Amendment.pdf", type: "PDF", size: "2.4 MB", date: "Jan 10, 2026", createdBy: "Maria Rodriguez" },
];

const INITIAL_PERMISSION_MEMBERS: PermissionMember[] = [
  { id: "1", name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Edit Content", avatarEmoji: "👩", avatarBg: "#FCE7F3" },
  { id: "2", name: "Roberto Marini", email: "roberto@beautywellness.com", role: "View Only", avatarEmoji: "👨", avatarBg: "#FEF3C7" },
  { id: "3", name: "Darlene Robertson (You)", email: "darlene.accountant@harem.it", role: "Add Files", avatarEmoji: "👩💼", avatarBg: "#EEECFF" },
  { id: "4", name: "Marco Rossi (HR)", email: "marco.hr@elitebeauty.com", role: "Add Folder", avatarEmoji: "🧑", avatarBg: "#CCFBF1" },
];

export default function FolderWiseUpload() {
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

      if (!res.canceled) {
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
      name: uploadDocName.endsWith(".pdf") ? uploadDocName : `${uploadDocName}.pdf`,
      type: "PDF",
      size: attachedFile ? attachedFile.size : "1.4 MB",
      date: "Just now",
      createdBy: "Accountant (You)",
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
    Alert.alert("Success", `"${newFile.name}" uploaded to ${depth > 0 ? currentPath[currentPath.length - 1].name : "Root"}.`);
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
      createdBy: "Accountant (You)",
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
    Alert.alert("Folder Created", `Folder "${newF.name}" created successfully.`);
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
              if (depth === 0) setRootFiles((prev) => prev.filter((f) => f.id !== id));
              else setSubfolderFiles((prev) => prev.filter((f) => f.id !== id));
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
              <Ionicons name="arrow-back" size={20} color="#1F2937" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.homeBtn} onPress={handleGoToRoot} activeOpacity={0.7}>
              <Ionicons name="home-outline" size={18} color="#635BFF" />
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
            <Ionicons name="list" size={16} color={!isGridView ? "#635BFF" : "#9CA3AF"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isGridView && styles.toggleBtnActive]}
            onPress={() => setIsGridView(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="grid" size={16} color={isGridView ? "#635BFF" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Big Action Cards: Upload & Create Folder */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.uploadActionCard}
          onPress={() => setIsUploadModalOpen(true)}
          activeOpacity={0.85}
        >
          <View style={styles.uploadActionIconWrap}>
            <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.uploadActionTitle}>Upload File</Text>
          <Text style={styles.uploadActionSub}>
            Add PDF or documents to {depth > 0 ? currentPath[currentPath.length - 1].name : "Root"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.folderActionCard}
          onPress={() => setIsCreateFolderOpen(true)}
          activeOpacity={0.85}
        >
          <View style={styles.folderActionIconWrap}>
            <Ionicons name="folder-open" size={24} color="#635BFF" />
          </View>
          <Text style={styles.folderActionTitle}>New Folder</Text>
          <Text style={styles.folderActionSub}>Organize into directories</Text>
        </TouchableOpacity>
      </View>

      {/* FOLDERS SECTION */}
      {currentFolderList.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="folder" size={18} color="#635BFF" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>
                {depth === 0 ? "Suggested Folders" : "Subfolders"} ({currentFolderList.length})
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
                  <View style={styles.folderIconBox}>
                    <Ionicons name="folder" size={36} color="#635BFF" />
                  </View>
                  <Text style={styles.folderName} numberOfLines={1}>
                    {folder.name}
                  </Text>
                  <Text style={styles.folderMeta}>
                    {folder.itemCount !== undefined ? `${folder.itemCount} items` : `By ${folder.createdBy}`}
                  </Text>

                  {/* Context Menu Trigger */}
                  <TouchableOpacity
                    style={styles.folderMoreBtn}
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
                      <Ionicons name="folder" size={20} color="#635BFF" />
                    </View>
                    <View>
                      <Text style={styles.folderListName}>{folder.name}</Text>
                      <Text style={styles.folderListMeta}>
                        Created by {folder.createdBy} • {folder.itemCount || 0} files
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
                    <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* FILES SECTION */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Ionicons name="document-text" size={18} color="#635BFF" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>
              {depth === 0 ? "Recent Files" : "Folder Files"} ({currentFileList.length})
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
                <Ionicons name="trash-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                <Text style={styles.batchDeleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.batchDownloadBtn}
                onPress={handleDownloadSelected}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={14} color="#635BFF" style={{ marginRight: 4 }} />
                <Text style={styles.batchDownloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Files Grid / List */}
        {currentFileList.length === 0 ? (
          <View style={styles.emptyFolderBox}>
            <Ionicons name="folder-open-outline" size={42} color="#D1D5DB" />
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
                  {depth > 0 && (
                    <TouchableOpacity
                      style={styles.fileCheckbox}
                      onPress={() => handleToggleFileSelection(file.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={20}
                        color={isSelected ? "#635BFF" : "#9CA3AF"}
                      />
                    </TouchableOpacity>
                  )}

                  <View style={styles.fileIconBox}>
                    <Ionicons name="document-text" size={32} color="#635BFF" />
                  </View>

                  <Text style={styles.fileName} numberOfLines={2}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileMeta}>
                    {file.size} • {file.date}
                  </Text>

                  {/* Actions Row */}
                  <View style={styles.fileCardActions}>
                    <TouchableOpacity
                      style={styles.fileActionBtn}
                      onPress={() => handleShareFile(file.name, file.downloadUrl)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-social-outline" size={16} color="#635BFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.fileActionBtn}
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
                          size={20}
                          color={isSelected ? "#635BFF" : "#9CA3AF"}
                        />
                      </TouchableOpacity>
                    )}
                    <View style={styles.fileListIcon}>
                      <Ionicons name="document-text" size={20} color="#635BFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileListName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileListMeta}>
                        {file.size} • {file.date} • {file.createdBy}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.fileListRightActions}>
                    <TouchableOpacity
                      style={styles.listIconAction}
                      onPress={() => handleShareFile(file.name, file.downloadUrl)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-social-outline" size={18} color="#635BFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.listIconAction}
                      onPress={() =>
                        setActiveItemMenu({ id: file.id, type: "file", name: file.name })
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
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
              <Ionicons name="pencil-outline" size={18} color="#1F2937" style={{ marginRight: 12 }} />
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
              <Ionicons name="folder-open-outline" size={18} color="#1F2937" style={{ marginRight: 12 }} />
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
                <Ionicons name="people-outline" size={18} color="#1F2937" style={{ marginRight: 12 }} />
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
              <Ionicons name="download-outline" size={18} color="#1F2937" style={{ marginRight: 12 }} />
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
              <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 12 }} />
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
            <CustomButton
              title="Cancel"
              onPress={() => setIsCreateFolderOpen(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Create"
              onPress={handleCreateFolder}
              variant="primary"
              style={{ flex: 1 }}
            />
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
              <Ionicons name="document-text" size={28} color="#635BFF" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.attachedFileName} numberOfLines={1}>
                  {attachedFile.name}
                </Text>
                <Text style={styles.attachedFileSize}>{attachedFile.size}</Text>
              </View>
              <TouchableOpacity onPress={() => setAttachedFile(null)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.filePickBox} onPress={handlePickFile} activeOpacity={0.8}>
              <Ionicons name="cloud-upload-outline" size={32} color="#635BFF" />
              <Text style={styles.filePickTitle}>Tap to select PDF or image</Text>
              <Text style={styles.filePickSub}>Max file size: 25MB</Text>
            </TouchableOpacity>
          )}

          <View style={styles.modalButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setIsUploadModalOpen(false)}
              variant="outline"
              size="small"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save & Upload"
              onPress={handleUploadSubmit}
              variant="primary"
              size="small"
              style={{ flex: 1 }}
            />
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
            <CustomButton
              title="Cancel"
              onPress={() => setIsRenameOpen(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save"
              onPress={handleRenameSubmit}
              variant="primary"
              style={{ flex: 1 }}
            />
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
          <ScrollView style={{ maxHeight: 180, marginBottom: 16 }}>
            {["Root", "Employees", "Accountant", "Tax & Compliance", "Legal Contracts", "Salon Licenses"]
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
                  <Ionicons name="folder" size={20} color="#635BFF" style={{ marginRight: 10 }} />
                  <Text style={styles.moveDestName}>{dest}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          <CustomButton
            title="Cancel"
            onPress={() => setIsMoveOpen(false)}
            variant="outline"
          />
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
          <ScrollView style={{ maxHeight: 220, marginBottom: 16 }}>
            {permissionMembers.map((member) => (
              <View key={member.id} style={styles.permMemberRow}>
                <View style={styles.permAvatarWrap}>
                  <Text style={{ fontSize: 18 }}>{member.avatarEmoji}</Text>
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

          <CustomButton
            title="Done"
            onPress={() => {
              setIsPermissionsOpen(false);
              Alert.alert("Permissions Saved", "Access control updated.");
            }}
            variant="primary"
          />
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 24,
  },
  breadcrumbCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  breadcrumbLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  homeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    marginRight: 8,
  },
  pathWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  pathRootText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  pathSegmentText: {
    fontSize: 13,
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
    borderRadius: 10,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
    gap: 10,
  },
  uploadActionCard: {
    flex: 1,
    backgroundColor: "#635BFF",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  uploadActionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  uploadActionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  uploadActionSub: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 13,
  },
  folderActionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  folderActionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  folderActionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  folderActionSub: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 13,
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  selectAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
  },
  selectAllText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  batchActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAF9FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEECFF",
  },
  batchSelectedCount: {
    fontSize: 12,
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
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  batchDeleteText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EF4444",
  },
  batchDownloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  batchDownloadText: {
    fontSize: 11,
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
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  folderIconBox: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  folderName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 1,
  },
  folderMeta: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  folderMoreBtn: {
    position: "absolute",
    top: 8,
    right: 6,
    padding: 6,
    zIndex: 10,
  },
  foldersList: {
    gap: 8,
  },
  folderListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  folderListLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  folderListIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  folderListName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  folderListMeta: {
    fontSize: 10,
    color: "#6B7280",
  },
  listMoreBtn: {
    padding: 6,
  },
  filesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  fileGridCard: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  fileGridCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  fileCheckbox: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 2,
  },
  fileIconBox: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  fileName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 1,
  },
  fileMeta: {
    fontSize: 9,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  fileCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  fileActionBtn: {
    padding: 2,
  },
  filesList: {
    gap: 8,
  },
  fileListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fileListItemSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
  },
  fileListLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  fileListIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  fileListName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  fileListMeta: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  fileListRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listIconAction: {
    padding: 6,
  },
  emptyFolderBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
  },
  emptyFolderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    marginTop: 8,
  },
  emptyFolderSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  modalMenuContent: {
    gap: 4,
  },
  modalMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalMenuText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  filePickBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#635BFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FAF9FF",
    marginBottom: 12,
  },
  filePickTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
    marginTop: 6,
  },
  filePickSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  fileAttachedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  attachedFileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  attachedFileSize: {
    fontSize: 11,
    color: "#6B7280",
  },
  moveDestItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    marginBottom: 6,
  },
  moveDestName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
  permMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  permAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  permMemberName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  permMemberEmail: {
    fontSize: 11,
    color: "#6B7280",
  },
  permRoleBadge: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  permRoleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
});
