// store/slices/noticeSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoticeItem, NoticesApiResponse } from "@/types/notice";
import { StatusCode, StatusType } from "@/constants/app_constants";
import { FetchParams } from "@/types/school";

const NOTICES_STORAGE_KEY = "stored_notices_count";

interface NoticeState {
  data: NoticeItem[];
  unreadCount: number;
  status: StatusType;
  error: string | null;
}

const initialState: NoticeState = {
  data: [],
  unreadCount: 0,
  status: StatusCode.IDLE,
  error: null,
};

export const fetchNotices = createAsyncThunk<
  NoticeItem[],
  FetchParams,
  { rejectValue: string }
>("notices/fetchNotices", async ({ endpoint, token }, { rejectWithValue }) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, { method: "GET", headers });
    const result: NoticesApiResponse = await response.json();

    if (!response.ok || !result.status) {
      return rejectWithValue(result.message || "Failed to fetch notices");
    }

    return result.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Network request failed");
  }
});

export const autoFetchNotices = createAsyncThunk<
  NoticeItem[],
  FetchParams,
  { rejectValue: string }
>("notices/autoFetchNotices", async ({ endpoint, token }, { rejectWithValue }) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, { method: "GET", headers });
    const result: NoticesApiResponse = await response.json();

    if (!response.ok || !result.status) {
      return rejectWithValue(result.message || "Failed to fetch notices");
    }

    return result.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Network request failed");
  }
});

// Thunk to compare API length with AsyncStorage cached count
export const checkUnreadNotices = createAsyncThunk<
  number,
  number // accepts current array length
>("notices/checkUnread", async (currentCount) => {
  try {
    const rawStored = await AsyncStorage.getItem(NOTICES_STORAGE_KEY);
    const storedCount = rawStored ? parseInt(rawStored, 10) : 0;

    if (currentCount > storedCount) {
      return currentCount - storedCount;
    }
    return 0;
  } catch {
    return 0;
  }
});

// Thunk to reset badge once user enters the notices screen
export const markNoticesAsSeen = createAsyncThunk<
  void,
  number // accepts current total count
>("notices/markAsSeen", async (currentCount) => {
  try {
    await AsyncStorage.setItem(NOTICES_STORAGE_KEY, currentCount.toString());
  } catch (e) {
    console.error("Failed to store notice count", e);
  }
});

export const noticeSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {
    resetNoticeState: (state) => {
      state.data = [];
      state.unreadCount = 0;
      state.status = StatusCode.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.status = StatusCode.LOADING;
      })
      .addCase(fetchNotices.fulfilled, (state, action: PayloadAction<NoticeItem[]>) => {
        state.status = StatusCode.SUCCEEDED;
        state.data = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.status = StatusCode.FAILED;
        state.error = action.payload || "Failed to load notices";
      })

      .addCase(autoFetchNotices.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      .addCase(checkUnreadNotices.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      .addCase(markNoticesAsSeen.fulfilled, (state) => {
        state.unreadCount = 0;
      });
  },
});

export const { resetNoticeState } = noticeSlice.actions;
export default noticeSlice.reducer;