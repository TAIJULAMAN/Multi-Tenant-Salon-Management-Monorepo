import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import DateRangeModal, { DateRange } from "@/components/shifts/DateRangeModal";
import { formatShortDate, toISO } from "@/components/shifts/shiftsData";
import {
  Card,
  FilterBox,
  FilterLabel,
  STAT_GRADIENTS,
  SoftButton,
  StatCard,
  TitleCard,
  figmaStyles,
} from "@/components/shifts/figmaUi";
import ViewPayslipModal from "@/components/remuneration/ViewPayslipModal";
import StatusLabel from "@/components/remuneration/StatusLabel";
import RecordCard, { RecordList, recordCardStyles } from "@/components/ui/RecordCard";
import TablePagination from "@/components/remuneration/TablePagination";
import {
  ALL_YEARS,
  PAYSLIPS,
  Payslip,
  REMUNERATION_STATS,
  YEAR_FILTERS,
  formatEuro,
} from "@/components/remuneration/remunerationData";

/** Figma 1:42730 – "Salaries" (Remuneration). */
export default function RemunerationScreen() {
  const [year, setYear] = useState(ALL_YEARS);
  const [range, setRange] = useState<DateRange | null>(null);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [viewing, setViewing] = useState<Payslip | null>(null);

  const filtered = PAYSLIPS.filter((p) => {
    if (range) return p.dateISO >= toISO(range.from) && p.dateISO <= toISO(range.to);
    return year === ALL_YEARS || p.dateISO.startsWith(year);
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const rangeLabel = range ? `${formatShortDate(range.from).slice(0, 6)} – ${formatShortDate(range.to).slice(0, 6)}` : null;

  const handleExport = () => {
    Alert.alert("Export Data", `Your payslips (${rangeLabel ?? year}) are being exported.`);
  };

  const selectYear = (y: string) => {
    setYear(y);
    setRange(null);
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TitleCard title="Remuneration" inlineActions actions={<SoftButton label="Export Data" onPress={handleExport} />}>
          <View style={styles.filtersRow}>
            <View>
              <FilterLabel label="Year" icon="filter-outline" />
              <View style={styles.yearChips}>
                {YEAR_FILTERS.map((y) => {
                  const active = !range && y === year;
                  return (
                    <TouchableOpacity
                      key={y}
                      style={[styles.yearChip, active && styles.yearChipActive]}
                      onPress={() => selectYear(y)}
                      activeOpacity={0.75}
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.yearChipText, active && styles.yearChipTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View>
              <FilterLabel label="Custom Range" />
              <FilterBox
                label={rangeLabel ?? "Select range"}
                icon="calendar-clear-outline"
                active={!!range}
                style={styles.rangeBox}
                onPress={() => setIsRangeOpen(true)}
              />
            </View>
          </View>
        </TitleCard>

        <View style={styles.statsGrid}>
          <StatCard
            label="Last Payslip"
            value={REMUNERATION_STATS.lastPayslip}
            icon="wallet-outline"
            color={colors.primary}
            gradient={STAT_GRADIENTS.primary}
            lines={[REMUNERATION_STATS.lastPayslipGross, REMUNERATION_STATS.lastPayslipDate]}
          />
          <View style={styles.statsRow}>
            <StatCard
              label="Average Salary"
              value={REMUNERATION_STATS.averageSalary}
              icon="cash-outline"
              color={colors.teal}
              gradient={STAT_GRADIENTS.teal}
              lines={[REMUNERATION_STATS.averageSalarySub]}
              style={figmaStyles.flex1}
            />
            <StatCard
              label="Accumulated TFR"
              value={REMUNERATION_STATS.accumulatedTfr}
              icon="layers-outline"
              color={colors.yellow}
              gradient={STAT_GRADIENTS.yellow}
              style={figmaStyles.flex1}
            />
          </View>
        </View>

        <Card style={styles.listCard}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="wallet-outline" size={44} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No payslips recorded</Text>
            </View>
          ) : (
            <RecordList>
              {visible.map((p) => (
                <RecordCard
                  key={p.id}
                  title={p.date}
                  subtitle={
                    <View style={styles.netRow}>
                      <Text style={styles.netValue}>{formatEuro(p.net)}</Text>
                      <Text style={recordCardStyles.label}>Net</Text>
                    </View>
                  }
                  trailing={<StatusLabel status={p.status} />}
                  onPress={() => setViewing(p)}
                  fields={[
                    { label: "Gross", value: formatEuro(p.gross) },
                    { label: "Contributions", value: formatEuro(p.contributions) },
                    { label: "TFR", value: formatEuro(p.tfr) },
                  ]}
                />
              ))}
            </RecordList>
          )}

          <View style={styles.footerDivider} />
          <TablePagination
            total={filtered.length}
            page={safePage}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={(n) => {
              setPerPage(n);
              setPage(1);
            }}
          />
        </Card>
      </ScrollView>

      <DateRangeModal
        visible={isRangeOpen}
        onClose={() => setIsRangeOpen(false)}
        title="Custom Range"
        onApply={(r) => {
          setRange(r);
          setPage(1);
        }}
      />

      <ViewPayslipModal visible={!!viewing} payslip={viewing} onClose={() => setViewing(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 24,
    rowGap: 12,
  },
  yearChips: {
    flexDirection: "row",
    gap: 8,
  },
  yearChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  yearChipActive: {
    borderColor: colors.primary,
  },
  yearChipText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  yearChipTextActive: {
    color: colors.primary,
  },
  rangeBox: {
    width: 150,
  },
  statsGrid: {
    gap: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  listCard: {
    padding: 16,
    gap: 16,
  },
  netRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  netValue: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.text,
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 16,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
