import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import moment from "moment";

export interface IProductivityData {
    fromDate: Date;
    toDate: Date;
    weekDates:string[]
}

const getArrayOfWeekDates = (thisWeek:moment.Moment) => {
    const fromDate = thisWeek.clone().startOf('week')
    const toDate = thisWeek.clone().endOf('week')
    const datesOfWeek = [];
    let currentDate = fromDate;
    while (currentDate <= toDate) {
      datesOfWeek.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.clone().add(1, 'day');
    }
    return datesOfWeek;
  }
  
const initialState: IProductivityData = {
    fromDate: new Date(),
    toDate: new Date(),
    weekDates:getArrayOfWeekDates(moment())
};
  

const ReducerProductivity = createSlice({
    name: 'productivityData',
    initialState,
    reducers: {
        saveProductivityData: (state,action) => {
            state.fromDate = action.payload.fromDate
            state.toDate = action.payload.toDate
            state.weekDates = action.payload.weekDates
        },
    }
})

export const selectProductivityData = (state: RootState) =>
  state.productivityReducer;

export const { saveProductivityData } = ReducerProductivity.actions;
export default ReducerProductivity.reducer;