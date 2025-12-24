import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosInstance";
import { AxiosError } from "axios";

export const getVideoCallToken = createAsyncThunk(
    "/video/token",
    async (input: {roomId:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/video/token", input);

            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            console.log(error);

            return rejectWithValue("Something went wrong. Please try again.");
        }
    }
);