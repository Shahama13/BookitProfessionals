import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice"
import apptSlice from "./reducers/apptSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        appt: apptSlice
    }
})

export default store