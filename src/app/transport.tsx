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
import { fetchTransportInfo } from "@/store/slices/transportSlice";

export default function TransportScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: transport,
    status,
    error,
  } = useAppSelector((state) => state.transport);

  const loadData = async () => {
    await dispatch(
      fetchTransportInfo({
        endpoint: `${api_url}/transport`,
        token,
      }),
    );
  };

  useEffect(() => {
    loadData();
  }, [dispatch, token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCall = (phoneNumber: string | null) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.3, 0.7]}
        style={StyleSheet.absoluteFill}
      /> */}

      <View style={styles.safeArea}>
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
            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontSize: colors.font28 },
                  ]}
                >
                  School Transport
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Bus routes and crew assignment
                </Text>
              </View>

              <View
                style={[
                  styles.activeBadge,
                  {
                    backgroundColor: isDark
                      ? "rgba(16, 185, 129, 0.15)"
                      : "#DCFCE7",
                    borderColor: "rgba(16, 185, 129, 0.3)",
                  },
                ]}
              >
                <View style={styles.pulseDot} />
                <Text style={styles.activeBadgeText}>Active Service</Text>
              </View>
            </View>

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to fetch transport information."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : !transport ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="bus-alert"
                  size={46}
                  color={colors.subtext}
                />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No transport service registered
                </Text>
              </View>
            ) : (
              <View
                style={[styles.mainLayout, isTablet && styles.tabletMainLayout]}
              >
                {/* Column 1 (Left on Tablet): Vehicle & Route Overview */}
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
                    Assigned Vehicle
                  </Text>

                  <View
                    style={[
                      styles.vehicleCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.borderL,
                        shadowColor: colors.shadowClr,
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={
                        isDark ? ["#312E81", "#1E1B4B"] : ["#EEF2FF", "#E0E7FF"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.vehicleHeaderBanner}
                    >
                      <View style={styles.vehicleNumberWrap}>
                        <MaterialCommunityIcons
                          name="bus-school"
                          size={28}
                          color={colors.tint}
                        />
                        <View>
                          <Text
                            style={[
                              styles.vehicleNumber,
                              {
                                color: isDark ? "#FFFFFF" : "#1E1B4B",
                                fontSize: colors.font20,
                              },
                            ]}
                          >
                            {transport.vehicle_number}
                          </Text>
                          <Text
                            style={[
                              styles.routeText,
                              {
                                color: isDark ? "#C7D2FE" : "#4338CA",
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            {transport.route_name}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>

                    <View style={[styles.cardBody, { padding: colors.pad }]}>
                      <View style={styles.routeTimeline}>
                        <View style={styles.timelineItem}>
                          <View
                            style={[
                              styles.timelineDot,
                              { backgroundColor: "#10B981" },
                            ]}
                          />
                          <View style={styles.timelineContent}>
                            <Text
                              style={[
                                styles.timelineTitle,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font12,
                                },
                              ]}
                            >
                              Pickup Location
                            </Text>
                            <Text
                              style={[
                                styles.timelineValue,
                                { color: colors.text, fontSize: colors.font16 },
                              ]}
                            >
                              {transport.pickup_location}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.timelineLine,
                            { backgroundColor: colors.borderL },
                          ]}
                        />

                        <View style={styles.timelineItem}>
                          <View
                            style={[
                              styles.timelineDot,
                              { backgroundColor: colors.tint },
                            ]}
                          />
                          <View style={styles.timelineContent}>
                            <Text
                              style={[
                                styles.timelineTitle,
                                {
                                  color: colors.subtext,
                                  fontSize: colors.font12,
                                },
                              ]}
                            >
                              Destination
                            </Text>
                            <Text
                              style={[
                                styles.timelineValue,
                                { color: colors.text, fontSize: colors.font16 },
                              ]}
                            >
                              School Campus
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Fee Box */}
                      <View
                        style={[
                          styles.feeBox,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F8FAFC",
                            borderColor: colors.borderL,
                          },
                        ]}
                      >
                        <View>
                          <Text
                            style={[
                              styles.feeLabel,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            Monthly Subscription Fee
                          </Text>
                          <Text
                            style={[
                              styles.feeAmount,
                              { color: colors.text, fontSize: colors.font22 },
                            ]}
                          >
                            ₹{transport.monthly_fee}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.feeChip,
                            {
                              backgroundColor: isDark
                                ? "rgba(99, 102, 241, 0.15)"
                                : "#EEF2FF",
                            },
                          ]}
                        >
                          <Text
                            style={[styles.feeChipText, { color: colors.tint }]}
                          >
                            Per Month
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Column 2 (Right on Tablet): Support Crew / Contacts */}
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
                    Transit Crew
                  </Text>

                  <View style={styles.crewList}>
                    {/* Driver Card */}
                    <View
                      style={[
                        styles.crewCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                    >
                      <View style={styles.crewHeader}>
                        <View
                          style={[
                            styles.crewAvatar,
                            {
                              backgroundColor: isDark
                                ? "rgba(99, 102, 241, 0.15)"
                                : "#EEF2FF",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="steering"
                            size={22}
                            color={colors.tint}
                          />
                        </View>
                        <View style={styles.crewInfo}>
                          <Text
                            style={[
                              styles.crewName,
                              { color: colors.text, fontSize: colors.font16 },
                            ]}
                          >
                            {transport.driver_name}
                          </Text>
                          <Text
                            style={[
                              styles.crewRole,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            Designated Driver
                          </Text>
                        </View>
                      </View>

                      {transport.driver_number ? (
                        <TouchableOpacity
                          style={[
                            styles.callBtn,
                            { backgroundColor: colors.tint },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => handleCall(transport.driver_number)}
                        >
                          <Feather
                            name="phone-call"
                            size={15}
                            color="#FFFFFF"
                          />
                          <Text style={styles.callBtnText}>
                            Call {transport.driver_number}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={[
                            styles.disabledCall,
                            {
                              backgroundColor: isDark
                                ? colors.borderL
                                : "#F1F5F9",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.disabledCallText,
                              { color: colors.subtext },
                            ]}
                          >
                            No contact provided
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Helper Card */}
                    <View
                      style={[
                        styles.crewCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.borderL,
                          shadowColor: colors.shadowClr,
                        },
                      ]}
                    >
                      <View style={styles.crewHeader}>
                        <View
                          style={[
                            styles.crewAvatar,
                            {
                              backgroundColor: isDark
                                ? "rgba(16, 185, 129, 0.15)"
                                : "#ECFDF5",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="account-supervisor-circle"
                            size={22}
                            color="#10B981"
                          />
                        </View>
                        <View style={styles.crewInfo}>
                          <Text
                            style={[
                              styles.crewName,
                              { color: colors.text, fontSize: colors.font16 },
                            ]}
                          >
                            {transport.helper_name || "No Assistant Assigned"}
                          </Text>
                          <Text
                            style={[
                              styles.crewRole,
                              {
                                color: colors.subtext,
                                fontSize: colors.font12,
                              },
                            ]}
                          >
                            Bus Attendant / Helper
                          </Text>
                        </View>
                      </View>

                      {transport.helper_number ? (
                        <TouchableOpacity
                          style={[
                            styles.callBtn,
                            {
                              backgroundColor: isDark
                                ? "rgba(16, 185, 129, 0.2)"
                                : "#DCFCE7",
                            },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => handleCall(transport.helper_number)}
                        >
                          <Ionicons name="call" size={15} color="#10B981" />
                          <Text
                            style={[styles.callBtnText, { color: "#10B981" }]}
                          >
                            Call {transport.helper_number}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={[
                            styles.disabledCall,
                            {
                              backgroundColor: isDark
                                ? colors.borderL
                                : "#F1F5F9",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.disabledCallText,
                              { color: colors.subtext },
                            ]}
                          >
                            Contact unavailable
                          </Text>
                        </View>
                      )}
                    </View>
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
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 0,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  activeBadgeText: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Fonts?.semibold || "System",
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
    padding: 36,
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
    flex: 1.2,
  },
  rightColumn: {
    width: "100%",
  },
  tabletRightColumn: {
    flex: 1,
  },
  vehicleCard: {
    borderRadius: 24,
    borderWidth: 0,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    // elevation: 2,
  },
  vehicleHeaderBanner: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  vehicleNumberWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  vehicleNumber: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  routeText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginTop: 2,
  },
  cardBody: {},
  routeTimeline: {
    position: "relative",
    marginBottom: 20,
    paddingLeft: 6,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    height: 24,
    marginLeft: 5,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontFamily: Fonts?.regular || "System",
  },
  timelineValue: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginTop: 2,
  },
  feeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 0,
  },
  feeLabel: {
    fontFamily: Fonts?.regular || "System",
  },
  feeAmount: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "800",
    marginTop: 2,
  },
  feeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  feeChipText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Fonts?.semibold || "System",
  },
  crewList: {
    gap: 14,
  },
  crewCard: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    // elevation: 1,
  },
  crewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  crewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 2,
  },
  crewRole: {
    fontFamily: Fonts?.regular || "System",
  },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  callBtnText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    fontSize: 13,
  },
  disabledCall: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledCallText: {
    fontSize: 12,
    fontFamily: Fonts?.regular || "System",
  },
});
