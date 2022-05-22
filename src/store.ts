import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import videoReducer from "./features/VideoSlice";

const rootReducer =  {
    user:userReducer,
    video:videoReducer,
}

export const store = configureStore({
    reducer:rootReducer
})



export type RootState = ReturnType<typeof store.getState>;

export const selectUser = (state:RootState) => state.user;
export const selectVideo = (state:RootState) => state.video