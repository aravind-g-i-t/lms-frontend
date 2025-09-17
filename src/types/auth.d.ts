import type { Role } from "./common";

export interface SignupInput{
    name:string,
    email:string,
    password:string
}

export interface OTPVerificationInput{
    email:string,
    otp:string,
    role:Role
}

export interface signinInput{
    role:string;
    email:string;
    password:string
}