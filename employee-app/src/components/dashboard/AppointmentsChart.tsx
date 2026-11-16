import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/constants/figmaTheme";
import Svg, {
  G,
  Rect,
  Line as SvgLine,
  Text as SvgText,
} from "react-native-svg";
import ExportReportModal from "./ExportReportModal";
import {
  ExportDataButton,
  PeriodDropdown,
  dashboardCardStyle as card,
  tooltipStyle as tip,
} from "./DashboardControls";
import { appointmentsSeries, type ChartPeriod } from "./dashboardData";

const COMPLETED = colors.primary;
const CANCELLED = colors.pink;
const CHART_HEIGHT = 200;
const Y_AXIS_W = 30;
const TOOLTIP_W = 150;
const PAD_TOP = 8;
const PERIODS = ["Monthly", "Weekly", "Yearly"] as const;
const SUBTITLES: Record<ChartPeriod, string> = {
  Monthly: "Last 12 Months",
  Weekly: "Last 8 Weeks",
  Yearly: "Last 6 Years",
};

export default function AppointmentsChart() {
  const [period, setPeriod] = useState<ChartPeriod>("Monthly");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [width, setWidth] = useState(0);

  const { labels, completed, cancelled } = appointmentsSeries[period];
  const rawMax = Math.max(...completed, ...cancelled);
  const step = Math.ceil(rawMax / 5 / 10) * 10 || 10;
  const maxVal = step * 5;
  const ticks = [1, 2, 3, 4, 5].map((i) => i * step);

  const plotW = Math.max(width - Y_AXIS_W, 0);
  const groupW = labels.length ? plotW / labels.length : 0;
  const barW = Math.max(Math.min(groupW * 0.3, 10), 4);
  const y = (v: number) => CHART_HEIGHT - (v / maxVal) * CHART_HEIGHT;
  const idx =
    activeIdx !== null && activeIdx < labels.length ? activeIdx : null;

  return (
    <View style={card.card}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>Appointments</Text>
          <Text style={card.subtitle}>{SUBTITLES[period]}</Text>
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
            <Svg width={width} height={CHART_HEIGHT + 24 + PAD_TOP}>
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
                <SvgLine
                  x1={Y_AXIS_W}
                  y1={0}
                  x2={Y_AXIS_W}
                  y2={CHART_HEIGHT}
                  stroke={colors.borderLight}
                  strokeWidth={1}
                />
                <SvgLine
                  x1={width - 1}
                  y1={0}
                  x2={width - 1}
                  y2={CHART_HEIGHT}
                  stroke={colors.borderLight}
                  strokeWidth={1}
                />

                {labels.map((label, i) => {
                  const gx = Y_AXIS_W + i * groupW;
                  const x1 = gx + (groupW - (barW * 2 + 2)) / 2;
                  const x2 = x1 + barW + 2;
                  const dim = idx !== null && idx !== i;
                  const showLabel =
                    groupW >= 24 || labels.length <= 8 || i % 2 === 0;
                  return (
                    <React.Fragment key={label}>
                      {idx === i && (
                        <Rect
                          x={gx + 1}
                          y={0}
                          width={groupW - 2}
                          height={CHART_HEIGHT}
                          fill={colors.primaryTint}
                          rx={4}
                        />
                      )}
                      <Rect
                        x={x1}
                        y={y(completed[i])}
                        width={barW}
                        height={CHART_HEIGHT - y(completed[i])}
                        fill={COMPLETED}
                        rx={barW / 2}
                        opacity={dim ? 0.55 : 1}
                      />
                      <Rect
                        x={x2}
                        y={y(cancelled[i])}
                        width={barW}
                        height={CHART_HEIGHT - y(cancelled[i])}
                        fill={CANCELLED}
                        rx={barW / 2}
                        opacity={dim ? 0.55 : 1}
                      />
                      {showLabel && (
                        <SvgText
                          x={gx + groupW / 2}
                          y={CHART_HEIGHT + 18}
                          fontSize={12}
                          fill={colors.textMuted}
                          textAnchor="middle"
                          fontFamily={fonts.regular}
                        >
                          {label}
                        </SvgText>
                      )}
                      {/* Hit target larger than the marks */}
                      <Rect
                        x={gx}
                        y={0}
                        width={groupW}
                        height={CHART_HEIGHT + 24}
                        fill="transparent"
                        onPress={() =>
                          setActiveIdx((p) => (p === i ? null : i))
                        }
                      />
                    </React.Fragment>
                  );
                })}
              </G>
            </Svg>
            {idx !== null && (
              <View
                pointerEvents="none"
                style={[
                  tip.card,
                  {
                    width: TOOLTIP_W,
                    top: 4,
                    left: Math.min(
                      Math.max(
                        Y_AXIS_W + idx * groupW + groupW / 2 - TOOLTIP_W / 2,
                        0,
                      ),
                      width - TOOLTIP_W,
                    ),
                  },
                ]}
              >
                <Text style={tip.label}>{labels[idx]}</Text>
                <View style={tip.row}>
                  <View style={tip.labelWrap}>
                    <View style={[tip.dot, { backgroundColor: COMPLETED }]} />
                    <Text style={tip.label}>Completed</Text>
                  </View>
                  <Text style={tip.value}>{completed[idx]}</Text>
                </View>
                <View style={tip.row}>
                  <View style={tip.labelWrap}>
                    <View style={[tip.dot, { backgroundColor: CANCELLED }]} />
                    <Text style={tip.label}>Cancelled</Text>
                  </View>
                  <Text style={tip.value}>{cancelled[idx]}</Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COMPLETED }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: CANCELLED }]} />
          <Text style={styles.legendText}>Cancelled</Text>
        </View>
      </View>

      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Appointments Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
