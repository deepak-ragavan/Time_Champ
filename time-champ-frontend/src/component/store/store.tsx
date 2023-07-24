import { configureStore } from "@reduxjs/toolkit";
import reducerToken from "./reducer/reducerToken";
import reducerFilter from "./reducer/reducerFilter";
import reducerProductivity from "./reducer/reducerProductivity";

export const Store =  configureStore({
        reducer : {
            tokenReducer: reducerToken,
            filterReducer: reducerFilter,
            productivityReducer: reducerProductivity
        },
});

export type RootState = ReturnType<typeof Store.getState>;

