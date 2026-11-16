import { useState } from "react";
import { formatFileSize } from "@/utils/formatters";
import type { UploadedFile } from "../types";
export type { UploadedFile };

export function useMockUpload(onExtract: () => void) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const startMockUpload = (fileName: string, fileSize: number) => {
    const newFile: UploadedFile = {
      name: fileName,
      size: fileSize,
      progress: 0,
      status: "uploading",
    };

    setFiles((prev) => [...prev, newFile]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.name === fileName
              ? { ...f, progress: 100, status: "completed" as const }
              : f,
          );
          const allCompleted = updated.every((f) => f.status === "completed");
          if (allCompleted) {
            setTimeout(() => {
              onExtract();
            }, 600);
          }
          return updated;
        });
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === fileName ? { ...f, progress: currentProgress } : f,
          ),
        );
      }
    }, 150);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    files,
    startMockUpload,
    removeFile,
    formatFileSize,
  };
}
