import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../services/userAuthServices";

interface IInstructorState {
    id: string | null;
    name: string | null;
    email: string | null;
    isVerified: boolean | null;
    walletBalance: number | null;
    profilePic: string | null;
    resume: string | null;
    joiningDate:string |null;
    bio:string|null,
    website:string|null
}

const initialState: IInstructorState = {
    id: null,
    name: null,
    email: null,
    walletBalance: null,
    profilePic: null,
    isVerified: null,
    resume: null,
    joiningDate:null,
    website:null,
    bio:null
}


const instructorSlice = createSlice({
    name: 'instructor',
    initialState,
    reducers: {
        setInstructor: (state, action) => {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.walletBalance = action.payload.walletBalance;
            state.profilePic = action.payload.profilePic;
            state.resume = action.payload.resume;
            state.isVerified = action.payload.isVerified;
            state.joiningDate=action.payload.joiningDate;
            state.website=action.payload.joiningDate;
            state.bio=action.payload.joiningDate;
            
        },

        clearInstructor: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state, action) => {
                console.log(action.payload);
                state.id = null;
                state.name = null;
                state.email = null;
                state.walletBalance = null;
                state.profilePic = null
                state.isVerified = null;
                state.resume = null;
            })
            .addCase(logout.rejected, (state) => {
                state.id = null;
                state.name = null;
                state.email = null;
                state.walletBalance = null;
                state.profilePic = null;
                state.resume = null;
                state.isVerified = null
            })
    }
});


export const { setInstructor, clearInstructor } = instructorSlice.actions;
export default instructorSlice.reducer;