import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { adminSigninInput } from "../../types/admin";
import adminAxiosInstance from "../../config/adminAxiosInstance";







export const adminSignin = createAsyncThunk(
    "/admin-signin",
    async ({ email, password }: adminSigninInput, { rejectWithValue }) => {
        try {
            const result = await adminAxiosInstance.post(`/admin/signin`, { email, password });
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

export const adminLogout = createAsyncThunk(
    "/admin-logout",
    async (_, { rejectWithValue }) => {
        try {
            const result = await adminAxiosInstance.post(`/admin/logout`);
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


export const getLearners = createAsyncThunk(
    "admin/getLearners",
    async (
        { page, limit, search, status }: { page: number; limit: number; search: string; status: 'All' | 'Active' | 'Blocked' },
        { rejectWithValue }
    ) => {
        try {
            console.log(page, status, limit, search);

            const res = await adminAxiosInstance.get("/admin/learners", {
                params: { page, limit, search, status },
            });

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

export const getInstructors = createAsyncThunk(
    "admin/getInstructors",
    async ({ page, limit, search, status }: { page: number; limit: number; search: string; status: 'All' | 'Active' | 'Blocked' }, { rejectWithValue }) => {
        try {
            console.log(page, status, limit, search);

            const res = await adminAxiosInstance.get("/admin/instructors", {
                params: { page, limit, search, status },
            });

            return res.data;
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


export const getBusinesses = createAsyncThunk(
    "admin/getBusinesses",
    async ({ page, limit, search, status }: { page: number; limit: number; search: string; status: 'All' | 'Active' | 'Blocked' }, { rejectWithValue }) => {
        try {
            console.log(page, status, limit, search);

            const res = await adminAxiosInstance.get("/admin/businesses", {
                params: { page, limit, search, status },
            });

            return res.data;
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


export const toggleLearnerStatus = createAsyncThunk(
    "admin/toggleLearnerStatus",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const res = await adminAxiosInstance.patch("/admin/learner/status", {
                id
            });

            return res.data;
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

export const toggleInstructorStatus = createAsyncThunk(
    "admin/toggleLearnerStatus",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const res = await adminAxiosInstance.patch("/admin/instructor/status", {
                id
            });

            return res.data;
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

export const toggleBusinessStatus = createAsyncThunk(
    "admin/toggleLearnerStatus",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const res = await adminAxiosInstance.patch("/admin/business/status", {
                id
            });

            return res.data;
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


export const adminTokenRefresh = createAsyncThunk(
    "/admin/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const result = await adminAxiosInstance.post(`/admin/refresh`);
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