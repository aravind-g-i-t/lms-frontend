import { createSlice } from "@reduxjs/toolkit";
import { googleSignIn, logout, signin, userTokenRefresh } from "../services/userAuthServices";
import { adminLogout, adminSignin } from "../services/adminServices";


interface IAuthState {
    role: 'learner' | 'instructor' | 'business' | 'admin'| null
    accessToken: string | null;
}

const initialState: IAuthState = {
    role: null,
    accessToken: null
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuth: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signin.fulfilled, (state,action) => {
                state.role = action.payload.role;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(logout.fulfilled, (state) => {
                state.role = null;
                state.accessToken = null;
            })
            .addCase(logout.rejected, (state) => {
                state.role = null;
                state.accessToken = null;
            })
            .addCase(userTokenRefresh.fulfilled, (state,action) => {

                state.accessToken = action.payload.accessToken;
            })
            .addCase(googleSignIn.fulfilled, (state,action) => {
                state.role = action.payload.role;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(adminSignin.fulfilled, (state,action) => {
                state.role = "admin";
                state.accessToken = action.payload.accessToken;
            })
            .addCase(adminLogout.rejected, (state) => {
                state.role = null;
                state.accessToken = null;
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.role = null;
                state.accessToken = null;
            })
            

            
    }
});


export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;