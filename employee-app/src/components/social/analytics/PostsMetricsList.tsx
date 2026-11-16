import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { MetricColumn, POST_TYPE_OPTIONS, SocialPlatform, SocialPost } from "../socialData";
import { Dropdown, EmptyState, Pagination, PlatformIcon, ReactionIcon, SearchBar, TypeBadge } from "../SocialUI";
import RecordCard, { RecordList, recordCardStyles } from "@/components/ui/RecordCard";
import { OptionsSheetConfig } from "../modals/OptionsSheet";

interface PostsMetricsListProps {
  posts: SocialPost[];
  columns: MetricColumn[];
  platform: SocialPlatform;
  /** Posts tabs have an "All Post Types" filter + type badge; Reels/Story only a search. */
  showTypeFilter?: boolean;
  /** Reels/Story use tall 64x88 thumbnails. */
  portraitThumbs?: boolean;
  onOpenOptions: (cfg: OptionsSheetConfig) => void;
  onViewPost: (post: SocialPost) => void;
}

/**
 * Analytics post metrics (IG Posts 1:11200 / 1:14164 / 1:14479, IG Reels 1:13271 / 1:13578,
 * IG Story 1:13864, FB Posts 1:11492 / 1:12312 / 1:12964).
 * Rendered as a vertical list of cards (one per post: thumbnail, caption, date/type/platform,
 * then each metric column as a label/value field) so it never scrolls sideways on a phone.
 * Tapping a card opens "View Post" (1:11844).
 */
export default function PostsMetricsList({
  posts,
  columns,
  platform,
  showTypeFilter,
  portraitThumbs,
  onOpenOptions,
  onViewPost,
}: PostsMetricsListProps) {
  const [type, setType] = useState(POST_TYPE_OPTIONS[0]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const q = query.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (type === POST_TYPE_OPTIONS[0] || p.type === type) &&
      (!q || p.caption.toLowerCase().includes(q) || p.date.toLowerCase().includes(q)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pages - 1);
  const visible = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  return (
    <View style={styles.card}>
      <View style={styles.toolbar}>
        {showTypeFilter && (
          <Dropdown
            label={type}
            style={styles.typeDropdown}
            onPress={() =>
              onOpenOptions({
                title: "Post Types",
                options: POST_TYPE_OPTIONS.map((label) => ({ label })),
                value: type,
                onSelect: (v) => {
                  setType(v);
                  setPage(0);
                },
              })
            }
          />
        )}
        <SearchBar
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            setPage(0);
          }}
          style={showTypeFilter ? styles.flex : styles.searchOnly}
        />
      </View>

      <View style={styles.listWrap}>
        {visible.length === 0 ? (
          <EmptyState icon="search-outline" title="No results" message="Try a different search or post type." />
        ) : (
          <RecordList>
            {visible.map((post) => (
              <RecordCard
                key={post.id}
                onPress={() => onViewPost(post)}
                leading={
                  <Image
                    source={{ uri: post.image }}
                    style={portraitThumbs ? styles.thumbPortrait : styles.thumb}
                    contentFit="cover"
                  />
                }
                title={post.caption}
                subtitle={
                  <View style={styles.metaRow}>
                    <Text style={styles.date} numberOfLines={1}>
                      {post.date}
                    </Text>
                    {showTypeFilter && <TypeBadge type={post.type} />}
                    <PlatformIcon platform={platform} size={19} />
                  </View>
                }
                fields={columns.map((c) => ({
                  label: c.label,
                  full: !!c.hint,
                  value: (
                    <View style={styles.metricValue}>
                      <View style={styles.metricRow}>
                        {c.reaction ? <ReactionIcon reaction={c.reaction} size={16} /> : null}
                        <Text style={recordCardStyles.value}>{post.metrics[c.key] ?? "-"}</Text>
                      </View>
                      {c.hint ? <Text style={styles.hint}>{c.hint}</Text> : null}
                    </View>
                  ),
                }))}
              />
            ))}
          </RecordList>
        )}

        <Pagination
          page={safePage}
          perPage={perPage}
          total={filtered.length}
          onPageChange={setPage}
          onPerPagePress={() =>
            onOpenOptions({
              title: "Items per page",
              options: ["5", "10"].map((label) => ({ label })),
              value: String(perPage),
              onSelect: (v) => {
                setPerPage(Number(v));
                setPage(0);
              },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
    ...shadows.card,
  },
  toolbar: {
    flexDirection: "row",
    gap: 16,
  },
  typeDropdown: {
    minWidth: 134,
  },
  searchOnly: {
    width: 240,
    maxWidth: "100%",
  },
  listWrap: {
    gap: 16,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.card,
    backgroundColor: colors.border,
  },
  thumbPortrait: {
    width: 64,
    height: 88,
    borderRadius: radius.card,
    backgroundColor: colors.border,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  date: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  metricValue: {
    gap: 2,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
