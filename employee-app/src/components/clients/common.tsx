import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  ViewStyle,
  StyleProp,
  TextInput,
  TextInputProps,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientFill from "@/components/GradientFill";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import type { LabelStyle, StatTile } from "./clientsData";

type IconName = keyof typeof Ionicons.glyphMap;

// ---------------------------------------------------------------------------
// Page title bar (Figma "title": back chevron + name, home / Clients breadcrumb)
// ---------------------------------------------------------------------------

export function TitleBar({
  title,
  onBack,
  onHome,
}: {
  title: string;
  onBack: () => void;
  onHome?: () => void;
}) {
  return (
    <View style={styles.titleBar}>
      <TouchableOpacity onPress={onBack} hitSlop={10} accessibilityLabel="Back" style={styles.titleLeft}>
        <Ionicons name="chevron-back" size={22} color={colors.primary} />
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.breadcrumb} onPress={onHome} activeOpacity={0.7} disabled={!onHome}>
        <Ionicons name="home-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.breadcrumbSlash}>/</Text>
        <View style={styles.breadcrumbPill}>
          <Text style={styles.breadcrumbPillText}>Clients</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section card with title + optional right action
// ---------------------------------------------------------------------------

export function SectionCard({
  title,
  right,
  children,
  style,
}: {
  title?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.card, style]}>
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

export function SubTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Text style={styles.subTitle}>{children}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

type SoftTone = "primary" | "solid" | "teal";

const SOFT_TONES: Record<SoftTone, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primary },
  solid: { bg: colors.primary, fg: colors.white },
  teal: { bg: colors.tealSoft, fg: colors.teal },
};

/** Figma "Btn": primary-soft (default), solid primary or teal-soft. */
export function SoftButton({
  label,
  icon,
  onPress,
  tone = "primary",
  small,
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  tone?: SoftTone;
  small?: boolean;
}) {
  const palette = SOFT_TONES[tone];
  return (
    <TouchableOpacity
      style={[
        styles.softBtn,
        small && styles.softBtnSmall,
        { backgroundColor: palette.bg },
        tone === "solid" && shadows.primary,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {icon && <Ionicons name={icon} size={small ? 14 : 18} color={palette.fg} />}
      <Text style={[styles.softBtnText, small && { fontSize: 12 }, { color: palette.fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

type IconTone = "primary" | "primarySoft" | "blue" | "danger" | "neutral" | "yellow" | "outline" | "success";

const ICON_TONES: Record<IconTone, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primaryTint, fg: colors.primary },
  primarySoft: { bg: colors.primarySoft, fg: colors.primary },
  blue: { bg: colors.borderLight, fg: colors.blue },
  danger: { bg: colors.pinkSoft, fg: colors.pink },
  neutral: { bg: colors.subtleAlt, fg: colors.text },
  yellow: { bg: colors.yellowSoft, fg: colors.yellow },
  outline: { bg: colors.white, fg: colors.primary, border: colors.primary },
  success: { bg: colors.tealSoft, fg: colors.teal },
};

/** Figma 48x36 icon "Btn". */
export function IconButton({
  icon,
  onPress,
  tone = "primary",
  accessibilityLabel,
  size,
}: {
  icon: IconName;
  onPress: () => void;
  tone?: IconTone;
  accessibilityLabel?: string;
  /** square size override (default Figma 48x36) */
  size?: number;
}) {
  const palette = ICON_TONES[tone];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.iconBtn,
        size ? { width: size, height: size } : null,
        { backgroundColor: palette.bg },
        palette.border ? { borderWidth: 1, borderColor: palette.border } : null,
      ]}
    >
      <Ionicons name={icon} size={18} color={palette.fg} />
    </TouchableOpacity>
  );
}

/** Solid primary button (Figma primary "Btn" with primary shadow). */
export function PrimaryButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity style={[styles.primaryBtn, style]} onPress={onPress} activeOpacity={0.85}>
      {icon && <Ionicons name={icon} size={18} color={colors.white} />}
      <Text style={styles.primaryText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Labels ("Advance labels")
// ---------------------------------------------------------------------------

export function Label({ label, styleDef }: { label: string; styleDef: LabelStyle }) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: styleDef.bg },
        styleDef.outline && { borderWidth: 1, borderColor: styleDef.text },
      ]}
    >
      <Text style={[styles.badgeText, { color: styleDef.text }]}>{label}</Text>
    </View>
  );
}

