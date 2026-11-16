import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, LayoutChangeEvent } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/figmaTheme";
import {
  CHART_COLORS,
  DAILY_PRODUCTION,
  DAILY_PRODUCTION_SUMMARY,
  Y_AXIS_LABELS,
  formatEuro,
  formatK,
} from "./statisticsData";
import { DropdownPill, StatsCard, StatusBadge, TooltipRow, tooltipStyles } from "./StatsUI";
import { DropdownAnchor } from "./StatsDropdown";

const PAGE_SIZE = 6;
const CHART_HEIGHT = 200;
const Y_AXIS_WIDTH = 38;
const BAR_WIDTH = 10;
const BASELINE_GAP = 5;
const TOOLTIP_WIDTH = 156;

/** Bar with only its outer end rounded (Figma: flat at the € 2k baseline) */
function barPath(x: number, y: number, w: number, h: number, roundTop: boolean): string {
  const r = Math.min(w / 2, h);
  if (roundTop) {
    return `M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
  }
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h - r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} Z`;
}

interface DailyProductionChartProps {
  granularity: string;
  onOpenGranularity: (anchor: DropdownAnchor) => void;
}

export default function DailyProductionChart({
  granularity,
  onOpenGranularity,
}: DailyProductionChartProps) {
  const [width, setWidth] = useState(0);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number | null>(3);

  const pageCount = Math.ceil(DAILY_PRODUCTION.length / PAGE_SIZE);
  const data = DAILY_PRODUCTION.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const plotWidth = Math.max(0, width - Y_AXIS_WIDTH);
  const colWidth = plotWidth / PAGE_SIZE;
  const baselineY = CHART_HEIGHT / 2; // € 2k line
  const halfSpace = CHART_HEIGHT / 2 - 10;
  const maxThreshold = Math.max(...DAILY_PRODUCTION.map((d) => d.threshold));
  const maxAbove = Math.max(...DAILY_PRODUCTION.map((d) => d.aboveThreshold));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const goToPage = (next: number) => {
    setPage(next);
    setSelected(null);
  };

  const selectedPoint = selected !== null ? data[selected] : undefined;
  let tooltipLeft = 0;
  if (selected !== null) {
    const barCenter = Y_AXIS_WIDTH + colWidth * selected + colWidth / 2;
    tooltipLeft = barCenter + 10;
    if (tooltipLeft + TOOLTIP_WIDTH > width) tooltipLeft = barCenter - 10 - TOOLTIP_WIDTH;
    tooltipLeft = Math.max(Y_AXIS_WIDTH, tooltipLeft);
  }

  return (
    <StatsCard>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Daily Production (Monthly)</Text>
        <DropdownPill label={granularity} onOpen={onOpenGranularity} />
      </View>

      <View style={styles.statusRow}>
        <View style={{ gap: 6 }}>
          <Text style={styles.statusLabel}>Production Status</Text>
          <StatusBadge label={DAILY_PRODUCTION_SUMMARY.status} variant="success" />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.totalValue}>{formatEuro(DAILY_PRODUCTION_SUMMARY.total)}</Text>
          <Text style={styles.thresholdText}>
            Threshold: {formatEuro(DAILY_PRODUCTION_SUMMARY.threshold)}
          </Text>
        </View>
      </View>

      <View style={styles.chartWrap} onLayout={onLayout}>
        {/* Y axis labels */}
        <View style={[styles.yAxis, { height: CHART_HEIGHT }]}>
          {Y_AXIS_LABELS.map((l) => (
            <Text key={l} style={styles.axisText}>
              {l}
            </Text>
          ))}
        </View>

        {width > 0 && (
          <Svg width={plotWidth} height={CHART_HEIGHT} style={{ position: "absolute", left: Y_AXIS_WIDTH }}>
            {/* grid: horizontal line per y tick + left / right frame */}
            {Y_AXIS_LABELS.map((l, i) => {
              const y = 6 + ((CHART_HEIGHT - 12) / (Y_AXIS_LABELS.length - 1)) * i;
              return <Line key={l} x1={0} x2={plotWidth} y1={y} y2={y} stroke={CHART_COLORS.grid} strokeWidth={1} />;
            })}
            <Line x1={0.5} x2={0.5} y1={6} y2={CHART_HEIGHT - 6} stroke={CHART_COLORS.grid} strokeWidth={1} />
            <Line
              x1={plotWidth - 0.5}
              x2={plotWidth - 0.5}
              y1={6}
              y2={CHART_HEIGHT - 6}
              stroke={CHART_COLORS.grid}
              strokeWidth={1}
            />
            {/* baseline */}
            <Line
              x1={0}
              x2={plotWidth}
              y1={baselineY}
              y2={baselineY}
              stroke={CHART_COLORS.thresholdLine}
              strokeWidth={1}
            />
            {data.map((d, i) => {
              const cx = colWidth * i + colWidth / 2;
              const upH = Math.max(BAR_WIDTH, (d.threshold / maxThreshold) * halfSpace);
              const downH = Math.max(BAR_WIDTH, (d.aboveThreshold / maxAbove) * halfSpace);
              return (
                <React.Fragment key={d.label}>
                  <Path
                    d={barPath(cx - BAR_WIDTH / 2, baselineY - BASELINE_GAP - upH, BAR_WIDTH, upH, true)}
                    fill={CHART_COLORS.threshold}
                  />
                  <Path
                    d={barPath(cx - BAR_WIDTH / 2, baselineY + BASELINE_GAP, BAR_WIDTH, downH, false)}
                    fill={CHART_COLORS.above}
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        )}

        {/* Tap targets */}
        {width > 0 && (
          <View style={[styles.hitRow, { left: Y_AXIS_WIDTH, width: plotWidth, height: CHART_HEIGHT }]}>
            {data.map((d, i) => (
              <Pressable
                key={d.label}
                style={{ width: colWidth, height: CHART_HEIGHT }}
                onPress={() => setSelected(selected === i ? null : i)}
              />
            ))}
          </View>
        )}

        {selectedPoint && (
          <View pointerEvents="none" style={[tooltipStyles.box, styles.tooltip, { left: tooltipLeft }]}>
            <Text style={tooltipStyles.title}>{selectedPoint.period}</Text>
            <TooltipRow label="Total Production" value={formatK(selectedPoint.totalProduction)} />
            <TooltipRow label="Threshold" value={formatK(selectedPoint.threshold)} color={CHART_COLORS.threshold} />
            <TooltipRow
              label="Above Threshold"
              value={formatK(selectedPoint.aboveThreshold)}
              color={CHART_COLORS.above}
            />
          </View>
        )}
      </View>

      {/* X axis */}
      <View style={[styles.xAxis, { paddingLeft: Y_AXIS_WIDTH }]}>
        {data.map((d, i) => (
          <Text
            key={d.label}
            style={[styles.axisText, styles.xLabel]}
          >
            {d.label}
          </Text>
        ))}
      </View>

      <View style={styles.footerRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.footerText}>
            Threshold Calculation: {DAILY_PRODUCTION_SUMMARY.thresholdCalculation}
          </Text>
          <Text style={styles.footerText}>
            Monthly Salary: {formatEuro(DAILY_PRODUCTION_SUMMARY.monthlySalary)}
          </Text>
        </View>
        <View style={styles.pager}>
          <TouchableOpacity
            style={styles.pagerBtn}
            accessibilityLabel="Previous months"
            disabled={page === 0}
            onPress={() => goToPage(page - 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={18} color={page === 0 ? colors.primarySoft : colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pagerBtn}
            accessibilityLabel="Next months"
            disabled={page === pageCount - 1}
            onPress={() => goToPage(page + 1)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={page === pageCount - 1 ? colors.primarySoft : colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </StatsCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  totalValue: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: fonts.semibold,
    color: colors.green,
  },
  thresholdText: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  chartWrap: {
    width: "100%",
    height: CHART_HEIGHT,
  },
  yAxis: {
    width: Y_AXIS_WIDTH,
    justifyContent: "space-between",
    paddingVertical: 0,
  },
  axisText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: fonts.regular,
    color: CHART_COLORS.axis,
  },
  hitRow: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
  },
  tooltip: {
    top: 4,
    width: TOOLTIP_WIDTH,
  },
  xAxis: {
    flexDirection: "row",
    marginTop: 10,
  },
  xLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  pager: {
    flexDirection: "row",
    gap: 12,
  },
  pagerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});
