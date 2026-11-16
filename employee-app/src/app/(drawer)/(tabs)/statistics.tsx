import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Header from "@/components/Header";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import { colors } from "@/constants/figmaTheme";
import StatsFilterCard from "@/components/statistics/StatsFilterCard";
import KpiCards from "@/components/statistics/KpiCards";
import DailyProductionChart from "@/components/statistics/DailyProductionChart";
import ProductionTrendsChart from "@/components/statistics/ProductionTrendsChart";
import { PerformanceMetricsCard, OperationStatsCard } from "@/components/statistics/MetricsCards";
import { CustomRangePicker } from "@/components/statistics/PickerSheetContent";
import {
  DropdownAnchor,
  DropdownOptionList,
  DropdownPopover,
  MonthPickerPanel,
} from "@/components/statistics/StatsDropdown";
import {
  GRANULARITY_OPTIONS,
  METRICS_PERIOD_OPTIONS,
  MONTHS,
  OPERATION_PERIOD_OPTIONS,
  YEARS,
  getOperationStats,
  getPerformanceMetrics,
  getPeriodSummary,
} from "@/components/statistics/statisticsData";

type MenuKind =
  | "month"
  | "year"
  | "dailyGranularity"
  | "trendGranularity"
  | "metricsMenu" // "Select Month ›" / "Select Year ›"
  | "metricsMonth" // year strip + month list (Figma 1:35342)
  | "metricsYear"
  | "operationPeriod";

type SheetKind = "customRange" | "operationCustomRange";

const MENU_WIDTH: Record<MenuKind, number> = {
  month: 180,
  year: 120,
  dailyGranularity: 149,
  trendGranularity: 149,
  metricsMenu: 149,
  metricsMonth: 349,
  metricsYear: 149,
  operationPeriod: 149,
};

type MetricsSelection =
  | { mode: "Select Month"; month: string; year: string }
  | { mode: "Select Year"; year: string }
  | null;

export default function StatisticsScreen() {
  const [month, setMonth] = useState("December");
  const [year, setYear] = useState("2024");
  const [customRange, setCustomRange] = useState<string | null>(null);
  const [dailyGranularity, setDailyGranularity] = useState("Monthly");
  const [trendGranularity, setTrendGranularity] = useState("Monthly");
  const [metrics, setMetrics] = useState<MetricsSelection>(null);
  const [operationPeriod, setOperationPeriod] = useState("Last Month");
  const [menu, setMenu] = useState<{ kind: MenuKind; anchor: DropdownAnchor } | null>(null);
  const [sheet, setSheet] = useState<SheetKind | null>(null);

  const summary = getPeriodSummary(MONTHS.indexOf(month), parseInt(year, 10));
  const operation = getOperationStats(operationPeriod);

  const metricsLabel =
    metrics === null
      ? "Select Month"
      : metrics.mode === "Select Month"
      ? `${metrics.month.slice(0, 3)} ${metrics.year}`
      : metrics.year;

  const openMenu = (kind: MenuKind) => (anchor: DropdownAnchor) => setMenu({ kind, anchor });
  const closeMenu = () => setMenu(null);
  const closeSheet = () => setSheet(null);

  const handleExport = () => {
    Alert.alert(
      "Export Data",
      `Exporting your statistics for ${customRange ?? `${month} ${year}`}.`
    );
  };

  const renderMenuContent = () => {
    if (!menu) return null;
    switch (menu.kind) {
      case "month":
        return (
          <DropdownOptionList
            options={MONTHS}
            value={month}
            onSelect={(m) => {
              setMonth(m);
              setCustomRange(null);
              closeMenu();
            }}
          />
        );
      case "year":
        return (
          <DropdownOptionList
            options={YEARS}
            value={year}
            onSelect={(y) => {
              setYear(y);
              setCustomRange(null);
              closeMenu();
            }}
          />
        );
      case "dailyGranularity":
      case "trendGranularity": {
        const isDaily = menu.kind === "dailyGranularity";
        return (
          <DropdownOptionList
            options={GRANULARITY_OPTIONS}
            value={isDaily ? dailyGranularity : trendGranularity}
            onSelect={(g) => {
              if (isDaily) setDailyGranularity(g);
              else setTrendGranularity(g);
              closeMenu();
            }}
          />
        );
      }
      case "metricsMenu":
        return (
          <DropdownOptionList
            options={METRICS_PERIOD_OPTIONS}
            value={metrics?.mode ?? "Select Month"}
            chevron
            onSelect={(opt) =>
              setMenu({
                kind: opt === "Select Year" ? "metricsYear" : "metricsMonth",
                anchor: menu.anchor,
              })
            }
          />
        );
      case "metricsMonth":
        return (
          <MonthPickerPanel
            initialYear={metrics?.year ?? "2022"}
            selectedMonth={metrics?.mode === "Select Month" ? metrics.month : undefined}
            onSelect={(m, y) => {
              setMetrics({ mode: "Select Month", month: m, year: y });
              closeMenu();
            }}
          />
        );
      case "metricsYear":
        return (
          <DropdownOptionList
            options={YEARS}
            value={metrics?.mode === "Select Year" ? metrics.year : undefined}
            onSelect={(y) => {
              setMetrics({ mode: "Select Year", year: y });
              closeMenu();
            }}
          />
        );
      case "operationPeriod":
        return (
          <DropdownOptionList
            options={OPERATION_PERIOD_OPTIONS}
            value={operationPeriod}
            onSelect={(p) => {
              closeMenu();
              if (p === "Custom Range") {
                setSheet("operationCustomRange");
                return;
              }
              setOperationPeriod(p);
            }}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <StatsFilterCard
          month={month}
          year={year}
          customRange={customRange}
          onOpenMonth={openMenu("month")}
          onOpenYear={openMenu("year")}
          onPressCustomRange={() => setSheet("customRange")}
          onExport={handleExport}
        />

        <KpiCards summary={summary} />

        <DailyProductionChart
          granularity={dailyGranularity}
          onOpenGranularity={openMenu("dailyGranularity")}
        />

        <ProductionTrendsChart
          granularity={trendGranularity}
          onOpenGranularity={openMenu("trendGranularity")}
        />

        <PerformanceMetricsCard
          periodLabel={metricsLabel}
          rows={getPerformanceMetrics()}
          goalAchieved={summary.performance >= 100}
          onOpenPeriod={openMenu("metricsMenu")}
        />

        <OperationStatsCard
          periodLabel={operationPeriod}
          rows={operation.rows}
          performanceStatus={operation.performanceStatus}
          onOpenPeriod={openMenu("operationPeriod")}
        />
      </ScrollView>

      <DropdownPopover
        visible={menu !== null}
        anchor={menu?.anchor ?? null}
        width={menu ? MENU_WIDTH[menu.kind] : 149}
        onClose={closeMenu}
      >
        {renderMenuContent()}
      </DropdownPopover>

      <CustomBottomSheet visible={sheet !== null} onClose={closeSheet} title="Custom Range">
        {sheet !== null && (
          <CustomRangePicker
            onApply={(from, to) => {
              if (sheet === "customRange") setCustomRange(`${from} - ${to}`);
              else setOperationPeriod(`${from} - ${to}`);
              closeSheet();
            }}
          />
        )}
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 24,
  },
});
