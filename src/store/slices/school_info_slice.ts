import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    FetchParams,
  SchoolApiResponse,
  SchoolData
} from "@/types/school";
import { StatusCode, StatusType } from "@/constants/app_constants";

interface SchoolState {
  school_info: SchoolData | null;
  status: StatusType;
  error: string | null;
}

const initialState: SchoolState = {
  school_info: null,
  status: StatusCode.IDLE,
  error: null,
};

export const fetchSchoolInfo = createAsyncThunk<
  SchoolData,
  FetchParams,
  { rejectValue: string }
>("school_info/fetchSchoolInfo", async ({ endpoint, token }, { rejectWithValue }) => {
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

    const result: SchoolApiResponse = await response.json();

    if (!response.ok || !result.status) {
      return rejectWithValue(result.message || "Failed to fetch school details");
    }

    return result.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Network request failed");
  }
});

export const schoolInfoSlice = createSlice({
  name: "school_info",
  initialState,
  reducers: {
    resetSchoolState: (state) => {
      state.school_info = null;
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolInfo.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(
        fetchSchoolInfo.fulfilled,
        (state, action: PayloadAction<SchoolData>) => {
          state.status = StatusCode.SUCCEEDED;
          state.school_info = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSchoolInfo.rejected, (state, action) => {
        state.school_info = null;
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetSchoolState } = schoolInfoSlice.actions;
export default schoolInfoSlice.reducer;