import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = ""
const ReducerUserEmail = createSlice({
    name: 'email',
    initialState,
    reducers: {
       setUserEmail : (state,action) => {
            return action.payload
       }
    }
})

export const selectUserEmailReducer = (state: RootState) =>
  state.userEmailReducer;

export const { setUserEmail } = ReducerUserEmail.actions;
export default ReducerUserEmail.reducer;