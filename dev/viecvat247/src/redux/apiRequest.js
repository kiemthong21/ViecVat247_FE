import request from "~/utils/request";
import { loginFailed, loginStart, loginSuccess, signupFailed, signupStart, signupSuccess } from "./authSlice";
import { getUserFailed, getUserStart, getUserSuccess } from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await request.post("Authen/Customer/Login", user);
        if (res.data.message) {
            dispatch(loginFailed());
        } else {
            dispatch(loginSuccess(res.data));
            navigate("/profile");
        }
    } catch (err) {
        dispatch(loginFailed());
    }
};

export const signupUser = async (user, dispatch, navigate) => {
    dispatch(signupStart());
    try {
        await request.post("api/Authen/Register", user);
        dispatch(signupSuccess());
    } catch (error) {
        dispatch(signupFailed());
    }
};

export const getUser = async (accessToken, dispatch) => {
    dispatch(getUserStart());
    try {
        const res = await request.get("api/Customer/UserProfile", {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUserSuccess(res.data));
    } catch (error) {
        dispatch(getUserFailed());
    }
};
