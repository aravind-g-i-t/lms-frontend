import { createAsyncThunk } from "@reduxjs/toolkit";

import { AxiosError } from "axios";
import type { GoogleSigninRequest, OTPVerificationRequest, ResendOTPRequest, ResetPasswordRequest, SigninRequest, SignupRequest, VerifyEmailRequest, VerifyResetOTPRequest } from "../../types/api/auth";
import axiosInstance from "../../config/axiosInstance";






export const sendOTP = createAsyncThunk(
    "/send-otp",
    async (singupInput: SignupRequest, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post('/auth/signup', singupInput);
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
    async (inputData:OTPVerificationRequest, { rejectWithValue }) => {
        try {
            console.log(inputData);
            const result = await axiosInstance.post('/auth/otp/send', inputData);
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
    async (input:ResendOTPRequest, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post('/auth/otp/resend', input);
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
    async (input:SigninRequest, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(`/auth/signin`, input);
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
            const result = await axiosInstance.post(`/auth/logout`);
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
            const result = await axiosInstance.post(`/auth/refresh`);
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
    async (payload:GoogleSigninRequest, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(`/auth/google`,payload);
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
    async (input:VerifyEmailRequest, { rejectWithValue }) => {
        try {
            console.log(input);
            const result = await axiosInstance.post('/auth/reset/email', input);
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
    async (input:VerifyResetOTPRequest, { rejectWithValue }) => {
        try {
            console.log(input);
            const result = await axiosInstance.post('/auth/reset/otp', input);
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
    async (input:ResetPasswordRequest, { rejectWithValue }) => {
        try {
            console.log(input);
            const result = await axiosInstance.post('/auth/reset', input);
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
