import axios from "axios"
import { toast } from '@backpackapp-io/react-native-toast';
import { apptCompleteRequest, apptCompleteSuccess, apptDateSuccess, apptFail, apptRequest } from "../reducers/apptSlice";
import { instance } from "./empActions";

export const getApptsOfASpecifiedDate = (id, date) => async (dispatch) => {
    try {
        dispatch(apptRequest())
        const { data: { data } } = await instance.post(`/appt/appt/date/${id}`, {
            date
        })
        dispatch(apptDateSuccess(data.appt))
    } catch (error) {
        console.log(error)
        dispatch(apptFail())
    }
}

export const markAsComplete = (id) => async (dispatch) => {
    try {
        dispatch(apptCompleteRequest())
        const { data } = await instance.get(`/appt/set/${id}`)
        dispatch(apptCompleteSuccess())
        toast.success(data.message)
    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
    }
}