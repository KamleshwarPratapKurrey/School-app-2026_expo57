import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
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
import { fetchAttendance } from "@/store/slices/attendanceSlice";
import { checkUnreadNotices, fetchNotices } from "@/store/slices/noticeSlice";
import { fetchSchoolInfo } from "@/store/slices/school_info_slice";
import { Href, Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentDashboardScreen() {
  const { colors, theme } = useTheme();
  const { user, token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isTablet = width >= 768;
  const isDark = theme === "dark";

  const { school_info } = useAppSelector((state) => state.school_info);

  const { summary: attendanceSummary, status: attendanceStatus } =
    useAppSelector((state) => state.attendance);

  const { unreadCount, data: notices } = useAppSelector(
    (state) => state.notices,
  );
  useEffect(() => {
    dispatch(
      fetchSchoolInfo({
        endpoint: `${api_url}/school-info`,
        token,
      }),
    );
    dispatch(
      fetchAttendance({
        endpoint: `${api_url}/attendance`,
        token,
      }),
    );

    // NOTIIFICATIONS
    const initNotices = async () => {
      const res = await dispatch(
        fetchNotices({
          endpoint: `${api_url}/notices`,
          token,
        }),
      );

      if (fetchNotices.fulfilled.match(res)) {
        // Compare current total against AsyncStorage
        dispatch(checkUnreadNotices(res.payload.length));
      }
    };

    initNotices();
  }, [dispatch, token]);

  const quickLinks = [
    {
      id: "timetable",
      title: "Time Table",
      icon: "calendar-clock",
      color: "#6366F1",
      bgColor: isDark ? "rgba(99, 102, 241, 0.15)" : "#EEF2FF",
      url: "/timetable",
    },
    {
      id: "notices",
      title: "Notices",
      icon: "bullhorn-outline",
      color: "#EC4899",
      bgColor: isDark ? "rgba(236, 72, 153, 0.15)" : "#FDF2F8",
      url: "/notices",
    },
    {
      id: "teachers",
      title: "Teachers",
      icon: "account-tie-outline",
      color: "#06B6D4",
      bgColor: isDark ? "rgba(6, 182, 212, 0.15)" : "#ECFEFF",
      url: "/teachers",
    },
    {
      id: "attendance",
      title: "Attendance",
      icon: "clipboard-check-outline",
      color: "#10B981",
      bgColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
      url: "/attendance",
    },
    {
      id: "subjects",
      title: "Subjects",
      icon: "bookshelf",
      color: "#9d10b9",
      bgColor: isDark ? "rgba(185, 16, 157, 0.15)" : "#fdecfd",
      url: "/subjects",
    },
    {
      id: "transport",
      title: "Transport",
      icon: "bus-school",
      color: "#b9b610",
      bgColor: isDark ? "rgba(162, 185, 16, 0.15)" : "#fdfdec",
      url: "/transport",
    },
  ];

  const overallPercent = attendanceSummary?.overall_percentage ?? 0;
  const presentCount = attendanceSummary?.total_present ?? 0;
  const totalDays = attendanceSummary?.total_working_days ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        // style={StyleSheet.absoluteFillObject}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.tabletScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.innerWrapper, isTablet && styles.tabletInnerWrapper]}
          >
            {/* Top Navigation Bar */}
            <View style={styles.header}>
              <View style={styles.userInfo}>
                {school_info?.logo ? (
                  <Image
                    // source={{ uri: school_info.logo }}
                    source={{
                      uri: `https://scontent.fbho3-6.fna.fbcdn.net/v/t39.30808-6/294146202_433930778750384_5455115691759611655_n.jpg?stp=dst-jpg_tt6&cstp=mx888x888&ctp=s888x888&_nc_cat=111&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=u6EaUMHgvPwQ7kNvwHAzzNB&_nc_oc=Adr80nMTO1qb5RrNNOYKcX-eMdxxYazAL-umBPntBG_AHdoalUvFE4_cY-6MobcjnPo&_nc_zt=23&_nc_ht=scontent.fbho3-6.fna&_nc_gid=r48pI3k4P-JO6CwHT4y_8Q&_nc_ss=7b289&oh=00_AQIZs7SxSKxHBsuDrB5V0AEj1fAJFOqaG578HPSSU2kd5g&oe=6A9DDE9D`,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatarFallback,
                      { backgroundColor: colors.tint + "20" },
                    ]}
                  >
                    <Text style={[styles.avatarText, { color: colors.tint }]}>
                      {user?.name ? user.name[0] : "S"}
                    </Text>
                  </View>
                )}
                <View style={styles.headerTextGroup}>
                  <Text
                    style={[
                      styles.greeting,
                      { color: colors.text, fontSize: colors.font18 },
                    ]}
                  >
                    Hello, {user?.name || "Student"}
                  </Text>
                  <Text
                    style={[
                      styles.schoolSubtitle,
                      { color: colors.subtext, fontSize: colors.font12 },
                    ]}
                  >
                    {school_info?.name || "School Portal"}
                  </Text>
                </View>
              </View>

              <View style={styles.headerActions}>
                {/* <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                      shadowColor: colors.shadowClr,
                    },
                  ]}
                >
                  <Ionicons
                    name="search-outline"
                    size={18}
                    color={colors.text}
                  />
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                      shadowColor: colors.shadowClr,
                    },
                  ]}
                  onPress={() => router.push("/notices")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={18}
                    color={colors.text}
                  />

                  {unreadCount > 0 && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeCount}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Body: Converts to 2 Columns on Tablet */}
            <View
              style={[
                styles.dashboardGrid,
                isTablet && styles.tabletDashboardGrid,
              ]}
            >
              {/* Column 1: Hero Banner & Quick Access */}
              <View style={[styles.column, isTablet && styles.leftColumn]}>
                <LinearGradient
                  colors={
                    isDark ? ["#312E81", "#1E1B4B"] : ["#EEF2FF", "#E0E7FF"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.heroBanner, { borderColor: colors.borderL }]}
                >
                  <View style={styles.heroTextContainer}>
                    <Text
                      style={[
                        styles.heroTitle,
                        {
                          color: isDark ? "#FFFFFF" : "#1E1B4B",
                          fontSize: colors.font20,
                        },
                      ]}
                    >
                      Ready to Learn?
                    </Text>
                    <Text
                      style={[
                        styles.heroSubtitle,
                        {
                          color: isDark ? "#C7D2FE" : "#4338CA",
                          fontSize: colors.font12,
                        },
                      ]}
                    >
                      Assignments, live schedules, and school announcements
                      updated regularly.
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.heroButton,
                        { backgroundColor: colors.tint },
                      ]}
                      activeOpacity={0.8}
                      onPress={() => router.push("/timetable")}
                    >
                      <Text
                        style={[
                          styles.heroButtonText,
                          { fontSize: colors.font13 },
                        ]}
                      >
                        View Schedule
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.heroArt}>
                    <MaterialCommunityIcons
                      name="school"
                      size={isTablet ? 110 : 84}
                      color={
                        isDark
                          ? "rgba(255,255,255,0.18)"
                          : "rgba(99, 102, 241, 0.22)"
                      }
                    />
                  </View>
                </LinearGradient>

                {/* Quick Access */}
                <View style={styles.sectionHeader}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.text, fontSize: colors.font16 },
                    ]}
                  >
                    Quick Access
                  </Text>
                </View>

                <View style={styles.quickAccessGrid}>
                  {quickLinks.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      style={[
                        styles.quickCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                      onPress={() => router.push(item.url as any)}
                    >
                      <View
                        style={[
                          styles.quickIconCircle,
                          { backgroundColor: item.bgColor },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon as any}
                          size={24}
                          color={item.color}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.quickCardText,
                          { color: colors.text, fontSize: colors.font12 },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Column 2: Academic Overview */}
              <View style={[styles.column, isTablet && styles.rightColumn]}>
                <View style={styles.sectionHeader}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.text, fontSize: colors.font16 },
                    ]}
                  >
                    Academic Overview
                  </Text>

                  <TouchableOpacity style={styles.filterPill}>
                    <Link href={"/attendance" as Href}>
                      <Text
                        style={[
                          styles.filterPillText,
                          { color: colors.subtext, fontSize: colors.font12 },
                        ]}
                      >
                        Overall ▾
                      </Text>
                    </Link>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.overviewCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                      shadowColor: colors.shadowClr,
                    },
                  ]}
                >
                  {attendanceStatus === StatusCode.LOADING ? (
                    <ActivityIndicator
                      color={colors.tint}
                      style={{ padding: 24 }}
                    />
                  ) : (
                    <>
                      <View style={styles.statRow}>
                        <View>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: colors.text, fontSize: colors.font14 },
                            ]}
                          >
                            Attendance
                          </Text>
                          <Text
                            style={[
                              styles.statSub,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            {presentCount} of {totalDays} Working Days
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.statValue,
                            { color: colors.text, fontSize: colors.font14 },
                          ]}
                        >
                          {overallPercent}%
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.progressTrack,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F1F5F9",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressBar,
                            {
                              backgroundColor: "#b7b8f9",
                              width: `${Math.min(overallPercent, 100)}%`,
                            },
                          ]}
                        />
                      </View>

                      <View style={[styles.statRow, { marginTop: 22 }]}>
                        <View>
                          <Text
                            style={[
                              styles.statLabel,
                              { color: colors.text, fontSize: colors.font14 },
                            ]}
                          >
                            Total Absents
                          </Text>
                          <Text
                            style={[
                              styles.statSub,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            Unexcused and excused days
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.statValue,
                            { color: "#EF4444", fontSize: colors.font14 },
                          ]}
                        >
                          {attendanceSummary?.total_absent ?? 0} Days
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.progressTrack,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F1F5F9",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressBar,
                            {
                              backgroundColor: "#f09c9c",
                              width: `${
                                totalDays > 0
                                  ? ((attendanceSummary?.total_absent || 0) /
                                      totalDays) *
                                    100
                                  : 0
                              }%`,
                            },
                          ]}
                        />
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 28,
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
    fontFamily: Fonts?.heavy || "System",
  },
  headerTextGroup: {
    marginLeft: 12,
  },
  greeting: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
  },
  schoolSubtitle: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // elevation: 2,
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444", // vibrant red notification dot
    borderWidth: 0.5,
    borderColor: "#FFFFFF", // separates the badge from the button background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    zIndex: 10,
  },

  badgeCount: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false, // eliminates default vertical alignment offset on Android
    lineHeight: 12,
  },
  // notificationDot: {
  //   position: "absolute",
  //   top: 9,
  //   right: 9,
  //   width: 7,
  //   height: 7,
  //   borderRadius: 3.5,
  //   backgroundColor: "#EF4444",
  // },
  dashboardGrid: {
    flexDirection: "column",
  },
  tabletDashboardGrid: {
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },
  column: {
    width: "100%",
  },
  leftColumn: {
    flex: 1.25,
  },
  rightColumn: {
    flex: 1,
  },
  heroBanner: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 22,
    borderWidth: 0,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 24,
  },
  heroTextContainer: {
    flex: 1,
    zIndex: 2,
  },
  heroTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: Fonts?.regular || "System",
    marginBottom: 16,
    lineHeight: 18,
    maxWidth: "85%",
  },
  heroButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
  },
  heroArt: {
    position: "absolute",
    right: 12,
    bottom: -8,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
  },
  filterPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterPillText: {
    fontFamily: Fonts?.regular || "System",
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginBottom: 24,
  },
  quickCard: {
    width: "48%", // Forces 2 boxes per row
    borderRadius: 20,
    borderWidth: 0,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    // elevation: 2,
    flexDirection:"row",
    gap: 6,
  },
  quickIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 10,
  },
  quickCardText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    textAlign: "center",
  },
  overviewCard: {
    borderRadius: 24,
    borderWidth: 0,
    padding: 22,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 2,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  statLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
  },
  statSub: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 2,
  },
  statValue: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
  },
  progressTrack: {
    width: "100%",
    height: 50,
    borderRadius: 18,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 18,
  },
});
