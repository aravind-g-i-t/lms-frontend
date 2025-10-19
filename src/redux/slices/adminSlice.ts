import { createSlice } from "@reduxjs/toolkit";
import { adminLogout, adminSignin } from "../services/adminServices";
import { userTokenRefresh } from "../services/userAuthServices";


interface AdminState {
    id: string | null;
    email: string | null;

}

const initialState: AdminState = {
    id: null,
    email: null,

}




const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearAdmin(state) {
            Object.assign(state, initialState)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminSignin.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.email = action.payload.email;
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.id = null;
                state.email = null;
            })
            .addCase(userTokenRefresh.rejected, (state) => {
                state.email = null;
                state.id = null;
            })
    }
})

export const { clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;