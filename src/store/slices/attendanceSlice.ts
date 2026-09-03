import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  AttendanceApiResponse,
  AttendanceRecord,
  AttendanceSummary
} from "@/types/attendance";
import { StatusCode, StatusType } from "@/constants/app_constants";
import { FetchParams } from "@/types/school";

interface AttendanceState {
  summary: AttendanceSummary | null;
  records: AttendanceRecord[];
  status: StatusType;
  error: string | null;
}

const initialState: AttendanceState = {
  summary: null,
  records: [],
  status: StatusCode.IDLE,
  error: null,
};

export const fetchAttendance = createAsyncThunk<
  { summary: AttendanceSummary; records: AttendanceRecord[] },
  FetchParams,
  { rejectValue: string }
>(
  "attendance/fetchAttendance",
  async ({ endpoint, token }, { rejectWithValue }) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers,
      });

      const result: AttendanceApiResponse = await response.json();

      if (!response.ok || !result.status) {
        return rejectWithValue(
          result.message || "Failed to fetch attendance data"
        );
      }

      return {
        summary: result.summary,
        records: result.data,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Network request failed");
    }
  }
);

export const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    resetAttendanceState: (state) => {
      state.summary = null;
      state.records = [];
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = StatusCode.SUCCEEDED;
        state.summary = action.payload.summary;
        state.records = action.payload.records;
        state.error = null;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to retrieve records";
      });
  },
});

export const { resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;