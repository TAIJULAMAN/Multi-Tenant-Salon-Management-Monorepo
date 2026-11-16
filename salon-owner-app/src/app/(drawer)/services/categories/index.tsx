import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  initialCategories,
  CategoryRecord,
  categoryColorMap,
} from "@/components/services/servicesData";

import AddCategoryModal from "@/components/services/modals/AddCategoryModal";
import EditCategoryModal from "@/components/services/modals/EditCategoryModal";
import DeleteCategoryModal from "@/components/services/modals/DeleteCategoryModal";

export default function CategoriesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryRecord | null>(null);

  const handleExportCSV = () => {
    Alert.alert("Export Data", `Exporting ${categories.length} categories to CSV...`);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Service Categories</Text>
          <Text style={styles.headerSub}>Organize your menu into customizable categories</Text>
        </View>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExportCSV}
          activeOpacity={0.75}
        >
          <Ionicons name="download-outline" size={14} color="#635BFF" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner with Add Button */}
        <View style={styles.bannerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Custom Categories</Text>
            <Text style={styles.bannerSub}>Structure services by salon departments or treatments</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setIsAddOpen(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        {/* Categories List */}
        <View style={styles.categoriesList}>
          {categories.map((category) => {
            const colorStyle = category.categoryStyle || categoryColorMap["Category 1"];

            return (
              <View key={category.id} style={styles.categoryCard}>
                <View style={styles.categoryCardHeader}>
                  <View
                    style={[
                      styles.categoryPill,
                      { backgroundColor: colorStyle.bg, borderColor: colorStyle.border },
                    ]}
                  >
                    <Text style={[styles.categoryPillText, { color: colorStyle.text }]}>
                      {category.name}
                    </Text>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => setEditingCategory(category)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil-outline" size={15} color="#475569" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => setDeletingCategory(category)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {category.description ? (
                  <Text style={styles.categoryDesc}>{category.description}</Text>
                ) : null}

                <View style={styles.categoryBottomRow}>
                  <Ionicons name="cut-outline" size={14} color="#635BFF" />
                  <Text style={styles.categoryCountText}>
                    <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>
                      {category.relatedServices}
                    </Text>{" "}
                    Related Services
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Category Modal */}
      <AddCategoryModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(newCat) => {
          setCategories([
            {
              id: `cat_${Date.now()}`,
              name: newCat.name,
              description: newCat.description,
              categoryStyle: newCat.categoryStyle,
              relatedServices: 0,
            },
            ...categories,
          ]);
          Alert.alert("Success", "Category created!");
        }}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        visible={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        onSave={(updated) => {
          setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
          Alert.alert("Success", "Category updated!");
        }}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        visible={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        categoryName={deletingCategory?.name}
        onConfirm={() => {
          if (deletingCategory) {
            setCategories(categories.filter((c) => c.id !== deletingCategory.id));
            Alert.alert("Deleted", "Category has been removed.");
            setDeletingCategory(null);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  bannerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 10,
  },
  categoryCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 6,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  categoryDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 18,
  },
  categoryBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  categoryCountText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
});
