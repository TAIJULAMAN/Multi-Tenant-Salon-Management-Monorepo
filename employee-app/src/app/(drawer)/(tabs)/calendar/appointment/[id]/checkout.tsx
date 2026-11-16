import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadows, typography } from "@/constants/figmaTheme";
import AppointmentHeader from "@/components/appointment/AppointmentHeader";
import AppointmentDialog, { DialogButton, dialogStyles } from "@/components/appointment/AppointmentDialog";
import PopoverMenu from "@/components/appointment/PopoverMenu";
import ServiceCard from "@/components/appointment/ServiceCard";
import OptionSheet from "@/components/appointment/OptionSheet";
import StatusToast, { ToastState, queueToast } from "@/components/appointment/StatusToast";
import PaymentDialog, { PaymentDialogState } from "@/components/appointment/payment/PaymentDialog";
import DividePaymentSheet from "@/components/appointment/payment/DividePaymentSheet";
import OnlinePaymentSheet from "@/components/appointment/payment/OnlinePaymentSheet";
import GiftCardSheet from "@/components/appointment/payment/GiftCardSheet";
import {
  CURRENT_EMPLOYEE,
  PAYMENT_METHODS,
  PaymentMethod,
  PaymentPart,
  STAFF,
  addActivity,
  formatEuro,
  servicesTotal,
  toISO,
  updateAppointment,
  useAppointment,
} from "@/components/appointment/appointmentData";

type Split = Partial<Record<PaymentMethod, number>>;
type Sheet = "gift" | "divide" | "online" | "tip" | "discount" | null;

const TIP_OPTIONS = [0, 10, 18, 25];
const parseAmount = (v: string) => parseFloat(v.replace(",", ".")) || 0;

/**
 * Figma 1:26800 (nothing selected) · 1:26945 (methods selected) · 1:30214 (after payment).
 * Flows per canvas column: Cash 1:27090→1:29911 · Card Terminal 1:27240→1:30062 ·
 * Two options 1:27390 · Online payment 1:29742→1:27565→1:27730 ·
 * Online + another option 1:27921 · Gift card 1:28185→1:28693→1:29214.
 */
