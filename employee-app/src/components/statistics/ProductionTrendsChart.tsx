import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent } from "react-native";
import Svg, { ClipPath, Circle, Defs, Line, Path, Rect } from "react-native-svg";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import {
  CHART_COLORS,
  PRODUCTION_TRENDS,
  TREND_DOMAIN,
  TREND_EDGES,
  TREND_THRESHOLD,
  Y_AXIS_LABELS,
  formatK,
} from "./statisticsData";
import { DropdownPill, StatsCard, TooltipRow, tooltipStyles } from "./StatsUI";
import { DropdownAnchor } from "./StatsDropdown";

const CHART_HEIGHT = 200;
const Y_AXIS_WIDTH = 38;
const PAD_Y = 8;
const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 56;

/** Catmull-Rom → cubic bezier smooth path */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

interface ProductionTrendsChartProps {
  granularity: string;
  onOpenGranularity: (anchor: DropdownAnchor) => void;
}

export default function ProductionTrendsChart({
  granularity,
  onOpenGranularity,
}: ProductionTrendsChartProps) {
  const [width, setWidth] = useState(0);
  // Figma shows two annotations: one above (2020) and one below (2023) the threshold
  const [selected, setSelected] = useState<number[]>([1, 4]);

  const plotWidth = Math.max(0, width - Y_AXIS_WIDTH);
  const n = PRODUCTION_TRENDS.length;
  // Years sit in the middle of equal columns; the line runs on to both plot edges (as in Figma)
  const step = n > 0 ? plotWidth / n : 0;
  const innerH = CHART_HEIGHT - PAD_Y * 2;

  const yFor = (v: number) =>
    PAD_Y + innerH - ((v - TREND_DOMAIN.min) / (TREND_DOMAIN.max - TREND_DOMAIN.min)) * innerH;

  const points = PRODUCTION_TRENDS.map((p, i) => ({ x: step * (i + 0.5), y: yFor(p.value) }));
  const path = smoothPath([
    { x: 0, y: yFor(TREND_EDGES.start) },
    ...points,
    { x: plotWidth, y: yFor(TREND_EDGES.end) },
  ]);
  const thresholdY = yFor(TREND_THRESHOLD);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const toggle = (i: number) =>
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [i]));

  return (
    <StatsCard>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Production Trends (Yearly)</Text>
        <DropdownPill label={granularity} onOpen={onOpenGranularity} />
      </View>

      <View style={styles.chartWrap} onLayout={onLayout}>
        <View style={[styles.yAxis, { height: CHART_HEIGHT }]}>
          {Y_AXIS_LABELS.map((l) => (
            <Text key={l} style={styles.axisText}>
              {l}
            </Text>
          ))}
        </View>

        {width > 0 && (
          <Svg
            width={plotWidth}
            height={CHART_HEIGHT}
            style={{ position: "absolute", left: Y_AXIS_WIDTH }}
          >
            <Defs>
              <ClipPath id="trendAbove">
                <Rect x={-10} y={0} width={plotWidth + 20} height={thresholdY} />
              </ClipPath>
              <ClipPath id="trendBelow">
                <Rect x={-10} y={thresholdY} width={plotWidth + 20} height={CHART_HEIGHT - thresholdY} />
              </ClipPath>
            </Defs>

            {/* grid */}
            {Array.from({ length: n + 1 }, (_, i) => (
              <Line
                key={`v${i}`}
                x1={Math.min(Math.max(0.5, step * i), plotWidth - 0.5)}
                x2={Math.min(Math.max(0.5, step * i), plotWidth - 0.5)}
                y1={PAD_Y}
                y2={CHART_HEIGHT - PAD_Y}
                stroke={CHART_COLORS.grid}
              />
            ))}
            {Y_AXIS_LABELS.map((_, i) => {
              const y = PAD_Y + (innerH / (Y_AXIS_LABELS.length - 1)) * i;
              return (
                <Line key={`h${i}`} x1={0} x2={plotWidth} y1={y} y2={y} stroke={CHART_COLORS.grid} />
              );
            })}

            {/* threshold */}
            <Line
              x1={0}
              x2={plotWidth}
              y1={thresholdY}
              y2={thresholdY}
              stroke={CHART_COLORS.thresholdLine}
              strokeWidth={1}
            />

            <Path
              d={path}
              fill="none"
              stroke={CHART_COLORS.aboveLine}
              strokeWidth={2}
              clipPath="url(#trendAbove)"
            />
            <Path
              d={path}
              fill="none"
              stroke={CHART_COLORS.belowLine}
              strokeWidth={2}
              clipPath="url(#trendBelow)"
            />

            {selected.map((i) => {
              const above = PRODUCTION_TRENDS[i].value >= TREND_THRESHOLD;
              return (
                <Circle
                  key={`c${i}`}
                  cx={points[i].x}
                  cy={points[i].y}
                  r={3.5}
                  fill={above ? CHART_COLORS.aboveLine : CHART_COLORS.belowLine}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                />
              );
            })}
          </Svg>
        )}

        {width > 0 && (
          <View style={[styles.hitRow, { left: Y_AXIS_WIDTH, height: CHART_HEIGHT }]}>
            {PRODUCTION_TRENDS.map((p, i) => (
              <Pressable
                key={p.year}
                style={{ width: step, height: CHART_HEIGHT }}
                onPress={() => toggle(i)}
              />
            ))}
          </View>
        )}

        {width > 0 &&
          selected.map((i) => {
            const p = PRODUCTION_TRENDS[i];
            const above = p.value >= TREND_THRESHOLD;
            const px = Y_AXIS_WIDTH + points[i].x;
            let left = px - TOOLTIP_WIDTH / 2;
            left = Math.min(Math.max(Y_AXIS_WIDTH, left), width - TOOLTIP_WIDTH);
            const top = above
              ? Math.max(0, points[i].y - TOOLTIP_HEIGHT - 8)
              : Math.min(CHART_HEIGHT - TOOLTIP_HEIGHT, points[i].y + 12);
            return (
              <View key={`t${i}`} pointerEvents="none" style={[tooltipStyles.box, styles.tooltip, { left, top }]}>
                <Text style={tooltipStyles.title}>{p.date}</Text>
                <TooltipRow
                  label={above ? "Above Threshold" : "Below Threshold"}
                  value={formatK(p.value)}
                  color={above ? CHART_COLORS.aboveLine : CHART_COLORS.belowLine}
                />
              </View>
            );
          })}
      </View>

      <View style={[styles.xAxis, { marginLeft: Y_AXIS_WIDTH }]}>
        {PRODUCTION_TRENDS.map((p, i) => (
          <Text
            key={p.year}
            style={[
              styles.axisText,
              styles.xLabel,
              { left: step * (i + 0.5) - 18 },
            ]}
          >
            {p.year}
          </Text>
        ))}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: CHART_COLORS.aboveLine }]} />
          <Text style={styles.legendText}>Above Threshold</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: CHART_COLORS.belowLine }]} />
          <Text style={styles.legendText}>Below Threshold</Text>
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
    marginBottom: 20,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  chartWrap: {
    width: "100%",
    height: CHART_HEIGHT,
  },
  yAxis: {
    width: Y_AXIS_WIDTH,
    justifyContent: "space-between",
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
    width: TOOLTIP_WIDTH,
  },
  xAxis: {
    height: 16,
    marginTop: 10,
  },
  xLabel: {
    position: "absolute",
    width: 36,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 14,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 24,
    rowGap: 8,
    marginTop: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendSwatch: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
  },
  legendText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});
