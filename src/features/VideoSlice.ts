import { createSlice } from "@reduxjs/toolkit";

import {
    Action,
    PayloadAction,
    configureStore,
    ThunkAction
}from "@reduxjs/toolkit";


export interface NextVideo{
    id:number,
    title:string,
    duration:number
}
const initialState:NextVideo = {
    id:0,
    title:"",
    duration:0
}




export const videoSlice = createSlice({
    name:"video",
    initialState,
    reducers:{
        setNextVideo: (state, action: PayloadAction<NextVideo>) =>{
            state.id = action.payload.id;
            state.title = action.payload.title;
            state.duration = action.payload.duration;
        }
    }
})

export const {setNextVideo} = videoSlice.actions;

export default  videoSlice.reducer;