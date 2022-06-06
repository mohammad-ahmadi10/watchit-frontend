import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE} from 'next-redux-wrapper';
import {
    PayloadAction,
}from "@reduxjs/toolkit";



export interface User{
    id:number,
    username:string,
    email:string,
    profileImage:string,
    
}


export type avatarState = {
    path:string
    page:string
};

const initialState:avatarState = {
    path:"",
    page:""
    
}





export const avatarSlice = createSlice({
    name: "avatar",
    initialState,
    reducers:{
        setAvatar: (state , action: PayloadAction<avatarState>) =>{
            state.path = action.payload.path
            state.page = action.payload.page
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

export const {setAvatar} = avatarSlice.actions;

export default  avatarSlice.reducer;