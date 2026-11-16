import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { PostType, ReactionKey, SocialPlatform } from "./socialData";

// ─── Platform icon ───────────────────────────────────────────────────────────
// Figma draws every platform glyph in the primary purple.

const PLATFORM_ICON: Record<SocialPlatform, { name: string; brand: string }> = {
  instagram: { name: "logo-instagram", brand: "#E4405F" },
  facebook: { name: "logo-facebook", brand: "#1877F2" },
  messenger: { name: "chatbubbles-outline", brand: "#0084FF" },
  tiktok: { name: "musical-notes", brand: "#000000" },
  x: { name: "logo-twitter", brand: "#000000" },
};

export function PlatformIcon({
  platform,
  size = 20,
  color,
  brand,
}: {
  platform: SocialPlatform;
  size?: number;
  color?: string;
  /** Use the platform brand colour instead of the Figma purple. */
  brand?: boolean;
}) {
  const cfg = PLATFORM_ICON[platform];
  const tint = color ?? (brand ? cfg.brand : colors.primary);
  if (platform === "x") {
    return <Text style={[styles.xLogo, { fontSize: size - 2, color: tint }]}>𝕏</Text>;
  }
  return <Ionicons name={cfg.name as any} size={size} color={tint} />;
}

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  messenger: "Messenger",
  tiktok: "TikTok",
  x: "X",
};

// ─── Cards ───────────────────────────────────────────────────────────────────

interface CardProps {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Figma "widget": white, 1px #E0E6EB border, r=12, card shadow. */
  bordered?: boolean;
}

