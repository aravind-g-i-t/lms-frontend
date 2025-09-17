import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import userAxiosInstance from "../../config/userAxiosInstance";


export const updateLearnerProfile = createAsyncThunk(
    "learner/profile/update",
    async ({id,data}:{id:string,data:{name?:string,imageURL?:string}}, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.patch(`/learner/profile`, {id,data});
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

export const learnerResetPassword = createAsyncThunk(
    "learner/profile/password",
    async (input:{id:string,currentPassword:string,newPassword:string}, { rejectWithValue }) => {
        try {
            const result = await userAxiosInstance.patch(`/learner/password`, input);
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