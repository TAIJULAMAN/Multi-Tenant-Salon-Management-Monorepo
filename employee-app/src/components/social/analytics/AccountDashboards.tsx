import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, fonts } from "@/constants/figmaTheme";
import {
  AGE_GROUPS,
  AUDIENCE_BREAKDOWN,
  AUDIENCE_OPTIONS,
  CONSUMPTION_LEGEND,
  CONSUMPTION_RING,
  CTA_BY_COUNTRY,
  CTA_BY_SITE,
  FACEBOOK_KPIS,
  FOLLOWERS_ACTIVE,
  FOLLOWERS_ACTIVE_MAX,
  GENDER_SERIES,
  HOUR_TICKS,
  HUNDRED_TICKS,
  HUNDREDS_MAX,
  INSTAGRAM_KPIS,
  MESSENGER_KPIS,
  ReactionKey,
  REACTIONS,
  STORIES_BY_TYPE,
  STORYTELLERS_BY_TYPE,
  VIEWS_BY_TYPE,
  WATCH_TIME,
  WATCH_TIME_CURVE,
  WATCH_TIME_TICKS,
} from "../socialData";
import { Card, Dropdown, ReactionIcon, SectionCard } from "../SocialUI";
import {
  AreaLineChart,
  DeltaChip,
  DonutChart,
  GaugeChart,
  GroupedBarChart,
  KpiGrid,
  Legend,
  ProgressList,
  TrackBarChart,
} from "../SocialCharts";
import { OptionsSheetConfig } from "../modals/OptionsSheet";

interface DashboardProps {
  onOpenOptions: (cfg: OptionsSheetConfig) => void;
}

/** Instagram › Account (Figma 1:9231, City/Country/Locale dropdown 1:14772). */
export function InstagramAccountDashboard({ onOpenOptions }: DashboardProps) {
  const [breakdown, setBreakdown] = useState("City");

  return (
    <View style={styles.stack}>
      <KpiGrid items={INSTAGRAM_KPIS} />

      <Card title="Audience by Gender/Age" bordered={false}>
        <GroupedBarChart categories={AGE_GROUPS} series={GENDER_SERIES} yTicks={[80, 60, 40, 20]} />
      </Card>

      <Card
        title={`Audience by ${breakdown}`}
        right={
          <Dropdown
            small
            label={breakdown}
            onPress={() =>
              onOpenOptions({
                title: `Audience by ${breakdown}`,
                options: AUDIENCE_OPTIONS.map((label) => ({ label })),
                value: breakdown,
                onSelect: setBreakdown,
              })
            }
          />
        }
      >
        <ProgressList items={AUDIENCE_BREAKDOWN[breakdown]} />
      </Card>

      <Card title="Followers Active by Hour/Day">
        <TrackBarChart
          data={FOLLOWERS_ACTIVE}
          max={FOLLOWERS_ACTIVE_MAX}
          yTicks={HOUR_TICKS}
          initialActive={4}
          shortLabels
        />
      </Card>
    </View>
  );
}

function ConsumptionCard({
  title,
  value,
  delta,
  up,
  suffix,
}: {
  title: string;
  value: string;
  delta: string;
  up?: boolean;
  suffix?: string;
}) {
  return (
    <Card title={title}>
      <View style={styles.donutRow}>
        <View style={styles.priceCol}>
          <Text style={styles.price}>{value}</Text>
          <DeltaChip delta={delta} up={up} suffix={suffix} />
        </View>
        <DonutChart data={CONSUMPTION_RING} size={150} thickness={20} />
      </View>
      <View style={styles.legendWrap}>
        <Legend items={CONSUMPTION_LEGEND} />
      </View>
    </Card>
  );
}

/** Facebook › Account (Figma 1:10126). */
export function FacebookAccountDashboard(_props: DashboardProps) {
  return (
    <View style={styles.stack}>
      <KpiGrid items={FACEBOOK_KPIS} />

      <SectionCard title="Consumption Metrics">
        <ConsumptionCard title="Consumptions by Type" value="8.924" delta="+9%" />
        <ConsumptionCard title="Unique Consumptions by Type" value="6.431" delta="+12.5%" up suffix="last month" />
      </SectionCard>

      <SectionCard title="Posts Metrics">
        <Card title="Post Reactions">
          <TrackBarChart
            data={REACTIONS}
            max={HUNDREDS_MAX}
            yTicks={HUNDRED_TICKS}
            initialActive={3}
            renderXLabel={(d) => (
              <>
                <ReactionIcon reaction={d.label as ReactionKey} size={22} />
                <Text style={styles.reactionLabel} numberOfLines={1}>
                  {d.label}
                </Text>
              </>
            )}
          />
        </Card>
      </SectionCard>

      <SectionCard title="Stories Metrics">
        <Card title="Stories by Type">
          <GaugeChart data={STORIES_BY_TYPE} value="324" label="Total Stories" />
          <View style={styles.legendWrap}>
            <Legend items={STORIES_BY_TYPE} />
          </View>
        </Card>
        <Card title="Storytellers by Type">
          <GaugeChart data={STORYTELLERS_BY_TYPE} value="500" label="Total Storytellers" />
          <View style={styles.legendWrap}>
            <Legend items={STORYTELLERS_BY_TYPE} />
          </View>
        </Card>
      </SectionCard>

      <SectionCard title="Call-to-Action Performance">
        <Card title="CTA Clicks by Age/Gender">
          <GroupedBarChart categories={AGE_GROUPS} series={GENDER_SERIES} yTicks={[80, 60, 40, 20]} />
        </Card>
        <Card title="CTA Clicks by Country">
          <ProgressList items={CTA_BY_COUNTRY} />
        </Card>
        <Card title="CTA Clicks by Site">
          <TrackBarChart data={CTA_BY_SITE} max={HUNDREDS_MAX} yTicks={HUNDRED_TICKS} initialActive={3} />
        </Card>
      </SectionCard>

      <SectionCard title="Videos Metrics">
        <Card title="Views by Type">
          <View style={styles.centered}>
            <DonutChart data={VIEWS_BY_TYPE} size={172} thickness={22} startDeg={95} />
          </View>
          <View style={styles.legendWrap}>
            <Legend items={VIEWS_BY_TYPE} />
          </View>
        </Card>
        <Card title="Watch Time">
          <AreaLineChart points={WATCH_TIME} curve={WATCH_TIME_CURVE} yTicks={WATCH_TIME_TICKS} />
        </Card>
      </SectionCard>
    </View>
  );
}

/** Messenger (Figma 1:10935) – KPI tiles only. */
export function MessengerDashboard(_props: DashboardProps) {
  return (
    <View style={styles.stack}>
      <KpiGrid items={MESSENGER_KPIS} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 24,
  },
  donutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  priceCol: {
    flexShrink: 1,
    gap: 7,
  },
  price: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    lineHeight: 26,
    color: colors.text,
  },
  legendWrap: {
    marginTop: 24,
  },
  centered: {
    alignItems: "center",
    paddingVertical: 24,
  },
  reactionLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
