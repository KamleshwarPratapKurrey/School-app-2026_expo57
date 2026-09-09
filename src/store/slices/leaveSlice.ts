import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import {
    AllLeaveApiResponse,
    CreateLeavePayload,
    LeaveApiResponse,
    LeaveApplicationItem,
    LeaveRecord,
    SubmitLeaveParams,
} from "@/types/leave";
import { StatusCode, StatusType } from "@/constants/app_constants";
import { FetchParams } from "@/types/school";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LEAVE_STORAGE_KEY = "stored_leave_count";

interface LeaveState {
    allLeaves: LeaveApplicationItem[];
    unreadCount: number;
    listStatus: StatusType;
    listError: string | null;
    lastSubmitted: LeaveRecord | null;
    status: StatusType;
    error: string | null;
    successMessage: string | null;
}

const initialState: LeaveState = {
    allLeaves: [],
    unreadCount: 0,
    listStatus: StatusCode.IDLE,
    listError: null,
    lastSubmitted: null,
    status: StatusCode.IDLE,
    error: null,
    successMessage: null,
};

// GET: Fetch all leave applications
export const fetchAllLeaves = createAsyncThunk<
    LeaveApplicationItem[],
    FetchParams,
    { rejectValue: string }
>("leave/fetchAllLeaves", async ({ endpoint, token }, { rejectWithValue }) => {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, { method: "GET", headers });
        const result: AllLeaveApiResponse = await response.json();

        if (!response.ok || !result.status) {
            return rejectWithValue(result.message || "Failed to fetch leave history");
        }

        return result.data;
    } catch (err: any) {
        return rejectWithValue(err.message || "Network request failed");
    }
});
export const autoFetchAllLeaves = createAsyncThunk<
    LeaveApplicationItem[],
    FetchParams,
    { rejectValue: string }
>("leave/autoFetchAllLeaves", async ({ endpoint, token }, { rejectWithValue }) => {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, { method: "GET", headers });
        const result: AllLeaveApiResponse = await response.json();

        if (!response.ok || !result.status) {
            return rejectWithValue(result.message || "Failed to fetch leave history");
        }

        return result.data;
    } catch (err: any) {
        return rejectWithValue(err.message || "Network request failed");
    }
});

export const submitLeaveApplication = createAsyncThunk<
    LeaveApiResponse,
    SubmitLeaveParams,
    { rejectValue: string }
>(
    "leave/submitLeaveApplication",
    async ({ endpoint, token, formData }, { rejectWithValue }) => {
        try {
            const data = new FormData();
            data.append("from_date", formData.from_date);
            data.append("to_date", formData.to_date);
            data.append("reason", formData.reason);

            if (formData.photo && formData.photo.uri) {
                // Expo SDK 57's fetch does not accept React Native's legacy
                // { uri, name, type } FormData part. Convert the local file
                // into a real Blob before adding it to the multipart body.
                const fileResponse = await fetch(formData.photo.uri);
                if (!fileResponse.ok) {
                    throw new Error("Could not read the selected attachment");
                }

                const fileBlob = await fileResponse.blob();
                data.append(
                    "photo",
                    fileBlob,
                    formData.photo.name || "attachment.webp",
                );
            }

            const headers: Record<string, string> = {
                Accept: "application/json",
                // 'Content-Type': 'multipart/form-data'
                // CRITICAL: NEVER set 'Content-Type': 'multipart/form-data' manually.
                // Fetch must generate it automatically along with the multipart boundary.
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers,
                body: data,
            });

            const result = await response.json();

            if (!response.ok || !result.status) {
                return rejectWithValue(
                    result.message || "Failed to submit leave application"
                );
            }

            return result;
        } catch (err: any) {
            return rejectWithValue(err.message || "Network request failed");
        }
    }
);

// Thunk to compare API length with AsyncStorage cached count
export const checkUnreadLeave = createAsyncThunk<
    number,
    number // accepts current array length
>("leave/checkUnread", async (currentCount) => {
    try {
        const rawStored = await AsyncStorage.getItem(LEAVE_STORAGE_KEY);
        const storedCount = rawStored ? parseInt(rawStored, 10) : 0;

        if (currentCount > storedCount) {
            return currentCount - storedCount;
        }
        return 0;
    } catch {
        return 0;
    }
});

// Thunk to reset badge once user enters the notices screen
export const markLeaveAsSeen = createAsyncThunk<
    void,
    number // accepts current total count
>("leave/markAsSeen", async (currentCount) => {
    try {
        await AsyncStorage.setItem(LEAVE_STORAGE_KEY, currentCount.toString());
    } catch (e) {
        console.error("Failed to store leave count", e);
    }
});

export const leaveSlice = createSlice({
    name: "leave",
    initialState,
    reducers: {
        resetLeaveState: (state) => {
            state.lastSubmitted = null;
            state.status = StatusCode.IDLE;
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch leaves
            .addCase(fetchAllLeaves.pending, (state) => {
                state.listStatus = StatusCode.LOADING;
                state.listError = null;
            })
            .addCase(
                fetchAllLeaves.fulfilled,
                (state, action: PayloadAction<LeaveApplicationItem[]>) => {
                    state.listStatus = StatusCode.SUCCEEDED;
                    state.allLeaves = action.payload;
                    state.listError = null;
                }
            )
            .addCase(fetchAllLeaves.rejected, (state, action) => {
                state.listStatus = StatusCode.FAILED;
                state.listError = action.payload || "Failed to load leave records";
            })
            .addCase(
                autoFetchAllLeaves.fulfilled,
                (state, action: PayloadAction<LeaveApplicationItem[]>) => {
                    // state.listStatus = StatusCode.SUCCEEDED;
                    state.allLeaves = action.payload;
                    // state.listError = null;
                }
            )
            // Submit leave
            .addCase(submitLeaveApplication.pending, (state) => {
                state.status = StatusCode.LOADING;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(
                submitLeaveApplication.fulfilled,
                (state, action: PayloadAction<LeaveApiResponse>) => {
                    state.status = StatusCode.SUCCEEDED;
                    state.lastSubmitted = action.payload.data;
                    state.successMessage = action.payload.message;
                    state.error = null;
                }
            )
            .addCase(submitLeaveApplication.rejected, (state, action) => {
                state.status = StatusCode.FAILED;
                state.error = action.payload || "Could not submit leave request";
            })

            .addCase(checkUnreadLeave.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })

            .addCase(markLeaveAsSeen.fulfilled, (state) => {
                state.unreadCount = 0;
            });
    },
});

export const { resetLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
