import axios from "axios";
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { logout, userTokenRefresh } from "../redux/services/userAuthServices";
import { toast } from "react-toastify";

const apiURL = import.meta.env.VITE_API_URL

const axiosInstance: AxiosInstance = axios.create({
    baseURL: apiURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
});

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
});


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const errData = error.response?.data as ErrorResponse | undefined;

        if (
            error.response?.status === 401 &&
            errData?.message === "Invalid or expired token" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const res = await store.dispatch(userTokenRefresh()).unwrap();
                const newAccessToken = res.accessToken;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest);
            } catch{
                await store.dispatch(logout());
                toast.error("Session has expired. Please login again.")
            }
        }

        if (errData?.message) {
            toast.error(errData.message);
        } else if (error.message === "Network Error") {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("Something went wrong. Please try again.");
        }

        return Promise.reject(error);
    }
);

interface ErrorResponse {
    success: boolean;
    message: string;
}


export default axiosInstance;