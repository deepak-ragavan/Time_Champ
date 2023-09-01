import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface userDataProfile {
  id:number
  email:string,
  childUsers:Array<string>
}

const initialState: userDataProfile = {
  id:0,
  email: "",
  childUsers:[]
}

const ReducerUserData = createSlice({
    name: 'userData',
    initialState,
    reducers: {
       setUserId : (state,action) => {
          state.id = action.payload.id
       },
       setUserEmail : (state,action) => {
          state.email = action.payload
       },
       setUserChildData : (state,action) => {
        state.childUsers = action.payload
     }
    }
})

export const selectUserDataReducer = (state: RootState) =>
  state.userDataReducer;

export const { setUserId,setUserEmail,setUserChildData } = ReducerUserData.actions;
export default ReducerUserData.reducer;