import axios from "axios"
import { loginFailure, loginRequest, loginSuccess, logoutSuccess, reload } from "../reducers/authSlice"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from '@backpackapp-io/react-native-toast';

export const instance = axios.create({
    baseURL: "http://ec2-65-0-130-71.ap-south-1.compute.amazonaws.com:3000/api/v1"
    // baseURL: "http://192.168.29.247:3000/api/v1"
})

export const setHeader = async () => {
    const a = await AsyncStorage.getItem('accessToken');
    if (a) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${a}`;
    } else {
        instance.defaults.headers.common['Authorization'] = null;
    }
}


export const empLogin = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest())
        const { data: { data } } = await instance.post("/emp/login", {
            email, password
        })
        await AsyncStorage.setItem('refreshToken', data.refreshToken.toString());
        await AsyncStorage.setItem('accessToken', data.accessToken.toString());
        dispatch(loginSuccess(data.employee))

    } catch (error) {
        toast.error(error.response.data.message);
        dispatch(loginFailure(error.response.data.message))
    }
}

export const getCurrentEmp = () => async (dispatch, getState) => {
    const a = await AsyncStorage.getItem('accessToken');
    try {
        await setHeader()
        const { data: { data } } = await instance.get("/emp/me")
        console.log(data)
        dispatch(loginSuccess(data))
    } catch (error) {
        console.log(error.response.data)
        if (error.response.data.message === "Token Expired") {
            const refreshToken = await AsyncStorage.getItem('refreshToken')
            try {
                instance.defaults.headers.common['Authorization'] = null;
                const response = await instance.post("/emp/token", {
                    refreshToken
                })
                await AsyncStorage.setItem('refreshToken', response.data.data.refreshToken.toString());
                await AsyncStorage.setItem('accessToken', response.data.data.accessToken.toString());
                const rel = !(getState().auth.reload)
                dispatch(reload(rel))
                console.log("token refresh")
            } catch (err) {
                dispatch(loginFailure(err.response.data.message))
            }
        }
        else dispatch(loginFailure(error.response.data.message))
    }
}

export const logoutEmp = () => async (dispatch, getState) => {
    try {
        await setHeader()
        await instance.get("/emp/logout")
        dispatch(logoutSuccess())
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('accessToken');
        await setHeader()
    } catch (error) {
        console.log(error.response.data)
    }
}
