import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../services/userAuthServices";
import { getBusinessProfile } from "../services/businessServices";

interface IBusinessState {
    id: string | null;
    name: string | null;
    profilePic: string | null;

}

const initialState: IBusinessState = {
    id: null,
    name: null,
    profilePic: null,
}


const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        setBusiness: (state, action) => {
            
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.profilePic = action.payload.profilePic;
        },
        setBusinessName: (state, action) => {
            state.name = action.payload.name;
        },
        setBusinessImage: (state, action) => {
            state.profilePic = action.payload.profilePic;
        },
        clearBusiness: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state) => {
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(logout.rejected, (state) => {
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(getBusinessProfile.fulfilled, (state, action) => {
                state.name = action.payload.business.name;
                state.profilePic = action.payload.business.profilePic;

            })
    }
});


export const { setBusiness, clearBusiness,setBusinessImage,setBusinessName } = businessSlice.actions;
export default businessSlice.reducer;