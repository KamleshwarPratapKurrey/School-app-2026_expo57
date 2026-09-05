import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

import { api_url } from "@/components/common/ApiUrls";
import { showInfoToast } from "@/components/common/Toast/ToastService";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

export default function UpdatePasswordScreen() {
  const { colors, theme } = useTheme();
  const { token } = useUser();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const isDark = theme === "dark";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      //   Alert.alert("Required", "Please enter your new password.");
      showInfoToast("Required", "Please enter your new password.");
      return;
    } else if (newPassword.length < 6) {
      //   Alert.alert("Invalid", "Password must be at least 6 characters long.");
      showInfoToast("Invalid", "Password must be at least 6 characters long.");
      return;
    } else if (newPassword !== confirmPassword) {
      //   Alert.alert("Mismatch", "New password and confirmation do not match.");
      showInfoToast("Mismatch", "New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("new_password", newPassword.trim());

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${api_url}/update-password`, {
        method: "POST",
        headers,
        body: formData,
      });

      const resData = await response.json();
    //   console.log("upd pwd-resData->", resData);
      if (!response.ok || !resData.status) {
        Alert.alert("Error", resData.message || "Failed to update password.");
        return;
      }

      Alert.alert(
        "Success",
        resData.message || "Password updated successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setNewPassword("");
              setConfirmPassword("");
              router.back();
            },
          },
        ],
      );
    } catch (err: any) {
      Alert.alert("Network Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#1a103c", "#0f0c20", colors.background]
            : ["#E0E7FF", "#F1F5F9", colors.background]
        }
        locations={[0, 0.35, 0.7]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        // Android needs an explicit behavior too; leaving this undefined
        // prevents the available height from shrinking with the keyboard.
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
        // This screen is rendered below the native stack header, so no
        // additional offset is needed here.
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.tabletScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Pressable
            onPress={Keyboard.dismiss}
            style={styles.keyboardPressableWrapper}
          >
            <View
              style={[
                styles.innerWrapper,
                isTablet && styles.tabletInnerWrapper,
              ]}
            >
              <View style={styles.header}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.borderL,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shield-key-outline"
                    size={28}
                    color={colors.tint}
                  />
                </View>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: colors.text, fontSize: colors.font24 },
                  ]}
                >
                  Change Password
                </Text>
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: colors.subtext, fontSize: colors.font13 },
                  ]}
                >
                  Enter and confirm your new secure credentials
                </Text>
              </View>

              <View
                style={[
                  styles.formCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderL,
                    shadowColor: colors.shadowClr,
                  },
                ]}
              >
                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.text, fontSize: colors.font14 },
                    ]}
                  >
                    New Password <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: isDark ? colors.borderL : "#F8FAFC",
                        borderColor: colors.borderL,
                      },
                    ]}
                  >
                    <Feather name="lock" size={18} color={colors.subtext} />
                    <TextInput
                      style={[styles.textInput, { color: colors.text }]}
                      placeholder="Enter new password"
                      placeholderTextColor={colors.subtext}
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword((prev) => !prev)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={
                          showNewPassword ? "eye-off-outline" : "eye-outline"
                        }
                        size={18}
                        color={colors.subtext}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.text, fontSize: colors.font14 },
                    ]}
                  >
                    Confirm New Password{" "}
                    <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: isDark ? colors.borderL : "#F8FAFC",
                        borderColor: colors.borderL,
                      },
                    ]}
                  >
                    <Feather
                      name="check-circle"
                      size={18}
                      color={colors.subtext}
                    />
                    <TextInput
                      style={[styles.textInput, { color: colors.text }]}
                      placeholder="Re-enter new password"
                      placeholderTextColor={colors.subtext}
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={18}
                        color={colors.subtext}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
                  activeOpacity={0.85}
                  onPress={handleUpdatePassword}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#6366F1", "#4F46E5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submitGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Feather name="check" size={18} color="#FFFFFF" />
                        <Text style={styles.submitButtonText}>
                          Update Password
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    // justifyContent: "center",
  },
  tabletScrollContent: {
    alignItems: "center",
  },
  keyboardPressableWrapper: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  innerWrapper: {
    width: "100%",
  },
  tabletInnerWrapper: {
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: Fonts?.heavy || "System",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: Fonts?.regular || "System",
    marginTop: 4,
    textAlign: "center",
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 0,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 0,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 0,
    paddingHorizontal: 14,
    height: 50,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts?.regular || "System",
    fontSize: 14,
  },
  submitButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: Fonts?.semibold || "System",
    fontWeight: "700",
    fontSize: 15,
  },
});
