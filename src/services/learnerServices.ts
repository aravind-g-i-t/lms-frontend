import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../config/axiosInstance";
import { API } from "../constants/api";


export const getLearnerProfile = createAsyncThunk(
    "learner/profile",
    async (_, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(API.LEARNER.PROFILE);
            console.log(result);

            if (!result.data.success) {
                return rejectWithValue(result.data.message)
            }
            console.log(result.data);
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
            couponId,
        }: {
            courseId: string;
            method: string;
            couponId: string | null;
        },
        { rejectWithValue }
    ) => {
        try {
            console.log(courseId, method, couponId);

            const res = await axiosInstance.post("/payment/initiate", {
                courseId,
                method,
                couponId,
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
            const result = await axiosInstance.post("/learner/favourites", data);
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

export const getConversationId = createAsyncThunk(
    "learner/conversation-id",
    async (input: { courseId:string,instructorId:string },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/conversation-id", {
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

export const getLearnerConversations = createAsyncThunk(
    "learner/conversations",
    async (input: { courseId:string },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/conversations", {
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

export const getQuizForLearner = createAsyncThunk(
    "learner/quiz",
    async (input: { courseId:string },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/quiz", {
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

interface SubmitQuizAttemptInput{
    quizId:string,
    courseId:string,
    answers:Answer[]
}

interface Answer{
    questionId: string;
    selectedOption: number|null;
}

export const submitQuizAttempt = createAsyncThunk(
    "learner/quiz",
    async (input: SubmitQuizAttemptInput,
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.post("/learner/quiz", input);

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


export const getLearnerCertificates = createAsyncThunk(
    "learner/certificates",
    async (input: {page:number,limit:number},
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/certificates", {params:input});

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

export const getLearnerMessages = createAsyncThunk(
    "learner/messages",
    async (input: {conversationId:string; offset?:number; limit?:number},
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/messages", {params:input});

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

export const getCourseVideo = createAsyncThunk(
    "learner/video",
    async (input: {courseId:string,moduleId:string,chapterId:string},
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/video", {params:input});

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

export const pingLearner = createAsyncThunk(
    "learner/ping",
    async (_,
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/learner/ping");

            console.log(res);
            
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

export const updateCurrentChapter = createAsyncThunk(
    "learner/progress/chapter/current",
    async (data: { courseId: string; chapterId:string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("learner/progress/chapter/current", data);
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

export const deleteLearnerMessages = createAsyncThunk(
    "learner/messages/delete",
    async (input: { messageIds:string[], scope:"ME"|"EVERYONE" },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.post("/learner/messages/delete",  input );

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

export const joinLiveSession = createAsyncThunk(
    "learner/session/join",
    async (input:{sessionId:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/learner/session/join",input);

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

export const getLiveSessionsForLearner = createAsyncThunk(
    "learner/sessions",
    async (input:{page:number,limit:number,status?:string,courseId:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/learner/sessions",{
                params: input,
            });

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
    }
);

export const submitReview = createAsyncThunk(
    "learner/course/review",
    async (input:{courseId:string; rating:number; reviewText:string|null},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/learner/course/review",input);

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


export const getReviewsForLearner = createAsyncThunk(
    "learner/course/reviews",
    async (input:{courseId:string; skip:number; limit:number}
,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/learner/course/reviews",{
                params: input,
            });

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
    }
);