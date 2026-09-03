// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "./slices/attendanceSlice";
import noticeReducer from "./slices/noticeSlice";
import schoolInfoReducer from "./slices/school_info_slice";
import teacherReducer from "./slices/teacherSlice";
import timetableReducer from "./slices/timetableSlice";
import transportReducer from "./slices/transportSlice";
import subjectReducer from "./slices/subjectSlice";

export const store = configureStore({
  reducer: {
    school_info: schoolInfoReducer,
    attendance: attendanceReducer,
    teachers: teacherReducer,
    notices: noticeReducer,
    timetable: timetableReducer,
    transport: transportReducer,
    subjects: subjectReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Recommended for Expo/React Native navigation or async storage states
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;