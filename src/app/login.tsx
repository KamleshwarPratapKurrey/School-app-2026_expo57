import { api_url } from "@/components/common/ApiUrls";
import { showErrorToast } from "@/components/common/Toast/ToastService";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { User } from "@/types/api";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login } = useUser();
  const [mob, setMob] = useState("");
  const [pwd, setPwd] = useState("");
  const [isEye, setIsEye] = useState(true);
  const [fetchLoader, setFetchLoader] = useState(false);

  const [errors, setErrors] = useState({
    mob: "",
    pwd: "",
  });

  interface Errors {
    mob: string;
    pwd: string;
  }

  const validate = (): boolean => {
    let valid = true;
    const newErrors: Errors = { mob: "", pwd: "" };

    // 1. Mobile Validation (Checking 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mob.trim()) {
      newErrors.mob = "Username number is required";
      valid = false;
    }
    // else if (!mobileRegex.test(mob)) {
    //   newErrors.mob = "Enter a valid 10-digit mobile number";
    //   valid = false;
    // }

    // 2. Password Validation (Complex Mix)
    // Breakdown: Lowercase, Uppercase, Digit, Special Char, Min 8
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!pwd.trim()) {
      newErrors.pwd = "Password is required";
      valid = false;
    }
    // else if (!passwordRegex.test(pwd)) {
    //   newErrors.pwd =
    //     "Use 8+ chars with Uppercase, Lowercase, Number & Special char (@$!%*?&)";
    //   valid = false;
    // }

    setErrors(newErrors);
    return valid;
  };

  // const onLogin = async () => {
  //   const sample_login_data = {
  //     user: {
  //       id: 1,
  //       name: "KPK",
  //       email: "k@gmail.com",
  //     },
  //     token: "435dfkjlgsdfio45sdfsdlkf",
  //   };
  //   login(sample_login_data.token, sample_login_data.user);
  //   // router.replace("/home");
  //   return;
  // };
  const onLoginM = async () => {
    if (!validate()) {
      // return showErrorToast(
      //   "Please check your mobile number and password format.",
      //   "",
      // );
      return;
    }
    try {
      setFetchLoader(true);
      const raw = {
        username: mob,
        password: pwd,
      };
      const res = await fetch(`${api_url}/login`, {
        method: "POST",
        headers: {
          // Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(raw),
      });
      const data = await res.json();
      // console.log("login-res->", data);
      if (data.status) {
        const login_user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          mobile: data.user.mobile,
          role: data.user.role,
          user_id: data.user.user_id,
          session: {
            id: data.session.id,
            year: data.session.year,
          },
        };
        // console.log("login_user->", login_user);
        await login(data.token, login_user);
        // ✅ go to tabs
        router.replace("/");
      } else {
        const err_msg: string = data?.message || "An error occurred.";
        showErrorToast(err_msg);
      }
    } catch (e: any) {
      // console.log("Login error", e);
      showErrorToast("Error", typeof e?.message === "string" ? e.message : e);
    } finally {
      setFetchLoader(false);
    }

    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // const raw = JSON.stringify({
    //   username: "7470907793",
    //   password: "Enter0262@",
    // });

    // const requestOptions: RequestInit = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // };

    // fetch(`${api_url}/api-token-auth/`, requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // or 'position'
        // behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <Pressable onPress={Keyboard.dismiss} style={styles.container}>
          <View>
            <Text
              style={[
                // styles.title,
                {
                  color: colors.text,
                  fontFamily: Fonts.heavy,
                  fontSize: colors.font32,
                },
              ]}
            >
              Welcome
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.subtext,
                  fontFamily: Fonts.semibold,
                  fontSize: colors.font16,
                },
              ]}
            >
              Login to continue
            </Text>
          </View>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderRadius: colors.brad },
            ]}
          >
            {/* Mobile */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                    fontFamily: Fonts.regular,
                    fontSize: colors.font16,
                  },
                ]}
              >
                Username
              </Text>
              <TextInput
                // keyboardType="number-pad"
                // inputMode={"decimal"}
                autoCapitalize="none"
                placeholder="Enter username"
                value={mob}
                onChangeText={(text) => {
                  setMob(text);
                  setErrors({ ...errors, mob: "" });
                }}
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: colors.background,
                    fontFamily: Fonts.regular,
                    fontSize: colors.font16,
                    borderRadius: colors.brad,
                  },
                  errors.mob && styles.inputError,
                ]}
                placeholderTextColor={colors.subtext}
                // maxLength={10}
              />
              {/* {mob && ( */}
              <Text
                style={[
                  styles.errorText,
                  { fontSize: colors.font12, fontFamily: Fonts.regular },
                ]}
              >
                {errors.mob}
              </Text>
              {/* )} */}
            </View>

            {/* Mobile */}
            <View style={styles.inputGroup}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                      fontFamily: Fonts.regular,
                      fontSize: colors.font16,
                    },
                  ]}
                >
                  Password
                </Text>

                {pwd && (
                  <Pressable
                    onPress={() => setIsEye(!isEye)}
                    style={{ paddingRight: 16 }}
                  >
                    <Feather
                      name={isEye ? "eye" : "eye-off"}
                      size={18}
                      color={colors.tint}
                    />
                  </Pressable>
                )}
              </View>

              <TextInput
                placeholder="Password"
                value={pwd}
                onChangeText={(text) => {
                  setPwd(text);
                  setErrors({ ...errors, pwd: "" });
                }}
                autoCapitalize="none"
                secureTextEntry={isEye}
                style={[
                  styles.input,
                  {
                    borderColor: colors.background,
                    color: colors.text,
                    backgroundColor: colors.background,
                    fontFamily: Fonts.regular,
                    fontSize: colors.font16,
                    borderRadius: colors.brad,
                  },
                  errors.pwd && styles.inputError,
                ]}
                placeholderTextColor={colors.subtext}
              />
              <Text
                style={[
                  styles.errorText,
                  { fontSize: colors.font12, fontFamily: Fonts.regular },
                ]}
              >
                {errors.pwd}
              </Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.tint, borderRadius: colors.brad },
              ]}
              onPress={onLoginM}
              disabled={fetchLoader}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontFamily: Fonts.regular,
                      fontSize: colors.font16,
                      color: colors.btntext,
                    },
                  ]}
                >
                  Login
                </Text>
                {fetchLoader && (
                  <ActivityIndicator size={"small"} color={colors.btntext} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    width: "100%",
    maxWidth: 640,
    marginHorizontal: "auto",
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    // borderRadius: 20,
    padding: 24,
    shadowColor: "#00000055",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  // title: {
  //   fontSize: 28,
  //   fontWeight: "700",
  // },
  subtitle: {
    // fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    // fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    // borderWidth: 0,
    // borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
  },
  button: {
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    // fontSize: 16,
    // fontWeight: "600",
  },
});
