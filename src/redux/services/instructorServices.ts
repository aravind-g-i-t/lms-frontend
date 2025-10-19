import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import type { UpdateInstructorProfileInput } from "../types/serviceInput";
import { API } from "../../constants/api";


export const getInstructorProfile = createAsyncThunk(
    "instructor/profile",
    async (_ ,{ rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(API.INSTRUCTOR.PROFILE);
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

export const updateInstructorProfile = createAsyncThunk(
    "instructor/profile/update",
    async (data:UpdateInstructorProfileInput, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.PROFILE, data);
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


export const updateInstructorProfileImage = createAsyncThunk(
    "instructor/profile/image/update",
    async (data:{imageURL:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.PROFILE_IMAGE, data);
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

export const updateInstructorExpertise = createAsyncThunk(
    "instructor/profile/expertise/update",
    async (data:{expertise:string[]}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.EXPERTISE, data);
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

export const updateInstructorResume = createAsyncThunk(
    "instructor/profile/resume/update",
    async (data:{resume:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.RESUME, data);
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

export const updateInstructorIDProof = createAsyncThunk(
    "instructor/profile/IDProof/update",
    async (data:{identityProof:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.ID_PROOF, data);
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

export const applyForInstructorVerification  = createAsyncThunk(
    "instructor/verification",
    async (_, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(API.INSTRUCTOR.VERIFICATION);
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

export const resetInstructorPassword = createAsyncThunk(
    "instructor/profile/password",
    async (input:{currentPassword:string,newPassword:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.PASSWORD, input);
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


