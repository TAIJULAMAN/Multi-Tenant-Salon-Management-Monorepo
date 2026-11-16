import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface MediaItem {
  id: string;
  name: string;
  type: "Photo" | "Video";
  uploadedBy: string;
  published: boolean;
  date: string;
  time: string;
  thumbnail: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "1",
    name: "SummerPromo.jpeg",
    type: "Photo",
    uploadedBy: "Maria",
    published: true,
    date: "08/25/2026",
    time: "5:06 PM",
    thumbnail: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "HairTutorial.mp4",
    type: "Video",
    uploadedBy: "Maria",
    published: false,
    date: "08/22/2026",
    time: "2:30 PM",
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "StylingSession.jpeg",
    type: "Photo",
    uploadedBy: "Alex",
    published: true,
    date: "08/10/2026",
    time: "11:15 AM",
    thumbnail: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "SalonTour.mp4",
    type: "Video",
    uploadedBy: "Sarah",
    published: true,
    date: "07/28/2026",
    time: "4:45 PM",
    thumbnail: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80",
  },
];

const DATE_RANGE_OPTIONS = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This Year",
  "All Time",
];

export default function MediaTab() {
  const [fileType, setFileType] = useState<"All Type" | "Photo" | "Video">("All Type");
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number }>({
    top: 100,
    right: 16,
  });
  const dateBtnRef = useRef<any>(null);

  const handleOpenDateMenu = () => {
    if (dateBtnRef.current?.measureInWindow) {
      dateBtnRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          const screenWidth = Dimensions.get("window").width;
          const rightOffset = Math.max(16, screenWidth - (x + width));
          setDropdownPosition({ top: y + height + 6, right: rightOffset });
          setIsDateModalOpen(true);
        }
      );
    } else {
      setIsDateModalOpen(true);
    }
  };

  // Selected item for action sheet
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Upload sheet
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadType, setUploadType] = useState<"Photo" | "Video">("Photo");
  const [selectedMediaFile, setSelectedMediaFile] = useState<{
    name: string;
    uri: string;
    size: string;
    type: "Photo" | "Video";
    resolution: string;
  } | null>(null);

  const filteredMedia = mediaList.filter((m) => {
    if (fileType !== "All Type" && m.type !== fileType) return false;
    return true;
  });

  const handlePickMedia = () => {
    Alert.alert(
      "Select Media",
      "Choose a photo or video from device library",
      [
        {
          text: "Photo: Balayage_Transformation.jpeg (3.8 MB)",
          onPress: () => {
            setSelectedMediaFile({
              name: "Balayage_Transformation.jpeg",
              uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
              size: "3.8 MB",
              type: "Photo",
              resolution: "1920x1080",
            });
            setUploadType("Photo");
            if (!uploadName.trim()) setUploadName("Balayage Transformation");
          },
        },
        {
          text: "Photo: Bridal_Styling_Shot.jpeg (2.5 MB)",
          onPress: () => {
            setSelectedMediaFile({
              name: "Bridal_Styling_Shot.jpeg",
              uri: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80",
              size: "2.5 MB",
              type: "Photo",
              resolution: "1920x1080",
            });
            setUploadType("Photo");
            if (!uploadName.trim()) setUploadName("Bridal Styling Shot");
          },
        },
        {
          text: "Video: Highlights_Masterclass.mp4 (16.4 MB)",
          onPress: () => {
            setSelectedMediaFile({
              name: "Highlights_Masterclass.mp4",
              uri: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
              size: "16.4 MB",
              type: "Video",
              resolution: "1080p 60fps",
            });
            setUploadType("Video");
            if (!uploadName.trim()) setUploadName("Highlights Masterclass");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleUpload = () => {
    if (!uploadName.trim()) {
      Alert.alert("Error", "Please enter media title or select a file.");
      return;
    }
    const created: MediaItem = {
      id: Date.now().toString(),
      name: uploadName.trim(),
      type: uploadType,
      uploadedBy: "Maria",
      published: true,
      date: "Today",
      time: "Just now",
      thumbnail: selectedMediaFile
        ? selectedMediaFile.uri
        : uploadType === "Photo"
        ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80"
        : "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
    };
    setMediaList([created, ...mediaList]);
    setIsUploadOpen(false);
    setUploadName("");
    setSelectedMediaFile(null);
    Alert.alert("Uploaded", "Media file successfully uploaded.");
  };

  const handleDeleteMedia = () => {
    if (!selectedMedia) return;
    setMediaList(mediaList.filter((m) => m.id !== selectedMedia.id));
    setSelectedMedia(null);
  };

  return (
    <View style={styles.container}>
      {/* Header with Upload button */}
      <View style={styles.headerCard}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Media Gallery</Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            Client transformations & promotional shots
          </Text>
        </View>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => setIsUploadOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          {(["All Type", "Photo", "Video"] as const).map((t) => {
            const isSelected = t === fileType;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.filterBadge, isSelected && styles.filterBadgeActive]}
                onPress={() => setFileType(t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          ref={dateBtnRef}
          style={styles.dateSelector}
          onPress={handleOpenDateMenu}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={styles.dateText}>{dateRange}</Text>
          <Ionicons name="chevron-down" size={12} color="#64748B" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Media Items List */}
      <View style={styles.mediaGrid}>
        {filteredMedia.map((item) => (
          <View key={item.id} style={styles.mediaCard}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              {item.type === "Video" && (
                <View style={styles.playOverlay}>
                  <Ionicons name="play-circle" size={36} color="#FFFFFF" />
                </View>
              )}
              <View
                style={[
                  styles.statusBadge,
                  item.published ? styles.badgePublished : styles.badgeDraft,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    item.published ? styles.textPublished : styles.textDraft,
                  ]}
                >
                  {item.published ? "PUBLISHED" : "DRAFT"}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.cardFooterLeft}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardMeta}>
                  By {item.uploadedBy} • {item.date} {item.time}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moreBtn}
                onPress={() => setSelectedMedia(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Media Action Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        title={selectedMedia?.name}
      >
        <View style={styles.sheetActionsContainer}>
          <TouchableOpacity
            style={styles.sheetActionItem}
            onPress={() => {
              Alert.alert("View", `Viewing fullscreen: ${selectedMedia?.name}`);
              setSelectedMedia(null);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="eye-outline" size={18} color="#635BFF" />
            </View>
            <Text style={styles.sheetActionText}>View Fullscreen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetActionItem}
            onPress={() => {
              Alert.alert("Download", `Downloading: ${selectedMedia?.name}`);
              setSelectedMedia(null);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#ECFEFF" }]}>
              <Ionicons name="download-outline" size={18} color="#06B6D4" />
            </View>
            <Text style={styles.sheetActionText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sheetActionItem, { borderBottomWidth: 0 }]}
            onPress={handleDeleteMedia}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </View>
            <Text style={[styles.sheetActionText, { color: "#EF4444" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/* Upload Media Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setSelectedMediaFile(null);
        }}
        title="Upload Media"
      >
        <View style={styles.sheetFormContainer}>
          {/* Media File Selection Dropzone */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>MEDIA FILE *</Text>
            {selectedMediaFile ? (
              <View style={styles.selectedMediaCard}>
                <Image
                  source={{ uri: selectedMediaFile.uri }}
                  style={styles.selectedMediaThumb}
                />
                <View style={styles.selectedMediaInfo}>
                  <Text style={styles.selectedMediaTitle} numberOfLines={1}>
                    {selectedMediaFile.name}
                  </Text>
                  <Text style={styles.selectedMediaMeta}>
                    {selectedMediaFile.size} • {selectedMediaFile.resolution}
                  </Text>
                  <View style={styles.selectedMediaTypeBadge}>
                    <Ionicons
                      name={uploadType === "Photo" ? "image-outline" : "videocam-outline"}
                      size={12}
                      color="#635BFF"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.selectedMediaTypeText}>{uploadType}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedMediaFile(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.dropzone}
                onPress={handlePickMedia}
                activeOpacity={0.8}
              >
                <View style={styles.dropzoneIconCircle}>
                  <Ionicons name="cloud-upload-outline" size={22} color="#635BFF" />
                </View>
                <Text style={styles.dropzoneTitle}>Tap to select photo or video from device</Text>
                <Text style={styles.dropzoneSubtitle}>
                  Supports JPG, PNG, WEBP, MP4, MOV (up to 100 MB)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Media File Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. BalayageHighlights.jpeg"
              placeholderTextColor="#94A3B8"
              value={uploadName}
              onChangeText={setUploadName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Type</Text>
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[styles.typeBtn, uploadType === "Photo" && styles.typeBtnActive]}
                onPress={() => setUploadType("Photo")}
              >
                <Ionicons
                  name="image-outline"
                  size={16}
                  color={uploadType === "Photo" ? "#635BFF" : "#64748B"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.typeBtnText, uploadType === "Photo" && styles.typeBtnTextActive]}>
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, uploadType === "Video" && styles.typeBtnActive]}
                onPress={() => setUploadType("Video")}
              >
                <Ionicons
                  name="videocam-outline"
                  size={16}
                  color={uploadType === "Video" ? "#635BFF" : "#64748B"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.typeBtnText, uploadType === "Video" && styles.typeBtnTextActive]}>
                  Video
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => {
                setIsUploadOpen(false);
                setSelectedMediaFile(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={handleUpload}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>

      {/* Date Range Small Option Modal Anchored Below Button */}
      <Modal
        visible={isDateModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDateModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDateModalOpen(false)}
        >
          <View
            style={[
              styles.smallModalCard,
              { top: dropdownPosition.top, right: dropdownPosition.right },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.smallModalOptions}>
              {DATE_RANGE_OPTIONS.map((option) => {
                const isSelected = dateRange === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.smallModalOptionItem,
                      isSelected && styles.smallModalOptionItemActive,
                    ]}
                    onPress={() => {
                      setDateRange(option);
                      setIsDateModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.smallModalOptionText,
                        isSelected && styles.smallModalOptionTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    flexShrink: 0,
  },
  uploadBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterBadgeActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  filterText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  filterTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  mediaGrid: {
    gap: 14,
  },
  mediaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  thumbnailContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePublished: {
    backgroundColor: "#DCFCE7",
  },
  badgeDraft: {
    backgroundColor: "#FEF3C7",
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  textPublished: {
    color: "#16A34A",
  },
  textDraft: {
    color: "#D97706",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  cardFooterLeft: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  cardMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  moreBtn: {
    padding: 6,
  },
  sheetActionsContainer: {
    paddingBottom: 8,
  },
  sheetActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  sheetActionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetActionText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
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
  dropzone: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dropzoneIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  dropzoneTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },
  dropzoneSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    textAlign: "center",
  },
  selectedMediaCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  selectedMediaThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  selectedMediaInfo: {
    flex: 1,
    gap: 2,
  },
  selectedMediaTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#166534",
  },
  selectedMediaMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#15803D",
  },
  selectedMediaTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  selectedMediaTypeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#166534",
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  typeBtnActive: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  typeBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  typeBtnTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  smallModalCard: {
    position: "absolute",
    width: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  smallModalOptions: {
    gap: 2,
  },
  smallModalOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  smallModalOptionItemActive: {
    backgroundColor: "#EEF2FF",
  },
  smallModalOptionText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  smallModalOptionTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
});
