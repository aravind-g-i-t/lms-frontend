import axios from "axios";
import type{ AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import {  userTokenRefresh } from "../redux/services/userAuthServices";

const apiURL= import.meta.env.VITE_API_URL

const userAxiosInstance:AxiosInstance = axios.create({
    baseURL:apiURL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    },
});

userAxiosInstance.interceptors.request.use((config)=>{
    const state=store.getState();
    const accessToken=state.auth.accessToken;
    if(accessToken){
        config.headers.Authorization=`Bearer ${accessToken}`
    }
    return config;
});


userAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res=await store.dispatch(userTokenRefresh()).unwrap();
                const newAccessToken = res.accessToken
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                return userAxiosInstance(originalRequest);
            } catch (refreshErr) {
                // await store.dispatch(userLogout())
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);


export default userAxiosInstance;