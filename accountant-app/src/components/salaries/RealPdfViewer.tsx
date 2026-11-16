import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

let NativePdf: any = null;
if (Platform.OS !== "web") {
  try {
    NativePdf = require("react-native-pdf").default;
  } catch (err) {
    console.warn("Native react-native-pdf not available, using web/fallback renderer", err);
  }
}

interface RealPdfViewerProps {
  sourceUri?: string;
  sourceAsset?: any;
  page?: number;
  enablePinchZoom?: boolean;
  style?: StyleProp<ViewStyle>;
  onLoadComplete?: (numberOfPages: number) => void;
  onPageChanged?: (page: number, numberOfPages: number) => void;
  onError?: (error: any) => void;
}

export default function RealPdfViewer({
  sourceUri,
  sourceAsset,
  page = 1,
  enablePinchZoom = false,
  style,
  onLoadComplete,
  onPageChanged,
  onError,
}: RealPdfViewerProps) {
  const pdfRef = useRef<any>(null);
  const [nativeError, setNativeError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync page changes with native pdf controller
  useEffect(() => {
    if (page && pdfRef.current) {
      try {
        pdfRef.current.setPage(page);
      } catch {
        // ignore
      }
    }
  }, [page]);

  // If no source is provided at all
  if (!sourceUri && !sourceAsset) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]}>
        <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
        <Text style={styles.emptyTitle}>No PDF Document</Text>
        <Text style={styles.emptySub}>
          Upload a pay slip PDF file to view and verify.
        </Text>
      </View>
    );
  }

  const finalUri = sourceUri || "";
  const pdfSource = sourceAsset || { uri: finalUri, cache: true };

  // If on web, render iframe for real PDF view
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, style]}>
        <iframe
          src={`${finalUri}#page=${page}`}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="PDF Preview"
        />
      </View>
    );
  }

  // If native module failed to load
  if (!NativePdf || nativeError) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]}>
        <Ionicons name="document-text" size={48} color="#635BFF" />
        <Text style={styles.emptyTitle}>PDF Document</Text>
        <Text style={styles.emptySub} numberOfLines={2}>
          {finalUri}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#635BFF" />
          <Text style={styles.loadingText}>Loading PDF Document...</Text>
        </View>
      )}

      <NativePdf
        ref={pdfRef}
        source={pdfSource}
        page={page}
        singlePage={false}
        scale={1.0}
        minScale={1.0}
        maxScale={enablePinchZoom ? 4.0 : 1.0}
        fitPolicy={0}
        spacing={0}
        enablePaging={true}
        onLoadComplete={(numberOfPages: number) => {
          setLoading(false);
          if (numberOfPages > 0) {
            onLoadComplete?.(numberOfPages);
          }
        }}
        onPageChanged={(currentPage: number, numberOfPages: number) => {
          onPageChanged?.(currentPage, numberOfPages);
        }}
        onError={(err: any) => {
          console.warn("react-native-pdf rendering error:", err);
          setNativeError(true);
          setLoading(false);
          onError?.(err);
        }}
        style={styles.pdfView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
  },
  pdfView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
});
