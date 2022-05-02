import { configureStore } from "@reduxjs/toolkit";
import reducer from "./features/userSlice";


export const store = configureStore({
    reducer:{user:reducer}
})



export type RootState = ReturnType<typeof store.getState>;

export const selectUser = (state:RootState) => state.user;