export default function CheckoutScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const appt = useAppointment(id);
  const payment = appt.payment;

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [dialog, setDialog] = useState<PaymentDialogState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [employeeForService, setEmployeeForService] = useState<string | null>(null);

  const [tip, setTip] = useState(0);
  const [tipDraft, setTipDraft] = useState<number | "custom">(0);
  const [customTip, setCustomTip] = useState("");
  const [discountType, setDiscountType] = useState<"Fixed Amount" | "Percentage">("Fixed Amount");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountDraft, setDiscountDraft] = useState("");
  const [discountTypeDraft, setDiscountTypeDraft] = useState<"Fixed Amount" | "Percentage">("Fixed Amount");

  // Gift card amount applied in this checkout; mirrored in a ref for timer callbacks.
  const giftRef = useRef(0);
  const [giftApplied, setGiftAppliedState] = useState(0);
  const setGiftApplied = (value: number) => {
    giftRef.current = value;
    setGiftAppliedState(value);
  };
  // Split waiting for the online-payment invitation / print choice.
  const pendingSplit = useRef<Split>({});

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const hideToast = useCallback(() => setToast(null), []);

  // ---- Totals --------------------------------------------------------------
  const subtotal = servicesTotal(appt.services);
  const discount = payment
    ? payment.discount
    : discountType === "Fixed Amount"
      ? Math.min(discountValue, subtotal)
      : Math.min((subtotal * discountValue) / 100, subtotal);
  const tipValue = payment ? payment.tip : tip;
  const gross = Math.max(0, subtotal - discount + tipValue);
  const gift = payment ? payment.giftCardDiscount : giftApplied;
  const partOf = (m: PaymentMethod) =>
    payment?.parts.filter((p) => p.method === m).reduce((acc, p) => acc + p.amount, 0) ?? 0;
  const paidCash = partOf("Cash");
  const paidCard = partOf("Card Terminal");
  const paidOnline = partOf("Online Payment");
  const totalDue = Math.max(0, gross - gift - paidCash - paidCard - paidOnline);
  const otherMethods = methods.filter((m) => m !== "Gift Card");

  // ---- Method selection ----------------------------------------------------
  const toggleMethod = (m: PaymentMethod) => {
    if (payment) return;
    if (m === "Gift Card" && methods.includes(m)) setGiftApplied(0);
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  // ---- Payment flow --------------------------------------------------------
  const finalize = (parts: Split, printed: boolean) => {
    const giftAmount = giftRef.current;
    const paymentParts: PaymentPart[] = [];
    if (giftAmount > 0) paymentParts.push({ method: "Gift Card", amount: giftAmount });
    (Object.keys(parts) as PaymentMethod[]).forEach((m) => {
      const amount = parts[m] ?? 0;
      if (amount > 0) paymentParts.push({ method: m, amount, pending: m === "Online Payment" });
    });
    const onlinePending = paymentParts.some((p) => p.pending);

    updateAppointment(appt.id, (a) => {
      let activity = a.activity;
      const log = (label: string) => {
        activity = addActivity({ ...a, activity }, label);
      };
      if (printed) log("Receipt Printed");
      if (onlinePending) log("Invitation to pay sent");
      if (!onlinePending) log("Paid");
      return {
        ...a,
        status: "Completed",
        activity,
        payment: {
          receiptNo: `2025-${String(Math.floor(100000 + Math.random() * 899999))}`,
          paidAt: toISO(new Date()),
          parts: paymentParts,
          tip,
          discount,
          giftCardDiscount: giftAmount,
          total: gross,
        },
      };
    });
  };

  /** Cash → Printing Receipt → Successful Payment; Card → Waiting → Successful Payment + Printing. */
  const runInPerson = (parts: Split, onDone: () => void) => {
    const hasCard = (parts["Card Terminal"] ?? 0) > 0;
    if (hasCard) {
      setDialog({ kind: "waiting" });
      later(() => {
        onDone();
        setDialog({ kind: "success", variant: "card" });
      }, 2400);
    } else {
      setDialog({ kind: "printing" });
      later(() => {
        onDone();
        setDialog({ kind: "success", variant: "cash" });
      }, 2000);
    }
  };

  const proceed = (parts: Split) => {
    if ((parts["Online Payment"] ?? 0) > 0) {
      pendingSplit.current = parts;
      setSheet("online");
      return;
    }
    runInPerson(parts, () => finalize(parts, true));
  };

  const payRemaining = (amount: number) => {
    if (amount <= 0) {
      // Gift card covers everything.
      setDialog({ kind: "printing" });
      later(() => {
        finalize({}, true);
        setDialog({ kind: "success", variant: "cash" });
      }, 2000);
      return;
    }
    if (otherMethods.length === 0) {
      setToast({
        type: "error",
        title: "Amount not covered",
        message: `Select another payment method for the remaining ${formatEuro(amount)}.`,
      });
      return;
    }
    if (otherMethods.length >= 2) {
      setSheet("divide");
      return;
    }
    proceed({ [otherMethods[0]]: amount });
  };

  const continuePayment = () => {
    if (methods.includes("Gift Card") && giftApplied === 0) {
      setSheet("gift");
      return;
    }
    payRemaining(Math.max(0, gross - giftApplied));
  };

  const handleInvitationSent = () => {
    setSheet(null);
    const parts = pendingSplit.current;
    const withOther = (Object.keys(parts) as PaymentMethod[]).some(
      (m) => m !== "Online Payment" && (parts[m] ?? 0) > 0
    );
    later(
      () =>
        setDialog({
          kind: "printChoice",
          nowLabel: withOther ? "Entirely (Including what will be paid later)" : "Print now",
          laterLabel: withOther ? "Print online payment part once received" : "After receiving payment",
        }),
      350
    );
  };

  const handlePrintChoice = (printNow: boolean) => {
    const parts = pendingSplit.current;
    const inPerson: Split = { ...parts };
    delete inPerson["Online Payment"];
    const hasInPerson = Object.values(inPerson).some((v) => (v ?? 0) > 0);
    if (hasInPerson) {
      runInPerson(inPerson, () => finalize(parts, true));
    } else {
      finalize(parts, printNow);
      setDialog(null);
      setToast({
        type: "info",
        title: "Invitation to pay sent",
        message: printNow ? "Receipt printed." : "The receipt will be printed once the payment is received.",
      });
    }
  };

  const handleSaveAndLeave = () => {
    queueToast(
      payment
        ? { type: "success", title: "Checkout saved" }
        : { type: "success", title: "Checkout saved", message: "You can complete the payment later." }
    );
    router.back();
  };

  // ---- Tip / discount ------------------------------------------------------
  const openTip = () => {
    setTipDraft(tip > 0 ? "custom" : 0);
    setCustomTip(tip > 0 ? String(tip) : "");
    setSheet("tip");
  };
  const saveTip = () => {
    setTip(tipDraft === "custom" ? parseAmount(customTip) : (subtotal * tipDraft) / 100);
    setSheet(null);
  };
  const openDiscount = () => {
    setDiscountTypeDraft(discountType);
    setDiscountDraft(discountValue > 0 ? String(discountValue) : "");
    setSheet("discount");
  };
  const saveDiscount = () => {
    setDiscountType(discountTypeDraft);
    setDiscountValue(parseAmount(discountDraft));
    setSheet(null);
  };

  const activeService = appt.services.find((s) => s.id === employeeForService);
  const canContinue = !payment && methods.length > 0;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <AppointmentHeader title="Checkout" />
      <StatusToast toast={toast} onHide={hideToast} top={Math.max(insets.top, 16) + 70} />

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* Payment Methods */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Payment Methods</Text>
              <Text style={styles.cardSubtitle}>Select one or more methods.</Text>
            </View>
            <TouchableOpacity
              style={[styles.continueBtn, canContinue && styles.continueBtnActive]}
              onPress={continuePayment}
              disabled={!canContinue}
              activeOpacity={0.85}
            >
              <Text style={[styles.continueBtnText, canContinue && { color: colors.primary }]}>Continue Payment</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.methodsGrid}>
            {PAYMENT_METHODS.map((pm) => {
              const isSel = methods.includes(pm.id);
              return (
                <TouchableOpacity
                  key={pm.id}
                  style={[styles.methodCard, isSel && styles.methodCardActive]}
                  onPress={() => toggleMethod(pm.id)}
                  disabled={!!payment}
                  activeOpacity={0.75}
                >
                  <View style={styles.methodIcon}>
                    <Ionicons name={pm.icon as any} size={30} color={colors.primary} />
                  </View>
                  <Text style={styles.methodLabel} numberOfLines={1}>
                    {pm.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Services + Order Summary */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 20 }]}>Services</Text>
          <View style={{ gap: 12 }}>
            {appt.services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                date={appt.date}
                onPressEmployee={payment ? undefined : () => setEmployeeForService(s.id)}
              />
            ))}
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <SummaryRow label="Tax" value="0" />
            {(discount > 0 || gift === 0) && (
              <SummaryRow label="Discount" value={discount > 0 ? `- ${formatEuro(discount)}` : "0"} />
            )}
            {tipValue > 0 && <SummaryRow label="Tip" value={formatEuro(tipValue)} />}
            {gift > 0 && <SummaryRow label="Gift Card discount" value={`- ${formatEuro(gift)}`} color={colors.pink} />}
            {paidCash > 0 && <SummaryRow label="Paid in cash" value={formatEuro(paidCash)} />}
            {paidCard > 0 && <SummaryRow label="Paid with card" value={formatEuro(paidCard)} />}
            {paidOnline > 0 && <SummaryRow label="To be paid online" value={formatEuro(paidOnline)} />}
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatEuro(totalDue)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer (Back · ⋮ · Save and Leave) */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 10, 20) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.footerRight}>
          {!payment && (
            <PopoverMenu
              items={[
                { label: "Add a Discount", onPress: openDiscount },
                { label: "Add a Tip", onPress: openTip },
              ]}
            />
          )}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveAndLeave} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Save and Leave</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment dialogs */}
      <GiftCardSheet
        visible={sheet === "gift"}
        amountDue={gross}
        onClose={() => setSheet(null)}
        onConfirm={(_cards, applied) => {
          setGiftApplied(applied);
          setSheet(null);
          // let the gift card dialog fade out before the next popup is presented
          later(() => payRemaining(Math.max(0, gross - applied)), 350);
        }}
      />

      <DividePaymentSheet
        visible={sheet === "divide"}
        amountDue={Math.max(0, gross - giftApplied)}
        methods={otherMethods}
        onClose={() => setSheet(null)}
        onConfirm={(parts) => {
          setSheet(null);
          later(() => proceed(parts), 350);
        }}
      />

      <OnlinePaymentSheet
        visible={sheet === "online"}
        client={appt.client}
        onClose={() => setSheet(null)}
        onSend={handleInvitationSent}
      />

      <PaymentDialog
        state={dialog}
        onClose={() => setDialog(null)}
        onPrintNow={() => handlePrintChoice(true)}
        onPrintLater={() => handlePrintChoice(false)}
      />

      <OptionSheet
        visible={!!employeeForService}
        title="Employee"
        options={STAFF.map((s) => ({
          value: s.id,
          label: s.name,
          avatar: s.avatar,
          subtitle: s.id === CURRENT_EMPLOYEE.id ? "You" : undefined,
        }))}
        selected={activeService?.employeeId}
        onSelect={(employeeId) =>
          updateAppointment(appt.id, (a) => ({
            ...a,
            services: a.services.map((s) => (s.id === employeeForService ? { ...s, employeeId } : s)),
          }))
        }
        onClose={() => setEmployeeForService(null)}
      />

      {/* Tip (⋮ menu – not drawn in the Figma file) */}
      <AppointmentDialog
        visible={sheet === "tip"}
        title="Add a Tip"
        subtitle={`The tip goes to ${CURRENT_EMPLOYEE.name}.`}
        onClose={() => setSheet(null)}
        footer={
          <View style={dialogStyles.actionsRight}>
            <DialogButton label="Save" onPress={saveTip} />
          </View>
        }
      >
        <View style={styles.choiceGrid}>
          {TIP_OPTIONS.map((pct) => (
            <Choice
              key={pct}
              label={pct === 0 ? "No Tip" : `${pct}%`}
              sub={pct > 0 ? formatEuro((subtotal * pct) / 100) : undefined}
              active={tipDraft === pct}
              onPress={() => setTipDraft(pct)}
            />
          ))}
          <Choice label="Custom Tip" active={tipDraft === "custom"} onPress={() => setTipDraft("custom")} wide />
        </View>
        {tipDraft === "custom" && (
          <TextInput
            style={dialogStyles.input}
            placeholder="Enter custom tip amount in €"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={customTip}
            onChangeText={setCustomTip}
          />
        )}
      </AppointmentDialog>

      {/* Discount (⋮ menu – feeds the "Discount" row of the Order Summary) */}
      <AppointmentDialog
        visible={sheet === "discount"}
        title="Add a Discount"
        onClose={() => setSheet(null)}
        footer={
          <View style={dialogStyles.actionsRight}>
            <DialogButton label="Cancel" variant="secondary" onPress={() => setSheet(null)} />
            <DialogButton label="Save" onPress={saveDiscount} />
          </View>
        }
      >
        <View style={styles.choiceGrid}>
          {(["Fixed Amount", "Percentage"] as const).map((t) => (
            <Choice key={t} label={t} active={discountTypeDraft === t} onPress={() => setDiscountTypeDraft(t)} />
          ))}
        </View>
        <View>
          <Text style={dialogStyles.label}>Amount ({discountTypeDraft === "Fixed Amount" ? "€" : "%"}) *</Text>
          <TextInput
            style={dialogStyles.input}
            placeholder="Enter amount"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={discountDraft}
            onChangeText={setDiscountDraft}
          />
        </View>
      </AppointmentDialog>
    </View>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, color ? { color } : null]}>{label}</Text>
      <Text style={[styles.summaryValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

function Choice({
  label,
  sub,
  active,
  wide,
  onPress,
}: {
  label: string;
  sub?: string;
  active: boolean;
  wide?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.choice, wide && { flexBasis: "100%" }, active && styles.choiceActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.choiceText, active && { color: colors.primary }]}>{label}</Text>
      {sub ? <Text style={styles.choiceSub}>{sub}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.card,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  continueBtn: {
    height: 40,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
  },
  continueBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  continueBtnText: {
    ...typography.button,
    color: colors.textMuted,
  },
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  methodCard: {
    flexBasis: "46%",
    flexGrow: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 22,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.white,
  },
  methodCardActive: {
    borderColor: colors.primary,
  },
  methodIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  methodLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  summaryBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    ...shadows.card,
  },
  backBtn: {
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
  },
  backBtnText: {
    ...typography.button,
    color: colors.textDark,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  primaryBtn: {
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.white,
  },
  choiceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  choice: {
    flexBasis: "45%",
    flexGrow: 1,
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.subtleAlt,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  choiceActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  choiceText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  choiceSub: {
    ...typography.caption,
    marginTop: 2,
  },
});
