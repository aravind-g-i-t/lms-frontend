import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import type { UpdateBusinessProfileInput } from "../types/serviceInput";


export const getBusinessProfile = createAsyncThunk(
    "business/profile",
    async (_ ,{ rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(`/business/profile`);
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


export const updateBusinessProfile = createAsyncThunk(
    "business/profile/update",
    async (data:UpdateBusinessProfileInput, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(`/business/profile`, data);
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


export const updateBusinessProfileImage = createAsyncThunk(
    "business/profile/image/update",
    async (data:{imageURL:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(`/business/profile/image`, data);
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

export const updateBusinessLicense = createAsyncThunk(
    "business/profile/image/update",
    async (data:{license:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(`/business/profile/license`, data);
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

export const resetBusinessPassword = createAsyncThunk(
    "business/profile/password",
    async (input:{currentPassword:string,newPassword:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(`/business/password`, input);
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


export const applyForBusinessVerification  = createAsyncThunk(
    "business/verification",
    async (_, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(`/business/verification`);
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

// export const learnerResetPassword = createAsyncThunk(
//     "learner/profile/password",
//     async (input:{id:string,currentPassword:string,newPassword:string}, { rejectWithValue }) => {
//         try {
//             const result = await axiosInstance.patch(`/learner/password`, input);
//             console.log(result);


//             if (!result.data.success) {
//                 return rejectWithValue(result.data.message)
//             }
//             return result.data
//         } catch (error: unknown) {

//             if (error instanceof AxiosError) {
//                 console.log(error.response?.data);
//                 return rejectWithValue(error.response?.data?.message || "Invalid request");
//             }
//             return rejectWithValue("Something went wrong. Please try again.");
//         }
//     },
// )