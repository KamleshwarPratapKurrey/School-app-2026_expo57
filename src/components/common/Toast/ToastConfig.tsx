import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  BaseToastProps,
  ToastConfig as ToastConfigType,
} from "react-native-toast-message";

const { width } = Dimensions.get("window");

// Define the TSX return type strictly
export const ToastConfig = (isDark: boolean = false): ToastConfigType => {
  // Helper to get text colors based on theme
  const textColor = isDark ? "#d0d3de" : "#4b5563"; // gray-600 equivalent
  const titleColor = isDark ? undefined : "#101010"; // Success/Error/Info handle their own dark colors

  return {
    success: ({ text1, text2 }: BaseToastProps) => (
      <View
        style={[styles.base, isDark ? styles.successDark : styles.lightBorder]}
      >
        <View style={styles.header}>
          <AntDesign
            name="check-circle"
            size={22}
            color={isDark ? "#c0f7ca" : "#90be6d"}
          />
          <Text
            style={[styles.title, { color: isDark ? "#c0f7ca" : titleColor }]}
          >
            {text1}
          </Text>
        </View>
        {text2 && (
          <Text style={[styles.description, { color: textColor }]}>
            {text2}
          </Text>
        )}
      </View>
    ),

    error: ({ text1, text2 }: BaseToastProps) => (
      <View
        style={[styles.base, isDark ? styles.errorDark : styles.lightBorder]}
      >
        <View style={styles.header}>
          <AntDesign
            name="close-circle"
            size={22}
            color={isDark ? "#fda5c4" : "#f07167"}
          />
          <Text
            style={[styles.title, { color: isDark ? "#fda5c4" : titleColor }]}
          >
            {text1}
          </Text>
        </View>
        {text2 && (
          <Text style={[styles.description, { color: textColor }]}>
            {text2}
          </Text>
        )}
      </View>
    ),

    info: ({ text1, text2 }: BaseToastProps) => (
      <View
        style={[styles.base, isDark ? styles.infoDark : styles.lightBorder]}
      >
        <View style={styles.header}>
          <FontAwesome6
            name="circle-info"
            size={22}
            color={isDark ? "#b4c5ff" : "#00afb9"}
          />
          <Text
            style={[styles.title, { color: isDark ? "#b4c5ff" : titleColor }]}
          >
            {text1}
          </Text>
        </View>
        {text2 && (
          <Text style={[styles.description, { color: textColor }]}>
            {text2}
          </Text>
        )}
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    // Standard StyleSheet equivalent of min-width
    minWidth: width > 400 ? 360 : 220,
    borderWidth: 0,
    // Elevation/Shadows
    shadowColor: "#0000007f",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Note: Supported in Expo 54+ (React Native 0.71+)
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    marginTop: 4,
    fontSize: 14,
  },
  // Theme Backgrounds
  lightBorder: {
    backgroundColor: "#efefef",
    borderColor: "#e5e7eb",
  },
  successDark: {
    backgroundColor: "#3a5a40",
    borderColor: "#497351",
  },
  errorDark: {
    backgroundColor: "#370617",
    borderColor: "#6a040f",
  },
  infoDark: {
    backgroundColor: "#023e8a",
    borderColor: "#023eff",
  },
});
