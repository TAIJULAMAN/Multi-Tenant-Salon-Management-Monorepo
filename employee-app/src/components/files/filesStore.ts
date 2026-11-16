import { useSyncExternalStore } from "react";
import { FileData, FolderData, INITIAL_FILES, INITIAL_FOLDERS } from "./filesData";

/**
 * Tiny in-memory store so folders/files created, renamed, moved or deleted on
 * one Files screen show up on the others (home → View More → folder detail).
 */
interface FilesState {
  folders: FolderData[];
  files: FileData[];
}

let state: FilesState = { folders: INITIAL_FOLDERS, files: INITIAL_FILES };
const listeners = new Set<() => void>();

function setState(next: FilesState) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFilesStore(): FilesState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** All descendant folder ids of `id` (inclusive). */
function collectFolderIds(id: string, folders: FolderData[]): string[] {
  const children = folders.filter((f) => f.parentId === id).flatMap((f) => collectFolderIds(f.id, folders));
  return [id, ...children];
}

export const filesActions = {
  createFolder(name: string, parentId: string | null, createdBy: string) {
    const folder: FolderData = { id: `folder_${Date.now()}`, name, createdBy, parentId };
    setState({ ...state, folders: [folder, ...state.folders] });
  },
  addFiles(newFiles: FileData[]) {
    setState({ ...state, files: [...newFiles, ...state.files] });
  },
  renameFolder(id: string, name: string) {
    setState({ ...state, folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)) });
  },
  renameFile(id: string, name: string) {
    setState({ ...state, files: state.files.map((f) => (f.id === id ? { ...f, name } : f)) });
  },
  moveFolder(id: string, parentId: string | null) {
    // Never move a folder into itself or one of its descendants.
    if (parentId && collectFolderIds(id, state.folders).includes(parentId)) return;
    setState({ ...state, folders: state.folders.map((f) => (f.id === id ? { ...f, parentId } : f)) });
  },
  moveFiles(ids: string[], folderId: string | null) {
    setState({ ...state, files: state.files.map((f) => (ids.includes(f.id) ? { ...f, folderId } : f)) });
  },
  deleteFolder(id: string) {
    const removed = collectFolderIds(id, state.folders);
    setState({
      folders: state.folders.filter((f) => !removed.includes(f.id)),
      files: state.files.filter((f) => !f.folderId || !removed.includes(f.folderId)),
    });
  },
  deleteFiles(ids: string[]) {
    setState({ ...state, files: state.files.filter((f) => !ids.includes(f.id)) });
  },
  /** Folders that are valid destinations when moving the given folder. */
  moveTargetsFor(folderId: string | null): FolderData[] {
    if (!folderId) return state.folders;
    const excluded = collectFolderIds(folderId, state.folders);
    return state.folders.filter((f) => !excluded.includes(f.id));
  },
};
