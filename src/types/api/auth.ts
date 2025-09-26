import type { Role } from "../shared";


export interface SignupRequest{
    role:Role
    name:string;
    email:string;
    password:string;
}

export interface OTPVerificationRequest{
    email:string,
    otp:string,
    role:Role
}

export interface SigninRequest{
    role:Role;
    email:string;
    password:string
}

export interface ResendOTPRequest{
    email:string
}

export interface GoogleSigninRequest{
    token:string;
    role:Role
}

export interface VerifyEmailRequest{
    email:string;
    role:Role
}

export interface VerifyResetOTPRequest{
    email:string;
    otp:string;
}

export interface ResetPasswordRequest{
    email:string;
    role:Role;
    password:string
}



