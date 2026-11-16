import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { AppStatus } from "./types";
import { statusTheme } from "./data";

/* -------------------------------------------------------------------------- */
/*                                   Avatars                                  */
/* -------------------------------------------------------------------------- */

/** Rounded-square avatar used across the Figma calendar / tables. */
export function SquareAvatar({
  uri,
  name,
  size = 40,
  bg = colors.primarySoft,
  rounded,
}: {
  uri?: string;
  name: string;
  size?: number;
  bg?: string;
  rounded?: number;
}) {
  const r = rounded ?? Math.round(size * 0.22);
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: r, backgroundColor: bg }} />;
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: r, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: size * 0.36, color: colors.primary }}>{initials}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Anchored menus                               */
/* -------------------------------------------------------------------------- */

export interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Measures a view (ref.current) in window coordinates and hands the result to `cb`. */
export function measureAnchor(node: View | null, cb: (a: Anchor) => void) {
  if (node && typeof node.measureInWindow === "function") {
    node.measureInWindow((x, y, width, height) => cb({ x, y, width, height }));
  } else {
    cb({ x: 16, y: 200, width: 0, height: 0 });
  }
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress: () => void;
}

/** White dropdown card (r=8, overlay shadow) anchored to a trigger — Figma 3-dot menus. */
export function PopoverMenu({
  anchor,
  onClose,
  items,
  align = "right",
  width = 210,
}: {
  anchor: Anchor | null;
  onClose: () => void;
  items: MenuItem[];
  align?: "left" | "right";
  width?: number;
}) {
  const { width: sw, height: sh } = useWindowDimensions();
  if (!anchor) return null;
  const estHeight = items.length * 36 + 16;
  const below = anchor.y + anchor.height + 6;
  const top = below + estHeight > sh - 24 ? Math.max(24, anchor.y - estHeight - 6) : below;
  const left =
    align === "right"
      ? Math.max(12, Math.min(sw - width - 12, anchor.x + anchor.width - width))
      : Math.max(12, Math.min(sw - width - 12, anchor.x));
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={[ui.menuCard, { top, left, width }]}>
        {items.map((it) => (
          <TouchableOpacity
            key={it.key}
            style={ui.menuItem}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              it.onPress();
            }}
          >
            {it.icon && <Ionicons name={it.icon} size={16} color={it.iconColor ?? colors.textSecondary} />}
            <Text style={ui.menuText}>{it.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Centered modal                              */
/* -------------------------------------------------------------------------- */

/** Desktop Figma modal → centered card (r=12, 20 padding, title 18 semibold, X close). */
export function FigmaModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  minBodyHeight,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  minBodyHeight?: number;
}) {
  const { height } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={ui.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[ui.modalCard, { maxHeight: height * 0.88 }]}>
          <View style={ui.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={ui.modalTitle}>{title}</Text>
              {subtitle ? <Text style={ui.modalSubtitle}>{subtitle}</Text> : null}
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={minBodyHeight ? { minHeight: minBodyHeight } : undefined}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {footer ? <View style={ui.modalFooter}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** Simple option list (used for every Figma "select" field on mobile). */
export function OptionPicker({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  renderLeft,
}: {
  visible: boolean;
  title: string;
  options: string[];
  value?: string;
  onSelect: (v: string) => void;
  onClose: () => void;
  renderLeft?: (option: string) => React.ReactNode;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title={title}>
      {options.map((o) => {
        const active = o === value;
        return (
          <TouchableOpacity
            key={o}
            style={[ui.optionRow, active && ui.optionRowActive]}
            activeOpacity={0.7}
            onPress={() => {
              onSelect(o);
              onClose();
            }}
          >
            {renderLeft?.(o)}
            <Text style={[ui.optionText, active && { color: colors.primary, fontFamily: fonts.semibold }]}>{o}</Text>
            {active && <Ionicons name="checkmark" size={18} color={colors.primary} />}
          </TouchableOpacity>
        );
      })}
    </FigmaModal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Form pieces                                */
/* -------------------------------------------------------------------------- */

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={ui.fieldLabel}>
      {label}
      {required ? " *" : ""}
    </Text>
  );
}

/** Bordered select (r=4, 44 high, muted value, chevron) — Figma "Input form/Default Form". */
export function SelectField({
  label,
  required,
  value,
  placeholder,
  onPress,
  disabled,
  style,
}: {
  label?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      {label ? <FieldLabel label={label} required={required} /> : null}
      <TouchableOpacity
        style={[ui.select, disabled && ui.selectDisabled]}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || !onPress}
      >
        <Text style={ui.selectText} numberOfLines={1}>
          {value || placeholder}
        </Text>
        {!disabled && <Ionicons name="chevron-down" size={18} color={colors.textMuted} />}
      </TouchableOpacity>
    </View>
  );
}

/** Figma checkbox: 20px, r=4, #98A4AE border, primary fill when checked. */
export function FigmaCheckbox({ checked, onPress, label }: { checked: boolean; onPress: () => void; label?: string }) {
  return (
    <TouchableOpacity style={ui.checkRow} activeOpacity={0.7} onPress={onPress} hitSlop={6}>
      <View style={[ui.checkBox, checked && ui.checkBoxOn]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>
      {label ? <Text style={ui.checkLabel}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Badges                                   */
/* -------------------------------------------------------------------------- */

export function StatusBadge({ status }: { status: AppStatus }) {
  const t = statusTheme[status];
  return (
    <View style={[ui.badge, { backgroundColor: t.badgeBg }]}>
      <Text style={[ui.badgeText, { color: t.badgeText }]}>{status}</Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Pagination                                 */
/* -------------------------------------------------------------------------- */

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  pageSizes = [5, 10, 20],
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
  onPageSize: (n: number) => void;
  pageSizes?: number[];
}) {
  const [open, setOpen] = useState(false);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  const btn = (icon: keyof typeof Ionicons.glyphMap, target: number, disabled: boolean) => (
    <TouchableOpacity
      key={icon}
      style={ui.pageBtn}
      disabled={disabled}
      onPress={() => onPage(target)}
      hitSlop={4}
    >
      <Ionicons name={icon} size={16} color={disabled ? colors.border : colors.textSecondary} />
    </TouchableOpacity>
  );
  return (
    <View style={ui.pagination}>
      <Text style={ui.pageText}>Items per page:</Text>
      <TouchableOpacity style={ui.pageSize} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={ui.pageSizeText}>{pageSize}</Text>
        <Ionicons name="caret-down" size={10} color={colors.text} />
      </TouchableOpacity>
      <Text style={ui.pageText}>
        {from}-{to} of {total}
      </Text>
      <View style={{ flexDirection: "row" }}>
        {btn("play-skip-back-outline", 0, page === 0)}
        {btn("chevron-back", page - 1, page === 0)}
        {btn("chevron-forward", page + 1, page >= pageCount - 1)}
        {btn("play-skip-forward-outline", pageCount - 1, page >= pageCount - 1)}
      </View>
      <OptionPicker
        visible={open}
        title="Items per page"
        options={pageSizes.map(String)}
        value={String(pageSize)}
        onSelect={(v) => {
          onPageSize(parseInt(v, 10));
          onPage(0);
        }}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

export const ui = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    ...shadows.card,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  primaryBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  primaryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.white,
  },
  smallPrimaryBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  smallPrimaryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.white,
  },
  softBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  softBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  greyBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  greyBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textDark,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  searchBox: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 0,
  },
  tealPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tealPillText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.teal,
  },
  menuCard: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 8,
    ...shadows.overlay,
    shadowOpacity: 0.18,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 34,
  },
  menuText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(41, 52, 61, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.overlay,
    shadowOpacity: 0.2,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  modalSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    height: 46,
    borderRadius: radius.md,
  },
  optionRowActive: {
    backgroundColor: colors.primaryTint,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  fieldLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
    marginBottom: 8,
  },
  select: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    gap: 8,
  },
  selectDisabled: {
    backgroundColor: "#EEF2F9",
  },
  selectText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkBoxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  pageText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.text,
  },
  pageSize: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pageSizeText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  pageBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
