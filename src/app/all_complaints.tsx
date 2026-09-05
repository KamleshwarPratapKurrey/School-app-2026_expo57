import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { fetchAllComplaints } from "@/store/slices/comlaintSlice";
import { ComplaintListItem } from "@/types/complaint";

export default function AllComplaintsScreen() {
  const { colors, theme } = useTheme();
  const { token, user } = useUser();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { allComplaints, listStatus, listError } = useAppSelector(
    (state) => state.complaint,
  );

  const loadData = async () => {
    await dispatch(
      fetchAllComplaints({
        endpoint: `${api_url}/complaints`,
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

  const filteredComplaints = useMemo(() => {
    if (!searchQuery.trim()) return allComplaints;
    const q = searchQuery.toLowerCase();
    return allComplaints.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.student.toLowerCase().includes(q) ||
        c.teacher.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [allComplaints, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {user?.role !== "Student" && (
        <Stack.Screen
          options={{
            headerRight: () => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.newBtn}
                  onPress={() => router.push("/register_complaint" as any)}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.newBtnGradient}
                  >
                    <Feather name="plus" size={16} color="#FFFFFF" />
                    <Text style={styles.newBtnText}>New</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            },
          }}
        />
      )}
      {/* <LinearGradient
        colors={
          isDark
            ? ["#2d0d12", "#19080b", colors.background]
            : ["#FFE4E6", "#FFF1F2", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      /> */}

      <View style={styles.safeArea}>
        {/* Search Input */}
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
            placeholder="Search student, title, or teacher..."
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
              tintColor="#EF4444"
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
                  Incident Log
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  All registered student disciplinary & academic notices
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.newBtn}
                onPress={() => router.push("/register_complaint" as any)}
              >
                <LinearGradient
                  colors={["#EF4444", "#DC2626"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.newBtnGradient}
                >
                  <Feather name="plus" size={16} color="#FFFFFF" />
                  <Text style={styles.newBtnText}>New</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View> */}

            {/* Status Views */}
            {listStatus === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#EF4444" />
              </View>
            ) : listStatus === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {listError || "Unable to retrieve incidents log."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredComplaints.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={52}
                  color="#10B981"
                />
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.text, fontSize: colors.font16 },
                  ]}
                >
                  {searchQuery
                    ? "No records match search"
                    : "No active complaints"}
                </Text>
                <Text style={[styles.emptySub, { color: colors.subtext }]}>
                  All student incident logs are clear.
                </Text>
              </View>
            ) : (
              /* Adaptive Complaints Grid */
              <View
                style={[
                  styles.complaintsGrid,
                  isTablet && styles.tabletComplaintsGrid,
                ]}
              >
                {filteredComplaints.map((item: ComplaintListItem) => (
                  <View
                    key={item.id}
                    style={[
                      styles.complaintCard,
                      isTablet && styles.tabletComplaintCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.borderL,
                        shadowColor: colors.shadowClr,
                      },
                    ]}
                  >
                    {/* Top Row: Student & Date */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.studentBadge}>
                        <MaterialCommunityIcons
                          name="account-outline"
                          size={15}
                          color="#EF4444"
                        />
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.studentBadgeText,
                            { color: "#EF4444" },
                          ]}
                        >
                          {item.student}
                        </Text>
                      </View>

                      <View style={styles.dateWrap}>
                        <Feather
                          name="calendar"
                          size={12}
                          color={colors.subtext}
                        />
                        <Text
                          style={[
                            styles.dateText,
                            { color: colors.subtext, fontSize: colors.font12 },
                          ]}
                        >
                          {item.date}
                        </Text>
                      </View>
                    </View>

                    {/* Title */}
                    <Text
                      style={[
                        styles.complaintTitle,
                        { color: colors.text, fontSize: colors.font16 },
                      ]}
                    >
                      {item.title}
                    </Text>

                    {/* Description */}
                    <Text
                      style={[
                        styles.complaintDesc,
                        { color: colors.subtext, fontSize: colors.font13 },
                      ]}
                    >
                      {item.description}
                    </Text>

                    {/* Footer: Issuer tag */}
                    <View
                      style={[
                        styles.cardFooter,
                        { borderTopColor: colors.borderL },
                      ]}
                    >
                      <View style={styles.issuerRow}>
                        <MaterialCommunityIcons
                          name="badge-account-horizontal-outline"
                          size={16}
                          color={colors.subtext}
                        />
                        <Text
                          style={[
                            styles.issuerText,
                            { color: colors.subtext, fontSize: colors.font12 },
                          ]}
                        >
                          Reported by:{" "}
                          <Text
                            style={{ color: colors.text, fontWeight: "600" }}
                          >
                            {item.teacher}
                          </Text>
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.caseIdBadge,
                          {
                            backgroundColor: isDark
                              ? colors.borderL
                              : "#F1F5F9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.caseIdText,
                            { color: colors.subtext, fontSize: colors.font12 },
                          ]}
                        >
                          #{item.id}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
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
  newBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  newBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  newBtnText: {
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
  complaintsGrid: {
    flexDirection: "column",
    gap: 14,
  },
  tabletComplaintsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  complaintCard: {
    borderRadius: 20,
    borderWidth: 0,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0,
  },
  tabletComplaintCard: {
    width: "48.8%",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  studentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    maxWidth: "65%",
  },
  studentBadgeText: {
    fontFamily: Fonts?.semibold || "System",
    fontSize: 12,
    fontWeight: "700",
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontFamily: Fonts?.regular || "System",
  },
  complaintTitle: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 6,
  },
  complaintDesc: {
    fontFamily: Fonts?.regular || "System",
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  issuerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  issuerText: {
    fontFamily: Fonts?.regular || "System",
  },
  caseIdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  caseIdText: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
  },
});
