import { configureStore } from "@reduxjs/toolkit";
import reducerToken from "./reducer/reducerToken";
import reducerFilter from "./reducer/reducerFilter";

export const Store =  configureStore({
        reducer : {
            tokenReducer: reducerToken,
            filterReducer: reducerFilter
        },
});

export type RootState = ReturnType<typeof Store.getState>;

