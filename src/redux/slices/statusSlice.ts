import { createSlice } from "@reduxjs/toolkit";
import { googleSignIn, logout, resendOTP, sendOTP, signin, verifyOTP } from "../../services/userAuthServices";
import { adminLogout, adminSignin, getBusinesses, getInstructors, getLearners } from "../../services/adminServices";

interface IStatus{
    loading:boolean;
    errorMsg:string | null;
    successMsg:string | null;

}
interface StatusState{
    user:IStatus,
    admin:IStatus
}

const initialState:StatusState={
    user:{
        loading:false,
        errorMsg:null,
        successMsg:null
    },
    admin:{
        loading:false,
        errorMsg:null,
        successMsg:null
    }
}


const statusSlice=createSlice({
    name:'status',
    initialState,
    reducers:{
        clearUserStatus:(state)=>{
            state.user.loading=false;
            state.user.errorMsg=null;
            state.user.successMsg=null;
        },
        clearAdminStatus:(state)=>{
            state.admin.loading=false;
            state.admin.errorMsg=null;
            state.admin.successMsg=null
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(sendOTP.pending,(state)=>{
            state.user.loading=true;
            state.user.successMsg=null;
            state.user.errorMsg=null;
        })
        .addCase(sendOTP.fulfilled,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=action.payload.message
            state.user.errorMsg=null;
        })
        .addCase(sendOTP.rejected,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=null;
            state.user.errorMsg=action.payload as string;
        })
        .addCase(verifyOTP.pending,(state)=>{
            state.user.loading=true;
            state.user.successMsg=null;
            state.user.errorMsg=null;
        })
        .addCase(verifyOTP.fulfilled,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=action.payload.message;
            state.user.errorMsg=null;
        })
        .addCase(verifyOTP.rejected,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=null;
            state.user.errorMsg=action.payload as string;
        })
        .addCase(resendOTP.pending,(state)=>{
            state.user.loading=true;
            state.user.successMsg=null;
            state.user.errorMsg=null;
        })
        .addCase(resendOTP.fulfilled,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=action.payload.message;
            state.user.errorMsg=null;
        })
        .addCase(resendOTP.rejected,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=null;
            state.user.errorMsg=action.payload as string;
        })
        .addCase(signin.pending,(state)=>{
            state.user.loading=true;
            state.user.successMsg=null;
            state.user.errorMsg=null;
        })
        .addCase(signin.fulfilled,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=action.payload.message;
            state.user.errorMsg=null;

        })
        .addCase(signin.rejected,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=null;
            state.user.errorMsg=action.payload as string;
            
        })
        .addCase(logout.pending,(state)=>{
            state.user.loading=true;
            state.user.successMsg=null;
            state.user.errorMsg=null;
        })
        .addCase(logout.fulfilled,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=action.payload.message;
            state.user.errorMsg=null;

        })
        .addCase(logout.rejected,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=null;
            state.user.errorMsg=action.payload as string;
            
        })
        .addCase(adminSignin.pending,(state)=>{
            state.admin.loading=true;
            state.admin.successMsg=null;
            state.admin.errorMsg=null;
        })
        .addCase(adminSignin.fulfilled,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=action.payload.message;
            state.admin.errorMsg=null;

        })
        .addCase(adminSignin.rejected,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=null;
            state.admin.errorMsg=action.payload as string;
            
        })
        .addCase(adminLogout.pending,(state)=>{
            state.admin.loading=true;
            state.admin.successMsg=null;
            state.admin.errorMsg=null;
        })
        .addCase(adminLogout.fulfilled,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=action.payload.message;
            state.admin.errorMsg=null;

        })
        .addCase(adminLogout.rejected,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=null;
            state.admin.errorMsg=action.payload as string;
            
        })
        .addCase(getLearners.pending,(state)=>{
            state.admin.loading=true;
            state.admin.successMsg=null;
            state.admin.errorMsg=null;
        })
        .addCase(getLearners.fulfilled,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=action.payload.message;
            state.admin.errorMsg=null;

        })
        .addCase(getLearners.rejected,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=null;
            state.admin.errorMsg=action.payload as string;
            
        })
        .addCase(getInstructors.pending,(state)=>{
            state.admin.loading=true;
            state.admin.successMsg=null;
            state.admin.errorMsg=null;
        })
        .addCase(getInstructors.fulfilled,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=action.payload.message;
            state.admin.errorMsg=null;

        })
        .addCase(getInstructors.rejected,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=null;
            state.admin.errorMsg=action.payload as string;
            
        })
        .addCase(getBusinesses.pending,(state)=>{
            state.admin.loading=true;
            state.admin.successMsg=null;
            state.admin.errorMsg=null;
        })
        .addCase(getBusinesses.fulfilled,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=action.payload.message;
            state.admin.errorMsg=null;

        })
        .addCase(getBusinesses.rejected,(state,action)=>{
            state.admin.loading=false;
            state.admin.successMsg=null;
            state.admin.errorMsg=action.payload as string;
            
        })
        .addCase(googleSignIn.pending,(state)=>{
            state.user.loading=true;
            state.user.successMsg=null;
            state.user.errorMsg=null;
        })
        .addCase(googleSignIn.fulfilled,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=action.payload.message;
            state.user.errorMsg=null;

        })
        .addCase(googleSignIn.rejected,(state,action)=>{
            state.user.loading=false;
            state.user.successMsg=null;
            state.user.errorMsg=action.payload as string;
            
        })
    },
});


export const {clearAdminStatus,clearUserStatus}=statusSlice.actions;
export default statusSlice.reducer;