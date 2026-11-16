import React, { useState } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Rect, Line, Path, Circle, G, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { KpiItem, Slice, TrackBarDatum } from "./socialData";

const GRID = colors.subtleAlt; // #F6F7F9 grid lines

function useWidth() {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.floor(e.nativeEvent.layout.width);
    if (w !== width) setWidth(w);
  };
  return { width, onLayout };
}

// ─── Delta chip ("+9%" with pink ↘ / green ↖) ────────────────────────────────

export function DeltaChip({ delta, up, suffix }: { delta: string; up?: boolean; suffix?: string }) {
  return (
    <View style={styles.deltaRow}>
      <View style={[styles.deltaIcon, up ? styles.deltaIconUp : styles.deltaIconDown]}>
        <Ionicons
          name={up ? "arrow-up-outline" : "arrow-down-outline"}
          size={14}
          color={up ? colors.green : colors.pink}
          // rotate -45°: ↓ becomes ↘ (down chip), ↑ becomes ↖ (up chip) as in Figma
          style={{ transform: [{ rotate: "-45deg" }] }}
        />
      </View>
      <Text style={[styles.deltaText, up && styles.deltaTextUp]}>{delta}</Text>
      {suffix ? <Text style={styles.deltaSuffix}>{suffix}</Text> : null}
    </View>
  );
}

// ─── KPI tiles (title, value, delta chip, 5 mini bars) ───────────────────────

const MINI_BARS = [62, 47, 94, 78, 78];

function MiniBars() {
  return (
    <View style={styles.miniBars}>
      {MINI_BARS.map((h, i) => (
        <View
          key={i}
          style={[
            styles.miniBar,
            { height: (h / 94) * 64, backgroundColor: i === 2 ? colors.teal : colors.tealSoft },
          ]}
        />
      ))}
    </View>
  );
}

export function KpiCard({ item }: { item: KpiItem }) {
  return (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiLabel} numberOfLines={2}>
        {item.label}
      </Text>
      <View style={styles.kpiBottom}>
        <View style={styles.kpiValueCol}>
          <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
            {item.value}
          </Text>
          <DeltaChip delta={item.delta} up={item.up} />
        </View>
        <MiniBars />
      </View>
    </View>
  );
}

