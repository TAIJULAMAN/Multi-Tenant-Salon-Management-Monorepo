import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadows, typography } from "@/constants/figmaTheme";
import AppointmentHeader from "@/components/appointment/AppointmentHeader";
import StatusToast, { ToastState, takeQueuedToast } from "@/components/appointment/StatusToast";
import {
  LEGAL_NOTES,
  RECEIPT_FOOTER,
  SALON,
  VAT_RATE,
  appointmentRoute,
  formatEuroFixed,
  parseISO,
  servicesTotal,
  toISO,
  useAppointment,
} from "@/components/appointment/appointmentData";

const METHOD_LABEL: Record<string, string> = {
  Cash: "Cash",
  "Card Terminal": "Credit Card",
  "Online Payment": "Online Payment",
  "Gift Card": "Gift Card",
};

const pad = (n: number) => String(n).padStart(2, "0");
/** Receipt dates use the Figma MM/DD/YYYY format (11/30/2024). */
const usDate = (iso: string) => {
  const d = parseISO(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
};

/** Figma 1:31814 – Service Receipt (Italian Fiscal Invoice). */
export default function ServiceReceiptScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const appt = useAppointment(id);
  const [toast, setToast] = useState<ToastState | null>(null);
  const hideToast = useCallback(() => setToast(null), []);

  useFocusEffect(
    useCallback(() => {
      const queued = takeQueuedToast();
      if (queued) setToast(queued);
    }, [])
  );

  const payment = appt.payment;
  const documentTotal = payment ? payment.total : servicesTotal(appt.services);
  const taxable = documentTotal / (1 + VAT_RATE);
  const vat = documentTotal - taxable;
  const paidAt = payment?.paidAt ?? appt.date;
  const deadline = (() => {
    const d = parseISO(paidAt);
    d.setDate(d.getDate() + 12);
    return toISO(d);
  })();
  const pendingOnline = payment?.parts.some((p) => p.pending) ?? false;
  const amountPaid = payment ? payment.parts.filter((p) => !p.pending).reduce((acc, p) => acc + p.amount, 0) : 0;
  const mode = payment ? payment.parts.map((p) => METHOD_LABEL[p.method]).join(" + ") || "—" : "—";
  const statusLabel = !payment ? "Unpaid" : pendingOnline ? "Partial" : "Paid";
  const statusColors =
    statusLabel === "Paid"
      ? { bg: "#E6F8EC", text: colors.green }
      : statusLabel === "Partial"
        ? { bg: colors.yellowSoft, text: "#C29A12" }
        : { bg: colors.pinkSoft, text: colors.pink };

  const handleDownload = () =>
    setToast({
      type: "success",
      title: "Download PDF",
      message: `Receipt ${payment?.receiptNo ?? appt.code} saved as PDF.`,
    });

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <AppointmentHeader
        title="Service Receipt"
        subtitle="Italian Fiscal Invoice"
        onBack={() => (router.canGoBack() ? router.back() : router.replace(appointmentRoute(appt.id) as any))}
        right={
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.8}>
            <Ionicons name="download-outline" size={16} color={colors.primary} />
            <Text style={styles.downloadText}>Download PDF</Text>
          </TouchableOpacity>
        }
      />
      <StatusToast toast={toast} onHide={hideToast} top={Math.max(insets.top, 16) + 76} />

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* Electronic invoice ("Eletronic" typo in Figma corrected) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Electronic Invoice</Text>
          <View style={styles.pairRow}>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightValue}>{payment?.receiptNo ?? "—"}</Text>
              <Text style={styles.highlightLabel}>Receipt No.</Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightValue}>{usDate(paidAt)}</Text>
              <Text style={styles.highlightLabel}>Date</Text>
            </View>
          </View>
        </View>

        {/* Provider */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transferor/Provider</Text>
          <Text style={styles.partyName}>{SALON.name}</Text>
          <Text style={styles.partyLine}>{SALON.address}</Text>
          <Text style={styles.partyLine}>{SALON.city}</Text>
          <View style={styles.fieldsGrid}>
            <Field label="P.IVA" value={SALON.vat} />
            <Field label="Tax Code" value={SALON.taxCode} />
            <Field label="PEC" value={SALON.pec} />
            <Field label="Recipient Code" value={SALON.recipientCode} />
            <Field label="Telephone" value={SALON.phone} />
            <Field label="Email" value={SALON.email} />
          </View>
        </View>

        {/* Client */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transferee/Client</Text>
          <Text style={styles.partyName}>{appt.client.name}</Text>
          {appt.client.address ? <Text style={styles.partyLine}>{appt.client.address}</Text> : null}
          {appt.client.city ? <Text style={styles.partyLine}>{appt.client.city}</Text> : null}
          <View style={styles.fieldsGrid}>
            <Field label="Tax Code" value={appt.client.taxCode || "—"} />
          </View>
        </View>

        {/* Service Description table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Description</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
            <View style={styles.table}>
              <View style={[styles.tr, styles.thead]}>
                <Text style={[styles.th, styles.colName]}>Name</Text>
                <Text style={[styles.th, styles.col]}>Amount</Text>
                <Text style={[styles.th, styles.col]}>Unit Price</Text>
                <Text style={[styles.th, styles.col]}>VAT Rate</Text>
                <Text style={[styles.th, styles.col, styles.lastCol]}>Total Price</Text>
              </View>
              {appt.services.map((s) => {
                const unit = s.price / (1 + VAT_RATE);
                return (
                  <View key={s.id} style={styles.tr}>
                    <Text style={[styles.tdStrong, styles.colName]}>{s.name}</Text>
                    <Text style={[styles.td, styles.col]}>1</Text>
                    <Text style={[styles.td, styles.col]}>{formatEuroFixed(unit)}</Text>
                    <Text style={[styles.td, styles.col]}>{VAT_RATE * 100}%</Text>
                    <Text style={[styles.tdStrong, styles.col, styles.lastCol]}>{formatEuroFixed(unit)}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* VAT Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>VAT Summary</Text>
          <View style={[styles.table, { marginTop: 16 }]}>
            <View style={[styles.tr, styles.thead]}>
              <Text style={[styles.th, styles.flexCol]}>Rate</Text>
              <Text style={[styles.th, styles.flexCol]}>Taxable</Text>
              <Text style={[styles.th, styles.flexCol, styles.lastCol]}>IVA</Text>
            </View>
            <View style={styles.tr}>
              <Text style={[styles.td, styles.flexCol]}>{VAT_RATE * 100}%</Text>
              <Text style={[styles.td, styles.flexCol]}>{formatEuroFixed(taxable)}</Text>
              <Text style={[styles.td, styles.flexCol, styles.lastCol]}>{formatEuroFixed(vat)}</Text>
            </View>
          </View>
        </View>

        {/* Document Totals */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Document Totals</Text>
          <View style={{ gap: 16, marginTop: 20 }}>
            <TotalRow label="Total Taxable Amount" value={formatEuroFixed(taxable)} />
            <TotalRow label="Total VAT" value={formatEuroFixed(vat)} />
          </View>
          <View style={styles.docTotalRow}>
            <Text style={styles.totalLabel}>Document Total</Text>
            <Text style={styles.docTotalValue}>{formatEuroFixed(documentTotal)}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Methods</Text>
          <View style={styles.fieldsGrid}>
            <Field label="Mode" value={mode} />
            <Field label="Payment Date" value={usDate(paidAt)} />
            <Field label="Deadline" value={usDate(deadline)} />
            <Field label="Amount Paid" value={formatEuroFixed(amountPaid)} />
          </View>
          <View style={{ marginTop: 14 }}>
            <Text style={styles.fieldLabel}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        {/* Legal Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legal Notes</Text>
          <View style={{ gap: 14, marginTop: 20 }}>
            {LEGAL_NOTES.map((n) => (
              <Text key={n} style={styles.legalText}>
                • {n}
              </Text>
            ))}
          </View>
        </View>

        <View style={[styles.card, { alignItems: "center", gap: 8 }]}>
          {RECEIPT_FOOTER.map((line) => (
            <Text key={line} style={styles.footerLine}>
              {line}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>{label}</Text>
      <Text style={styles.totalValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: radius.md,
  },
  downloadText: {
    ...typography.button,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  pairRow: {
    gap: 12,
    marginTop: 16,
  },
  highlightBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  highlightValue: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  highlightLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  partyName: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  partyLine: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  fieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
    marginTop: 16,
  },
  field: {
    width: "50%",
    paddingRight: 8,
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  fieldValue: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thead: {
    backgroundColor: colors.primaryTint,
  },
  th: {
    paddingHorizontal: 14,
    paddingVertical: 24,
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  td: {
    paddingHorizontal: 14,
    paddingVertical: 24,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  tdStrong: {
    paddingHorizontal: 14,
    paddingVertical: 24,
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  colName: {
    width: 180,
  },
  col: {
    width: 110,
  },
  flexCol: {
    flex: 1,
  },
  lastCol: {
    borderRightWidth: 0,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  docTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  docTotalValue: {
    fontSize: 20,
    lineHeight: 27,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  legalText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  footerLine: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
