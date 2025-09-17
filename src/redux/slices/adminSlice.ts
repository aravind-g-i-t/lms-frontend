import { createSlice } from "@reduxjs/toolkit";
import { adminLogout, adminSignin, adminTokenRefresh } from "../services/adminServices";

// interface Learner{
//     id?:string;
//     name?:string;
//     email?:string;
//     status?:'Active'|'Blocked';
//     profilePic?:string;
    
// }

interface AdminState{
    accessToken:string | null;
    id:string | null;
    email: string | null;

}




const initialState: AdminState={
    accessToken:null,
    id:null,
    email:null,

}

const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        clearAdmin(state){
            Object.assign(state,initialState)
        }
    },
    extraReducers: (builder) => {
            builder
                .addCase(adminSignin.fulfilled, (state,action) => {
                    state.id = action.payload.id;
                    state.accessToken = action.payload.accessToken;
                    state.email=action.payload.email;
                })
                .addCase(adminLogout.fulfilled, (state) => {
                    state.id = null;
                    state.accessToken =null;
                    state.email=null;
                })
                .addCase(adminTokenRefresh.fulfilled, (state,action) => {
                    state.accessToken =action.payload.accessToken;
                })
                .addCase(adminTokenRefresh.rejected, (state) => {
                    state.accessToken =null;
                    state.email=null;
                    state.id=null;
                })
        }
})

export const {clearAdmin}= adminSlice.actions;
export default adminSlice.reducer;