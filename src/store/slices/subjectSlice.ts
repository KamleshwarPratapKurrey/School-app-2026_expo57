import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SubjectItem,
  SubjectsApiResponse,
} from "@/types/subject";
import { StatusCode, StatusType } from "@/constants/app_constants";
import { FetchParams } from "@/types/school";

interface SubjectState {
  data: SubjectItem[];
  status: StatusType;
  error: string | null;
}

const initialState: SubjectState = {
  data: [],
  status: StatusCode.IDLE,
  error: null,
};

export const fetchSubjects = createAsyncThunk<
  SubjectItem[],
  FetchParams,
  { rejectValue: string }
>("subjects/fetchSubjects", async ({ endpoint, token }, { rejectWithValue }) => {
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

    const result: SubjectsApiResponse = await response.json();

    if (!response.ok || !result.status) {
      return rejectWithValue(result.message || "Failed to load subjects");
    }

    return result.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Network request failed");
  }
});

export const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    resetSubjectState: (state) => {
      state.data = [];
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(
        fetchSubjects.fulfilled,
        (state, action: PayloadAction<SubjectItem[]>) => {
          state.status = StatusCode.SUCCEEDED;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to retrieve subjects list";
      });
  },
});

export const { resetSubjectState } = subjectSlice.actions;
export default subjectSlice.reducer;