/** Back-compat badge used by the client list. */
export function Badge({
  label,
  bg,
  color,
  solid,
}: {
  label: string;
  bg: string;
  color?: string;
  solid?: boolean;
}) {
  return <Label label={label} styleDef={{ bg, text: solid ? colors.white : color ?? colors.text }} />;
}

// ---------------------------------------------------------------------------
// Checkbox (Figma "Checkbox, Radio & Toggle Btns": empty / primary ✓ / pink –)
// ---------------------------------------------------------------------------

export type CheckState = "unchecked" | "checked" | "indeterminate";

export function FigmaCheckbox({ state, onPress, label }: { state: CheckState; onPress?: () => void; label?: string }) {
  const box =
    state === "unchecked" ? (
      <View style={styles.checkEmpty} />
    ) : (
      <View style={[styles.checkFilled, { backgroundColor: state === "checked" ? colors.primary : colors.pink }]}>
        <Ionicons name={state === "checked" ? "checkmark" : "remove"} size={16} color={colors.white} />
      </View>
    );
  if (!onPress) return box;
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: state === "checked" ? true : state === "indeterminate" ? "mixed" : false }}
    >
      {box}
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Info field (label / value)
// ---------------------------------------------------------------------------

export function InfoField({
  label,
  value,
  full,
  right,
}: {
  label: string;
  value: string;
  full?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <View style={full ? styles.infoFull : styles.infoHalf}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueRow}>
        <Text style={[styles.infoValue, { flexShrink: 1 }]}>{value || "-"}</Text>
        {right}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stat tile (Figma "Cards": gradient, solid icon square, label, value)
// ---------------------------------------------------------------------------

export function StatTileCard({ tile, style }: { tile: StatTile; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.statTile, style]}>
      <GradientFill from={tile.gradient[0]} to={tile.gradient[1]} />
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: tile.color }]}>
          <Ionicons name={tile.icon} size={20} color={colors.white} />
        </View>
        <Text style={styles.statLabel} numberOfLines={2}>
          {tile.label}
        </Text>
      </View>
      <Text style={styles.statValue}>{tile.value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Numbered row (Figma "post": borderLight bg, primary square index)
// ---------------------------------------------------------------------------

export function RankRow({ index, name, right }: { index: number; name: string; right?: React.ReactNode }) {
  return (
    <View style={styles.rankRow}>
      <View style={styles.rankSquare}>
        <Text style={styles.rankText}>{index}</Text>
      </View>
      <Text style={styles.rankName}>{name}</Text>
      {right}
    </View>
  );
}

export function AmountBlock({ amount, caption, green }: { amount: string; caption: string; green?: boolean }) {
  return (
    <View style={{ alignItems: "flex-end" }}>
      <Text style={[styles.amount, green && { color: colors.green }]}>{amount}</Text>
      <Text style={styles.amountCaption}>{caption}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Chip group (Figma filter buttons, single select)
// ---------------------------------------------------------------------------

export function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export function FilterLabel({ children }: { children: string }) {
  return <Text style={styles.filterLabel}>{children}</Text>;
}

// ---------------------------------------------------------------------------
// Anchored popover menu (Figma dropdown list: white card, overlay shadow)
// ---------------------------------------------------------------------------

export interface MenuItem {
  key: string;
  label: string;
  icon?: IconName;
  color?: string;
  active?: boolean;
}

type Anchor = { x: number; y: number; w: number; h: number };

function measureAnchor(node: View | null, set: (a: Anchor) => void) {
  node?.measureInWindow((x, y, w, h) => set({ x, y, w, h }));
}

function PopoverCard({
  anchor,
  items,
  onSelect,
  onClose,
  align = "right",
  minWidth = 140,
}: {
  anchor: Anchor | null;
  items: MenuItem[];
  onSelect: (key: string) => void;
  onClose: () => void;
  align?: "left" | "right";
  minWidth?: number;
}) {
  const { width, height } = useWindowDimensions();
  if (!anchor) return null;
  const estHeight = items.length * 36 + 16;
  const below = anchor.y + anchor.h + 4;
  const top = below + estHeight > height - 24 ? Math.max(24, anchor.y - estHeight - 4) : below;
  const pos: ViewStyle =
    // Right-aligned menus open left-aligned instead when the trigger sits in the left half.
    align === "right" && anchor.x + anchor.w > width / 2
      ? { top, right: Math.max(12, width - (anchor.x + anchor.w)) }
      : { top, left: Math.max(12, anchor.x) };
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.popover, pos, { minWidth: Math.max(minWidth, align === "left" ? anchor.w : 0) }]}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.popoverItem}
                onPress={() => {
                  onClose();
                  onSelect(item.key);
                }}
                activeOpacity={0.7}
              >
                {item.icon && <Ionicons name={item.icon} size={16} color={item.color ?? colors.primary} />}
                <Text style={[styles.popoverText, item.active && { color: colors.primary, fontFamily: fonts.semibold }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/** Kebab (⋮) that opens an anchored View / Edit / Delete style menu. */
export function KebabMenu({ items, onSelect }: { items: MenuItem[]; onSelect: (key: string) => void }) {
  const ref = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  return (
    <>
      <View ref={ref} collapsable={false}>
        <TouchableOpacity
          onPress={() => measureAnchor(ref.current, setAnchor)}
          hitSlop={10}
          accessibilityLabel="More actions"
          style={{ padding: 4 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      <PopoverCard anchor={anchor} items={items} onSelect={onSelect} onClose={() => setAnchor(null)} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Compact dropdown (white bordered box that opens an anchored option list)
// ---------------------------------------------------------------------------

export function CompactDropdown({
  value,
  options,
  onChange,
  style,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  /** kept for API compatibility */
  title?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const ref = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  return (
    <>
      <View ref={ref} collapsable={false} style={style}>
        <TouchableOpacity style={styles.dropdown} onPress={() => measureAnchor(ref.current, setAnchor)} activeOpacity={0.75}>
          <Text style={styles.dropdownText} numberOfLines={1}>
            {value}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
      <PopoverCard
        anchor={anchor}
        align="left"
        minWidth={120}
        items={options.map((o) => ({ key: o, label: o, active: o === value }))}
        onSelect={onChange}
        onClose={() => setAnchor(null)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Form controls (Figma "Input form": label 14 semibold, 42px box, #E0E6EB border)
// ---------------------------------------------------------------------------

export function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.formLabel}>
      {label}
      {required ? " *" : ""}
    </Text>
  );
}

export function FormInput({
  label,
  required,
  multiline,
  style,
  containerStyle,
  ...props
}: TextInputProps & { label?: string; required?: boolean; containerStyle?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.formField, containerStyle]}>
      {label ? <FormLabel label={label} required={required} /> : null}
      <TextInput
        placeholderTextColor={colors.text}
        multiline={multiline}
        style={[styles.input, multiline && styles.textArea, style]}
        {...props}
      />
    </View>
  );
}

export function InlineSelect({
  label,
  required,
  value,
  placeholder = "Select",
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const ref = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  return (
    <View style={styles.formField}>
      <FormLabel label={label} required={required} />
      <View ref={ref} collapsable={false}>
        <TouchableOpacity style={styles.selectBox} onPress={() => measureAnchor(ref.current, setAnchor)} activeOpacity={0.75}>
          <Text style={[styles.selectText, !value && { color: colors.textMuted }]}>{value || placeholder}</Text>
          <Ionicons name={anchor ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <PopoverCard
        anchor={anchor}
        align="left"
        items={options.map((o) => ({ key: o, label: o, active: o === value }))}
        onSelect={onChange}
        onClose={() => setAnchor(null)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Pagination (Items per page / range / arrows)
// ---------------------------------------------------------------------------

export function usePagination<T>(items: T[], initialPerPage = 5) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  return {
    pageItems: items.slice(start, start + perPage),
    page: safePage,
    perPage,
    setPage,
    setPerPage: (n: number) => {
      setPerPage(n);
      setPage(1);
    },
    total: items.length,
    totalPages,
    start,
  };
}

export function Pagination({
  page,
  perPage,
  total,
  totalPages,
  setPage,
  setPerPage,
}: {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  setPage: (n: number) => void;
  setPerPage: (n: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const arrow = (icon: IconName, disabled: boolean, target: number) => (
    <TouchableOpacity disabled={disabled} onPress={() => setPage(target)} style={styles.pageArrow} hitSlop={6}>
      <Ionicons name={icon} size={16} color={disabled ? colors.border : colors.text} />
    </TouchableOpacity>
  );
  return (
    <View style={styles.pagination}>
      <View style={styles.perPageRow}>
        <Text style={styles.paginationText}>Items per page:</Text>
        <CompactDropdown
          value={String(perPage)}
          options={["5", "10", "20"]}
          onChange={(v) => setPerPage(parseInt(v, 10))}
          style={{ minWidth: 64 }}
        />
      </View>
      <View style={styles.perPageRow}>
        <Text style={styles.paginationText}>
          {from}-{to} of {total}
        </Text>
        {arrow("play-skip-back-outline", page <= 1, 1)}
        {arrow("chevron-back", page <= 1, page - 1)}
        {arrow("chevron-forward", page >= totalPages, page + 1)}
        {arrow("play-skip-forward-outline", page >= totalPages, totalPages)}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Upload dropzone (Figma "_File upload base")
// ---------------------------------------------------------------------------

export function UploadDropzone({
  onPress,
  title = "Drop here or click to browse",
  style,
}: {
  onPress: () => void;
  title?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity style={[styles.dropzone, style]} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.dropzoneIcon}>
        <Ionicons name="hand-left-outline" size={28} color={colors.primary} />
        <Ionicons name="add" size={14} color={colors.primary} style={styles.dropzonePlus} />
      </View>
      <Text style={styles.dropzoneTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

/** Figma "_File upload item base": file icon, primary name, muted size, actions. */
export function FileRow({
  name,
  size,
  onRemove,
  actions,
}: {
  name: string;
  size?: string;
  onRemove?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <View style={styles.fileRow}>
      <Ionicons name="document-attach-outline" size={32} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.fileName} numberOfLines={1}>
          {name}
        </Text>
        {size ? <Text style={styles.fileSize}>{size}</Text> : null}
      </View>
      {actions}
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={{ padding: 4 }} accessibilityLabel="Remove file">
          <Ionicons name="trash-outline" size={18} color={colors.pink} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Figma modal ("Montlhy Recurring Renevue" frame): white r=12, title + ✕
// ---------------------------------------------------------------------------

export function FigmaModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close">
                  <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={{ flexShrink: 1 }}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/** Figma modal footer: single right-aligned primary button. */
export function ModalFooter({ primaryLabel, onPrimary }: { primaryLabel: string; onPrimary: () => void }) {
  return (
    <View style={styles.footerRow}>
      <PrimaryButton label={primaryLabel} onPress={onPrimary} />
    </View>
  );
}

export function EmptyState({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={30} color={colors.border} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export const shared = StyleSheet.create({
  formLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    minHeight: 110,
    textAlignVertical: "top",
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
});

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    ...shadows.card,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  titleText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    flexShrink: 1,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breadcrumbSlash: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  breadcrumbPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  breadcrumbPillText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 27,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  softBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: radius.md,
  },
  softBtnSmall: {
    height: 32,
    paddingHorizontal: 12,
  },
  softBtnText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  iconBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  primaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  checkEmpty: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    backgroundColor: colors.white,
  },
  checkFilled: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    height: 24,
    justifyContent: "center",
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },
  infoHalf: {
    width: "50%",
    paddingRight: 8,
    marginBottom: 16,
  },
  infoFull: {
    width: "100%",
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  statTile: {
    borderRadius: radius.card,
    padding: 16,
    gap: 14,
    overflow: "hidden",
    minHeight: 120,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  statValue: {
    fontSize: 26,
    lineHeight: 34,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  rankSquare: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  rankName: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  amount: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  amountCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  chipRow: {
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.primary,
  },
  filterLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  dropdownText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text,
    flexShrink: 1,
  },
  popover: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 8,
    ...shadows.overlay,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  popoverText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 125,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 42,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selectText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  pagination: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 4,
  },
  perPageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paginationText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  pageArrow: {
    padding: 2,
  },
  dropzone: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingVertical: 16,
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  dropzoneIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.card,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzonePlus: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  dropzoneTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.primary,
    textAlign: "center",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    backgroundColor: colors.white,
  },
  fileName: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  fileSize: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(41, 52, 61, 0.35)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    maxHeight: "90%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.overlay,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    paddingBottom: 4,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
});
