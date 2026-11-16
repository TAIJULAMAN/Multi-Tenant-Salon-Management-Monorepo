import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { FB_VIEW_POST_METRICS, MetricColumn, POST_AUTHOR, SocialPlatform, SocialPost } from "../socialData";
import { ReactionIcon } from "../SocialUI";

interface PostDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  post: SocialPost | null;
  columns: MetricColumn[];
  platform: SocialPlatform;
}

const ACTIONS = [
  { icon: "thumbs-up-outline", label: "Like" },
  { icon: "chatbubble-outline", label: "Comment" },
  { icon: "sync-outline", label: "Repost" },
  { icon: "paper-plane-outline", label: "Send" },
];

/** "View Post" (Figma 1:11844): post preview + "Post Analytics" + "Edit Post". */
export default function PostDetailsModal({ visible, onClose, post, columns, platform }: PostDetailsModalProps) {
  if (!post) return null;

  // Facebook shows the curated list from the frame; other tables show every column of their row.
  const metrics: MetricColumn[] =
    platform === "facebook"
      ? FB_VIEW_POST_METRICS.map((k) => columns.find((c) => c.key === k)).filter((c): c is MetricColumn => !!c)
      : columns;

  const handleEdit = () => {
    onClose();
    Alert.alert("Edit Post", "Editing opens the post on the connected account.");
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>View Post</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Post preview */}
            <View style={styles.widget}>
              <View style={styles.userRow}>
                <Image source={{ uri: POST_AUTHOR.avatar }} style={styles.avatar} />
                <Text style={styles.userName}>{POST_AUTHOR.name}</Text>
              </View>
              <Text style={styles.body}>{POST_AUTHOR.body}</Text>
              <Image source={{ uri: post.image }} style={styles.postImage} contentFit="cover" />
              <View style={styles.actionsRow}>
                {ACTIONS.map((a) => (
                  <View key={a.label} style={styles.action}>
                    <Ionicons name={a.icon as any} size={20} color="#1C274C" />
                    <Text style={styles.actionText}>{a.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Post analytics */}
            <View style={styles.widget}>
              <Text style={styles.sectionTitle}>Post Analytics</Text>
              <View style={styles.grid}>
                {metrics.map((c) => (
                  <View
                    key={c.key}
                    style={[styles.metricCell, c.key === "All reactions by type" && styles.metricCellFull]}
                  >
                    <Text style={styles.metricLabel}>{c.label}</Text>
                    <View style={styles.metricValueRow}>
                      {c.reaction ? <ReactionIcon reaction={c.reaction} size={20} /> : null}
                      <Text style={styles.metricValue}>{post.metrics[c.key] ?? "-"}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.8}>
              <Text style={styles.editText}>Edit Post</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    maxHeight: "90%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 16,
    gap: 24,
    ...shadows.overlay,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  content: {
    gap: 24,
  },
  widget: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 24,
    ...shadows.card,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
  },
  userName: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.card,
    backgroundColor: colors.border,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 16,
  },
  metricCell: {
    width: "46%",
  },
  metricCellFull: {
    width: "100%",
  },
  metricLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: "#999999",
  },
  metricValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  editBtn: {
    alignSelf: "flex-end",
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  editText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
});
