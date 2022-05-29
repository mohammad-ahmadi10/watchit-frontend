import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE} from 'next-redux-wrapper';

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
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
})

export const {setNextVideo} = videoSlice.actions;

export default  videoSlice.reducer;
//export default  videoSlice;