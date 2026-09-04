import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ComplaintApiResponse,
  ComplaintRecord,
  SubmitComplaintParams,
} from "@/types/complaint";
import { StatusCode, StatusType } from "@/constants/app_constants";

interface ComplaintState {
  lastSubmitted: ComplaintRecord | null;
  status: StatusType;
  error: string | null;
  successMessage: string | null;
}

const initialState: ComplaintState = {
  lastSubmitted: null,
  status: StatusCode.IDLE,
  error: null,
  successMessage: null,
};

export const submitComplaint = createAsyncThunk<
  ComplaintApiResponse,
  SubmitComplaintParams,
  { rejectValue: string }
>(
  "complaint/submitComplaint",
  async ({ endpoint, token, formData }, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append("student_id", String(formData.student_id));
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("complaint_date", formData.complaint_date);

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: data,
      });

      const result: ComplaintApiResponse = await response.json();

      if (!response.ok || !result.status) {
        return rejectWithValue(result.message || "Failed to submit complaint");
      }

      return result;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network request failed");
    }
  }
);

export const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    resetComplaintState: (state) => {
      state.lastSubmitted = null;
      state.status = StatusCode.IDLE;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitComplaint.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        submitComplaint.fulfilled,
        (state, action: PayloadAction<ComplaintApiResponse>) => {
          state.status = StatusCode.SUCCEEDED;
          state.lastSubmitted = action.payload.data;
          state.successMessage = action.payload.message;
          state.error = null;
        }
      )
      .addCase(submitComplaint.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Could not register complaint";
      });
  },
});

export const { resetComplaintState } = complaintSlice.actions;
export default complaintSlice.reducer;