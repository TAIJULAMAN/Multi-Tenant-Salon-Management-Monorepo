import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AppointmentDialog, { DialogButton } from "../AppointmentDialog";

export type PaymentDialogState =
  | { kind: "printing" }
  | { kind: "waiting" }
  | { kind: "success"; variant: "cash" | "card" }
  | { kind: "printChoice"; nowLabel: string; laterLabel: string };

interface PaymentDialogProps {
  state: PaymentDialogState | null;
  onClose: () => void;
  onPrintNow?: () => void;
  onPrintLater?: () => void;
}

/**
 * Centered status popups of the payment flows:
 * Printing Receipt (1:27090) · Successful Payment (1:29911 cash, 1:30062 card) ·
 * Waiting for payment processing (1:27240) · Print Receipt choice (1:27730, 1:27921).
 */
export default function PaymentDialog({ state, onClose, onPrintNow, onPrintLater }: PaymentDialogProps) {
  const dismissable = state?.kind === "success";

  return (
    <AppointmentDialog
      visible={!!state}
      onClose={dismissable ? onClose : undefined}
      centered
      footer={
        state?.kind === "printChoice" ? (
          <View style={styles.choiceRow}>
            <DialogButton label={state.nowLabel} variant="soft" onPress={onPrintNow ?? onClose} style={styles.choiceBtn} />
            <DialogButton label={state.laterLabel} onPress={onPrintLater ?? onClose} style={styles.choiceBtn} />
          </View>
        ) : undefined
      }
    >
      {state?.kind === "printing" && (
        <>
          <ReceiptArt />
          <ProgressBar />
          <Text style={[styles.title, { marginTop: 36 }]}>Printing Receipt</Text>
        </>
      )}

      {state?.kind === "waiting" && (
        <>
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
          <Ionicons name="card-outline" size={84} color={colors.primary} />
          <Text style={[styles.title, { marginTop: 24 }]}>Waiting for payment processing</Text>
        </>
      )}

      {state?.kind === "success" && state.variant === "cash" && (
        <>
          <Ionicons name="checkmark-circle-outline" size={60} color={colors.green} />
          <Text style={styles.title}>Successful Payment</Text>
        </>
      )}

      {state?.kind === "success" && state.variant === "card" && (
        <>
          <View style={styles.terminal}>
            <Ionicons name="calculator" size={88} color="#3B3B3B" />
            <View style={styles.terminalCard}>
              <Ionicons name="card" size={34} color={colors.blueDark} />
            </View>
          </View>
          <Text style={[styles.title, { color: colors.green, marginTop: 20 }]}>Successful Payment</Text>
          <Text style={styles.sub}>Printing Receipt</Text>
        </>
      )}

      {state?.kind === "printChoice" && (
        <>
          <ReceiptArt tilted />
          <Text style={[styles.title, { marginTop: 20 }]}>Print Receipt</Text>
        </>
      )}
    </AppointmentDialog>
  );
}

/** Stand-in for the receipt illustration of the Figma popups. */
function ReceiptArt({ tilted }: { tilted?: boolean }) {
  const accent = tilted ? colors.primary : colors.textSecondary;
  return (
    <View style={[styles.receipt, tilted && styles.receiptTilted]}>
      <Text style={[styles.receiptTitle, { color: accent }]}>RECEIPT</Text>
      <View style={[styles.receiptRule, { backgroundColor: accent }]} />
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.receiptLineRow}>
          <View style={[styles.receiptLine, { width: 44 - i * 6 }]} />
          <View style={[styles.receiptLine, { width: 14 }]} />
        </View>
      ))}
      <View style={[styles.receiptRule, { backgroundColor: accent }]} />
      <Ionicons name="barcode-outline" size={34} color={accent} />
    </View>
  );
}

function ProgressBar() {
  const [progress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1600,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);
  return (
    <View style={styles.progressTrack}>
      <Animated.View
        style={[
          styles.progressFill,
          { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["10%", "100%"] }) },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
    textAlign: "center",
  },
  sub: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.text,
    textAlign: "center",
    marginTop: -8,
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  choiceBtn: {
    flexGrow: 1,
    flexBasis: 120,
  },
  receipt: {
    width: 110,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    alignItems: "center",
    gap: 6,
    shadowColor: "#AFB6C9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  receiptTilted: {
    transform: [{ rotate: "-14deg" }],
    marginTop: 12,
  },
  receiptTitle: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
  receiptRule: {
    width: "100%",
    height: 2,
    borderRadius: 1,
  },
  receiptLineRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  receiptLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  progressTrack: {
    width: 160,
    height: 4,
    marginTop: -10,
    backgroundColor: colors.borderLight,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.blueDark,
  },
  terminal: {
    alignItems: "center",
  },
  terminalCard: {
    position: "absolute",
    bottom: -18,
  },
});
