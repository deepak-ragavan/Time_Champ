import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IUserProfile {
    access_token: string;
    refresh_token: string;
    access_token_expiry: number;
    refresh_token_expiry: number;
}
  
const initialState: IUserProfile = {
    access_token: "",
    refresh_token: "",
    access_token_expiry: 0,
    refresh_token_expiry: 0,
};

const ReducerToken = createSlice({
    name: 'token',
    initialState,
    reducers: {
        saveToken: (state,action) => {
            state.access_token = action.payload.data.access_token
            state.refresh_token = action.payload.data.refresh_token
            state.access_token_expiry = action.payload.data.access_token_Expires_in
            state.refresh_token_expiry = action.payload.data.refresh_token_Expires_in
        }
    }
})

export const selectTokenProfile = (state: RootState) =>
  state.tokenReducer;

export const { saveToken } = ReducerToken.actions;
export default ReducerToken.reducer;