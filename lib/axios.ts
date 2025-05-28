import axios from "axios"
import { getCookie } from "./cookies"

// Create axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from cookies
        const token = getCookie("auth_token")

        // If token exists, add to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // Dynamically set baseURL for GitHub API requests
        if (config.url?.startsWith("/repos/")) {
            config.baseURL = "https://api.github.com"; // Set GitHub API base URL
            config.headers.Accept = "application/vnd.github.v3+json"; // GitHub API version
            config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle errors
        const message = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."

        // You can handle specific error codes here
        if (error.response?.status === 401) {
            // Handle unauthorized error
            console.error("Unauthorized access")
        }

        return Promise.reject(error)
    },
)

export default api
