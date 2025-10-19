import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import { API } from "../../constants/api";


export const getLearnerProfile = createAsyncThunk(
    "learner/profile",
    async (_ ,{ rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(API.LEARNER.PROFILE);
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


export const updateLearnerProfile = createAsyncThunk(
    "learner/profile/update",
    async (data:{name:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.LEARNER.PROFILE, data);
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

export const updateLearnerProfileImage = createAsyncThunk(
    "learner/profile/image/update",
    async (data:{imageURL:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.LEARNER.PROFILE_IMAGE, data);
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

// export const resetLearnerPassword = createAsyncThunk(
//     "learner/profile/password",
//     async (input:{currentPassword:string,newPassword:string}, { rejectWithValue }) => {
//         try {
//             const result = await axiosInstance.patch(API.LEARNER.PASSWORD, input);
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

export const learnerResetPassword = createAsyncThunk(
    "learner/profile/password",
    async (input:{id:string,currentPassword:string,newPassword:string}, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.LEARNER.PASSWORD, input);
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