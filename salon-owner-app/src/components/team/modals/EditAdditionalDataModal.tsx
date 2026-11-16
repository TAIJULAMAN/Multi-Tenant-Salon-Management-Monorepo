import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

export interface AdditionalDataState {
  certifications: string[];
  courses: string[];
  languages: { language: string; level: string }[];
}

interface EditAdditionalDataModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: AdditionalDataState;
  onSave?: (data: AdditionalDataState) => void;
}

const DEFAULT_DATA: AdditionalDataState = {
  certifications: ["Professional Hairdresser", "Business Management"],
  courses: ["Leadership Management", "Customer Service Excellence"],
  languages: [
    { language: "Italian", level: "Native" },
    { language: "English", level: "Advanced" },
    { language: "Spanish", level: "Intermediate" },
  ],
};

const LANGUAGE_LEVELS = ["Native", "Advanced", "Intermediate", "Basic"];

export default function EditAdditionalDataModal({
  visible,
  onClose,
  initialData = DEFAULT_DATA,
  onSave,
}: EditAdditionalDataModalProps) {
  const [certifications, setCertifications] = useState<string[]>(initialData.certifications);
  const [courses, setCourses] = useState<string[]>(initialData.courses);
  const [languages, setLanguages] = useState<{ language: string; level: string }[]>(
    initialData.languages
  );

  useEffect(() => {
    if (visible) {
      setCertifications(initialData.certifications);
      setCourses(initialData.courses);
      setLanguages(initialData.languages);
    }
  }, [visible, initialData]);

  const handleAddCert = () => {
    setCertifications([...certifications, ""]);
  };

  const handleUpdateCert = (text: string, index: number) => {
    const updated = [...certifications];
    updated[index] = text;
    setCertifications(updated);
  };

  const handleRemoveCert = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleAddCourse = () => {
    setCourses([...courses, ""]);
  };

  const handleUpdateCourse = (text: string, index: number) => {
    const updated = [...courses];
    updated[index] = text;
    setCourses(updated);
  };

  const handleRemoveCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleAddLang = () => {
    setLanguages([...languages, { language: "", level: "Intermediate" }]);
  };

  const handleUpdateLangName = (text: string, index: number) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], language: text };
    setLanguages(updated);
  };

  const handleCycleLangLevel = (index: number) => {
    const current = languages[index].level;
    const currentIdx = LANGUAGE_LEVELS.indexOf(current);
    const nextIdx = (currentIdx + 1) % LANGUAGE_LEVELS.length;
    const updated = [...languages];
    updated[index] = { ...updated[index], level: LANGUAGE_LEVELS[nextIdx] };
    setLanguages(updated);
  };

  const handleRemoveLang = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave?.({
      certifications: certifications.filter((c) => c.trim().length > 0),
      courses: courses.filter((c) => c.trim().length > 0),
      languages: languages.filter((l) => l.language.trim().length > 0),
    });
    Alert.alert("Success", "Additional data updated successfully.");
    onClose();
  };

  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      title="Edit Additional Data"
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Certifications Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Certifications</Text>
              <Text style={styles.sectionSub}>Professional certificates and licenses</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddCert} activeOpacity={0.7}>
              <Ionicons name="add" size={15} color="#635BFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {certifications.map((cert, index) => (
            <View key={`cert_${index}`} style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={cert}
                placeholder="e.g. Master Stylist License"
                placeholderTextColor="#94A3B8"
                onChangeText={(text) => handleUpdateCert(text, index)}
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleRemoveCert(index)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Completed Courses Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Completed Courses</Text>
              <Text style={styles.sectionSub}>Trainings, masterclasses & workshops</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddCourse} activeOpacity={0.7}>
              <Ionicons name="add" size={15} color="#635BFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {courses.map((course, index) => (
            <View key={`course_${index}`} style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={course}
                placeholder="e.g. Advanced Color Theory 2024"
                placeholderTextColor="#94A3B8"
                onChangeText={(text) => handleUpdateCourse(text, index)}
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleRemoveCourse(index)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Languages Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Languages</Text>
              <Text style={styles.sectionSub}>Spoken languages & proficiency level</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddLang} activeOpacity={0.7}>
              <Ionicons name="add" size={15} color="#635BFF" />
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {languages.map((lang, index) => (
            <View key={`lang_${index}`} style={styles.langInputRow}>
              <TextInput
                style={[styles.input, { flex: 1.4 }]}
                value={lang.language}
                placeholder="e.g. French"
                placeholderTextColor="#94A3B8"
                onChangeText={(text) => handleUpdateLangName(text, index)}
              />
              <TouchableOpacity
                style={styles.levelSelector}
                onPress={() => handleCycleLangLevel(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.levelSelectorText}>{lang.level}</Text>
                <Ionicons name="swap-vertical" size={14} color="#635BFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleRemoveLang(index)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Docked Footer Actions - outside ScrollView with ample bottom space */}
      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 16,
  },
  sectionCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  levelSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 10,
    height: 42,
    gap: 4,
  },
  levelSelectorText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  footerActions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 14,
    paddingBottom: 16,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  saveBtn: {
    flex: 1.2,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
