import { createSlice } from "@reduxjs/toolkit";
import { resendOTP, sendOTP, verifyEmail } from "../../services/userAuthServices";

interface ISignupState{
    email:string;
    role:'learner'|'instructor'|'business'|null
    otpExpiresAt:Date|null;
}

const initialState:ISignupState={
    email:'',
    role:null,
    otpExpiresAt:null
}


const signupSlice=createSlice({
    name:'signup',
    initialState,
    reducers:{
        clearSignup:(state)=>{
            Object.assign(state,initialState)
        },
        setSignupCredentials:(state,action)=>{
            state.email=action.payload.email;
            state.role=action.payload.role;
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(sendOTP.fulfilled,(state,action)=>{
            state.role=action.payload.role;
            state.email=action.payload.email;
            state.otpExpiresAt=action.payload.otpExpiresAt;
        })
        .addCase(resendOTP.fulfilled,(state,action)=>{
            state.otpExpiresAt=action.payload.otpExpiresAt;
        })
        .addCase(verifyEmail.fulfilled,(state,action)=>{
            state.otpExpiresAt=action.payload.otpExpiresAt;
        })
        
    },
});


export const {clearSignup,setSignupCredentials}=signupSlice.actions;
export default signupSlice.reducer;