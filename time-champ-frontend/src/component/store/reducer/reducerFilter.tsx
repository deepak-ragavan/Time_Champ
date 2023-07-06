import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IFilterData {
    fromDate: Date;
    toDate: Date;
    branch: Array<String>;
    department: Array<String>;
    role: Array<String>;
    user: Array<String>;
    search:string;
    isresetFilter:boolean;
}
const defaultDate = new Date().getDate()+" "+new Date().toLocaleString('default', { month: 'long' })+","+new Date().getFullYear();
  
const initialState: IFilterData = {
    fromDate: new Date(),
    toDate: new Date(),
    branch: [],
    department: [],
    role: [],
    user: [],
    search:"",
    isresetFilter:false
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
            state.user = action.payload
        },
        saveSearch:(state,action) => {
            state.search = action.payload
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
        removeFilterData: (state) => {
            state.fromDate = initialState.fromDate
            state.toDate = initialState.toDate
            state.branch = initialState.branch
            state.department = initialState.department
            state.role = initialState.role
            state.user = initialState.user
            state.search = initialState.search
            state.isresetFilter = true;
        }
    }
})

export const selectFilterData = (state: RootState) =>
  state.filterReducer;

export const { loadFilterData,saveFilterDate,saveBranch,saveDepartment,saveRole,saveUser,saveSearch,removeFilterData,removeBranch,removeDepartment,removeRole,removeUser,removeSearch } = ReducerFilter.actions;
export default ReducerFilter.reducer;