export function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <View style={styles.kpiGrid}>
      {items.map((k) => (
        <KpiCard key={k.label} item={k} />
      ))}
    </View>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <View style={styles.legend}>
      {items.map((it) => (
        <View key={it.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: it.color }]} />
          <Text style={styles.legendText}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Tooltip ("info" card) ───────────────────────────────────────────────────

export function ChartTooltip({
  title,
  value,
  dotColor = colors.primary,
  totalLabel = "Total",
  totalColor = colors.text,
  style,
}: {
  title: string;
  value: string;
  dotColor?: string | null;
  totalLabel?: string;
  totalColor?: string;
  style?: object;
}) {
  return (
    <View style={[styles.tooltip, style]} pointerEvents="none">
      <View style={styles.tooltipRow}>
        {dotColor ? <View style={[styles.tooltipDot, { backgroundColor: dotColor }]} /> : null}
        <Text style={styles.tooltipTitle}>{title}</Text>
      </View>
      <View style={[styles.tooltipRow, styles.tooltipTotalRow]}>
        <Text style={[styles.tooltipTitle, { color: totalColor }]}>{totalLabel}</Text>
        <Text style={styles.tooltipValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Y axis (labels spread evenly top→bottom) ────────────────────────────────

function YAxis({ ticks, height, width = 32 }: { ticks: string[]; height: number; width?: number }) {
  const step = ticks.length > 1 ? height / (ticks.length - 1) : 0;
  return (
    <View style={{ width, height }}>
      {ticks.map((t, i) => (
        <Text key={t} style={[styles.axisLabel, styles.yLabel, { top: i * step - 8 }]}>
          {t}
        </Text>
      ))}
    </View>
  );
}

function topRoundedBar(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

// ─── Grouped bar chart (Audience by Gender/Age, CTA Clicks by Age/Gender) ────

interface GroupedBarProps {
  categories: string[];
  series: { label: string; color: string; values: number[] }[];
  yTicks: number[];
  height?: number;
}

export function GroupedBarChart({ categories, series, yTicks, height = 200 }: GroupedBarProps) {
  const { width, onLayout } = useWidth();
  const [active, setActive] = useState<number | null>(null);
  const maxY = yTicks[0];
  const axisW = 30;
  const plotW = Math.max(0, width - axisW);
  const groupW = plotW / categories.length;
  const barW = Math.max(5, Math.min(10, (groupW - 12) / series.length - 3));
  const gap = barW >= 8 ? 4 : 2;
  const groupContent = series.length * barW + (series.length - 1) * gap;
  const tickY = (t: number) => height - (t / maxY) * (height * 0.86);

  return (
    <View>
      <View onLayout={onLayout} style={styles.chartRow}>
        <View style={{ width: axisW, height }}>
          {yTicks.map((t) => (
            <Text key={t} style={[styles.axisLabelLg, styles.yLabel, { top: tickY(t) - 9 }]}>
              {t}
            </Text>
          ))}
        </View>
        {width > 0 && (
          <Svg width={plotW} height={height}>
            {[0, ...yTicks].map((t) => (
              <Line key={t} x1={0} x2={plotW} y1={tickY(t)} y2={tickY(t)} stroke={GRID} strokeWidth={1} />
            ))}
            <Line x1={0.5} x2={0.5} y1={0} y2={height} stroke={GRID} />
            <Line x1={plotW - 0.5} x2={plotW - 0.5} y1={0} y2={height} stroke={GRID} />
            {categories.map((c, gi) => {
              const gx = gi * groupW + (groupW - groupContent) / 2;
              return (
                <G key={c} onPress={() => setActive(active === gi ? null : gi)}>
                  <Rect x={gi * groupW} y={0} width={groupW} height={height} fill="transparent" />
                  {series.map((s, si) => {
                    const h = (s.values[gi] / maxY) * (height * 0.86);
                    return (
                      <Path
                        key={s.label}
                        d={topRoundedBar(gx + si * (barW + gap), height - h, barW, h, 10)}
                        fill={s.color}
                        opacity={active === null || active === gi ? 1 : 0.35}
                      />
                    );
                  })}
                </G>
              );
            })}
          </Svg>
        )}
        {active !== null && width > 0 && (
          <View
            style={[
              styles.floatingTip,
              { left: Math.min(width - 150, axisW + active * groupW + groupW / 2 - 40), top: 0 },
            ]}
            pointerEvents="none"
          >
            <View style={styles.tooltip}>
              <Text style={styles.tooltipTitle}>{categories[active]}</Text>
              {series.map((s) => (
                <View key={s.label} style={styles.tooltipRow}>
                  <View style={[styles.tooltipDot, { backgroundColor: s.color }]} />
                  <Text style={styles.tooltipTitle}>{s.label}</Text>
                  <Text style={styles.tooltipValue}>{s.values[active]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={[styles.xAxis, { marginLeft: axisW }]}>
        {categories.map((c) => (
          <Text key={c} style={[styles.axisLabelLg, styles.xLabel]} numberOfLines={1}>
            {c}
          </Text>
        ))}
      </View>
      <View style={{ marginTop: 24 }}>
        <Legend items={series} />
      </View>
    </View>
  );
}

// ─── Track bar chart (Followers Active, Post Reactions, CTA Clicks by Site) ──
// Full-height #F6F7F9 tracks with a purple r=12 bar at the bottom + floating tooltip.

interface TrackBarProps {
  data: TrackBarDatum[];
  max: number;
  yTicks: string[];
  height?: number;
  initialActive?: number | null;
  renderXLabel?: (d: TrackBarDatum) => React.ReactNode;
  /** Shorten x labels (e.g. Sunday → Sun) when the chart is narrow. */
  shortLabels?: boolean;
}

export function TrackBarChart({
  data,
  max,
  yTicks,
  height = 220,
  initialActive = null,
  renderXLabel,
  shortLabels,
}: TrackBarProps) {
  const { width, onLayout } = useWidth();
  const [active, setActive] = useState<number | null>(initialActive);
  const axisW = 34;
  const plotW = Math.max(0, width - axisW - 8);
  const slot = plotW / data.length;
  const barW = Math.min(92, slot * 0.72);

  return (
    <View>
      <View onLayout={onLayout} style={styles.chartRow}>
        <YAxis ticks={yTicks} height={height - 8} width={axisW} />
        <View style={[styles.trackDivider, { height }]} />
        {width > 0 && (
          <View style={{ width: plotW, height, flexDirection: "row", marginLeft: 7 }}>
            {data.map((d, i) => {
              const h = Math.max(24, (d.value / max) * height);
              return (
                <TouchableOpacity
                  key={d.label}
                  style={[styles.trackSlot, { width: slot }]}
                  activeOpacity={0.85}
                  onPress={() => setActive(active === i ? null : i)}
                >
                  <View style={[styles.track, { width: barW, height }]}>
                    <View
                      style={[
                        styles.trackFill,
                        { height: h, opacity: active === null || active === i ? 1 : 0.55 },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {active !== null && width > 0 && (
          <ChartTooltip
            title={data[active].tooltipTitle ?? data[active].label}
            value={String(data[active].value)}
            style={[
              styles.floatingTip,
              {
                left: Math.max(
                  0,
                  Math.min(width - 100, axisW + 8 + active * slot + slot / 2 - 48),
                ),
                top: Math.max(0, height - Math.max(24, (data[active].value / max) * height) - 66),
              },
            ]}
          />
        )}
      </View>
      <View style={[styles.xAxis, { marginLeft: axisW + 8, marginTop: 16 }]}>
        {data.map((d) => (
          <View key={d.label} style={styles.xLabelWrap}>
            {renderXLabel ? (
              renderXLabel(d)
            ) : (
              <Text style={[styles.axisLabel, styles.xLabel]} numberOfLines={1}>
                {shortLabels ? d.label.slice(0, 3) : d.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Arcs ────────────────────────────────────────────────────────────────────

function polar(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M${s.x},${s.y} A${r},${r} 0 ${large} 1 ${e.x},${e.y}`;
}

// ─── Donut (Consumptions by Type, Views by Type) ─────────────────────────────

interface DonutProps {
  data: Slice[];
  size?: number;
  thickness?: number;
  /** Angle (deg, 0 = 3 o'clock, clockwise) where the first slice starts. */
  startDeg?: number;
}

export function DonutChart({ data, size = 150, thickness = 20, startDeg = -80 }: DonutProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const start0 = (startDeg * Math.PI) / 180;
  const arcs = data.map((d, i) => {
    const before = data.slice(0, i).reduce((sum, x) => sum + x.value, 0);
    const start = start0 + (before / total) * Math.PI * 2;
    return { start, end: start + (d.value / total) * Math.PI * 2, i };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {arcs.map((a) => (
          <Path
            key={data[a.i].label}
            d={arcPath(c, c, r, a.start, a.end - 0.0001)}
            stroke={data[a.i].color}
            strokeWidth={active === a.i ? thickness + 4 : thickness}
            fill="none"
            onPress={() => setActive(active === a.i ? null : a.i)}
          />
        ))}
      </Svg>
      {active !== null && (
        <View style={styles.donutCenter} pointerEvents="none">
          <Text style={styles.donutValue}>{Math.round((data[active].value / total) * 100)}%</Text>
          <Text style={styles.donutLabel} numberOfLines={1}>
            {data[active].label}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Semi gauge (Stories by Type, Storytellers by Type) ──────────────────────

export function GaugeChart({
  data,
  value,
  label,
  size = 240,
  thickness = 8,
}: {
  data: Slice[];
  value: string;
  label: string;
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const gap = 0.12;
  // ~200° sweep from lower-left to lower-right like the PNG.
  const startA = Math.PI * 0.95;
  const sweepAll = Math.PI * 1.1;
  const arcs = data.map((d, i) => {
    const before = data.slice(0, i).reduce((sum, x) => sum + x.value, 0);
    const from = startA + (before / total) * sweepAll;
    const sweep = (d.value / total) * sweepAll;
    return { start: from + gap / 2, end: from + sweep - gap / 2, color: d.color, key: d.label };
  });
  const h = c + thickness;

  return (
    <View style={{ width: size, height: h, alignSelf: "center" }}>
      <Svg width={size} height={h}>
        {arcs.map((a) => (
          <Path
            key={a.key}
            d={arcPath(c, c, r, a.start, a.end)}
            stroke={a.color}
            strokeWidth={thickness}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </Svg>
      <View style={styles.gaugeCenter} pointerEvents="none">
        <Text style={styles.gaugeValue}>{value}</Text>
        <Text style={styles.gaugeLabel}>{label}</Text>
      </View>
    </View>
  );
}

// ─── Area line chart (Watch Time) ────────────────────────────────────────────

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function AreaLineChart({
  points,
  curve,
  yTicks,
  height = 220,
  color = colors.green,
  initialActive = 2,
}: {
  points: { label: string; tooltip: string; value: number }[];
  curve: [number, number][];
  yTicks: number[];
  height?: number;
  color?: string;
  initialActive?: number | null;
}) {
  const { width, onLayout } = useWidth();
  const [active, setActive] = useState<number | null>(initialActive);
  const axisW = 34;
  const plotW = Math.max(0, width - axisW);
  const maxY = yTicks[0];
  const toY = (v: number) => height - (v / maxY) * height;
  const curvePts = curve.map(([x, v]) => ({ x: x * plotW, y: toY(v) }));
  const line = smoothPath(curvePts);
  const area = `${line} L${plotW},${height} L0,${height} Z`;
  const col = plotW / points.length;
  // Markers sit on the curve at the right edge of each bucket column (matches the 30s dot in Figma).
  const markerX = (i: number) => Math.min(plotW - 4, (i + 0.6) * col);
  const curveYAt = (x: number) => {
    const fx = x / (plotW || 1);
    for (let i = 0; i < curve.length - 1; i++) {
      const [x0, v0] = curve[i];
      const [x1, v1] = curve[i + 1];
      if (fx >= x0 && fx <= x1) return toY(v0 + ((fx - x0) / (x1 - x0)) * (v1 - v0));
    }
    return toY(curve[curve.length - 1][1]);
  };

  return (
    <View>
      <View onLayout={onLayout} style={styles.chartRow}>
        <View style={{ width: axisW, height }}>
          {yTicks.map((t) => (
            <Text key={t} style={[styles.axisLabelSm, styles.yLabel, { top: toY(t) - 8 }]}>
              {t}
            </Text>
          ))}
        </View>
        {width > 0 && (
          <Svg width={plotW} height={height + 2}>
            <Defs>
              <LinearGradient id="wtFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.18} />
                <Stop offset="1" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {yTicks.map((t) => (
              <Line key={t} x1={0} x2={plotW} y1={toY(t)} y2={toY(t)} stroke={GRID} />
            ))}
            {points.map((_, i) => (
              <Line key={i} x1={i * col + 0.5} x2={i * col + 0.5} y1={0} y2={height} stroke={GRID} />
            ))}
            <Line x1={plotW - 0.5} x2={plotW - 0.5} y1={0} y2={height} stroke={GRID} />
            <Path d={area} fill="url(#wtFill)" />
            <Path d={line} fill="none" stroke={color} strokeWidth={1.9} />
            {points.map((p, i) => (
              <G key={p.label} onPress={() => setActive(i)}>
                <Rect x={i * col} y={0} width={col} height={height} fill="transparent" />
                {active === i && (
                  <Circle cx={markerX(i)} cy={curveYAt(markerX(i))} r={3.5} fill={color} stroke="#FFFFFF" strokeWidth={1.9} />
                )}
              </G>
            ))}
          </Svg>
        )}
        {active !== null && width > 0 && (
          <ChartTooltip
            title={points[active].tooltip}
            value={String(points[active].value)}
            dotColor={null}
            totalLabel="Total:"
            totalColor={color}
            style={[
              styles.floatingTip,
              styles.wideTip,
              {
                left: Math.max(axisW, Math.min(width - 140, axisW + markerX(active) - 50)),
                top: Math.max(0, curveYAt(markerX(active)) - 66),
              },
            ]}
          />
        )}
      </View>
      <View style={[styles.xAxis, { marginLeft: axisW, marginTop: 10 }]}>
        {points.map((p) => (
          <Text key={p.label} style={[styles.axisLabelSm, styles.xLabel]} numberOfLines={1}>
            {p.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ─── Progress list (Audience by City, CTA Clicks by Country) ─────────────────

export function ProgressList({ items }: { items: { label: string; pct: number }[] }) {
  const max = Math.max(...items.map((i) => i.pct), 1);
  return (
    <View style={{ gap: 16 }}>
      {items.map((it) => (
        <View key={it.label} style={{ gap: 12 }}>
          <View style={styles.progressTxt}>
            <Text style={styles.progressLabel}>{it.label}</Text>
            <Text style={styles.progressPct}>{it.pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(it.pct / max) * 71}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    gap: 8,
    ...shadows.card,
  },
  kpiLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
    minHeight: 38,
  },
  kpiBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  kpiValueCol: {
    flexShrink: 1,
    gap: 12,
    paddingBottom: 2,
  },
  kpiValue: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    lineHeight: 26,
    color: colors.text,
  },
  miniBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    height: 64,
  },
  miniBar: {
    width: 7,
    borderRadius: 2,
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deltaIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deltaIconDown: {
    borderRadius: 10,
    backgroundColor: colors.pinkSoft,
  },
  deltaIconUp: {
    backgroundColor: colors.tealSoft,
  },
  deltaText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  deltaTextUp: {
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  deltaSuffix: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  tooltip: {
    minWidth: 97,
    backgroundColor: colors.white,
    borderRadius: 7.6,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 6,
  },
  floatingTip: {
    position: "absolute",
  },
  wideTip: {
    minWidth: 130,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7.6,
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 11,
  },
  tooltipTotalRow: {
    justifyContent: "space-between",
  },
  tooltipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tooltipTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
  },
  tooltipValue: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
    marginLeft: "auto",
  },
  chartRow: {
    flexDirection: "row",
  },
  axisLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  axisLabelLg: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  axisLabelSm: {
    fontFamily: fonts.regular,
    fontSize: 11.4,
    lineHeight: 15,
    color: colors.textMuted,
  },
  yLabel: {
    position: "absolute",
    left: 0,
  },
  xAxis: {
    flexDirection: "row",
    marginTop: 6,
  },
  xLabelWrap: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  xLabel: {
    flex: 1,
    textAlign: "center",
  },
  trackDivider: {
    width: 1,
    backgroundColor: GRID,
  },
  trackSlot: {
    alignItems: "center",
  },
  track: {
    borderRadius: 12,
    backgroundColor: "rgba(246, 247, 249, 0.5)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  trackFill: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  donutCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  donutValue: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  donutLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  gaugeCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    gap: 6,
  },
  gaugeValue: {
    fontFamily: fonts.semibold,
    fontSize: 30,
    lineHeight: 41,
    color: colors.text,
  },
  gaugeLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  progressTxt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  progressLabel: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textMuted,
  },
  progressPct: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.borderLight,
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
});
