import {
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api_url } from "@/components/common/ApiUrls";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkUnreadNotices, fetchNotices } from "@/store/slices/noticeSlice";
import { fetchSchoolInfo } from "@/store/slices/school_info_slice";

export default function TeacherDashboardScreen() {
  const { colors, theme } = useTheme();
  const { user, token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isTablet = width >= 768;
  const isDark = theme === "dark";

  const { school_info } = useAppSelector((state) => state.school_info);
  const { unreadCount } = useAppSelector((state) => state.notices);

  useEffect(() => {
    dispatch(
      fetchSchoolInfo({
        endpoint: `${api_url}/school-info`,
        token,
      }),
    );

    const initNotices = async () => {
      const res = await dispatch(
        fetchNotices({
          endpoint: `${api_url}/notices`,
          token,
        }),
      );

      if (fetchNotices.fulfilled.match(res)) {
        dispatch(checkUnreadNotices(res.payload.length));
      }
    };

    initNotices();
  }, [dispatch, token]);

  const teacherQuickLinks = [
    {
      id: "complaints",
      title: "Complaints",
      icon: "calendar-clock",
      color: "#06B6D4",
      bgColor: isDark ? "rgba(6, 182, 212, 0.15)" : "#ECFEFF",
      url: "/complaints",
    },
    // {
    //   id: "attendance",
    //   title: "Mark Attendance",
    //   icon: "clipboard-check-outline",
    //   color: "#10B981",
    //   bgColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
    //   url: "/attendance",
    // },
    {
      id: "notices",
      title: "Notices",
      icon: "bullhorn-outline",
      color: "#EC4899",
      bgColor: isDark ? "rgba(236, 72, 153, 0.15)" : "#FDF2F8",
      url: "/notices",
    },
    // {
    //   id: "subjects",
    //   title: "Assigned Classes",
    //   icon: "bookshelf",
    //   color: "#8B5CF6",
    //   bgColor: isDark ? "rgba(139, 92, 246, 0.15)" : "#F5F3FF",
    //   url: "/subjects",
    // },
    {
      id: "students",
      title: "Students",
      icon: "account-group-outline",
      color: "#3B82F6",
      bgColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
      url: "/students",
    },
    // {
    //   id: "transport",
    //   title: "Transport Route",
    //   icon: "bus-school",
    //   color: "#F59E0B",
    //   bgColor: isDark ? "rgba(245, 158, 11, 0.15)" : "#FFFBEB",
    //   url: "/transport",
    // },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#06232d", "#08131d", colors.background]
            : ["#CFFAFE", "#F0FDFA", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
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
                    source={{
                      uri: "https://scontent.fbho3-6.fna.fbcdn.net/v/t39.30808-6/294146202_433930778750384_5455115691759611655_n.jpg?stp=dst-jpg_tt6&cstp=mx888x888&ctp=s888x888&_nc_cat=111&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=u6EaUMHgvPwQ7kNvwHAzzNB&_nc_oc=Adr80nMTO1qb5RrNNOYKcX-eMdxxYazAL-umBPntBG_AHdoalUvFE4_cY-6MobcjnPo&_nc_zt=23&_nc_ht=scontent.fbho3-6.fna&_nc_gid=r48pI3k4P-JO6CwHT4y_8Q&_nc_ss=7b289&oh=00_AQIZs7SxSKxHBsuDrB5V0AEj1fAJFOqaG578HPSSU2kd5g&oe=6A9DDE9D",
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatarFallback,
                      { backgroundColor: "#06B6D420" },
                    ]}
                  >
                    <Text style={[styles.avatarText, { color: "#06B6D4" }]}>
                      {user?.name ? user.name[0] : "T"}
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
                    Welcome, {user?.name || "Teacher"}
                  </Text>
                  <Text
                    style={[
                      styles.schoolSubtitle,
                      { color: colors.subtext, fontSize: colors.font12 },
                    ]}
                  >
                    {school_info?.name || "Faculty Portal"}
                  </Text>
                </View>
              </View>

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

            {/* Hero Banner: Emerald/Teal Horizon Gradient */}
            <LinearGradient
              colors={
                isDark
                  ? ["#064e3b", "#0f766e", "#042f2e"]
                  : ["#0d9488", "#059669", "#047857"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBanner}
            >
              <View style={styles.heroTextContainer}>
                <View style={styles.facultyBadge}>
                  <Feather name="award" size={13} color="#A7F3D0" />
                  <Text style={styles.facultyBadgeText}>FACULTY DESK</Text>
                </View>
                <Text style={[styles.heroTitle, { fontSize: colors.font22 }]}>
                  Manage Your Classes
                </Text>
                <Text
                  style={[styles.heroSubtitle, { fontSize: colors.font12 }]}
                >
                  Record student attendance, view assigned subjects, and publish
                  department notices.
                </Text>
                <TouchableOpacity
                  style={styles.heroButton}
                  activeOpacity={0.85}
                  onPress={() => router.push("/notices")}
                >
                  <Text
                    style={[styles.heroButtonText, { fontSize: colors.font13 }]}
                  >
                    View Notice
                  </Text>
                  <Feather name="arrow-right" size={14} color="#065F46" />
                </TouchableOpacity>
              </View>

              <View style={styles.heroArt}>
                <FontAwesome5
                  name="chalkboard-teacher"
                  size={isTablet ? 120 : 96}
                  color="rgba(255, 255, 255, 0.22)"
                />
              </View>
            </LinearGradient>

            {/* Quick Actions Grid */}
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontSize: colors.font16 },
                ]}
              >
                Quick Management
              </Text>
            </View>

            <View
              style={[
                styles.quickAccessGrid,
                isTablet && styles.tabletQuickAccessGrid,
              ]}
            >
              {teacherQuickLinks.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  style={[
                    styles.quickCard,
                    isTablet && styles.tabletQuickCard,
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
                  {/* <View style={styles.cardTextContainer}> */}
                  <View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.quickCardText,
                        { color: colors.text, fontSize: colors.font12 },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  {/* <Feather
                    name="chevron-right"
                    size={16}
                    color={colors.subtext}
                  /> */}
                </TouchableOpacity>
              ))}
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
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
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
    includeFontPadding: false,
    lineHeight: 12,
  },
  heroBanner: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 24,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  heroTextContainer: {
    flex: 1,
    zIndex: 2,
  },
  facultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  facultyBadgeText: {
    color: "#E2E8F0",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    color: "#E0F2FE",
    fontFamily: Fonts?.regular || "System",
    marginBottom: 16,
    lineHeight: 18,
    maxWidth: "88%",
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#065F46",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
  },
  heroArt: {
    position: "absolute",
    right: 8,
    bottom: -10,
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
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
    marginBottom: 24,
  },
  tabletQuickAccessGrid: {
    gap: 16,
    justifyContent: "flex-start",
  },
  quickCard: {
    width: "48%",
    borderRadius: 20,
    borderWidth: 1,
    // paddingVertical: 14,
    // paddingHorizontal: 14,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tabletQuickCard: {
    width: "31.8%",
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTextContainer: {
    flex: 1,
  },
  quickCardText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
  },
});
