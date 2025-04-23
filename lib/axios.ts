import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { toast } from "@/components/ui/use-toast";

// Constants for configuration
const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
    TIMEOUT: 10000,
    HEADERS: {
        "Content-Type": "application/json",
    },
};

// Error configuration
interface ErrorConfig {
    status: number;
    title: string;
    description: string;
}

const ERROR_CONFIGS: Record<number, ErrorConfig> = {
    401: {
        status: 401,
        title: "Phiên đăng nhập hết hạn",
        description: "Vui lòng đăng nhập lại để tiếp tục.",
    },
    403: {
        status: 403,
        title: "Không có quyền truy cập",
        description: "Bạn không có quyền thực hiện hành động này.",
    },
    404: {
        status: 404,
        title: "Không tìm thấy",
        description: "Không tìm thấy tài nguyên yêu cầu.",
    },
    500: {
        status: 500,
        title: "Lỗi máy chủ",
        description: "Đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau.",
    },
};

// Create axios instance
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

// Utility function to check if running in browser
const isBrowser = () => typeof window !== "undefined";

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (isBrowser()) {
            const token = localStorage.getItem("auth_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        config.headers["X-Request-Time"] = Date.now().toString();
        return config;
    },
    (error: AxiosError) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Handle error response
const handleError = (error: AxiosError): Promise<never> => {
    const status = error.response?.status;
    const errorMessage = (error.response?.data as any)?.message || error.message;

    if (isBrowser() && status === 401) {
        localStorage.removeItem("auth_token");
        // Consider using a navigation library instead of window.location
        // e.g., useRouter from next/navigation
    }

    const errorConfig = status && ERROR_CONFIGS[status];

    toast({
        title: errorConfig?.title || "Đã xảy ra lỗi",
        description: errorConfig?.description || errorMessage,
        variant: "destructive",
    });

    return Promise.reject(error);
};

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    handleError
);

// Add method to update auth token
export const setAuthToken = (token: string | null) => {
    if (isBrowser()) {
        if (token) {
            localStorage.setItem("auth_token", token);
        } else {
            localStorage.removeItem("auth_token");
        }
    }
};

export default api;