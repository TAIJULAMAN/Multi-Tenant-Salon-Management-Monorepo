import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, fonts, shadows } from "@/constants/figmaTheme";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

const MAX = 2500;
const Y_LABELS = ["€ 2,5k", "€ 2k", "€ 1,5k", "€ 1k", "€ 500", "0"];
const HEIGHT = 190;
const Y_AXIS_W = 42;

export default function MoneySpentChart({
  labels,
  values,
  tooltipYear = "2025",
}: {
  labels: string[];
  values: number[];
  tooltipYear?: string;
}) {
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(Math.min(1, values.length - 1));
  const plotW = Math.max(0, width - Y_AXIS_W);
  const stepX = values.length > 1 ? plotW / (values.length - 1) : 0;
  const pts = values.map((v, i) => ({
    x: i * stepX,
    y: HEIGHT - (Math.min(v, MAX) / MAX) * HEIGHT,
  }));

  // Smooth path (cubic bezier between points)
  let line = "";
  pts.forEach((p, i) => {
    if (i === 0) {
      line += `M ${p.x} ${p.y}`;
    } else {
      const prev = pts[i - 1];
      const cx = (prev.x + p.x) / 2;
      line += ` C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }
  });
  const area = pts.length ? `${line} L ${pts[pts.length - 1].x} ${HEIGHT} L 0 ${HEIGHT} Z` : "";
  const activePt = pts[active];
  const safeActive = activePt ? active : 0;

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.chartRow}>
        <View style={[styles.yAxis, { height: HEIGHT }]}>
          {Y_LABELS.map((l) => (
            <Text key={l} style={styles.axisText}>
              {l}
            </Text>
          ))}
        </View>
        {plotW > 0 && (
          <View style={{ width: plotW, height: HEIGHT }}>
            <Svg width={plotW} height={HEIGHT}>
              <Defs>
                <LinearGradient id="moneyFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={colors.green} stopOpacity={0.18} />
                  <Stop offset="1" stopColor={colors.green} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              {Y_LABELS.map((_, i) => (
                <Line
                  key={i}
                  x1={0}
                  x2={plotW}
                  y1={(HEIGHT / (Y_LABELS.length - 1)) * i}
                  y2={(HEIGHT / (Y_LABELS.length - 1)) * i}
                  stroke={colors.borderLight}
                  strokeWidth={1}
                />
              ))}
              <Path d={area} fill="url(#moneyFill)" />
              {pts.map((p, i) => (
                <Line key={`v${i}`} x1={p.x} x2={p.x} y1={0} y2={HEIGHT} stroke={colors.borderLight} strokeWidth={1} />
              ))}
              <Path d={line} stroke={colors.green} strokeWidth={2} fill="none" />
              {activePt && (
                <>
                  <Circle cx={activePt.x} cy={activePt.y} r={4} fill={colors.green} stroke={colors.white} strokeWidth={1.5} />
                </>
              )}
            </Svg>
            {/* Touch targets */}
            <View style={StyleSheet.absoluteFill}>
              {pts.map((p, i) => (
                <Pressable
                  key={i}
                  onPress={() => setActive(i)}
                  style={{
                    position: "absolute",
                    left: p.x - Math.max(stepX / 2, 12),
                    width: Math.max(stepX, 24),
                    top: 0,
                    bottom: 0,
                  }}
                />
              ))}
            </View>
            {activePt && (
              <View
                pointerEvents="none"
                style={[
                  styles.tooltip,
                  {
                    left: Math.min(Math.max(activePt.x - 65, 0), plotW - 130),
                    top: Math.max(activePt.y - 62, 0),
                  },
                ]}
              >
                <Text style={styles.tooltipTitle}>
                  {labels[safeActive]}, {tooltipYear}
                </Text>
                <Text style={styles.tooltipText}>
                  Appointments:{"  "}<Text style={styles.tooltipValue}>{Math.round(values[safeActive] / 45)}</Text>
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={[styles.xAxis, { marginLeft: Y_AXIS_W }]}>
        {labels.map((l, i) => (
          <Text key={`${l}-${i}`} style={[styles.axisText, i === safeActive && styles.axisActive]}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartRow: {
    flexDirection: "row",
  },
  yAxis: {
    width: Y_AXIS_W,
    justifyContent: "space-between",
    marginTop: -6,
    marginBottom: -6,
  },
  axisText: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  axisActive: {
    color: colors.text,
    fontFamily: fonts.medium,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tooltip: {
    position: "absolute",
    width: 130,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
    ...shadows.card,
  },
  tooltipTitle: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.green,
  },
  tooltipValue: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});
