export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    SIGNUP: "/signup",
    VERIFY_OTP: "/verify-otp",
    DASHBOARD: "/dashboard",

    LEARNER: {
        DASHBOARD: "/learner/dashboard",
        PROFILE: "/learner/profile",
        COURSES: "/learner/courses",
    },
    INSTRUCTOR: {
        DASHBOARD: "/instructor/dashboard",
        COURSES: "/instructor/courses",
        CREATE_COURSE: "/instructor/courses/create",
    },
    ORGANISATION: {
        DASHBOARD: "/organisation/dashboard",
        EMPLOYEES: "/organisation/employees",
        PLANS: "/organisation/plans",
    },
} as const;
