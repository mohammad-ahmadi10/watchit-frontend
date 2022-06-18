import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE} from 'next-redux-wrapper';



import {
    Action,
    PayloadAction,
    configureStore,
    ThunkAction
}from "@reduxjs/toolkit";



export interface User{
    id:string,
    username:string,
    email:string,
    profileImage:string,
}


export type UserState = {
    user: User|null,
    errorMSG:string | {mssg:string},
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
            state.user = null,
            state.errorMSG = ""
        }

    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },

})

export const {login , logout , register} = userSlice.actions;


export default  userSlice.reducer;
//export default  userSlice;


