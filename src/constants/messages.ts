export const MESSAGES = {
    ERRORS: {
        REQUIRED_FIELD: "This field is required.",
        INVALID_EMAIL: "Please enter a valid email address.",
        PASSWORD_MISMATCH: "Passwords do not match.",
        OTP_EXPIRED: "Your OTP has expired. Please request a new one.",
        UNAUTHORIZED: "You are not authorized to perform this action.",
        SERVER_ERROR: "Something went wrong. Please try again later.",
    },
    SUCCESS: {
        SIGNUP: "Signup successful! Please check your email for OTP.",
        LOGIN: "Login successful! Redirecting...",
        OTP_RESENT: "A new OTP has been sent to your email.",
        PROFILE_UPDATED: "Profile updated successfully!",
    },
    INFO: {
        LOADING: "Loading, please wait...",
        NO_DATA: "No data available.",
        SESSION_EXPIRED: "Your session has expired. Please login again.",
    },
} as const;
