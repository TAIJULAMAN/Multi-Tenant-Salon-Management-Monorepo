import React, { useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export interface ToastState {
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

// A toast queued by a sub-screen, shown by the screen we navigate back to.
let pendingToast: ToastState | null = null;
export const queueToast = (toast: ToastState) => {
  pendingToast = toast;
};
export const takeQueuedToast = () => {
  const t = pendingToast;
  pendingToast = null;
  return t;
};

interface StatusToastProps {
  toast: ToastState | null;
  onHide: () => void;
  top?: number;
  duration?: number;
}

const THEME = {
  success: { bg: "#ECFDF5", border: "#A7F3D0", color: "#059669", icon: "checkmark-circle" },
  error: { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626", icon: "close-circle" },
  info: { bg: "#EEF2FF", border: "#C7D2FE", color: "#635BFF", icon: "information-circle" },
} as const;

/** Small auto-dismissing banner shown at the top of a screen. */
export default function StatusToast({ toast, onHide, top = 70, duration = 2600 }: StatusToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [toast, onHide, duration]);

  if (!toast) return null;
  const theme = THEME[toast.type];

  return (
    <Animated.View
      entering={FadeInUp.duration(220)}
      exiting={FadeOutUp.duration(180)}
      style={[styles.toast, { top, backgroundColor: theme.bg, borderColor: theme.border }]}
      pointerEvents="none"
    >
      <Ionicons name={theme.icon} size={22} color={theme.color} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.color }]}>{toast.title}</Text>
        {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
  },
  message: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    marginTop: 1,
  },
});
