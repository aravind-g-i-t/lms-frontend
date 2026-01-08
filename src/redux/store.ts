import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer,persistStore } from "redux-persist";
import signupReducer from './slices/signupSlice';
import authReducer from './slices/authSlice';
import chatReducer from "./slices/chatSlice";


const rootReducer=combineReducers({
    signup:signupReducer,
    auth:authReducer,
    chat:chatReducer
})


const persistConfig={
    key:'root',
    storage,
    whitelist:["signup","auth"]
};

const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store= configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;