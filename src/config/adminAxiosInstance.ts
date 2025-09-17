import axios from "axios";
import type{ AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { adminTokenRefresh } from "../redux/services/adminServices";

const apiURL= import.meta.env.VITE_API_URL

const adminAxiosInstance:AxiosInstance = axios.create({
    baseURL:apiURL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    },
});

adminAxiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const accessToken = state.admin.accessToken;
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
});

adminAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res=await store.dispatch(adminTokenRefresh()).unwrap();
                const newAccessToken = res.accessToken;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return adminAxiosInstance(originalRequest);
            } catch (refreshErr) {
                // await store.dispatch(adminLogout())
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);


export default adminAxiosInstance;