import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface EvaluationItem {
  id: string;
  period: string;
  date: string;
  score: number;
  evaluator: string;
  summary: string;
}

const INITIAL_EVALUATIONS: EvaluationItem[] = [
  {
    id: "1",
    period: "Annual Review 2024",
    date: "Dec 15, 2024",
    score: 4.8,
    evaluator: "Marco Rossi (Salon Manager)",
    summary: "Exceptional technical execution in balayage and highlights. Outstanding customer satisfaction metrics and punctuality.",
  },
  {
    id: "2",
    period: "Mid-Year Assessment 2024",
    date: "Jun 20, 2024",
    score: 4.6,
    evaluator: "Marco Rossi (Salon Manager)",
    summary: "Consistent performance, great teamwork, and steady revenue contribution.",
  },
];

export default function EvaluationTab() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(INITIAL_EVALUATIONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState("");
  const [newScore, setNewScore] = useState("4.8");
  const [newNotes, setNewNotes] = useState("");

  const handleAddEvaluation = () => {
    if (!newPeriod.trim()) {
      Alert.alert("Required", "Please enter review title or period.");
      return;
    }
    const scoreNum = parseFloat(newScore) || 4.5;
    const item: EvaluationItem = {
      id: Date.now().toString(),
      period: newPeriod.trim(),
      date: "Today",
      score: Math.min(5, Math.max(1, scoreNum)),
      evaluator: "You (Owner)",
      summary: newNotes.trim() || "Performance review recorded.",
    };
    setEvaluations([item, ...evaluations]);
    setIsAddModalOpen(false);
    setNewPeriod("");
    setNewNotes("");
    Alert.alert("Success", "Performance evaluation recorded.");
  };

  return (
    <View style={styles.container}>
      {/* Overall Evaluation Score Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewTop}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>4.8</Text>
            <Text style={styles.scoreTotal}>/ 5.0</Text>
          </View>

          <View style={styles.overviewRight}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Outstanding</Text>
            </View>
            <Text style={styles.overviewTitle}>Overall Performance</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name="star"
                  size={16}
                  color={star <= 4 ? "#F59E0B" : "#FBBF24"}
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text style={styles.starsText}>Top 5% Salon Rank</Text>
            </View>
          </View>
        </View>

        <View style={styles.overviewFooter}>
          <View style={styles.footerCol}>
            <Text style={styles.footerLabel}>LAST EVALUATOR</Text>
            <Text style={styles.footerVal}>Marco Rossi</Text>
          </View>
          <View style={styles.footerDivider} />
          <View style={styles.footerCol}>
            <Text style={styles.footerLabel}>NEXT EVALUATION</Text>
            <Text style={[styles.footerVal, { color: "#635BFF" }]}>March 14, 2025</Text>
          </View>
        </View>
      </View>

      {/* Competency Breakdown Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Competency Breakdown</Text>
          <TouchableOpacity
            style={styles.addReviewBtn}
            onPress={() => setIsAddModalOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={14} color="#FFFFFF" style={{ marginRight: 2 }} />
            <Text style={styles.addReviewBtnText}>Add Review</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Technical Skills */}
        <View style={styles.competencyItem}>
          <View style={styles.competencyHeader}>
            <Text style={styles.competencyName}>Technical Skills & Styling</Text>
            <Text style={styles.competencyPercent}>98%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "98%", backgroundColor: "#635BFF" }]} />
          </View>
        </View>

        {/* 2. Client Satisfaction */}
        <View style={styles.competencyItem}>
          <View style={styles.competencyHeader}>
            <Text style={styles.competencyName}>Client Satisfaction</Text>
            <Text style={styles.competencyPercent}>96%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "96%", backgroundColor: "#10B981" }]} />
          </View>
        </View>

        {/* 3. Punctuality */}
        <View style={styles.competencyItem}>
          <View style={styles.competencyHeader}>
            <Text style={styles.competencyName}>Punctuality & Attendance</Text>
            <Text style={styles.competencyPercent}>100%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "100%", backgroundColor: "#06B6D4" }]} />
          </View>
        </View>

        {/* 4. Team Collaboration */}
        <View style={styles.competencyItem}>
          <View style={styles.competencyHeader}>
            <Text style={styles.competencyName}>Teamwork & Collaboration</Text>
            <Text style={styles.competencyPercent}>94%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "94%", backgroundColor: "#F59E0B" }]} />
          </View>
        </View>

        {/* 5. Retail Upselling */}
        <View style={[styles.competencyItem, { marginBottom: 0 }]}>
          <View style={styles.competencyHeader}>
            <Text style={styles.competencyName}>Retail Upselling & Cross-sell</Text>
            <Text style={styles.competencyPercent}>92%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "92%", backgroundColor: "#EC4899" }]} />
          </View>
        </View>
      </View>

      {/* Supervisor Feedback & Goals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Supervisor Feedback & Goals</Text>

        <View style={styles.feedbackSection}>
          <View style={styles.feedbackHeaderRow}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginRight: 6 }} />
            <Text style={styles.feedbackSectionTitle}>Key Strengths</Text>
          </View>
          <Text style={styles.feedbackText}>
            • Consistently brings high-retention repeat clients.{"\n"}
            • Excellent color technique precision and quick turnarounds.{"\n"}
            • Mentors junior apprentices proactively.
          </Text>
        </View>

        <View style={styles.feedbackSection}>
          <View style={styles.feedbackHeaderRow}>
            <Ionicons name="arrow-up-circle" size={18} color="#635BFF" style={{ marginRight: 6 }} />
            <Text style={styles.feedbackSectionTitle}>Growth & Development Targets</Text>
          </View>
          <Text style={styles.feedbackText}>
            • Lead weekend styling masterclass for apprentice stylists.{"\n"}
            • Expand retail cross-selling of hair care treatments.
          </Text>
        </View>
      </View>

      {/* Evaluation History */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Evaluation History</Text>
        {evaluations.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.historyItem,
              idx === evaluations.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <View style={styles.historyHeader}>
              <View>
                <Text style={styles.historyPeriod}>{item.period}</Text>
                <Text style={styles.historyDate}>{item.date} • {item.evaluator}</Text>
              </View>
              <View style={styles.historyScoreBox}>
                <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                <Text style={styles.historyScoreText}>{item.score.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.historySummary}>{item.summary}</Text>
          </View>
        ))}
      </View>

      {/* Add Evaluation Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Performance Review"
      >
        <View style={styles.sheetFormContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Review Title / Period *</Text>
            <TextInput
              style={styles.formInput}
              value={newPeriod}
              onChangeText={setNewPeriod}
              placeholder="e.g. Q1 2025 Evaluation"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Score (1.0 - 5.0) *</Text>
            <TextInput
              style={styles.formInput}
              value={newScore}
              onChangeText={setNewScore}
              keyboardType="decimal-pad"
              placeholder="4.8"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Feedback & Observations</Text>
            <TextInput
              style={[styles.formInput, { height: 80, textAlignVertical: "top" }]}
              value={newNotes}
              onChangeText={setNewNotes}
              multiline
              placeholder="Enter evaluation summary, achievements and feedback..."
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setIsAddModalOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={handleAddEvaluation}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Save Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF2FF",
    borderWidth: 3,
    borderColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 22,
    fontFamily: "Manrope_800ExtraBold",
    color: "#635BFF",
    lineHeight: 24,
  },
  scoreTotal: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  overviewRight: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  overviewTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    marginLeft: 6,
  },
  overviewFooter: {
    flexDirection: "row",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    alignItems: "center",
  },
  footerCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  footerVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  footerDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  addReviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addReviewBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  competencyItem: {
    marginBottom: 12,
  },
  competencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  competencyName: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  competencyPercent: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  feedbackSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  feedbackHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  feedbackSectionTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  feedbackText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    lineHeight: 18,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  historyPeriod: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  historyDate: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  historyScoreBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  historyScoreText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#B45309",
  },
  historySummary: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 17,
  },
  sheetFormContainer: {
    gap: 14,
    paddingBottom: 8,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#334155",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  sheetModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  sheetCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  sheetCancelText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  sheetSaveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSaveText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
