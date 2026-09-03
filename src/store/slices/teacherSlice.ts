import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  TeachersApiResponse,
  TeachersData,
} from "@/types/teacher";
import { StatusCode, StatusType } from "@/constants/app_constants";
import { FetchParams } from "@/types/school";

interface TeacherState {
  data: TeachersData | null;
  status: StatusType;
  error: string | null;
}

const initialState: TeacherState = {
  data: null,
  status: StatusCode.IDLE,
  error: null,
};

export const fetchTeachers = createAsyncThunk<
  TeachersData,
  FetchParams,
  { rejectValue: string }
>("teachers/fetchTeachers", async ({ endpoint, token }, { rejectWithValue }) => {
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

    const result: TeachersApiResponse = await response.json();

    if (!response.ok || !result.status) {
      return rejectWithValue(result.message || "Failed to fetch teachers data");
    }

    return result.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Network request failed");
  }
});

export const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    resetTeacherState: (state) => {
      state.data = null;
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = StatusCode.SUCCEEDED;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to load teachers list";
      });
  },
});

export const { resetTeacherState } = teacherSlice.actions;
export default teacherSlice.reducer;