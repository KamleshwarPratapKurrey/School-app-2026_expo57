import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { fetchSubjects } from "@/store/slices/subjectSlice";

export default function SubjectsScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");

  const {
    data: subjects,
    status,
    error,
  } = useAppSelector((state) => state.subjects);

  const loadData = async () => {
    await dispatch(
      fetchSubjects({
        endpoint: `${api_url}/subjects`,
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

  const tabs = ["All", "Main", "Additional", "Activity"];

  const filteredSubjects =
    activeTab === "All"
      ? subjects
      : subjects.filter(
          (sub) => sub.sub_type.toLowerCase() === activeTab.toLowerCase(),
        );

  const getTypeTheme = (type: string) => {
    switch (type.toLowerCase()) {
      case "main":
        return {
          icon: "book-open-page-variant",
          color: "#6366F1",
          bg: isDark ? "rgba(99, 102, 241, 0.15)" : "#EEF2FF",
        };
      case "additional":
        // case "add":
        return {
          icon: "bookmark-plus-outline",
          color: "#EC4899",
          bg: isDark ? "rgba(236, 72, 153, 0.15)" : "#FDF2F8",
        };
      case "activity":
        return {
          icon: "palette-outline",
          color: "#10B981",
          bg: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
        };
      default:
        return {
          icon: "school-outline",
          color: colors.tint,
          bg: isDark ? colors.borderL : "#F1F5F9",
        };
    }
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
                  Subjects & Modules
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Curriculum courses and elective track
                </Text>
              </View>

              <View
                style={[
                  styles.badgeWrap,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="bookshelf"
                  size={18}
                  color={colors.tint}
                />
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {subjects.length} Courses
                </Text>
              </View>
            </View>

            {status === StatusCode.LOADING && !refreshing ? (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
              </View>
            ) : status === StatusCode.FAILED ? (
              <View style={styles.centerContainer}>
                <Text style={{ color: "#EF4444", marginBottom: 12 }}>
                  {error || "Unable to retrieve course list."}
                </Text>
                <TouchableOpacity
                  onPress={loadData}
                  style={[styles.retryBtn, { backgroundColor: colors.tint }]}
                >
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : subjects.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: colors.card, borderColor: colors.borderL },
                ]}
              >
                <MaterialCommunityIcons
                  name="book-remove-outline"
                  size={46}
                  color={colors.subtext}
                />
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  No course subjects enrolled
                </Text>
              </View>
            ) : (
              <>
                {/* Filter Pills */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScroll}
                >
                  {tabs.map((tab) => {
                    const isSelected = activeTab === tab;
                    return (
                      <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        activeOpacity={0.7}
                        style={[
                          styles.tabBtn,
                          {
                            backgroundColor: isSelected
                              ? colors.tint
                              : colors.card,
                            borderColor: isSelected
                              ? colors.tint
                              : colors.borderL,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tabText,
                            {
                              color: isSelected ? "#FFFFFF" : colors.text,
                              fontFamily: isSelected
                                ? Fonts?.semibold || "System"
                                : Fonts?.regular || "System",
                            },
                          ]}
                        >
                          {tab}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* Adaptive Grid Layout */}
                <View
                  style={[
                    styles.subjectGrid,
                    isTablet && styles.tabletSubjectGrid,
                  ]}
                >
                  {filteredSubjects.map((item) => {
                    const config = getTypeTheme(item.sub_type);
                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.subjectCard,
                          isTablet && styles.tabletSubjectCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.borderL,
                            shadowColor: colors.shadowClr,
                          },
                        ]}
                      >
                        <View style={styles.cardHeaderRow}>
                          <View
                            style={[
                              styles.iconWrap,
                              { backgroundColor: config.bg },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={config.icon as any}
                              size={22}
                              color={config.color}
                            />
                          </View>

                          <View
                            style={[
                              styles.typeChip,
                              {
                                backgroundColor: isDark
                                  ? colors.borderL
                                  : "#F1F5F9",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.typeChipText,
                                { color: colors.subtext },
                              ]}
                            >
                              {item.sub_type}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={[
                            styles.subjectName,
                            { color: colors.text, fontSize: colors.font18 },
                          ]}
                        >
                          {item.subject}
                        </Text>

                        {/* <View
                          style={[
                            styles.cardFooter,
                            { borderTopColor: colors.borderL },
                          ]}
                        >
                          <Text
                            style={[
                              styles.codeText,
                              { color: colors.subtext, fontSize: colors.font12 },
                            ]}
                          >
                            ID #{item.id}
                          </Text>
                          <Feather
                            name="chevron-right"
                            size={16}
                            color={colors.icon}
                          />
                        </View> */}
                      </View>
                    );
                  })}
                </View>
              </>
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
  badgeWrap: {
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
  badgeText: {
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
  filterScroll: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0,
  },
  tabText: {
    fontSize: 13,
  },
  subjectGrid: {
    flexDirection: "column",
    gap: 12,
  },
  tabletSubjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  subjectCard: {
    borderRadius: 22,
    borderWidth: 0,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    // elevation: 0,
  },
  tabletSubjectCard: {
    width: "48.8%",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: Fonts?.semibold || "System",
  },
  subjectName: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 12,
  },
  codeText: {
    fontFamily: Fonts?.regular || "System",
  },
});
