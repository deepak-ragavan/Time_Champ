import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IFilterData {
    fromDate: string;
    toDate: string;
    branch: Array<String>;
    department: Array<String>;
    role: Array<String>;
    user: Array<String>;
    search:string;
}
const defaultDate = new Date().getDate()+" "+new Date().toLocaleString('default', { month: 'long' })+","+new Date().getFullYear();
  
const initialState: IFilterData = {
    fromDate: defaultDate,
    toDate: defaultDate,
    branch: [],
    department: [],
    role: [],
    user: [],
    search:""
};

const ReducerFilter = createSlice({
    name: 'filterData',
    initialState,
    reducers: {
        loadFilterData: () => {
            return initialState;
        },
        saveFilterDate: (state,action) => {
            state.fromDate = action.payload.fromDate
            state.toDate = action.payload.toDate
        },
        saveBranch:(state,action) => {
            state.branch = action.payload
        },
        saveDepartment:(state,action) => {
            state.department = action.payload
        },
        saveRole:(state,action) => {
            state.role = action.payload
        },
        saveUser:(state,action) => {
            state.user = action.payload.user
        },
        saveSearch:(state,action) => {
            state.search = action.payload.search
        },
        removeBranch:(state) => {
            state.branch = []
        },
        removeDepartment:(state) => {
            state.department = []
        },
        removeRole:(state) => {
            state.role = []
        },
        removeUser:(state) => {
            state.user = []
        },
        removeSearch:(state) => {
            state.search = ""
        },
        removeFilterData: () => {
            return initialState;
        }
    }
})

export const selectFilterData = (state: RootState) =>
  state.filterReducer;

export const { loadFilterData,saveFilterDate,saveBranch,saveDepartment,saveRole,saveUser,saveSearch,removeFilterData,removeBranch,removeDepartment,removeRole,removeUser,removeSearch } = ReducerFilter.actions;
export default ReducerFilter.reducer;