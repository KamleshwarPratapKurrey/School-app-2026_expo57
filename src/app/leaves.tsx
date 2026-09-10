import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { api_url } from "@/components/common/ApiUrls";
import { StatusCode } from "@/constants/app_constants";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllLeaves, markLeaveAsSeen } from "@/store/slices/leaveSlice";
import { LeaveApplicationItem } from "@/types/leave";

export default function AllLeaveScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { allLeaves, listStatus, listError } = useAppSelector(
    (state) => state.leave,
  );

  const loadData = async () => {
    await dispatch(
      fetchAllLeaves({
        endpoint: `${api_url}/leave`,
        token,
      }),
    );
  };

  useEffect(() => {
    loadData();
  }, [dispatch, token]);
  useEffect(() => {
    if (allLeaves.length > 0) {
      // Saves the latest count to AsyncStorage & clears badge in Redux
      dispatch(markLeaveAsSeen(allLeaves.length));
    }
  }, [dispatch, allLeaves.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredLeaves = useMemo(() => {
    if (!searchQuery.trim()) return allLeaves;
    const q = searchQuery.toLowerCase();
    return allLeaves.filter(
      (item) =>
        item.reason.toLowerCase().includes(q) ||
        item.from_date.toLowerCase().includes(q) ||
        item.to_date.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q),
    );
  }, [allLeaves, searchQuery]);

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr.toLowerCase()) {
      case "approved":
        return {
          bg: isDark ? "rgba(16, 185, 129, 0.15)" : "#DCFCE7",
          text: "#10B981",
          icon: "check-circle-outline",
        };
      case "rejected":
        return {
          bg: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
          text: "#EF4444",
          icon: "close-circle-outline",
        };
      default:
        return {
          bg: isDark ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7",
          text: "#D97706",
          icon: "clock-outline",
        };
    }
  };

  // console.log("leaves->", allLeaves);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.applyBtn}
                onPress={() => router.push("/register_leave" as any)}
              >
                <LinearGradient
                  colors={["#6366F1", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.applyBtnGradient}
                >
                  <Feather name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.applyBtnText}>Apply</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          },
        }}
      />

      {/* <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      /> */}

      <View style={styles.safeArea}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBarWrapper,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderL,
              shadowColor: colors.shadowClr,
            },
          ]}
        >
          <Feather name="search" size={18} color={colors.subtext} />
          <TextInput
            placeholder="Search by reason, status, or date..."
            placeholderTextColor={colors.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              { color: colors.text, fontSize: colors.font14 },
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.subtext} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.tabletScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.tint}
            />
          }
        >
          <View
            style={[styles.innerWrapper, isTablet && styles.tabletInnerWrapper]}
          >
            {/* Header */}
            {/* <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontSize: colors.font28 },
                  ]}
                >
                  Leave Applications
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  History and track approval statuses
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.applyBtn}
                onPress={() => router.push("/leave-form" as any)}
              >
                <LinearGradient
                  colors={["#6366F1", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.applyBtnGradient}
                >
                  <Feather name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.applyBtnText}>Apply</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}

            {/* Status Views */}
            {listStatus === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : listStatus === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {listError || "Failed to load leave records."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredLeaves.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="calendar-blank-outline"
                  size={52}
                  color={colors.subtext}
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.text, fontSize: colors.font16 },
                  ]}
                >
                  {searchQuery
                    ? "No matching leave requests"
                    : "No leave history found"}
                </Text>
                <Text style={[styles.emptySub, { color: colors.subtext }]}>
                  Submitted leave requests will show up here.
                </Text>
              </View>
            ) : (
              /* Grid Layout */
              <View
                style={[styles.leavesGrid, isTablet && styles.tabletLeavesGrid]}
              >
                {filteredLeaves.map((item: LeaveApplicationItem) => {
                  const badge = getStatusBadge(item.status);

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.leaveCard,
                        isTablet && styles.tabletLeaveCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                    >
                      {/* Top Header Row */}
                      <View style={styles.cardHeaderRow}>
                        <View style={styles.dateDurationWrap}>
                          <Feather
                            name="calendar"
                            size={15}
                            color={colors.tint}
                          />
                          <Text
                            style={[
                              styles.dateRangeText,
                              { color: colors.text, fontSize: colors.font14 },
                            ]}
                          >
                            {item.from_date} – {item.to_date}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: badge.bg },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={badge.icon as any}
                            size={14}
                            color={badge.text}
                          />
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: badge.text },
                            ]}
                          >
                            {item.status}
                          </Text>
                        </View>
                      </View>

                      {/* Reason Description */}
                      <Text
                        style={[
                          styles.reasonText,
                          { color: colors.text, fontSize: colors.font14 },
                        ]}
                      >
                        {item.reason}
                      </Text>

                      {/* Footer Row */}
                      <View
                        style={[
                          styles.cardFooter,
                          { borderTopColor: colors.borderL },
                        ]}
                      >
                        {/* <Text
                          style={[
                            styles.appIdText,
                            { color: colors.subtext, fontSize: colors.font12 },
                          ]}
                        >
                          App ID: #{item.id}
                        </Text> */}

                        {item.photo ? (
                          <TouchableOpacity
                            style={styles.attachmentBtn}
                            activeOpacity={0.7}
                            onPress={() => setPreviewImage(item.photo)}
                          >
                            <Feather
                              name="image"
                              size={14}
                              color={colors.tint}
                            />
                            <Text
                              style={[
                                styles.attachmentBtnText,
                                { color: colors.tint },
                              ]}
                            >
                              View Attachment
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            style={[
                              styles.noAttachText,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            No Attachment
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Attachment Image Preview Modal */}
      <Modal
        visible={!!previewImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setPreviewImage(null)}
          >
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {previewImage && (
            <Image
              source={{ uri: previewImage }}
              style={styles.fullPreviewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  tabletScrollContent: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 12,
  },
  innerWrapper: {
    width: "100%",
  },
  tabletInnerWrapper: {
    maxWidth: 1040,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  applyBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  applyBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    fontSize: 13,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 0,
  },
  searchInput: {
    flex: 1,
    padding: 0,
  },
  centerContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyCard: {
    padding: 40,
    borderRadius: 24,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 6,
  },
  emptyTitle: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginTop: 8,
  },
  emptySub: {
    fontFamily: Fonts?.regular || "System",
    fontSize: 13,
  },
  leavesGrid: {
    flexDirection: "column",
    gap: 14,
  },
  tabletLeavesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  leaveCard: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0,
  },
  tabletLeaveCard: {
    width: "48.8%",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateDurationWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateRangeText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "700",
  },
  reasonText: {
    fontFamily: Fonts?.regular || "System",
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  appIdText: {
    fontFamily: Fonts?.regular || "System",
  },
  attachmentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  attachmentBtnText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
  },
  noAttachText: {
    fontFamily: Fonts?.regular || "System",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCloseBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fullPreviewImage: {
    width: "100%",
    height: "80%",
    borderRadius: 12,
  },
});
