import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/slice'



export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});
