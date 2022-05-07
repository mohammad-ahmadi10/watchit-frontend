import { createSlice } from "@reduxjs/toolkit";

import {
    Action,
    PayloadAction,
    configureStore,
    ThunkAction
}from "@reduxjs/toolkit";



export interface User{
    id:number,
    username:string,
    email:string,
    profileImage:string,
    
}

export type UserState = {
    user: User|null,
    errorMSG:String,
    logIn:boolean,
};

const initialState:UserState = {
    user: null,
    errorMSG:"",
    logIn:false

}


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        login: (state , action: PayloadAction<UserState>) =>{
            state.user = action.payload.user;
            state.errorMSG = action.payload.errorMSG;
            state.logIn = action.payload.logIn;
        },
        register:(state , action: PayloadAction<UserState>) =>{
            state.user = action.payload.user;
            state.errorMSG = action.payload.errorMSG;
            state.logIn = action.payload.logIn;
        },

        logout:(state) =>{
            state.user = null
        }

    }
})

export const {login , logout , register} = userSlice.actions;
export default  userSlice.reducer;

