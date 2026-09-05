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

interface LeaveState {
    allLeaves: LeaveApplicationItem[];
    listStatus: StatusType;
    listError: string | null;
    lastSubmitted: LeaveRecord | null;
    status: StatusType;
    error: string | null;
    successMessage: string | null;
}

const initialState: LeaveState = {
    allLeaves: [],
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
            });
    },
});

export const { resetLeaveState } = leaveSlice.actions;
export default leaveSlice.reducer;
