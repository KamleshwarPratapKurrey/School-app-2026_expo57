import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchParams } from "@/types/school";
import {
  ClassStudentGroup,
  
  TeacherStudentsApiResponse,
} from "@/types/student";
import { StatusCode, StatusType } from "@/constants/app_constants";

interface TeacherStudentsState {
  data: ClassStudentGroup[];
  status: StatusType;
  error: string | null;
}

const initialState: TeacherStudentsState = {
  data: [],
  status: StatusCode.IDLE,
  error: null,
};

export const fetchTeacherStudents = createAsyncThunk<
  ClassStudentGroup[],
  FetchParams,
  { rejectValue: string }
>(
  "teacherStudents/fetchTeacherStudents",
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

      const result: TeacherStudentsApiResponse = await response.json();

      if (!response.ok || !result.status) {
        return rejectWithValue(
          result.message || "Failed to load class students"
        );
      }

      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network request failed");
    }
  }
);

export const teacherStudentsSlice = createSlice({
  name: "teacherStudents",
  initialState,
  reducers: {
    resetTeacherStudentsState: (state) => {
      state.data = [];
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherStudents.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(
        fetchTeacherStudents.fulfilled,
        (state, action: PayloadAction<ClassStudentGroup[]>) => {
          state.status = StatusCode.SUCCEEDED;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchTeacherStudents.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to retrieve student directory";
      });
  },
});

export const { resetTeacherStudentsState } = teacherStudentsSlice.actions;
export default teacherStudentsSlice.reducer;