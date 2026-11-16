import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Header from "@/components/Header";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import {
  ANALYTICS_PLATFORMS,
  FB_POST_COLUMNS,
  FB_POSTS,
  IG_POST_COLUMNS,
  IG_POSTS,
  IG_REEL_COLUMNS,
  IG_REELS,
  IG_STORIES,
  IG_STORY_COLUMNS,
  MetricColumn,
  PERIOD_OPTIONS,
  PLATFORM_TABS,
  SocialPlatform,
  SocialPost,
} from "@/components/social/socialData";
import { useSocialAccounts } from "@/components/social/useSocialAccounts";
import { Dropdown, EmptyState, PlatformIcon, PLATFORM_LABEL, UnderlineTabs } from "@/components/social/SocialUI";
import {
  FacebookAccountDashboard,
  InstagramAccountDashboard,
  MessengerDashboard,
} from "@/components/social/analytics/AccountDashboards";
import PostsMetricsList from "@/components/social/analytics/PostsMetricsList";
import MediaLibrary from "@/components/social/media/MediaLibrary";
import OptionsSheet, { OptionsSheetConfig } from "@/components/social/modals/OptionsSheet";
import PostDetailsModal from "@/components/social/modals/PostDetailsModal";
import CustomRangeModal from "@/components/social/modals/CustomRangeModal";

type Section = "Analytics" | "Media";

