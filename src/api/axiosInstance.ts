// src/api/axiosInstance.ts
import axios, { AxiosHeaders } from 'axios';
import { useAuthStore } from '../store/authStore';
import { useConnectionStore } from '../store/connectionStore';

export const api = axios.create();

// interceptor pra sempre pegar a baseURL mais recente
api.interceptors.request.use((config) => {
    const baseUrl = useConnectionStore.getState().getBaseUrl?.();
    const token = useAuthStore.getState().user?.token;

    if (baseUrl) {
        // só seta se não tiver setado
        config.baseURL = baseUrl;
    }

    if (token) {
        // create an AxiosHeaders instance from the existing headers (if any)
        config.headers = AxiosHeaders.from({
            ...(config.headers || {}),
            Authorization: `Bearer ${token}`,
        });
    }

    return config;
});
