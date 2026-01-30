import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../config/axiosInstance";
import type { UpdateInstructorProfileInput } from "../redux/types/serviceInput";
import { API } from "../constants/api";


export const getInstructorProfile = createAsyncThunk(
    "instructor/profile",
    async (_, { rejectWithValue }) => {
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
    async (data: UpdateInstructorProfileInput, { rejectWithValue }) => {
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
    async (data: { imageURL: string }, { rejectWithValue }) => {
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
    async (data: { expertise: string[] }, { rejectWithValue }) => {
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
    async (data: { resume: string }, { rejectWithValue }) => {
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
    async (data: { identityProof: string }, { rejectWithValue }) => {
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

export const applyForInstructorVerification = createAsyncThunk(
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
    async (input: { currentPassword: string, newPassword: string }, { rejectWithValue }) => {
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


export const createCourse = createAsyncThunk(
    "/courses/create",
    async ({ title, description, prerequisites, categoryId, price, level, tags, whatYouWillLearn }: { title: string; description: string, prerequisites: string[], categoryId: string, price: number; level: string; tags: string[], whatYouWillLearn: string[] }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post(API.INSTRUCTOR.COURSE, { title, description, prerequisites, categoryId, price, level, tags, whatYouWillLearn });

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

export const getCategoryOptions = createAsyncThunk(
    "/categories/options",
    async (_, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.get(API.INSTRUCTOR.CATEGORIES);

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

export const getCoursesForInstructor = createAsyncThunk(
    "instructor/courses",
    async (
        { page, limit, search, status }: { page: number; limit: number; search: string; status: string },
        { rejectWithValue }
    ) => {
        try {
            console.log(page, status, limit, search);

            const res = await axiosInstance.get(API.INSTRUCTOR.COURSES, {
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


export const getCourseDetails = createAsyncThunk(
    "instructor/course/details",
    async (
        id: string,
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get(API.INSTRUCTOR.COURSE, {
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

export const updateCourseInfo = createAsyncThunk(
    "instructor/course/info/update",
    async (input: { id: string, title: string, description: string, categoryId: string, level: string, price: number }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.COURSE_INFO, input);


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

export const updateCourseThumbnail = createAsyncThunk(
    "instructor/course/thumbnail/update",
    async (input: { id: string, thumbnail: string | null }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.COURSE_THUMBNAIL, input);


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

export const updateCoursePreviewVideo = createAsyncThunk(
    "instructor/course/preview-video/update",
    async (input: { id: string, previewVideo: string | null }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.COURSE_PREVIEW_VIDEO, input);


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


export const updateCoursePrerequisites = createAsyncThunk(
    "instructor/course/prerequisites/update",
    async (input: { id: string, prerequisites: string[] }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.COURSE_PREREQUISITES, input);


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


export const updateCourseTags = createAsyncThunk(
    "instructor/course/tags/update",
    async (input: { id: string, tags: string[] }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.COURSE_TAGS, input);


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

export const updateCourseObjectives = createAsyncThunk(
    "instructor/course/objectives/update",
    async (input: { id: string, whatYouWillLearn: string[] }, { rejectWithValue }) => {
        try {
            console.log(input);

            const result = await axiosInstance.patch(API.INSTRUCTOR.COURSE_OBJECTIVES, input);


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

export const addNewModule = createAsyncThunk(
    "instructor/course/module/add",
    async (input: { id: string, title: string, description: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.ADD_MODULE, input);

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

export const updateModuleInfo = createAsyncThunk(
    "instructor/course/module/update",
    async (input: { courseId: string, moduleId: string, title: string, description: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.UPDATE_MODULE, input);

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

export const deleteModule = createAsyncThunk(
    "instructor/course/module/delete",
    async (input: { courseId: string, moduleId: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/module/delete", input);

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

export const addChapter = createAsyncThunk(
    "instructor/course/chapter/add",
    async (input: { courseId: string, moduleId: string, title: string, description: string, video: string, duration: number }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch(API.INSTRUCTOR.ADD_CHAPTER, input);

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


export const updateChapterInfo = createAsyncThunk(
    "instructor/course/chapter/update",
    async (input: { courseId: string, moduleId: string, chapterId: string, title: string, description: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/chapter/update", input);

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

export const updateVideo = createAsyncThunk(
    "instructor/course/video/update",
    async (input: { courseId: string, moduleId: string, chapterId: string, duration: number, video: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/video/update", input);

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

export const deleteChapter = createAsyncThunk(
    "instructor/course/chapter/delete",
    async (input: { courseId: string, moduleId: string, chapterId: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/chapter/delete", input);

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

export const submitCourseForReview = createAsyncThunk(
    "instructor/course/verification",
    async (input: { courseId: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/verification", input);

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

export const updateCourseStatus = createAsyncThunk(
    "instructor/course/status",
    async (input: { courseId: string, status: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/status", input);

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

export const addResource = createAsyncThunk(
    "instructor/course/resource/add",
    async (input: { courseId: string, moduleId: string, chapterId: string, name: string, file: string, size: number }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/resource/add", input);

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

export const deleteResource = createAsyncThunk(
    "instructor/course/resource/delete",
    async (input: { courseId: string, moduleId: string, chapterId: string, resourceId: string }, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.patch("instructor/course/resource/delete", input);

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

export const createQuiz = createAsyncThunk(
    "instructor/course/quiz/add",
    async (input: { courseId: string },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.post("/instructor/course/quiz", input);

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

export const updateQuiz = createAsyncThunk(
    "instructor/course/quiz/update",
    async (input: { quizId: string, passingScore: number; timeLimitMinutes: number | null; },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.patch("/instructor/course/quiz", input);

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


export const addQuestion = createAsyncThunk(
    "instructor/course/quiz/question/add",
    async (input: {
        quizId: string;
        question: string;
        options: string[];
        correctAnswer: number;
        points: number;
        explanation: string | null;
    },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.post("/instructor/course/quiz/question", input);

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

export const updateQuestion = createAsyncThunk(
    "instructor/course/quiz/question/update",
    async (input: {
        quizId: string;
        questionId: string
        question: string;
        options: string[];
        correctAnswer: number;
        points: number;
        explanation: string | null;
    },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.patch("/instructor/course/quiz/question", input);

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

export const deleteQuestion = createAsyncThunk(
    "instructor/course/quiz/question/delete",
    async (input: {
        quizId: string;
        questionId: string;
    },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.delete("/instructor/course/quiz/question", {
                params: input
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

export const deleteQuiz = createAsyncThunk(
    "instructor/course/quiz/delete",
    async (input: {
        quizId: string;
        courseId: string;
    },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.delete("/instructor/course/quiz", {
                params: input
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

export const getInstructorConversations = createAsyncThunk(
    "instructor/conversations",
    async (input: { courseId?: string, learnerId?: string, limit: number, page: number, search?: string ,selectedCourse?:string},
        { rejectWithValue }
    ) => {
        try {
            console.log(input);
            
            const res = await axiosInstance.get("/instructor/conversations", {
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

export const getInstructorMessages = createAsyncThunk(
    "instructor/messages",
    async (input: { conversationId: string; offset?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.get("/instructor/messages", { params: input });

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


export const deleteInstructorMessages = createAsyncThunk(
    "instructor/messages/delete",
    async (input: { messageIds:string[], scope:"ME"|"EVERYONE" },
        { rejectWithValue }
    ) => {
        try {

            const res = await axiosInstance.post("/instructor/messages/delete",  input );

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

export const getCourseOptions = createAsyncThunk(
    "instructor/course/options",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/instructor/course/options");

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

export const createLiveSession = createAsyncThunk(
    "instructor/session/create",
    async (input:{courseId:string; scheduledAt:Date,durationInMinutes:number,description:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/instructor/session",input);

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

export const GetLiveSessionsForInstructor = createAsyncThunk(
    "instructor/sessions",
    async (input:{page:number,limit:number,status?:string,search:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/instructor/sessions",{
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

export const startLiveSession = createAsyncThunk(
    "instructor/session/start",
    async (input:{sessionId:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/instructor/session/start",input);

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

export const endLiveSession = createAsyncThunk(
    "instructor/session/end",
    async (input:{sessionId:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post("/instructor/session/end",input);

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

export const GetInstructorEarnings = createAsyncThunk(
    "instructor/earnings",
    async (input:{page:number,limit:number,status?:string,search?:string},
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/instructor/earnings",{
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

export const GetInstructorDashboard = createAsyncThunk(
    "instructor/dashboard",
    async (_,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get("/instructor/dashboard");

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