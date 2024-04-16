import { configureStore } from "@reduxjs/toolkit";
import tripReducer from "../features/Redux/tripSlice";
import activitiesReducer from "../features/Redux/activitiesSlice";
import transportsReducer from "../features/Redux/transportsSlice";
import accomodationsReducer from "../features/Redux/accommodationsSlice";
import planningReducer from "../features/Redux/planningSlice";

export const store = configureStore({
  reducer: {
    tripsReducer: tripReducer,
    activitiesReducer: activitiesReducer,
    transportsReducer: transportsReducer,
    accomodationsReducer: accomodationsReducer,
    planningReducer: planningReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
