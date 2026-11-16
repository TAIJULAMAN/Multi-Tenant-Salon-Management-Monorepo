import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import {
  AmountBlock,
  CompactDropdown,
  IconButton,
  KebabMenu,
  Label,
  Pagination,
  RankRow,
  SectionCard,
  SoftButton,
  StatTileCard,
  SubTitle,
  usePagination,
} from "../common";
import {
  ANALYTICS_STATS,
  DATE_RANGE_OPTIONS,
  EMPLOYEE_BREAKDOWN,
  GIFT_LABELS,
  GREEN_SOFT,
  GiftCard,
  MONEY_SPENT_SERIES,
  PAYMENT_METHOD_STYLES,
  RECEIPTS,
  RECEIPT_STATUS_STYLES,
  Receipt,
  SERVICE_BREAKDOWN,
  giftCardsStore,
  useGiftCards,
} from "../clientsData";
import MoneySpentChart from "./MoneySpentChart";
import { GiftCardFront } from "../giftCards/GiftCardVisual";
import { ReceiptModal } from "../modals/InfoModals";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import RecordCard, { RecordList } from "@/components/ui/RecordCard";

/** Figma 1:38171 — Analytics, Money Spent, breakdowns, Receipts list, Gift Cards. */
export default function FinancialTab({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [range, setRange] = useState("Last 7 days");
  const series = MONEY_SPENT_SERIES[range] ?? MONEY_SPENT_SERIES["Last 7 days"];
  const receipts = usePagination(RECEIPTS, 5);
  const [viewReceipt, setViewReceipt] = useState<Receipt | null>(null);
  const giftCards = useGiftCards();
  const [deleteCard, setDeleteCard] = useState<GiftCard | null>(null);

  const stillToSpend = giftCards.filter((g) => !g.used && !g.expired).reduce((s, g) => s + g.amount * g.quantity, 0);
  const totalUsed = giftCards.filter((g) => g.used).reduce((s, g) => s + g.amount * g.quantity, 0);
  const positive = !series.delta.startsWith("-");

  const handleCardAction = (card: GiftCard, action: string) => {
    if (action === "view") router.push(`/(drawer)/(tabs)/clients/gift-cards/${card.id}` as never);
    if (action === "edit")
      router.push({ pathname: "/(drawer)/(tabs)/clients/gift-cards/add", params: { id: card.id, clientId } } as never);
    if (action === "delete") setDeleteCard(card);
  };

  return (
    <View style={styles.container}>
      {/* Analytics */}
      <SectionCard title="Analytics">
        <View style={styles.statsRow}>
          {ANALYTICS_STATS.map((s) => (
            <StatTileCard key={s.label} tile={s} style={{ flex: 1 }} />
          ))}
        </View>

        {/* Money spent widget */}
        <View style={styles.widget}>
          <View style={styles.widgetHeader}>
            <Text style={styles.widgetTitle}>Money Spent</Text>
            <CompactDropdown value={range} options={DATE_RANGE_OPTIONS} onChange={setRange} />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={styles.total}>{series.total}</Text>
            <View style={styles.deltaRow}>
              <View style={[styles.deltaIcon, { backgroundColor: positive ? GREEN_SOFT : colors.pinkSoft }]}>
                <Ionicons
                  name={positive ? "arrow-up" : "arrow-down"}
                  size={14}
                  color={positive ? colors.green : colors.pink}
                  style={{ transform: [{ rotate: positive ? "-45deg" : "45deg" }] }}
                />
              </View>
              <Text style={styles.delta}>{series.delta}</Text>
              <Text style={styles.deltaLabel}>{series.deltaLabel}</Text>
            </View>
          </View>
          <MoneySpentChart key={range} labels={series.labels} values={series.values} />
        </View>

        {/* Breakdown by employee */}
        <SubTitle>Breakdown by Employee</SubTitle>
        <View style={{ gap: 12 }}>
          {EMPLOYEE_BREAKDOWN.map((e) => (
            <View key={e.id} style={styles.employeeCard}>
              <Image source={{ uri: e.avatar }} style={styles.employeeAvatar} />
              <Text style={styles.employeeName} numberOfLines={1}>
                {e.name}
              </Text>
              <AmountBlock amount={e.amount} caption="Total Earned" green />
            </View>
          ))}
        </View>

        {/* Breakdown by service */}
        <SubTitle>Breakdown by Service Type</SubTitle>
        <View style={{ gap: 16 }}>
          {SERVICE_BREAKDOWN.map((s, i) => (
            <RankRow
              key={s.name}
              index={i + 1}
              name={s.name}
              right={<AmountBlock amount={s.amount} caption="Total Earned" green />}
            />
          ))}
        </View>
      </SectionCard>

      {/* Receipts */}
      <SectionCard title="Receipts list">
        <RecordList>
          {receipts.pageItems.map((r) => (
            <RecordCard
              key={r.id}
              title={
                <TouchableOpacity onPress={() => setViewReceipt(r)} hitSlop={8} style={{ alignSelf: "flex-start" }}>
                  <Text style={styles.idLink}>{r.id}</Text>
                </TouchableOpacity>
              }
              subtitle={
                <View style={styles.memberRow}>
                  <Image source={{ uri: r.avatar }} style={styles.receiptAvatar} />
                  <Text style={styles.memberText} numberOfLines={1}>
                    {r.teamMember}
                  </Text>
                </View>
              }
              trailing={<Label label={r.status} styleDef={RECEIPT_STATUS_STYLES[r.status]} />}
              fields={[
                { label: "Service", value: r.service },
                { label: "Price", value: `€ ${r.price}` },
                { label: "Scheduled Date", value: r.scheduledDate, full: true },
                {
                  label: "Payment Method",
                  value: <Label label={r.paymentMethod} styleDef={PAYMENT_METHOD_STYLES[r.paymentMethod]} />,
                },
              ]}
              footer={
                <>
                  <IconButton
                    icon="download-outline"
                    tone="primarySoft"
                    accessibilityLabel="Download receipt"
                    onPress={() => Alert.alert("Download", `Receipt ${r.id} downloaded.`)}
                  />
                  <IconButton
                    icon="print-outline"
                    tone="neutral"
                    accessibilityLabel="Print receipt"
                    onPress={() => Alert.alert("Print", `Receipt ${r.id} sent to printer.`)}
                  />
                </>
              }
            />
          ))}
        </RecordList>
        <Pagination {...receipts} />
      </SectionCard>

      {/* Gift cards */}
      <SectionCard
        title="Gift Cards"
        right={
          <SoftButton
            label="Add Gift Card"
            icon="add"
            onPress={() =>
              router.push({ pathname: "/(drawer)/(tabs)/clients/gift-cards/add", params: { clientId } } as never)
            }
          />
        }
      >
        {[
          { label: "Total to Still Spend", value: stillToSpend, icon: "ticket-outline" as const, color: colors.green },
          { label: "Total Used", value: totalUsed, icon: "checkbox-outline" as const, color: colors.yellow },
        ].map((s) => (
          <View key={s.label} style={styles.giftStat}>
            <View style={[styles.giftStatIcon, { backgroundColor: s.color }]}>
              <Ionicons name={s.icon} size={20} color={colors.white} />
            </View>
            <Text style={styles.giftStatLabel}>{s.label}</Text>
            <Text style={styles.giftStatValue}>€ {s.value.toLocaleString("en-US")}</Text>
          </View>
        ))}

        {giftCards.map((g) => (
          <View key={g.id} style={styles.giftCard}>
            <View style={styles.giftHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.giftAmount}>
                  {g.currency} {g.amount}
                </Text>
                <Text style={styles.giftCode}>{g.code}</Text>
              </View>
              <KebabMenu
                items={[
                  { key: "view", label: "View", icon: "eye" },
                  { key: "edit", label: "Edit", icon: "pencil-outline" },
                  { key: "delete", label: "Delete", icon: "trash-outline", color: colors.pink },
                ]}
                onSelect={(k) => handleCardAction(g, k)}
              />
            </View>
            <GiftCardFront
              template={g.template}
              amount={g.amount}
              currency={g.currency}
              hideAmount={g.hideAmount}
              logo={g.logo}
              height={170}
            />
            <View style={styles.giftBadges}>
              {g.used ? (
                <Label label="Used" styleDef={GIFT_LABELS.Used} />
              ) : (
                <>
                  <Label label="No-Used" styleDef={GIFT_LABELS["No-Used"]} />
                  <Label
                    label={g.expired ? "Expired" : "Active"}
                    styleDef={g.expired ? GIFT_LABELS.Expired : GIFT_LABELS.Active}
                  />
                </>
              )}
            </View>
          </View>
        ))}
      </SectionCard>

      <ReceiptModal visible={!!viewReceipt} onClose={() => setViewReceipt(null)} receipt={viewReceipt} />

      <ConfirmDeleteModal
        visible={!!deleteCard}
        onClose={() => setDeleteCard(null)}
        title="Delete Gift Card"
        message={`Are you sure you want to delete gift card ${deleteCard?.code ?? ""}? It will become permanently invalid.`}
        onConfirm={() => deleteCard && giftCardsStore.remove([deleteCard.id])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  widget: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  widgetTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  total: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deltaIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  delta: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  deltaLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  employeeName: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  idLink: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  receiptAvatar: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
  },
  memberText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  giftStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 20,
  },
  giftStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  giftStatLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  giftStatValue: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  giftCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 20,
    gap: 20,
  },
  giftHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  giftAmount: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  giftCode: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  giftBadges: {
    flexDirection: "row",
    gap: 8,
  },
});
