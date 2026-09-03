import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchParams } from "@/types/school";
import {
  ExamTimeTableApiResponse,
  ExamTimeTableGroup,
} from "@/types/timetable";
import { StatusCode, StatusType } from "@/constants/app_constants";

interface TimeTableState {
  data: ExamTimeTableGroup[];
  status: StatusType;
  error: string | null;
}

const initialState: TimeTableState = {
  data: [],
  status: StatusCode.IDLE,
  error: null,
};

export const fetchExamTimeTable = createAsyncThunk<
  ExamTimeTableGroup[],
  FetchParams,
  { rejectValue: string }
>(
  "timetable/fetchExamTimeTable",
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

      const result: ExamTimeTableApiResponse = await response.json();

      if (!response.ok || !result.status) {
        return rejectWithValue(
          result.message || "Failed to fetch exam schedules"
        );
      }

      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network request failed");
    }
  }
);

export const timetableSlice = createSlice({
  name: "timetable",
  initialState,
  reducers: {
    resetTimeTableState: (state) => {
      state.data = [];
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamTimeTable.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(
        fetchExamTimeTable.fulfilled,
        (state, action: PayloadAction<ExamTimeTableGroup[]>) => {
          state.status = StatusCode.SUCCEEDED;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchExamTimeTable.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to load exam timetable";
      });
  },
});

export const { resetTimeTableState } = timetableSlice.actions;
export default timetableSlice.reducer;