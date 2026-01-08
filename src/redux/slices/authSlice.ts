import { createSlice } from "@reduxjs/toolkit";
import { googleSignIn, logout, signin, userTokenRefresh } from "../../services/userAuthServices";
import { adminLogout, adminSignin } from "../../services/adminServices";
import { getLearnerProfile } from "../../services/learnerServices";
import { getInstructorProfile } from "../../services/instructorServices";
import { getBusinessProfile } from "../../services/businessServices";



interface IAuthState {
    role: 'learner' | 'instructor' | 'business' | 'admin' | null;
    accessToken: string | null;
    id: string | null;
    name: string | null;
    profilePic: string | null
}

const initialState: IAuthState = {
    role: null,
    accessToken: null,
    id: null,
    name: null,
    profilePic: null
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuth: (state) => {
            Object.assign(state, initialState)
        },
        setUserName: (state, action) => {
            state.name = action.payload.name;
        },
        setUserProfilePic: (state, action) => {
            state.profilePic = action.payload.profilePic;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signin.fulfilled, (state, action) => {
                state.role = action.payload.role;
                state.accessToken = action.payload.accessToken;
                state.id= action.payload.user.id;
                state.name= action.payload.user.name;
                state.profilePic= action.payload.user.profilePic;
            })
            .addCase(userTokenRefresh.fulfilled, (state, action) => {
                state.accessToken = action.payload.accessToken;
            })
            .addCase(userTokenRefresh.rejected, (state) => {
                state.role = null;
                state.accessToken = null;
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.role = action.payload.role;
                state.accessToken = action.payload.accessToken;
                state.id= action.payload.user.id;
                state.name= action.payload.user.name;
                state.profilePic= action.payload.user.profilePic;
            })
            .addCase(adminSignin.fulfilled, (state, action) => {
                state.role = "admin";
                state.accessToken = action.payload.accessToken;
                state.id = action.payload.id;
            })
            .addCase(adminLogout.rejected, (state) => {
                state.role = null;
                state.accessToken = null;
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.role = null;
                state.accessToken = null;
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(logout.rejected, (state) => {
                state.role = null;
                state.accessToken = null;
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.role = null;
                state.accessToken = null;
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(getLearnerProfile.fulfilled, (state, action) => {
                state.name = action.payload.learner.name;
                state.profilePic = action.payload.learner.profilePic;
            })
            .addCase(getInstructorProfile.fulfilled, (state, action) => {
                state.name = action.payload.instructor.name;
                state.profilePic = action.payload.instructor.profilePic;
            })
            .addCase(getBusinessProfile.fulfilled, (state, action) => {
                console.log(action.payload);
                state.name = action.payload.business.name;
                state.profilePic = action.payload.business.profilePic;
            })
    }
});



export const { clearAuth,setUserName,setUserProfilePic } = authSlice.actions;
export default authSlice.reducer;