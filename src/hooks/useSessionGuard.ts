import { api_url } from "@/components/common/ApiUrls";
import { useUser } from "@/context/UserContext";
import { useEffect, useRef } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";

const CHECK_INTERVAL = 8 * 60 * 1000; // 8 minutes

export function useSessionGuard() {
    const { token, logout } = useUser();
    // Safe across Node, DOM, and React Native runtimes
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isAlertVisible = useRef(false);

    const checkStatus = async () => {
        if (!token || isAlertVisible.current) return;

        try {
            const response = await fetch(`${api_url}/check-status`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const resData = await response.json();

            // Check for logout trigger
            if (resData.status === false && resData.logout === true) {
                isAlertVisible.current = true;

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }

                Alert.alert(
                    "Session Terminated",
                    resData.message ||
                    "Your account has been blocked or disabled. Session expired.",
                    [
                        {
                            // text: "Log Out",
                            text: "OK",
                            style: "destructive",
                            onPress: async () => {
                                isAlertVisible.current = false;
                                await logout();
                            },
                        },
                    ],
                    { cancelable: false } // Prevents tapping outside to dismiss
                );
            }
        } catch (error) {
            console.warn("Session status check failed:", error);
        }
    };

    useEffect(() => {
        if (!token) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        // Run initial check on load
        checkStatus();

        // Start 8-minute interval
        timerRef.current = setInterval(checkStatus, CHECK_INTERVAL);

        // Re-verify immediately whenever the app returns from background
        const subscription = AppState.addEventListener(
            "change",
            (nextState: AppStateStatus) => {
                if (nextState === "active") {
                    checkStatus();
                }
            }
        );

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            subscription.remove();
        };
    }, [token]);
}