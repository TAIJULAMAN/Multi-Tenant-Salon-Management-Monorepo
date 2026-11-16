import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AppointmentDialog, { DialogButton, dialogStyles } from "../AppointmentDialog";
import { GIFT_CARDS, GiftCard, formatEuro } from "../appointmentData";

interface GiftCardSheetProps {
  visible: boolean;
  amountDue: number;
  onClose: () => void;
  onConfirm: (cards: GiftCard[], applied: number) => void;
}

const LOREM =
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

/**
 * Figma 1:28185 (select the gift card) → 1:28693 ("Insert Code Manually" field) →
 * 1:29214 (code applied, card selected, total).
 */
export default function GiftCardSheet({ visible, amountDue, onClose, onConfirm }: GiftCardSheetProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState("");
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setSelected([]);
      setShowCode(false);
      setCode("");
      setAppliedCode(null);
      setCodeError("");
    }
  }

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const applyCode = () => {
    const raw = code.trim();
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    const card = GIFT_CARDS.find((c) => c.code.toLowerCase() === normalized.toLowerCase());
    if (!card) {
      setCodeError("Gift card code not found");
      return;
    }
    setCodeError("");
    setAppliedCode(card.code);
    setSelected((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
  };

  const cards = GIFT_CARDS.filter((c) => selected.includes(c.id));
  const applied = Math.min(
    cards.reduce((acc, c) => acc + c.amount, 0),
    amountDue
  );
  const remaining = Math.max(0, amountDue - applied);

  return (
    <AppointmentDialog
      visible={visible}
      title="Gift Card"
      onClose={onClose}
      footer={
        <View style={styles.footer}>
          <DialogButton
            label="Insert Code Manually"
            icon="add"
            variant="soft"
            onPress={() => setShowCode(true)}
          />
          <View style={dialogStyles.actionsRight}>
            <DialogButton label="Cancel" variant="secondary" onPress={onClose} />
            <DialogButton label="Confirm Payment" disabled={cards.length === 0} onPress={() => onConfirm(cards, applied)} />
          </View>
        </View>
      }
    >
      <Text style={styles.sectionLabel}>
        {showCode ? "Select one or more Gift Cards" : "Select the Gift Card"}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
        style={{ marginHorizontal: -20 }}
      >
        <View style={{ width: 4 }} />
        {GIFT_CARDS.map((card) => {
          const isSel = selected.includes(card.id);
          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.tile, isSel && styles.tileActive]}
              onPress={() => toggle(card.id)}
              activeOpacity={0.85}
            >
              {card.variant === "classic" ? <ClassicCard amount={card.amount} /> : <PremiumCard />}
              <Text style={styles.tileName}>{card.owner}</Text>
              <Text style={styles.tileCode}>{card.code}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ width: 4 }} />
      </ScrollView>

      {showCode && (
        <View>
          <Text style={dialogStyles.label}>Insert Code Manually *</Text>
          <View style={styles.codeBox}>
            {appliedCode ? (
              <>
                <View style={styles.codeChip}>
                  <Text style={styles.codeChipText}>{appliedCode}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  style={styles.appliedRow}
                  onPress={() => {
                    setAppliedCode(null);
                    setCode("");
                  }}
                >
                  <Text style={styles.appliedText}>Applied</Text>
                  <Ionicons name="checkmark" size={18} color={colors.green} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Enter code"
                  placeholderTextColor={colors.text}
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="none"
                  onSubmitEditing={applyCode}
                />
                <TouchableOpacity onPress={applyCode} disabled={!code.trim()} hitSlop={8}>
                  <Text style={[styles.saveText, !code.trim() && { color: colors.textMuted }]}>Save</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {codeError ? <Text style={styles.error}>{codeError}</Text> : null}
        </View>
      )}

      {cards.length > 0 && (
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatEuro(remaining)}</Text>
        </View>
      )}
    </AppointmentDialog>
  );
}

function BrandMark({ light }: { light?: boolean }) {
  return (
    <View style={styles.brand}>
      <Image source={require("../../../../assets/app/transparentIcon.png")} style={styles.brandIcon} />
      <Text style={[styles.brandText, { color: light ? colors.white : colors.text }]}>GlamPro</Text>
    </View>
  );
}

function ClassicCard({ amount }: { amount: number }) {
  return (
    <View style={[styles.visual, styles.classic]}>
      <BrandMark light />
      <View style={styles.amountRow}>
        <Text style={styles.amountEuro}>€</Text>
        <Text style={styles.amountValue}>{amount}</Text>
      </View>
      <Text style={styles.giftScript}>
        Gift <Text style={styles.cardWord}>card</Text>
      </Text>
      <Ionicons name="star-outline" size={14} color={colors.teal} style={{ position: "absolute", top: 14, right: 70 }} />
      <Ionicons name="star-outline" size={12} color={colors.pink} style={{ position: "absolute", top: 22, right: 30 }} />
      <Ionicons name="ellipse-outline" size={10} color={colors.teal} style={{ position: "absolute", top: 44, right: 50 }} />
      <View style={styles.giftBox}>
        <View style={styles.giftLid} />
        <View style={styles.giftRibbon} />
        <Ionicons name="heart" size={26} color={colors.pink} style={styles.giftBow} />
      </View>
    </View>
  );
}

function PremiumCard() {
  return (
    <View style={[styles.visual, styles.premium]}>
      <View style={styles.premiumInner}>
        <Text style={styles.premiumTitle}>GIFT CARD</Text>
        <Text style={styles.premiumLorem} numberOfLines={3}>
          {LOREM}
        </Text>
        <View style={{ marginTop: "auto" }}>
          <BrandMark />
        </View>
      </View>
      <View style={styles.vip}>
        <Text style={styles.vipText}>VIP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: -4,
  },
  footer: {
    gap: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: 250,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    backgroundColor: colors.white,
  },
  tileActive: {
    borderColor: colors.primary,
  },
  tileName: {
    marginTop: 16,
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  tileCode: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  visual: {
    height: 140,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  classic: {
    backgroundColor: colors.primary,
    padding: 12,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandIcon: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },
  brandText: {
    fontSize: 10,
    fontFamily: fonts.semibold,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 4,
  },
  amountEuro: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  amountValue: {
    fontSize: 34,
    fontFamily: fonts.bold,
    color: colors.white,
  },
  giftScript: {
    fontSize: 18,
    fontStyle: "italic",
    fontFamily: fonts.medium,
    color: colors.teal,
  },
  cardWord: {
    fontSize: 11,
    fontStyle: "normal",
    fontFamily: fonts.semibold,
  },
  giftBox: {
    position: "absolute",
    right: 14,
    bottom: 0,
    width: 84,
    height: 58,
    backgroundColor: colors.teal,
  },
  giftLid: {
    position: "absolute",
    top: 0,
    left: -4,
    right: -4,
    height: 14,
    backgroundColor: "#13BDB7",
  },
  giftRibbon: {
    position: "absolute",
    left: 36,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: colors.pink,
  },
  giftBow: {
    position: "absolute",
    left: 29,
    top: -22,
  },
  premium: {
    backgroundColor: "#C9B48C",
    padding: 10,
  },
  premiumInner: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 12,
  },
  premiumTitle: {
    fontSize: 22,
    fontFamily: fonts.medium,
    letterSpacing: 1,
    color: "#A6844A",
  },
  premiumLorem: {
    marginTop: 4,
    fontSize: 6,
    lineHeight: 8,
    width: "75%",
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  vip: {
    position: "absolute",
    right: 8,
    bottom: 14,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: "#D7B55A",
    backgroundColor: "#F4E6B8",
    alignItems: "center",
    justifyContent: "center",
  },
  vipText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: "#8A6A22",
  },
  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  codeInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  saveText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  codeChip: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  codeChipText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  appliedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appliedText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.green,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.red,
  },
  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.subtle,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});
