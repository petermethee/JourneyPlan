import { configureStore } from "@reduxjs/toolkit";
import tripReducer from "../features/Redux/tripSlice";
import activityReducer from "../features/Redux/activitySlice";

export const store = configureStore({
  reducer: {
    tripsReducer: tripReducer,
    activitiesReducer: activityReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
