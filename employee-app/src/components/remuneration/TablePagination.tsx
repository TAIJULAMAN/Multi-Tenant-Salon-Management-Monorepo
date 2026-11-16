import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AnchoredMenu, { MenuAnchor, measureAnchor } from "@/components/shifts/AnchoredMenu";

interface TablePaginationProps {
  total: number;
  page: number; // 1-based
  perPage: number;
  perPageOptions?: number[];
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

type NavKind = "first" | "prev" | "next" | "last";

function NavBtn({ kind, enabled, onPress }: { kind: NavKind; enabled: boolean; onPress: () => void }) {
  const color = enabled ? colors.text : colors.textMuted;
  const back = kind === "first" || kind === "prev";
  const bar = kind === "first" || kind === "last";
  const label = { first: "First page", prev: "Previous page", next: "Next page", last: "Last page" }[kind];
  return (
    <TouchableOpacity
      style={styles.navBtn}
      onPress={onPress}
      disabled={!enabled}
      accessibilityLabel={label}
      activeOpacity={0.7}
      hitSlop={6}
    >
      {bar && kind === "first" && <View style={[styles.navBar, { backgroundColor: color }]} />}
      <Ionicons name={back ? "chevron-back" : "chevron-forward"} size={18} color={color} />
      {bar && kind === "last" && <View style={[styles.navBar, { backgroundColor: color }]} />}
    </TouchableOpacity>
  );
}

/** Figma table footer: "Items per page: [5 ▾]   1-5 of 10   |<  <  >  >|". */
export default function TablePagination({
  total,
  page,
  perPage,
  perPageOptions = [5, 10, 20],
  onPageChange,
  onPerPageChange,
}: TablePaginationProps) {
  const ref = useRef<View>(null);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <View style={styles.container}>
      <View style={styles.perPageRow}>
        <Text style={styles.mutedText}>Items per page:</Text>
        <TouchableOpacity ref={ref} style={styles.perPageBtn} onPress={() => measureAnchor(ref, setAnchor)} activeOpacity={0.7}>
          <Text style={styles.perPageText}>{perPage}</Text>
          <Ionicons name="caret-down" size={12} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.rangeText}>
          {from}-{to} of {total}
        </Text>
      </View>

      <View style={styles.navRow}>
        <NavBtn kind="first" enabled={canPrev} onPress={() => onPageChange(1)} />
        <NavBtn kind="prev" enabled={canPrev} onPress={() => onPageChange(page - 1)} />
        <NavBtn kind="next" enabled={canNext} onPress={() => onPageChange(page + 1)} />
        <NavBtn kind="last" enabled={canNext} onPress={() => onPageChange(pageCount)} />
      </View>

      <AnchoredMenu
        visible={!!anchor}
        anchor={anchor}
        options={perPageOptions.map((n) => ({ key: String(n), label: String(n), selected: n === perPage }))}
        onClose={() => setAnchor(null)}
        onSelect={(key) => onPerPageChange(parseInt(key, 10))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    columnGap: 20,
    rowGap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  perPageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mutedText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  perPageBtn: {
    height: 36,
    minWidth: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
  },
  perPageText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  rangeText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
  },
  navBar: {
    width: 1.5,
    height: 13,
    borderRadius: 1,
  },
});
