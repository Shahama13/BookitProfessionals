import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const apptSlice = createSlice({
    name: "appt",
    initialState: {
        today: [],
        week: [],
        month: [],
        year: [],
        loading: false,
        appt: [],
        latestAppt: []
    },
    reducers: {
        apptRequest: (state) => {
            state.loading = true;
        },
        apptSuccess: (state, action) => {
            state.loading = false;
            state.today = action.payload.today
            state.week = action.payload.week
            state.month = action.payload.month
            state.year = action.payload.year
        },
        apptDateSuccess: (state, action) => {
            state.loading = false;
            state.appt = action.payload

            state.latestAppt = action.payload.filter(a => {
                if ((moment().format().split("T")[0] === moment(a.endTime).format().split("T")[0]) && (a.status === "Booked")) { return moment(a.endTime).format() >= moment().format() }
            })

        },
        apptCompleteRequest: (state) => {
            state.loader = true;

        },
        apptCompleteSuccess: (state) => {
            state.loader = false;
        },

        apptFail: (state) => {
            state.loading = false
        }
    }
})

export default apptSlice.reducer

export const { apptRequest, apptSuccess, apptFail, apptDateSuccess, apptCompleteRequest, apptCompleteSuccess } = apptSlice.actions