/** Chart widget (title 16/600). */
export function Card({ title, right, children, style, bordered = true }: CardProps) {
  return (
    <View style={[styles.card, bordered && styles.cardBorder, style]}>
      {(title || right) && (
        <View style={styles.cardHeader}>
          {title ? <Text style={styles.cardTitle}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

/** Section wrapper on the Facebook dashboard ("Consumption Metrics", …): title 18/600. */
export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={[styles.card, styles.cardBorder, styles.section]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Dropdown trigger ────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  /** 44 (default) or 36 high. */
  small?: boolean;
}

export function Dropdown({ label, onPress, style, small }: DropdownProps) {
  return (
    <TouchableOpacity
      style={[styles.dropdown, small && styles.dropdownSmall, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.dropdownText} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons name="chevron-down" size={14} color={colors.text} />
    </TouchableOpacity>
  );
}

// ─── Filter chips (Media Type / Usage) ───────────────────────────────────────

interface ChipGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

export function ChipGroup({ label, options, value, onChange }: ChipGroupProps) {
  return (
    <View style={styles.chipGroup}>
      <Text style={styles.chipGroupLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((o) => {
          const active = o === value;
          return (
            <TouchableOpacity
              key={o}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(o)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Tabs (underline) ────────────────────────────────────────────────────────

interface TabsProps {
  tabs: string[];
  value: string;
  onChange: (v: string) => void;
}

export function UnderlineTabs({ tabs, value, onChange }: TabsProps) {
  return (
    <View style={styles.tabsRow}>
      {tabs.map((t) => {
        const active = t === value;
        return (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tabs.length < 4 && styles.tabFixed, active && styles.tabActive]}
            onPress={() => onChange(t)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1}>
              {t}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  style,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.search, style]}>
      <Ionicons name="search-outline" size={18} color={colors.text} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} hitSlop={8}>
          <Ionicons name="close-circle" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPagePress: () => void;
}

function PageNavBtn({ icon, enabled, onPress }: { icon: string; enabled: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity disabled={!enabled} onPress={onPress} style={styles.pageBtn} hitSlop={6} activeOpacity={0.7}>
      <Ionicons name={icon as any} size={18} color={enabled ? colors.text : colors.textMuted} />
    </TouchableOpacity>
  );
}

export function Pagination({ page, perPage, total, onPageChange, onPerPagePress }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : page * perPage + 1;
  const to = Math.min(total, (page + 1) * perPage);
  const canPrev = page > 0;
  const canNext = page < pages - 1;

  return (
    <View style={styles.pagination}>
      <View style={styles.perPageRow}>
        <Text style={styles.pageText}>Items per page:</Text>
        <TouchableOpacity style={styles.perPageBtn} onPress={onPerPagePress} activeOpacity={0.7}>
          <Text style={styles.perPageText}>{perPage}</Text>
          <Ionicons name="caret-down" size={12} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.pageNav}>
        <Text style={styles.pageText}>
          {from}-{to} of {total}
        </Text>
        <PageNavBtn icon="play-skip-back-outline" enabled={canPrev} onPress={() => onPageChange(0)} />
        <PageNavBtn icon="chevron-back" enabled={canPrev} onPress={() => onPageChange(page - 1)} />
        <PageNavBtn icon="chevron-forward" enabled={canNext} onPress={() => onPageChange(page + 1)} />
        <PageNavBtn icon="play-skip-forward-outline" enabled={canNext} onPress={() => onPageChange(pages - 1)} />
      </View>
    </View>
  );
}

// ─── Post type badge (Figma "label": pill, 12/500) ───────────────────────────

const TYPE_COLORS: Record<PostType, { bg: string; fg: string }> = {
  Link: { bg: "#E6F4F7", fg: "#46CAEB" },
  Photo: { bg: colors.yellowSoft, fg: colors.yellow },
  Gif: { bg: colors.subtleAlt, fg: colors.textDark },
  Carousel: { bg: colors.primarySoft, fg: colors.primary },
  Video: { bg: colors.tealSoft, fg: colors.teal },
};

export function TypeBadge({ type }: { type: PostType }) {
  const c = TYPE_COLORS[type];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{type}</Text>
    </View>
  );
}

// ─── Facebook reaction glyphs ────────────────────────────────────────────────

const REACTION_EMOJI: Partial<Record<ReactionKey, string>> = {
  Wow: "😮",
  Haha: "😆",
  "Sad/Sorry": "😢",
  Angry: "😡",
};

export function ReactionIcon({ reaction, size = 20 }: { reaction: ReactionKey; size?: number }) {
  if (reaction === "Like" || reaction === "Love") {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: reaction === "Like" ? colors.blueDark : colors.red,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={reaction === "Like" ? "thumbs-up" : "heart"} size={size * 0.55} color="#FFFFFF" />
      </View>
    );
  }
  return <Text style={{ fontSize: size * 0.85, lineHeight: size }}>{REACTION_EMOJI[reaction]}</Text>;
}

// ─── Checkbox (Figma "Checkbox, Radio & Toggle Btns") ───────────────────────

export type CheckState = "checked" | "unchecked" | "indeterminate";

export function FigmaCheckbox({ state, onPress }: { state: CheckState; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8} activeOpacity={0.8} style={styles.checkboxHit}>
      <View
        style={[
          styles.checkbox,
          state === "checked" && styles.checkboxChecked,
          state === "indeterminate" && styles.checkboxIndeterminate,
        ]}
      >
        {state === "checked" && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        {state === "indeterminate" && <View style={styles.minus} />}
      </View>
    </TouchableOpacity>
  );
}

export function EmptyState({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon as any} size={26} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  xLogo: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.card,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  cardTitle: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  section: {
    gap: 20,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  dropdownSmall: {
    height: 36,
  },
  dropdownText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
    flexShrink: 1,
  },
  chipGroup: {
    gap: 8,
  },
  chipGroupLabel: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textDark,
  },
  chipTextActive: {
    color: colors.primary,
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    marginBottom: -1,
    alignItems: "center",
  },
  tabFixed: {
    flex: 0,
    width: 120,
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  tabTextActive: {
    color: colors.primary,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
    paddingVertical: 0,
  },
  pagination: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    columnGap: 24,
    rowGap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  perPageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  perPageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  perPageText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  pageNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
    marginRight: 8,
  },
  pageBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  checkboxHit: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderWidth: 0,
    backgroundColor: colors.primary,
  },
  checkboxIndeterminate: {
    width: 24,
    height: 24,
    borderWidth: 0,
    backgroundColor: colors.pink,
  },
  minus: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFFFFF",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  emptyMessage: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
});
