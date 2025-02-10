import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        reload: false,
    },
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.employee = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.employee = null
        },
        reload: (state, action) => {
            state.reload = action.payload
        }
    }
})

export default authSlice.reducer

export const { loginRequest, loginSuccess, loginFailure, logoutSuccess, reload } = authSlice.actions