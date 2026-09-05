// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import attendanceReducer from "./slices/attendanceSlice";
import complaintReducer from "./slices/comlaintSlice";
import noticeReducer from "./slices/noticeSlice";
import schoolInfoReducer from "./slices/school_info_slice";
import subjectReducer from "./slices/subjectSlice";
import teacherReducer from "./slices/teacherSlice";
import teacherStudentsReducer from "./slices/teacherStudentsSlice";
import timetableReducer from "./slices/timetableSlice";
import transportReducer from "./slices/transportSlice";
import teacherProfileReducer from "./slices/teacherProfileSlice";
import leaveReducer from "./slices/leaveSlice";

export const store = configureStore({
  reducer: {
    school_info: schoolInfoReducer,
    attendance: attendanceReducer,
    teachers: teacherReducer,
    notices: noticeReducer,
    timetable: timetableReducer,
    transport: transportReducer,
    subjects: subjectReducer,
    teacherStudents: teacherStudentsReducer,
    complaint: complaintReducer,
    teacherProfile: teacherProfileReducer,
    leave: leaveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Recommended for Expo/React Native navigation or async storage states
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;