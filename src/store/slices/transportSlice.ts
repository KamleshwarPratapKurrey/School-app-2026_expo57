import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TransportApiResponse,
  TransportData,
} from "@/types/transport";
import { StatusCode, StatusType } from "@/constants/app_constants";
import { FetchParams } from "@/types/school";

interface TransportState {
  data: TransportData | null;
  status: StatusType;
  error: string | null;
}

const initialState: TransportState = {
  data: null,
  status: StatusCode.IDLE,
  error: null,
};

export const fetchTransportInfo = createAsyncThunk<
  TransportData,
  FetchParams,
  { rejectValue: string }
>(
  "transport/fetchTransportInfo",
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

      const result: TransportApiResponse = await response.json();

      if (!response.ok || !result.status) {
        return rejectWithValue(
          result.message || "Failed to fetch transport information"
        );
      }

      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network request failed");
    }
  }
);

export const transportSlice = createSlice({
  name: "transport",
  initialState,
  reducers: {
    resetTransportState: (state) => {
      state.data = null;
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransportInfo.pending, (state) => {
        state.status = StatusCode.LOADING;
        state.error = null;
      })
      .addCase(
        fetchTransportInfo.fulfilled,
        (state, action: PayloadAction<TransportData>) => {
          state.status = StatusCode.SUCCEEDED;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchTransportInfo.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to load transport details";
      });
  },
});

export const { resetTransportState } = transportSlice.actions;
export default transportSlice.reducer;