export default function SocialMediaScreen() {
  const accounts = useSocialAccounts();
  const connected = accounts.filter(
    (a) => a.status === "Connected" && ANALYTICS_PLATFORMS.includes(a.platform),
  );

  const [section, setSection] = useState<Section>("Analytics");
  const [platformState, setPlatform] = useState<SocialPlatform>("instagram");
  const [tabByPlatform, setTabByPlatform] = useState<Record<string, string>>({});
  const [period, setPeriod] = useState(PERIOD_OPTIONS[0]);
  const [rangeOpen, setRangeOpen] = useState(false);

  const [sheet, setSheet] = useState<OptionsSheetConfig | null>(null);
  const [viewPost, setViewPost] = useState<{ post: SocialPost; columns: MetricColumn[] } | null>(null);

  // Fall back to the first connected analytics account if the selected one was disconnected.
  const platform: SocialPlatform | null = connected.some((a) => a.platform === platformState)
    ? platformState
    : (connected[0]?.platform ?? null);
  const tabs = platform ? PLATFORM_TABS[platform] : [];
  const tab = (platform && tabByPlatform[platform]) || tabs[0];
  const activeAccount = connected.find((a) => a.platform === platform);

  const openAccountSwitcher = () =>
    setSheet({
      title: "Select Account",
      options: connected.map((a) => ({
        label: PLATFORM_LABEL[a.platform],
        subtitle: a.handle,
        icon: <PlatformIcon platform={a.platform} size={20} />,
      })),
      value: platform ? PLATFORM_LABEL[platform] : undefined,
      onSelect: (label) => {
        const acc = connected.find((a) => PLATFORM_LABEL[a.platform] === label);
        if (acc) setPlatform(acc.platform);
      },
      footer: {
        label: "Manage connected accounts",
        onPress: () => router.push("/(drawer)/social/accounts" as any),
      },
    });

  const openPeriod = () =>
    setSheet({
      title: "Period",
      options: PERIOD_OPTIONS.map((label) => ({ label })),
      value: PERIOD_OPTIONS.includes(period) ? period : "Custom Range",
      onSelect: (v) => {
        if (v === "Custom Range") setRangeOpen(true);
        else setPeriod(v);
      },
    });

  const handleViewPost = (columns: MetricColumn[]) => (post: SocialPost) => setViewPost({ post, columns });

  const renderAnalytics = () => {
    if (!platform) {
      return (
        <View style={styles.titleCard}>
          <EmptyState
            icon="link-outline"
            title="No accounts connected"
            message="Connect your Instagram or Facebook account to see your analytics."
          />
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/(drawer)/social/accounts" as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Connect Account</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (platform === "messenger") return <MessengerDashboard onOpenOptions={setSheet} />;

    if (platform === "facebook") {
      return tab === "Posts" ? (
        <PostsMetricsList
          key="fb-posts"
          posts={FB_POSTS}
          columns={FB_POST_COLUMNS}
          platform="facebook"
          showTypeFilter
          onOpenOptions={setSheet}
          onViewPost={handleViewPost(FB_POST_COLUMNS)}
        />
      ) : (
        <FacebookAccountDashboard onOpenOptions={setSheet} />
      );
    }

    switch (tab) {
      case "Posts":
        return (
          <PostsMetricsList
            key="ig-posts"
            posts={IG_POSTS}
            columns={IG_POST_COLUMNS}
            platform="instagram"
            showTypeFilter
            onOpenOptions={setSheet}
            onViewPost={handleViewPost(IG_POST_COLUMNS)}
          />
        );
      case "Reels":
        return (
          <PostsMetricsList
            key="ig-reels"
            posts={IG_REELS}
            columns={IG_REEL_COLUMNS}
            platform="instagram"
            portraitThumbs
            onOpenOptions={setSheet}
            onViewPost={handleViewPost(IG_REEL_COLUMNS)}
          />
        );
      case "Story":
        return (
          <PostsMetricsList
            key="ig-story"
            posts={IG_STORIES}
            columns={IG_STORY_COLUMNS}
            platform="instagram"
            portraitThumbs
            onOpenOptions={setSheet}
            onViewPost={handleViewPost(IG_STORY_COLUMNS)}
          />
        );
      default:
        return <InstagramAccountDashboard onOpenOptions={setSheet} />;
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Analytics / Media switch – the Figma frames show both pages under "Social Media" */}
        <View style={styles.segment}>
          {(["Analytics", "Media"] as Section[]).map((s) => {
            const active = s === section;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => setSection(s)}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {section === "Analytics" ? (
          <>
            <View style={styles.titleCard}>
              <Text style={styles.cardTitle}>Analytics</Text>
              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.accountBtn}
                  onPress={openAccountSwitcher}
                  activeOpacity={0.75}
                  disabled={connected.length === 0}
                >
                  {platform === "messenger" && <PlatformIcon platform="messenger" size={22} />}
                  {platform ? (
                    <PlatformIcon platform={platform === "messenger" ? "facebook" : platform} size={20} />
                  ) : (
                    <Ionicons name="link-outline" size={20} color={colors.primary} />
                  )}
                  <Text style={styles.accountName} numberOfLines={1}>
                    {platform ? (activeAccount?.handle ?? PLATFORM_LABEL[platform]) : "No account"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textDark} />
                </TouchableOpacity>
                <Dropdown label={period} onPress={openPeriod} style={styles.periodPill} />
              </View>
              {tabs.length > 0 && platform && (
                <UnderlineTabs
                  tabs={tabs}
                  value={tab}
                  onChange={(t) => setTabByPlatform((prev) => ({ ...prev, [platform]: t }))}
                />
              )}
            </View>
            {renderAnalytics()}
          </>
        ) : (
          <MediaLibrary onOpenOptions={setSheet} />
        )}
      </ScrollView>

      <OptionsSheet config={sheet} onClose={() => setSheet(null)} />

      <PostDetailsModal
        visible={!!viewPost}
        onClose={() => setViewPost(null)}
        post={viewPost?.post ?? null}
        columns={viewPost?.columns ?? []}
        platform={platform ?? "instagram"}
      />

      <CustomRangeModal visible={rangeOpen} onClose={() => setRangeOpen(false)} onApply={setPeriod} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 24,
  },
  segment: {
    flexDirection: "row",
    gap: 8,
  },
  segmentItem: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemActive: {
    borderColor: colors.primary,
  },
  segmentText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textDark,
  },
  segmentTextActive: {
    color: colors.primary,
  },
  titleCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
    ...shadows.card,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  controls: {
    flexDirection: "row",
    gap: 16,
  },
  accountBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  accountName: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 24,
    color: colors.textDark,
  },
  periodPill: {
    maxWidth: "45%",
  },
  primaryBtn: {
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.primary,
  },
  primaryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 24,
    color: colors.white,
  },
});
