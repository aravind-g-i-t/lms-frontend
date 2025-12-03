import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import { API } from "../../constants/api";


export const getLearnerProfile = createAsyncThunk(
    "learner/profile",
    async (_, { rejectWithValue }) => {
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
    async (data: { name: string }, { rejectWithValue }) => {
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
    async (data: { imageURL: string }, { rejectWithValue }) => {
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
    async (input: { id: string, currentPassword: string, newPassword: string }, { rejectWithValue }) => {
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

export const getCoursesForLearners = createAsyncThunk(
    "learner/courses",
    async (input: { page?: number, limit: number, search?: string; sort: string; instructorIds?: string[]; categoryIds?: string[]; levels?: string[]; durationRange?: [number, number]; priceRange?: [number, number]; minRating?: number; learnerId:string|null},
        { rejectWithValue }
    ) => {
        try {
            console.log(input);

            const res = await axiosInstance.get(API.LEARNER.COURSES, {
                params: input,
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

export const getCourseDetailsForLearner = createAsyncThunk(
    "learner/course/preview",
    async ({ courseId, learnerId }: { courseId: string, learnerId: string | null },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/learner/course/preview", {
                params: { courseId, learnerId },
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

export const getCourseDetailsForCheckout = createAsyncThunk(
    "learner/course/checkout",
    async ({ courseId }: { courseId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/learner/course/checkout", {
                params: { courseId }
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

export const createPaymentSession = createAsyncThunk(
    "payment/initiate",
    async (
        {
            courseId,
            method,
            coupon,
        }: {
            courseId: string;
            method: string;
            coupon: string | null;
        },
        { rejectWithValue }
    ) => {
        try {
            console.log(courseId, method, coupon);

            const res = await axiosInstance.post("/payment/initiate", {
                courseId,
                method,
                coupon,
            });

            return res.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error("Payment session error:", error.response?.data);
                return rejectWithValue(
                    error.response?.data?.message || "Payment initialization failed"
                );
            }
            return rejectWithValue("Something went wrong. Please try again.");
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "payment/verify",
    async (sessionId: string,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/payment/verify", {
                params: { sessionId },
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

export const getEnrollments = createAsyncThunk(
    "learner/enrollments",
    async (input: { page?: number, limit: number, search?: string; },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/enrollments", {
                params: input,
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

export const getFullCourseForLearner = createAsyncThunk(
    "learner/course",
    async ({ courseId }: { courseId: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/learner/course/learn", {
                params: { courseId },
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

export const markChapterAsCompleted = createAsyncThunk(
    "learner/progress/chapter/complete",
    async (data: { courseId: string; chapterId:string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("learner/progress/chapter/complete", data);
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

export const addToFavourites = createAsyncThunk(
    "learner/favourites/add",
    async (data: { courseId: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post("learner/favourites", data);
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

export const removeFromFavourites = createAsyncThunk(
    "learner/favourites/delete",
    async (data: { courseId: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.delete(`learner/favourites/${data.courseId}`);
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

export const getFavourites = createAsyncThunk(
    "learner/favourites",
    async (input: { page?: number, limit: number, search?: string; },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/favourites", {
                params: input,
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