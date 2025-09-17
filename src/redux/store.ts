import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer,persistStore } from "redux-persist";
import learnerReducer from './slices/learnerSlice';
import signupReducer from './slices/signupSlice';
import statusReducer from './slices/statusSlice';
import authReducer from './slices/authSlice';
import instructorReducer from './slices/instructorSlice';
import businessReducer from './slices/businessSlice';
import adminReducer from './slices/adminSlice';


const rootReducer=combineReducers({
    learner:learnerReducer,
    instructor:instructorReducer,
    business:businessReducer,
    signup:signupReducer,
    status:statusReducer,
    auth:authReducer,
    admin:adminReducer
})


const persistConfig={
    key:'root',
    storage,
    whitelist:["learner","instructor","business","signup","auth","admin"]
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