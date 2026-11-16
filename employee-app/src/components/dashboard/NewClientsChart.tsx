import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
  Line as SvgLine,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { colors, fonts } from "@/constants/figmaTheme";
import ExportReportModal from "./ExportReportModal";
import {
  ExportDataButton,
  PeriodDropdown,
  dashboardCardStyle as card,
  tooltipStyle as tip,
} from "./DashboardControls";
import { MONTHS, newClientsSeries } from "./dashboardData";

const CURRENT = colors.teal;
const PREVIOUS = colors.primary;
const CHART_HEIGHT = 180;
const Y_AXIS_W = 30;
const PAD_TOP = 8;
const TOOLTIP_W = 140;
const PERIODS = ["Monthly", "Quarterly"] as const;
type Period = (typeof PERIODS)[number];

const sumBy = (arr: number[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size).reduce((a, b) => a + b, 0),
  );

const smoothPath = (pts: { x: number; y: number }[]) =>
  pts.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

/** Figma 1:32440 › "New Clients" – current year (teal) vs previous year (purple). */
export default function NewClientsChart() {
  const [period, setPeriod] = useState<Period>("Monthly");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(6);
  const [width, setWidth] = useState(0);

  const isMonthly = period === "Monthly";
  const labels = isMonthly ? MONTHS : ["Q1", "Q2", "Q3", "Q4"];
  const current = isMonthly
    ? newClientsSeries.current
    : sumBy(newClientsSeries.current, 3);
  const previous = isMonthly
    ? newClientsSeries.previous
    : sumBy(newClientsSeries.previous, 3);

  // Monthly matches Figma (50 … 300, step 50); other periods scale to the data.
  const step = isMonthly
    ? 50
    : Math.ceil(Math.max(...current, ...previous) / 5 / 50) * 50 || 50;
  const minVal = step;
  const ticks = [1, 2, 3, 4, 5, 6].map((i) => i * step);
  const maxVal = ticks[ticks.length - 1];

  const plotW = Math.max(width - Y_AXIS_W, 0);
  const stepX = labels.length > 1 ? plotW / (labels.length - 1) : 0;
  const x = (i: number) => Y_AXIS_W + i * stepX;
  const y = (v: number) =>
    CHART_HEIGHT -
    ((Math.max(v, minVal) - minVal) / (maxVal - minVal)) * CHART_HEIGHT;

  const ptsCurrent = current.map((v, i) => ({ x: x(i), y: y(v) }));
  const ptsPrevious = previous.map((v, i) => ({ x: x(i), y: y(v) }));
  const pathCurrent = smoothPath(ptsCurrent);
  const pathPrevious = smoothPath(ptsPrevious);
  const areaCurrent = `${pathCurrent} L ${x(labels.length - 1)} ${CHART_HEIGHT} L ${x(0)} ${CHART_HEIGHT} Z`;
  const areaPrevious = `${pathPrevious} L ${x(labels.length - 1)} ${CHART_HEIGHT} L ${x(0)} ${CHART_HEIGHT} Z`;

  const idx =
    activeIdx !== null && activeIdx < labels.length ? activeIdx : null;
  const tooltipTop =
    idx !== null
      ? Math.max(PAD_TOP + Math.min(y(current[idx]), y(previous[idx])) - 76, 0)
      : 0;

  return (
    <View style={card.card}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>New Clients</Text>
          <Text style={card.subtitle}>
            Last 12 Months <Text style={styles.growth}>+15%</Text>
          </Text>
        </View>
        <View style={card.actionsRow}>
          <PeriodDropdown
            value={period}
            options={PERIODS}
            onChange={(p) => {
              setPeriod(p);
              setActiveIdx(null);
            }}
          />
          <ExportDataButton onPress={() => setIsExportOpen(true)} />
        </View>
      </View>

      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <>
            <Svg width={width} height={CHART_HEIGHT + 26 + PAD_TOP}>
              <Defs>
                <LinearGradient id="ncPrev" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={PREVIOUS} stopOpacity="0.08" />
                  <Stop offset="1" stopColor={PREVIOUS} stopOpacity="0.1" />
                </LinearGradient>
                <LinearGradient id="ncCurr" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={CURRENT} stopOpacity="0.06" />
                  <Stop offset="1" stopColor={CURRENT} stopOpacity="0" />
                </LinearGradient>
              </Defs>

              <G y={PAD_TOP}>
                {ticks.map((t) => (
                  <React.Fragment key={t}>
                    <SvgLine
                      x1={Y_AXIS_W}
                      y1={y(t)}
                      x2={width}
                      y2={y(t)}
                      stroke={colors.borderLight}
                      strokeWidth={1}
                    />
                    <SvgText
                      x={0}
                      y={y(t) + 4}
                      fontSize={12}
                      fill={colors.textMuted}
                      fontFamily={fonts.regular}
                    >
                      {t}
                    </SvgText>
                  </React.Fragment>
                ))}
                {labels.map((label, i) => (
                  <SvgLine
                    key={`v-${label}`}
                    x1={x(i)}
                    y1={0}
                    x2={x(i)}
                    y2={CHART_HEIGHT}
                    stroke={colors.borderLight}
                    strokeWidth={1}
                  />
                ))}

                <Path d={areaPrevious} fill="url(#ncPrev)" />
                <Path d={areaCurrent} fill="url(#ncCurr)" />
                <Path
                  d={pathPrevious}
                  fill="none"
                  stroke={PREVIOUS}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <Path
                  d={pathCurrent}
                  fill="none"
                  stroke={CURRENT}
                  strokeWidth={2}
                  strokeLinecap="round"
                />

                {idx !== null && (
                  <>
                    <Circle
                      cx={x(idx)}
                      cy={y(previous[idx])}
                      r={4}
                      fill={PREVIOUS}
                      stroke={colors.white}
                      strokeWidth={1.5}
                    />
                    <Circle
                      cx={x(idx)}
                      cy={y(current[idx])}
                      r={4}
                      fill={CURRENT}
                      stroke={colors.white}
                      strokeWidth={1.5}
                    />
                  </>
                )}

                {labels.map((label, i) =>
                  stepX >= 26 || labels.length <= 6 || i % 2 === 0 ? (
                    <SvgText
                      key={label}
                      x={x(i)}
                      y={CHART_HEIGHT + 20}
                      fontSize={12}
                      fill={colors.textMuted}
                      textAnchor="middle"
                      fontFamily={fonts.regular}
                    >
                      {label}
                    </SvgText>
                  ) : null,
                )}

                {/* Column hit targets */}
                {labels.map((label, i) => (
                  <Rect
                    key={`hit-${label}`}
                    x={x(i) - stepX / 2}
                    y={0}
                    width={Math.max(stepX, 1)}
                    height={CHART_HEIGHT + 26}
                    fill="transparent"
                    onPress={() => setActiveIdx((p) => (p === i ? null : i))}
                  />
                ))}
              </G>
            </Svg>

            {idx !== null && (
              <View
                pointerEvents="none"
                style={[
                  tip.card,
                  {
                    width: TOOLTIP_W,
                    top: tooltipTop,
                    left: Math.min(
                      Math.max(x(idx) - TOOLTIP_W / 2, 0),
                      width - TOOLTIP_W,
                    ),
                  },
                ]}
              >
                <View style={tip.row}>
                  <View style={tip.labelWrap}>
                    <View style={[tip.dot, { backgroundColor: CURRENT }]} />
                    <Text style={tip.label}>
                      {labels[idx]}, {newClientsSeries.currentLabel}
                    </Text>
                  </View>
                  <Text style={tip.value}>{current[idx]}</Text>
                </View>
                <View style={tip.row}>
                  <View style={tip.labelWrap}>
                    <View style={[tip.dot, { backgroundColor: PREVIOUS }]} />
                    <Text style={tip.label}>
                      {labels[idx]}, {newClientsSeries.previousLabel}
                    </Text>
                  </View>
                  <Text style={tip.value}>{previous[idx]}</Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="New Clients Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  growth: {
    color: colors.green,
    fontFamily: fonts.semibold,
  },
});
