export const API = {
    ADMIN:{
        SIGNIN:"/admin/signin",
        LOGOUT:"/admin/logout",
        LEARNERS:"/admin/learners",
        INSTRUCTORS:"/admin/instructors",
        BUSINESSES:"/admin/businesses",
        LEARNER_STATUS:"/admin/learner/status",
        INSTRUCTOR_STATUS:"/admin/instructor/status",
        BUSINESS_STATUS:"/admin/business/status",
        INSTRUCTOR_VERIFICATION:"/admin/instructor/verifcation",
        BUSINESS_VERIFICATION:"admin/business/verification",
        CATEGORY:"/admin/category",
        CATEGORIES:"/admin/categories",
        STATUS:"/admin/category/status"

    },
    AUTH: {
        SIGNUP: "/auth/signup",
        SIGNIN: "/auth/signin",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        RESEND_OTP: "/auth/otp/resend",
        VERIFY_OTP: "/auth/otp/send",
        GOOGLE_SIGNIN:"/auth/google",
        VERIFY_EMAIL:'/auth/reset/email',
        VERIFY_RESET_OTP:'/auth/reset/otp',
        RESET_PASSWORD:'/auth/reset'
    },
    LEARNER: {
        DASHBOARD: "/learner/dashboard",
        PROFILE: "/learner/profile",
        COURSES: "/learner/courses",
        PROFILE_IMAGE:`/learner/profile/image`,
        PASSWORD:`/learner/password`,
    },
    INSTRUCTOR: {
        DASHBOARD: "/instructor/dashboard",
        COURSES: "/instructor/courses",
        CREATE_COURSE: "/instructor/courses/create",
        PROFILE:`/instructor/profile`,
        PROFILE_IMAGE:`/instructor/profile/image`,
        RESUME:`/instructor/profile/resume`,
        ID_PROOF:`/instructor/profile/identity-proof`,
        EXPERTISE:`/instructor/profile/expertise`,
        PASSWORD:`/instructor/password`,
        VERIFICATION:`/instructor/verification`
    },
    BUSINESS: {
        DASHBOARD: "/business/dashboard",
        EMPLOYEES: "/business/employees",
        PLANS: "/business/plans",
        PROFILE:`/business/profile`,
        PROFILE_IMAGE:`/business/profile/image`,
        LICENSE:`/business/profile/license`,
        PASSWORD:`/business/password`,
        VERIFICATION:`/business/verification`
    },

} as const;
