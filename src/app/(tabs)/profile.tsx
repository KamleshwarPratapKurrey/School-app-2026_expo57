import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useAppSelector } from "@/store/hooks";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout, loading } = useUser();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isTablet = width >= 768;
  const isDark = theme === "dark";

  const { unreadCount, data: notices } = useAppSelector(
    (state) => state.notices,
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.tint} />
      </SafeAreaView>
    );
  }

  const userData = (user as any) || {};
  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "GU";

  // const unreadNotificationsCount = 3;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Dynamic Ambient Background Gradient */}
      <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            isTablet && styles.tabletScrollContainer,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header */}
          <View style={[styles.topHeader, isTablet && styles.tabletTopHeader]}>
            <View>
              <Text
                style={[
                  styles.screenTitle,
                  {
                    color: colors.text,
                    fontSize: colors.font28,
                  },
                ]}
              >
                Profile
              </Text>
              <Text style={[styles.screenSubtitle, { color: colors.subtext }]}>
                Account & Preferences
              </Text>
            </View>

            {/* <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.borderL,
                  shadowColor: colors.shadowClr,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => console.log("Open notifications")}
            >
              <FontAwesome5 name="bell" size={19} color={colors.text} />
              {unreadNotificationsCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeCount}>
                    {unreadNotificationsCount > 9
                      ? "9+"
                      : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.iconButton,
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

          {/* Responsive Layout Grid */}
          <View
            style={[
              styles.contentLayout,
              isTablet && styles.tabletContentLayout,
            ]}
          >
            {/* User Profile Card */}
            <View
              style={[
                styles.userCardWrapper,
                isTablet && styles.tabletUserCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.borderL,
                  shadowColor: colors.shadowClr,
                },
              ]}
            >
              {/* Card Banner Background Gradient */}
              <LinearGradient
                colors={
                  isDark ? ["#2c2a77", "#1b1845"] : ["#cecff5", "#e7e7ff"]
                }
                // start={{ x: 1, y: 0 }}
                // end={{ x: 1, y: 1 }}
                // start={{ x: 0, y: 0 }}
                // end={{ x: 1, y: 1 }}
                // style={styles.cardCoverGradient}
                locations={[0, 0.35, 0.7]}
                style={[StyleSheet.absoluteFill]}
              />

              <View style={[styles.userCardContent, { padding: colors.pad }]}>
                <View style={styles.avatarGlowContainer}>
                  <LinearGradient
                    colors={["#6366F1", "#A855F7", "#EC4899"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarBorderGradient}
                  >
                    {userData.avatar ? (
                      <Image
                        source={{ uri: userData.avatar }}
                        style={styles.avatar}
                      />
                    ) : (
                      <View
                        style={[
                          styles.avatarPlaceholder,
                          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.avatarText,
                            {
                              color: colors.tint,
                              fontSize: colors.font28,
                            },
                          ]}
                        >
                          {initials}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                  <View style={styles.onlineBadge} />
                </View>

                <Text
                  style={[
                    styles.userName,
                    {
                      color: colors.text,
                      fontSize: colors.font22,
                    },
                  ]}
                >
                  {userData.name || "Guest User"}
                </Text>
                <Text
                  style={[
                    styles.userEmail,
                    {
                      color: colors.subtext,
                      fontSize: colors.font14,
                    },
                  ]}
                >
                  {userData.email || "No email linked"}
                </Text>

                {/* Gradient Role Badge */}
                <LinearGradient
                  colors={
                    isDark
                      ? ["rgba(99, 102, 241, 0.25)", "rgba(168, 85, 247, 0.25)"]
                      : ["#EEF2FF", "#F3E8FF"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.roleBadge,
                    {
                      borderColor: isDark
                        ? "rgba(168, 85, 247, 0.3)"
                        : "#E0E7FF",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={15}
                    color={colors.tint}
                  />
                  <Text
                    style={[
                      styles.roleBadgeText,
                      {
                        color: colors.tint,
                        fontSize: colors.font12,
                      },
                    ]}
                  >
                    {userData.role || "Member"}
                  </Text>
                </LinearGradient>
              </View>
            </View>

            {/* Settings & Action Controls */}
            <View
              style={[
                styles.settingsColumn,
                isTablet && styles.tabletSettingsColumn,
              ]}
            >
              {/* Preferences Section */}
              <View style={styles.sectionGroup}>
                <Text
                  style={[
                    styles.sectionHeader,
                    {
                      color: colors.subtext,
                      fontSize: colors.font13,
                    },
                  ]}
                >
                  Preferences
                </Text>
                <View
                  style={[
                    styles.cardGroup,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                      shadowColor: colors.shadowClr,
                    },
                  ]}
                >
                  <View style={styles.rowItem}>
                    <View style={styles.rowLeftContent}>
                      <LinearGradient
                        colors={["#6366F1", "#4F46E5"]}
                        style={styles.iconWrapper}
                      >
                        <Ionicons
                          name={isDark ? "moon" : "sunny"}
                          size={18}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View style={styles.rowInfo}>
                        <Text
                          style={[
                            styles.rowTitle,
                            {
                              color: colors.text,
                              fontSize: colors.font16,
                            },
                          ]}
                        >
                          Dark Mode
                        </Text>
                        <Text
                          style={[
                            styles.rowSubtitle,
                            {
                              color: colors.subtext,
                              fontSize: colors.font13,
                            },
                          ]}
                        >
                          {isDark ? "Dark theme active" : "Light theme active"}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={isDark}
                      onValueChange={toggleTheme}
                      trackColor={{ false: "#D1D5DB", true: colors.tint }}
                      thumbColor={colors.btnclr}
                    />
                  </View>
                </View>
              </View>

              {/* Account Section */}
              <View style={styles.sectionGroup}>
                <Text
                  style={[
                    styles.sectionHeader,
                    {
                      color: colors.subtext,
                      fontSize: colors.font13,
                    },
                  ]}
                >
                  Account
                </Text>
                <View
                  style={[
                    styles.cardGroup,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                      shadowColor: colors.shadowClr,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.rowItem,
                      styles.separator,
                      { borderBottomColor: colors.borderL },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rowLeftContent}>
                      <LinearGradient
                        colors={["#06B6D4", "#0EA5E9"]}
                        style={styles.iconWrapper}
                      >
                        <Ionicons name="person" size={17} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={styles.rowInfo}>
                        <Text
                          style={[
                            styles.rowTitle,
                            {
                              color: colors.text,
                              fontSize: colors.font16,
                            },
                          ]}
                        >
                          Edit Profile
                        </Text>
                        <Text
                          style={[
                            styles.rowSubtitle,
                            {
                              color: colors.subtext,
                              fontSize: colors.font13,
                            },
                          ]}
                        >
                          Personal info and details
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.icon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rowItem}
                    activeOpacity={0.7}
                    onPress={() => router.push("/notices")}
                  >
                    <View style={styles.rowLeftContent}>
                      <LinearGradient
                        colors={["#EC4899", "#D946EF"]}
                        style={styles.iconWrapper}
                      >
                        <Ionicons
                          name="notifications"
                          size={17}
                          color="#FFFFFF"
                        />
                      </LinearGradient>
                      <View style={styles.rowInfo}>
                        <Text
                          style={[
                            styles.rowTitle,
                            {
                              color: colors.text,
                              fontSize: colors.font16,
                            },
                          ]}
                        >
                          Notifications
                        </Text>
                        <Text
                          style={[
                            styles.rowSubtitle,
                            {
                              color: colors.subtext,
                              fontSize: colors.font13,
                            },
                          ]}
                        >
                          Push alerts & preferences
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Logout Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={logout}
                style={styles.logoutWrapper}
              >
                <LinearGradient
                  colors={
                    isDark ? ["#d9737333", "#d25e5e33"] : ["#FEF2F2", "#FEE2E2"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.logoutGradient,
                    {
                      borderColor: isDark ? "#ef44444d" : "#fecaca",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    color="#EF4444"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={[
                      styles.logoutText,
                      {
                        fontSize: colors.font16,
                      },
                    ]}
                  >
                    Log Out
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
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
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  tabletScrollContainer: {
    padding: 32,
    alignItems: "center",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  tabletTopHeader: {
    width: "100%",
    maxWidth: 960,
  },
  screenTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    fontFamily: Fonts?.regular || "System",
    fontSize: 13,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // elevation: 2,
  },
  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeCount: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: Fonts?.semibold || "System",
  },
  contentLayout: {
    width: "100%",
    flexDirection: "column",
    gap: 16,
  },
  tabletContentLayout: {
    flexDirection: "row",
    maxWidth: 960,
    gap: 24,
    alignItems: "flex-start",
  },
  userCardWrapper: {
    borderRadius: 24,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    // elevation: 2,
  },
  tabletUserCard: {
    flex: 1,
  },
  cardCoverGradient: {
    height: 72,
    width: "100%",
  },
  userCardContent: {
    alignItems: "center",
    // marginTop: -42,
  },
  avatarGlowContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatarBorderGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10B981",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "center",
  },
  userEmail: {
    fontFamily: Fonts?.regular || "System",
    textAlign: "center",
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 0,
  },
  roleBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  settingsColumn: {
    width: "100%",
    gap: 16,
  },
  tabletSettingsColumn: {
    flex: 1.8,
  },
  sectionGroup: {
    gap: 6,
  },
  sectionHeader: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 6,
  },
  cardGroup: {
    borderRadius: 20,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 1,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginBottom: 2,
  },
  rowSubtitle: {
    fontFamily: Fonts?.regular || "System",
  },
  logoutWrapper: {
    marginTop: 4,
    borderRadius: 18,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#EF4444",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
  },
});
