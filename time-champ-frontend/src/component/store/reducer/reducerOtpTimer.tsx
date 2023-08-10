import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = 0
const ReducerOtpTimer = createSlice({
    name: 'seconds',
    initialState,
    reducers: {
       setTimer : (state,action) => {
            return action.payload
       }
    }
})

export const selectOtpTimerReducer = (state: RootState) =>
  state.otpTimerReducer;

export const { setTimer } = ReducerOtpTimer.actions;
export default ReducerOtpTimer.reducer;