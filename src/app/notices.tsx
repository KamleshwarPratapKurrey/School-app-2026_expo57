import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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
import { fetchNotices, markNoticesAsSeen } from "@/store/slices/noticeSlice";
import { Stack } from "expo-router";

export default function NoticesScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: notices,
    status,
    error,
  } = useAppSelector((state) => state.notices);

  const loadData = async () => {
    await dispatch(
      fetchNotices({
        endpoint: `${api_url}/notices`,
        token,
      }),
    );
  };

  useEffect(() => {
    loadData();
  }, [dispatch, token]);
  useEffect(() => {
    if (notices.length > 0) {
      // Saves the latest count to AsyncStorage & clears badge in Redux
      dispatch(markNoticesAsSeen(notices.length));
    }
  }, [dispatch, notices.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAttachment = (attachmentUrl: string | null) => {
    if (!attachmentUrl) return;
    Linking.openURL(attachmentUrl);
  };

  // Group latest notice as featured on tablet/mobile
  const latestNotice = notices.length > 0 ? notices[0] : null;
  const standardNotices = notices.length > 0 ? notices.slice(1) : [];
  // console.log("notices-->", JSON.stringify(notices, null, 2));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.3, 0.7]}
        style={StyleSheet.absoluteFill}
      />

      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="bell-ring-outline"
                  size={16}
                  color="#EC4899"
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {notices.length} Updates
                </Text>
              </View>
            );
          },
        }}
      />
      <View style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            { paddingTop: 20 },
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
                  Notice Board
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Circulars & administrative alerts
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="bell-ring-outline"
                  size={16}
                  color="#EC4899"
                />
                <Text style={[styles.countBadgeText, { color: colors.text }]}>
                  {notices.length} Updates
                </Text>
              </View>
            </View> */}

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to fetch announcements."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : notices.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="bell-sleep-outline"
                  size={44}
                  color={colors.subtext}
                />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No active notices or circulars available
                </Text>
              </View>
            ) : (
              <View
                style={[styles.mainLayout, isTablet && styles.tabletMainLayout]}
              >
                {/* Left Column (Tablet): Pinned / Recent Notice Announcement */}
                <View
                  style={[
                    styles.leftColumn,
                    isTablet && styles.tabletLeftColumn,
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: colors.subtext, fontSize: colors.font13 },
                    ]}
                  >
                    Latest Announcement
                  </Text>

                  {latestNotice && (
                    <View
                      style={[
                        styles.featuredCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={
                          isDark
                            ? ["#4A154B", "#2E0854"]
                            : ["#FCE7F3", "#FBCFE8"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.featuredBanner}
                      >
                        <View style={styles.featuredTagWrap}>
                          <MaterialCommunityIcons
                            name="pin"
                            size={16}
                            color={isDark ? "#F472B6" : "#BE185D"}
                          />
                          <Text
                            style={[
                              styles.featuredTagText,
                              { color: isDark ? "#F472B6" : "#BE185D" },
                            ]}
                          >
                            Pinned Notice
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.noticeDate,
                            { color: isDark ? "#F9A8D4" : "#9D174D" },
                          ]}
                        >
                          {latestNotice.date}
                        </Text>
                      </LinearGradient>

                      <View
                        style={[styles.featuredBody, { padding: colors.pad }]}
                      >
                        <Text
                          style={[
                            styles.featuredTitle,
                            { color: colors.text, fontSize: colors.font20 },
                          ]}
                        >
                          {latestNotice.title}
                        </Text>
                        <Text
                          style={[
                            styles.featuredContent,
                            { color: colors.subtext, fontSize: colors.font14 },
                          ]}
                        >
                          {latestNotice.content}
                        </Text>

                        {latestNotice.attachment && (
                          <TouchableOpacity
                            style={[
                              styles.attachmentBtn,
                              {
                                backgroundColor: isDark
                                  ? "rgba(99, 102, 241, 0.15)"
                                  : "#EEF2FF",
                              },
                            ]}
                            onPress={() =>
                              handleAttachment(latestNotice.attachment)
                            }
                          >
                            <Feather
                              name="paperclip"
                              size={15}
                              color={colors.tint}
                            />
                            <Text
                              style={[
                                styles.attachmentText,
                                { color: colors.tint },
                              ]}
                            >
                              Download Attachment
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                </View>

                {/* Right Column (Tablet): Notification Log Feed */}
                <View
                  style={[
                    styles.rightColumn,
                    isTablet && styles.tabletRightColumn,
                  ]}
                >
                  <Text
                    style={[
                      styles.sectionLabel,
                      { color: colors.subtext, fontSize: colors.font13 },
                    ]}
                  >
                    Notification Feed
                  </Text>

                  <View style={styles.notificationStack}>
                    {notices.map((notice, idx) => {
                      const isAlert =
                        notice.title.toLowerCase().includes("important") ||
                        notice.title.toLowerCase().includes("exam");

                      return (
                        <View
                          key={notice.id}
                          style={[
                            styles.notificationItem,
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.borderL,
                              shadowColor: colors.shadowClr,
                            },
                          ]}
                        >
                          {/* Notification Category Indicator */}
                          <View
                            style={[
                              styles.iconBox,
                              {
                                backgroundColor: isAlert
                                  ? isDark
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "#FEE2E2"
                                  : isDark
                                    ? "rgba(99, 102, 241, 0.15)"
                                    : "#EEF2FF",
                              },
                            ]}
                          >
                            <Ionicons
                              name={isAlert ? "alert-circle" : "notifications"}
                              size={20}
                              color={isAlert ? "#EF4444" : colors.tint}
                            />
                          </View>

                          <View style={styles.itemBody}>
                            <View style={styles.itemHeaderRow}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.itemTitle,
                                  {
                                    color: colors.text,
                                    fontSize: colors.font16,
                                  },
                                ]}
                              >
                                {notice.title}
                              </Text>
                              {idx === 0 && <View style={styles.unreadDot} />}
                            </View>

                            <Text
                              style={[
                                styles.itemContent,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font13,
                                },
                              ]}
                            >
                              {notice.content}
                            </Text>

                            <View style={styles.itemFooterRow}>
                              <View style={styles.dateWrap}>
                                <Ionicons
                                  name="time-outline"
                                  size={13}
                                  color={colors.subtext}
                                />
                                <Text
                                  style={[
                                    styles.itemDate,
                                    {
                                      color: colors.subtext,
                                      fontSize: colors.font12,
                                    },
                                  ]}
                                >
                                  {notice.date}
                                </Text>
                              </View>

                              {notice.attachment && (
                                <TouchableOpacity
                                  style={styles.inlineAttach}
                                  onPress={() =>
                                    handleAttachment(notice.attachment)
                                  }
                                >
                                  <Feather
                                    name="download"
                                    size={12}
                                    color={colors.tint}
                                  />
                                  <Text
                                    style={[
                                      styles.inlineAttachText,
                                      { color: colors.tint },
                                    ]}
                                  >
                                    File
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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
    marginBottom: 8,
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
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // elevation: 0,
  },
  countBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
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
    padding: 32,
    borderRadius: 20,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  emptyText: {
    fontFamily: Fonts?.regular || "System",
    textAlign: "center",
  },
  sectionLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  mainLayout: {
    flexDirection: "column",
    gap: 20,
  },
  tabletMainLayout: {
    flexDirection: "row",
    gap: 28,
    alignItems: "flex-start",
  },
  leftColumn: {
    width: "100%",
  },
  tabletLeftColumn: {
    flex: 1.1,
  },
  rightColumn: {
    width: "100%",
  },
  tabletRightColumn: {
    flex: 1.4,
  },
  featuredCard: {
    borderRadius: 24,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    // elevation: 0,
  },
  featuredBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  featuredTagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredTagText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  noticeDate: {
    fontFamily: Fonts?.regular || "System",
    fontSize: 12,
  },
  featuredBody: {},
  featuredTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    marginBottom: 8,
  },
  featuredContent: {
    fontFamily: Fonts?.regular || "System",
    lineHeight: 20,
    marginBottom: 14,
  },
  attachmentBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  attachmentText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 13,
    fontWeight: "600",
  },
  notificationStack: {
    gap: 12,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 0,
    gap: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    // elevation: 0,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBody: {
    flex: 1,
  },
  itemHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    paddingRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EC4899",
  },
  itemContent: {
    fontFamily: Fonts?.regular || "System",
    lineHeight: 18,
    marginBottom: 10,
  },
  itemFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  itemDate: {
    fontFamily: Fonts?.regular || "System",
  },
  inlineAttach: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  inlineAttachText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "600",
  },
});
