import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import type { UpdateBusinessProfileInput } from "../types/serviceInput";
import { API } from "../../constants/api";


export const getBusinessProfile = createAsyncThunk(
    "business/profile",
    async (_ ,{ rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(API.BUSINESS.PROFILE);
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
            const result = await axiosInstance.patch(API.BUSINESS.PROFILE, data);
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
            const result = await axiosInstance.patch(API.BUSINESS.PROFILE_IMAGE, data);
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
            const result = await axiosInstance.patch(API.BUSINESS.LICENSE, data);
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
            const result = await axiosInstance.patch(API.BUSINESS.PASSWORD, input);
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
            const result = await axiosInstance.post(API.BUSINESS.VERIFICATION);
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

