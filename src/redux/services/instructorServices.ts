import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import type { UpdateInstructorProfileInput } from "../types/serviceInput";


export const getInstructorProfile = createAsyncThunk(
    "instructor/profile",
    async (_ ,{ rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(`/instructor/profile`);
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
            const result = await axiosInstance.patch(`/instructor/profile`, {data});
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
            const result = await axiosInstance.patch(`/instructor/profile/image`, data);
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
            const result = await axiosInstance.patch(`/instructor/profile/expertise`, data);
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
            const result = await axiosInstance.patch(`/instructor/profile/resume`, data);
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
            const result = await axiosInstance.post(`/instructor/verification`);
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
            const result = await axiosInstance.patch(`/instructor/password`, input);
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


// export const updateLearnerProfile = createAsyncThunk(
//     "learner/profile/update",
//     async (data:{name?:string,imageURL?:string}, { rejectWithValue }) => {
//         try {
//             const result = await axiosInstance.patch(`/learner/profile`, {data});
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