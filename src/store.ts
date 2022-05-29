import { configureStore,  combineReducers,
    ThunkAction,  Action,
    AnyAction,
 } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import videoReducer from "./features/VideoSlice";

import {createWrapper, HYDRATE} from 'next-redux-wrapper';



const rootReducer =  combineReducers({
    user:userReducer,
    video:videoReducer,
})


const reducer = (state: ReturnType<typeof rootReducer>, action: AnyAction) => {
    if (action.type === HYDRATE) {
      const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      };
      return nextState;
    } else {
      return rootReducer(state, action);
    }
  };


  export const store = configureStore({reducer:rootReducer});
  export const makeStore = () => store


/* export const store = configureStore({
    reducer:rootReducer,
}) 
*/

type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store['dispatch'];


export type RootState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;




// export type RootState = ReturnType<typeof store.getState>;
export const wrapper = createWrapper(makeStore, { debug: true });

export const selectUser = (state:RootState) => state.user;
export const selectVideo = (state:RootState) => state.video