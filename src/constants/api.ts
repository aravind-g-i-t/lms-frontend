export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: "/auth/signup",
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REFRESH_TOKEN: "/auth/refresh-token",
        SEND_OTP: "/auth/otp/send",
        RESEND_OTP: "/auth/otp/resend",
        VERIFY_OTP: "/auth/otp/verify",
    },
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
