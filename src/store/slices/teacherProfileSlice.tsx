import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchParams } from "@/types/school";
import {
  TeacherProfileApiResponse,
  TeacherProfileData,
} from "@/types/teacherProfile";
import { StatusCode, StatusType } from "@/constants/app_constants";

interface TeacherProfileState {
  data: TeacherProfileData | null;
  status: StatusType;
  error: string | null;
}

const initialState: TeacherProfileState = {
  data: null,
  status: StatusCode.IDLE,
  error: null,
};

export const fetchTeacherProfile = createAsyncThunk<
  TeacherProfileData,
  FetchParams,
  { rejectValue: string }
>(
  "teacherProfile/fetchTeacherProfile",
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

      const result: TeacherProfileApiResponse = await response.json();

      if (!response.ok || !result.status) {
        return rejectWithValue(
          result.message || "Failed to fetch teacher profile info"
        );
      }

      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network request failed");
    }
  }
);

export const teacherProfileSlice = createSlice({
  name: "teacherProfile",
  initialState,
  reducers: {
    resetTeacherProfileState: (state) => {
      state.data = null;
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(
        fetchTeacherProfile.fulfilled,
        (state, action: PayloadAction<TeacherProfileData>) => {
          state.status = StatusCode.SUCCEEDED;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to load teacher profile details";
      });
  },
});

export const { resetTeacherProfileState } = teacherProfileSlice.actions;
export default teacherProfileSlice.reducer;