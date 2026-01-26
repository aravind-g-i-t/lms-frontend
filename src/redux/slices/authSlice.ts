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
                state.role = action.payload.data.role;
                state.accessToken = action.payload.data.accessToken;
                state.id= action.payload.data.user.id;
                state.name= action.payload.data.user.name;
                state.profilePic= action.payload.data.user.profilePic;
            })
            .addCase(userTokenRefresh.fulfilled, (state, action) => {
                state.accessToken = action.payload.data.accessToken;
            })
            .addCase(userTokenRefresh.rejected, (state) => {
                state.role = null;
                state.accessToken = null;
                state.id = null;
                state.name = null;
                state.profilePic = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.role = action.payload.data.role;
                state.accessToken = action.payload.data.accessToken;
                state.id= action.payload.data.user.id;
                state.name= action.payload.data.user.name;
                state.profilePic= action.payload.data.user.profilePic;
            })
            .addCase(adminSignin.fulfilled, (state, action) => {
                state.role = "admin";
                state.accessToken = action.payload.data.accessToken;
                state.id = action.payload.data.id;
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
                state.name = action.payload.data.learner.name;
                state.profilePic = action.payload.data.learner.profilePic;
            })
            .addCase(getInstructorProfile.fulfilled, (state, action) => {
                state.name = action.payload.data.instructor.name;
                state.profilePic = action.payload.data.instructor.profilePic;
            })
            .addCase(getBusinessProfile.fulfilled, (state, action) => {
                console.log(action.payload);
                state.name = action.payload.data.business.name;
                state.profilePic = action.payload.data.business.profilePic;
            })
    }
});



export const { clearAuth,setUserName,setUserProfilePic } = authSlice.actions;
export default authSlice.reducer;