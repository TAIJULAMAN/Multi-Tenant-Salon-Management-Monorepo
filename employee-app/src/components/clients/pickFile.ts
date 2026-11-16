import * as DocumentPicker from "expo-document-picker";

export interface PickedFile {
  name: string;
  size: string;
  uri: string;
  mimeType?: string;
}

export function formatBytes(bytes?: number) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Opens the system document picker and returns the chosen file (or null if canceled). */
export async function pickFile(type: string | string[] = "*/*"): Promise<PickedFile | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type, copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.length) return null;
    const asset = result.assets[0];
    return {
      name: asset.name,
      size: formatBytes(asset.size),
      uri: asset.uri,
      mimeType: asset.mimeType,
    };
  } catch {
    return null;
  }
}
