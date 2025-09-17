import { createAsyncThunk } from "@reduxjs/toolkit";
import type { OTPVerificationInput, signinInput, SignupInput } from "../../types/auth";
import { AxiosError } from "axios";
import userAxiosInstance from "../../config/userAxiosInstance";






export const sendOTP = createAsyncThunk(
    "/send-otp",
    async (singupInput: SignupInput, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.post('/auth/signup', singupInput);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    }
)


export const verifyOTP = createAsyncThunk(
    "/verify-otp",
    async (inputData:OTPVerificationInput, { rejectWithValue }) => {
        try {
            console.log(inputData);
            const result = await userAxiosInstance.post('/auth/otp/send', inputData);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    }
)

export const resendOTP = createAsyncThunk(
    "/resend-otp",
    async (email:string, { rejectWithValue }) => {
        try {
            console.log(email);
            const result = await userAxiosInstance.post('/auth/otp/resend', {email});
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const signin = createAsyncThunk(
    "/signin",
    async ({role,email,password}:signinInput, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.post(`/auth/signin`, {role,email,password});
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const logout = createAsyncThunk(
    "/logout",
    async (_, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.post(`/auth/logout`);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            console.log(error);
            
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const userTokenRefresh = createAsyncThunk(
    "/auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.post(`/auth/refresh`);
            console.log(result);
            return result.data
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            console.log(error);

            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const googleSignIn = createAsyncThunk(
    "/auth/googleAuth",
    async (payload:{token:string,role:string}, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.post(`/auth/google`,payload);
            console.log(result);
            return result.data
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            console.log(error);

            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const verifyEmail = createAsyncThunk(
    "/reset/verifyEmail",
    async (input:{email:string,role:string}, { rejectWithValue }) => {
        try {
            console.log(input);
            const result = await userAxiosInstance.post('/auth/reset/email', input);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const verifyResetOTP = createAsyncThunk(
    "/reset/verifyEmail",
    async (input:{email:string,otp:string}, { rejectWithValue }) => {
        try {
            console.log(input);
            const result = await userAxiosInstance.post('/auth/reset/otp', input);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const resetPassword = createAsyncThunk(
    "/reset/verifyEmail",
    async (input:{email:string,role:string,password:string}, { rejectWithValue }) => {
        try {
            console.log(input);
            const result = await userAxiosInstance.post('/auth/reset', input);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data
        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)
