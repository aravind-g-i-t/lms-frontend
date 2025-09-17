import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../services/userAuthServices";

interface IBusinessState {
    id: string | null;
    name: string | null;
    email: string | null;
    planId: string | null;
    planStartDate: Date | null;
    planEndDate: Date | null;
    maxEmployees: number | null;
    profilePic: string | null;

}

const initialState: IBusinessState = {
    id: null,
    name: null,
    email: null,
    planId: null,
    planStartDate: null,
    planEndDate: null,
    maxEmployees: null,
    profilePic: null,
}


const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        setBusiness: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.profilePic = action.payload.profilePic;
            state.maxEmployees = action.payload.maxEmployees;
            state.planId = action.payload.planId;
            state.planStartDate = action.payload.planStartDate;
            state.planEndDate = action.payload.planEndDate;
        },

        clearBusiness: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state) => {
                state.id = null;
                state.email = null;
                state.name = null;
                state.profilePic = null;
                state.maxEmployees = null;
                state.planId = null
                state.planStartDate = null;
                state.planEndDate = null
            })
            .addCase(logout.rejected, (state) => {
                state.id = null;
                state.email = null;
                state.name = null;
                state.profilePic = null;
                state.maxEmployees = null;
                state.planId = null;
                state.planStartDate = null;
                state.planEndDate = null;
            })
    }
});


export const { setBusiness, clearBusiness } = businessSlice.actions;
export default businessSlice.reducer;