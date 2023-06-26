import { configureStore } from "@reduxjs/toolkit";
import reducerToken from "./reducer/reducerToken";

export const Store =  configureStore({
        reducer : {
            tokenReducer: reducerToken,
        },
});

export type RootState = ReturnType<typeof Store.getState>;

