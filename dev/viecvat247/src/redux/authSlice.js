import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        signup: {
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        // Login reducers
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        // Signup reducers
        signupStart: (state) => {
            state.signup.isFetching = true;
        },
        signupSuccess: (state) => {
            state.signup.isFetching = false;
            state.signup.error = false;
            state.signup.success = true;
        },
        signupFailed: (state) => {
            state.signup.isFetching = false;
            state.signup.error = true;
        },
    },
});

export const { loginStart, loginFailed, loginSuccess, signupStart, signupFailed, signupSuccess } = authSlice.actions;
export default authSlice.reducer;
