import React, { useCallback, useState } from "react";
import { Alert, GestureResponderEvent } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/figmaTheme";
import { CURRENT_EMPLOYEE, FileData, FolderData } from "./filesData";
import { filesActions } from "./filesStore";
import ActionDropdownModal, { ActionDropdownItem, AnchorPosition } from "./modals/ActionDropdownModal";
import CreateFolderModal from "./modals/CreateFolderModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import ManagePermissionModal from "./modals/ManagePermissionModal";
import MoveModal from "./modals/MoveModal";
import RenameModal from "./modals/RenameModal";
import UploadFileModal from "./modals/UploadFileModal";

type Target =
  | { kind: "folder"; folder: FolderData }
  | { kind: "file"; file: FileData }
  | { kind: "files"; ids: string[]; onDone?: () => void };

type ModalName = "menu" | "upload" | "create" | "rename" | "move" | "permission" | "delete" | null;

/**
 * Owns the kebab dropdown (Figma 1:6093) and every Files dialog
 * (Upload 1:8645, Create Folder 1:8945, Move 1:7955, Manage Permissions 1:7616/1:8299,
 * Rename, Delete) for a screen whose contents live in `currentFolderId`.
 */
export function useFileActions(currentFolderId: string | null) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalName>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [anchor, setAnchor] = useState<AnchorPosition | null>(null);
  // Bumped on every open so dialogs remount with fresh form state.
  const [openCount, setOpenCount] = useState(0);
  const show = useCallback((m: Exclude<ModalName, null>) => {
    setOpenCount((n) => n + 1);
    setModal(m);
  }, []);

  const openMenu = useCallback((t: Target, e?: GestureResponderEvent) => {
    setTarget(t);
    const node = e?.currentTarget as unknown as
      | { measureInWindow?: (cb: (x: number, y: number, w: number, h: number) => void) => void }
      | undefined;
    if (node?.measureInWindow) {
      node.measureInWindow((x, y, width, height) => {
        setAnchor({ x, y, width, height });
        show("menu");
      });
    } else if (e?.nativeEvent?.pageX) {
      setAnchor({ x: e.nativeEvent.pageX - 10, y: e.nativeEvent.pageY, width: 20, height: 20 });
      show("menu");
    } else {
      setAnchor(null);
      show("menu");
    }
  }, [show]);

  const close = () => setModal(null);

  const targetName =
    target?.kind === "folder"
      ? target.folder.name
      : target?.kind === "file"
        ? target.file.name
        : target?.kind === "files"
          ? `${target.ids.length} file${target.ids.length === 1 ? "" : "s"}`
          : "";

  const menuItems: ActionDropdownItem[] = [
    { id: "rename", label: "Rename", iconName: "pencil-outline", iconColor: colors.teal, onPress: () => show("rename") },
    {
      id: "download",
      label: "Download",
      iconName: "download-outline",
      iconColor: colors.text,
      onPress: () => Alert.alert("Download", `Downloading "${targetName}"...`),
    },
    { id: "move", label: "Move", iconName: "folder-open-outline", iconColor: colors.primary, onPress: () => show("move") },
    ...(target?.kind === "file"
      ? [
          {
            id: "publish",
            label: "Publish social media post",
            iconName: "globe-outline" as const,
            iconColor: colors.teal,
            onPress: () => router.push("/(drawer)/social" as never),
          },
        ]
      : []),
    {
      id: "permission",
      label: "Manage Permission",
      iconName: "people-outline",
      iconColor: colors.yellow,
      onPress: () => show("permission"),
    },
    { id: "delete", label: "Delete", iconName: "trash-outline", iconColor: colors.pink, onPress: () => show("delete") },
  ];

  const handleRename = (name: string) => {
    if (target?.kind === "folder") filesActions.renameFolder(target.folder.id, name);
    if (target?.kind === "file") filesActions.renameFile(target.file.id, name);
  };

  const handleMove = (dest: string | null) => {
    if (target?.kind === "folder") filesActions.moveFolder(target.folder.id, dest);
    if (target?.kind === "file") filesActions.moveFiles([target.file.id], dest);
    if (target?.kind === "files") {
      filesActions.moveFiles(target.ids, dest);
      target.onDone?.();
    }
  };

  const handleDelete = () => {
    if (target?.kind === "folder") filesActions.deleteFolder(target.folder.id);
    if (target?.kind === "file") filesActions.deleteFiles([target.file.id]);
    if (target?.kind === "files") {
      filesActions.deleteFiles(target.ids);
      target.onDone?.();
    }
    close();
  };

  const moveParent =
    target?.kind === "folder" ? target.folder.parentId : target?.kind === "file" ? target.file.folderId : currentFolderId;

  const element = (
    <>
      <ActionDropdownModal visible={modal === "menu"} onClose={close} items={menuItems} anchorPosition={anchor} />
      <UploadFileModal
        key={`UploadFileModal-${openCount}`}
        visible={modal === "upload"}
        onClose={close}
        folderId={currentFolderId}
        onUpload={filesActions.addFiles}
      />
      <CreateFolderModal
        key={`CreateFolderModal-${openCount}`}
        visible={modal === "create"}
        onClose={close}
        onCreate={(name) => filesActions.createFolder(name, currentFolderId, CURRENT_EMPLOYEE)}
      />
      <RenameModal
        key={`RenameModal-${openCount}`}
        visible={modal === "rename"} onClose={close} currentName={targetName} onSave={handleRename} />
      <MoveModal
        key={`MoveModal-${openCount}`}
        visible={modal === "move"}
        onClose={close}
        title={target?.kind === "folder" ? "Move Folder" : target?.kind === "files" ? "Move Files" : "Move File"}
        folders={filesActions.moveTargetsFor(target?.kind === "folder" ? target.folder.id : null)}
        currentParentId={moveParent ?? null}
        onMove={handleMove}
      />
      <ManagePermissionModal
        key={`ManagePermissionModal-${openCount}`}
        visible={modal === "permission"} onClose={close} />
      <DeleteConfirmModal
        key={`DeleteConfirmModal-${openCount}`}
        visible={modal === "delete"}
        onClose={close}
        itemName={targetName}
        itemType={target?.kind ?? "file"}
        onConfirm={handleDelete}
      />
    </>
  );

  return {
    element,
    openFolderMenu: (folder: FolderData, e?: GestureResponderEvent) => openMenu({ kind: "folder", folder }, e),
    openFileMenu: (file: FileData, e?: GestureResponderEvent) => openMenu({ kind: "file", file }, e),
    openUpload: () => show("upload"),
    openCreateFolder: () => show("create"),
    bulkDelete: (ids: string[], onDone?: () => void) => {
      setTarget({ kind: "files", ids, onDone });
      show("delete");
    },
    bulkMove: (ids: string[], onDone?: () => void) => {
      setTarget({ kind: "files", ids, onDone });
      show("move");
    },
  };
}
