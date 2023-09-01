import { configureStore } from "@reduxjs/toolkit";
import reducerToken from "./reducer/reducerToken";
import storage from "redux-persist/lib/storage"; 
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import reducerOtpTimer from "./reducer/reducerOtpTimer";
import reducerUserData from "./reducer/reducerUserData";

const persistConfig = {
  key: 'root', // The key for the root of the storage
  storage, // The storage engine to use (e.g., localStorage or AsyncStorage)
  // Additional configuration options can be specified here (e.g., whitelist, blacklist, transforms, etc.)
};

const reducer = combineReducers({
  tokenReducer: reducerToken,
  otpTimerReducer: reducerOtpTimer,
  userDataReducer: reducerUserData
})

const persistedReducer = persistReducer(persistConfig,reducer);

export const Store =  configureStore({
        reducer : persistedReducer
});

export type RootState = ReturnType<typeof Store.getState>;

