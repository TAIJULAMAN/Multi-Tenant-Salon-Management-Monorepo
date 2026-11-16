import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, {
  G,
  Rect,
  Line as SvgLine,
  Text as SvgText,
} from "react-native-svg";
import { colors, fonts, shadows } from "@/constants/figmaTheme";
import ExportReportModal from "./ExportReportModal";
import {
  ExportDataButton,
  PeriodDropdown,
  dashboardCardStyle as card,
  tooltipStyle as tip,
} from "./DashboardControls";
import { paymentsPerYear, type YearPayment } from "./dashboardData";

const BAR = colors.primary;
const TRACK = colors.subtle;
const CHART_HEIGHT = 200;
const Y_AXIS_W = 52;
const PAD_TOP = 8;
const WINDOW = 6;
const TOOLTIP_W = 160;
const PERIODS = ["Yearly", "Monthly"] as const;
type Period = (typeof PERIODS)[number];

const euro = (n: number) => `€ ${n.toLocaleString("en-US")}`;

/** Figma 1:32440 › "Payments per Year" (y-axis € 1,000 – € 4,000, pager arrows bottom-right). */
export default function PaymentsPerYearChart() {
  const [period, setPeriod] = useState<Period>("Yearly");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [start, setStart] = useState(
    Math.max(paymentsPerYear.length - WINDOW, 0),
  );
  const [activeYear, setActiveYear] = useState<string | null>(
    paymentsPerYear[paymentsPerYear.length - 1].year,
  );
  const [width, setWidth] = useState(0);

  const isYearly = period === "Yearly";
  const visible = paymentsPerYear.slice(start, start + WINDOW);
  const valueOf = (p: YearPayment) => (isYearly ? p.amount : p.monthlyMean);

  // Yearly: Figma scale € 1,000 → € 4,000 (step 500). Monthly mean: 0-based scale fitted to the data.
  const step = isYearly
    ? 500
    : Math.ceil(Math.max(...paymentsPerYear.map(valueOf)) / 6 / 100) * 100 ||
      100;
  const minVal = isYearly ? 1000 : 0;
  const ticks = Array.from({ length: 7 }, (_, i) => minVal + i * step);
  const maxVal = ticks[ticks.length - 1];

  const plotW = Math.max(width - Y_AXIS_W, 0);
  const groupW = visible.length ? plotW / visible.length : 0;
  const barW = Math.min(groupW * 0.62, 86);
  const y = (v: number) =>
    CHART_HEIGHT -
    ((Math.max(v, minVal) - minVal) / (maxVal - minVal)) * CHART_HEIGHT;

  const activeIndex = visible.findIndex((p) => p.year === activeYear);
  const active = activeIndex >= 0 ? visible[activeIndex] : null;
  const canPrev = start > 0;
  const canNext = start + WINDOW < paymentsPerYear.length;

  return (
    <View style={card.card}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>Payments per Year</Text>
        </View>
        <View style={card.actionsRow}>
          <PeriodDropdown
            value={period}
            options={PERIODS}
            onChange={setPeriod}
          />
          <ExportDataButton onPress={() => setIsExportOpen(true)} />
        </View>
      </View>

      <View
        style={styles.chartWrap}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {width > 0 && (
          <>
            <Svg width={width} height={CHART_HEIGHT + 30 + PAD_TOP}>
              <G y={PAD_TOP}>
                {ticks.map((t) => (
                  <SvgText
                    key={t}
                    x={0}
                    y={y(t) + 4}
                    fontSize={11}
                    fill={colors.textMuted}
                    fontFamily={fonts.regular}
                  >
                    {euro(t)}
                  </SvgText>
                ))}
                <SvgLine
                  x1={Y_AXIS_W - 6}
                  y1={0}
                  x2={Y_AXIS_W - 6}
                  y2={CHART_HEIGHT}
                  stroke={colors.borderLight}
                  strokeWidth={1}
                />

                {visible.map((p, i) => {
                  const bx = Y_AXIS_W + i * groupW + (groupW - barW) / 2;
                  const v = valueOf(p);
                  const r = Math.min(8, barW / 3);
                  return (
                    <React.Fragment key={p.year}>
                      <Rect
                        x={bx}
                        y={-6}
                        width={barW}
                        height={CHART_HEIGHT + 6}
                        fill={TRACK}
                        rx={r}
                      />
                      <Rect
                        x={bx}
                        y={y(v)}
                        width={barW}
                        height={CHART_HEIGHT - y(v)}
                        fill={BAR}
                        rx={r}
                      />
                      <SvgText
                        x={bx + barW / 2}
                        y={CHART_HEIGHT + 24}
                        fontSize={12}
                        fill={colors.textMuted}
                        textAnchor="middle"
                        fontFamily={fonts.regular}
                      >
                        {p.year}
                      </SvgText>
                      <Rect
                        x={Y_AXIS_W + i * groupW}
                        y={-6}
                        width={groupW}
                        height={CHART_HEIGHT + 36}
                        fill="transparent"
                        onPress={() =>
                          setActiveYear((a) => (a === p.year ? null : p.year))
                        }
                      />
                    </React.Fragment>
                  );
                })}
              </G>
            </Svg>

            {active && (
              <View
                pointerEvents="none"
                style={[
                  tip.card,
                  {
                    width: TOOLTIP_W,
                    top: Math.max(PAD_TOP + y(valueOf(active)) - 96, 0),
                    left: Math.min(
                      Math.max(
                        Y_AXIS_W +
                          activeIndex * groupW +
                          groupW / 2 -
                          TOOLTIP_W / 2,
                        0,
                      ),
                      width - TOOLTIP_W,
                    ),
                  },
                ]}
              >
                <View style={tip.labelWrap}>
                  <View style={[tip.dot, { backgroundColor: BAR }]} />
                  <Text style={tip.label}>{active.year}</Text>
                </View>
                <View style={tip.row}>
                  <Text style={tip.label}>Total</Text>
                  <Text style={tip.value}>{euro(active.total)}</Text>
                </View>
                <View style={tip.row}>
                  <Text style={tip.label}>Monthly mean</Text>
                  <Text style={tip.value}>{euro(active.monthlyMean)}</Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.pagerRow}>
        <TouchableOpacity
          style={styles.pagerBtn}
          onPress={() => setStart((s) => s - 1)}
          disabled={!canPrev}
          activeOpacity={0.7}
          accessibilityLabel="Previous years"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={canPrev ? colors.primary : colors.primarySoft}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pagerBtn}
          onPress={() => setStart((s) => s + 1)}
          disabled={!canNext}
          activeOpacity={0.7}
          accessibilityLabel="Next years"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={canNext ? colors.primary : colors.primarySoft}
          />
        </TouchableOpacity>
      </View>

      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Payments Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrap: {
    marginTop: 8,
  },
  pagerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  pagerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
});
