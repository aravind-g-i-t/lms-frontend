import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../config/axiosInstance";
import type { AdminSigninRequest } from "../types/api/admin";
import { API } from "../constants/api";







export const adminSignin = createAsyncThunk(
    "/admin-signin",
    async ({ email, password }: AdminSigninRequest, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(API.ADMIN.SIGNIN, { email, password });
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
            const result = await axiosInstance.post(API.ADMIN.LOGOUT);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data;
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

            const res = await axiosInstance.get(API.ADMIN.LEARNERS, {
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
    async ({ page, limit, search, status, verificationStatus }: { page: number; limit: number; search: string; status: 'All' | 'Active' | 'Blocked'; verificationStatus: "All" | "Not Submitted" | "Under Review" | "Verified" | "Rejected"; }, { rejectWithValue }) => {
        try {
            console.log(page, status, limit, search);

            const res = await axiosInstance.get(API.ADMIN.INSTRUCTORS, {
                params: { page, limit, search, status, verificationStatus },
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
    async ({ page, limit, search, status, verificationStatus }: { page: number; limit: number; search: string; status: 'All' | 'Active' | 'Blocked'; verificationStatus: "All" | "Not Submitted" | "Under Review" | "Verified" | "Rejected"; }, { rejectWithValue }) => {
        try {
            console.log(page, status, limit, search);

            const res = await axiosInstance.get(API.ADMIN.BUSINESSES, {
                params: { page, limit, search, status, verificationStatus },
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
            const res = await axiosInstance.patch(API.ADMIN.LEARNER_STATUS, {
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
            const res = await axiosInstance.patch(API.ADMIN.INSTRUCTOR_STATUS, {
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
            const res = await axiosInstance.patch(API.ADMIN.BUSINESS_STATUS, {
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







// export const getInstructorVerifications = createAsyncThunk(
//     "admin/instructorVerifications",
//     async ({ page, limit, search, status }: { page: number; limit: number; search: string; status: 'All' | 'Pending' | 'Rejected'|"Verified" }, { rejectWithValue }) => {
//         try {
//             console.log(page, status, limit, search);

//             const res = await axiosInstance.get("/admin/verifications/instructors", {
//                 params: { page, limit, search, status },
//             });

//             return res.data;
//         } catch (error: unknown) {
//             if (error instanceof AxiosError) {
//                 console.log(error.response?.data);
//                 return rejectWithValue(error.response?.data?.message || "Invalid request");
//             }
//             console.log(error);

//             return rejectWithValue("Something went wrong. Please try again.");
//         }
//     },
// )

export const getBusinessData = createAsyncThunk(
    "admin/business",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/admin/business/${id}`);

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

export const getLearnerData = createAsyncThunk(
    "admin/learner",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/admin/learner/${id}`);

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

export const getInstructorData = createAsyncThunk(
    "admin/instructor",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/admin/instructor/${id}`);

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

export const updateInstructorVerificationStatus = createAsyncThunk(
    "admin/instructor/verification",
    async ({ id, status, remarks }: { id: string, status: string, remarks: string | null }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(API.ADMIN.INSTRUCTOR_VERIFICATION, {
                id,
                status,
                remarks
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

export const updateBusinessVerificationStatus = createAsyncThunk(
    "admin/business/verification",
    async ({ id, status, remarks }: { id: string, status: string, remarks: string | null }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(API.ADMIN.BUSINESS_VERIFICATION, {
                id,
                status,
                remarks
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

export const addCategory = createAsyncThunk(
    "/category/add",
    async ({ name, description, isActive }: { name: string; description: string, isActive: boolean }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(API.ADMIN.CATEGORY, { name, description, isActive });
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            return result.data;

        } catch (error: unknown) {

            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                return rejectWithValue(error.response?.data?.message || "Invalid request");
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    },
)

export const updateCategory = createAsyncThunk(
    "/category/update",
    async ({ id, name, description, isActive }: { id: string, name: string; description: string, isActive: boolean }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.put(API.ADMIN.CATEGORY, { id, name, description, isActive });
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

export const toggleCategoryStatus = createAsyncThunk(
    "/admin/category/status",
    async ({ id }: { id: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.ADMIN.STATUS, { id });
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

export const getCategories = createAsyncThunk(
    "admin/categories",
    async (
        { page, limit, search, status }: { page: number; limit: number; search: string; status: 'All' | 'Active' | 'Blocked' },
        { rejectWithValue }
    ) => {
        try {
            console.log(page, status, limit, search);

            const res = await axiosInstance.get(API.ADMIN.CATEGORIES, {
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

export const getCoursesForAdmin = createAsyncThunk(
    "admin/courses",
    async (
        { page, limit, search, status, verificationStatus }: { page: number; limit: number; search: string; status?: string, verificationStatus?: string },
        { rejectWithValue }
    ) => {
        try {
            console.log(page, status, limit, search);

            const res = await axiosInstance.get(API.ADMIN.COURSES, {
                params: { page, limit, search, status, verificationStatus },
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

export const updateCourseVerification = createAsyncThunk(
    "/admin/course/status",
    async (input: { courseId: string, status: string, remarks: string | null }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("/admin/course/verification", input);
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

export const createCoupon = createAsyncThunk(
    "/admin/coupon/create",
    async (input: {
        description: string;
        code: string;
        discountType: string;
        discountValue: number;
        maxDiscount: number | null;
        minCost: number;
        expiresAt: Date;
        isActive: boolean;
        usageLimit: number;
    }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post("/admin/coupon", input);
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

export const getCoupons = createAsyncThunk(
    "admin/coupons",
    async (
        { page, limit, search, isActive }: { page: number; limit: number; search: string; isActive?:boolean  },
        { rejectWithValue }
    ) => {
        try {
            console.log(page, isActive, limit, search);

            const res = await axiosInstance.get("/admin/coupons", {
                params: { page, limit, search, isActive },
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

export const updateCoupon = createAsyncThunk(
    "/admin/coupon/update",
    async (input: {
        id:string
        description: string;
        code: string;
        discountType: string;
        discountValue: number;
        maxDiscount: number | null;
        minCost: number;
        expiresAt: Date;
        isActive: boolean;
        usageLimit: number;
    }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.put("/admin/coupon", input);
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

export const updateCouponStatus = createAsyncThunk(
    "/admin/coupon/status/update",
    async (id:string, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("/admin/coupon/status", {id});
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

export const getCourseDetailsForAdmin = createAsyncThunk(
    "admin/course/details",
    async (
        id: string,
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/admin/course", {
                params: { id },
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

export const getAdminDashboard = createAsyncThunk(
    "admin/dashboard",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/admin/dashboard`);
            console.log(res.data);
            
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