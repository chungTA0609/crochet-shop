"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import api from "@/lib/axios"
import { toast } from "@/components/ui/use-toast"
import { setCookie, getCookie, deleteCookie, areCookiesEnabled } from "@/lib/cookies"

// Define user type
export interface User {
    id: string
    email: string
    name: string
    roles: string[]
    avatar?: string
}

// Define auth context type
interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    checkAuth: () => Promise<boolean>
    login: (email: string, password: string, redirectPath?: string, rememberMe?: boolean) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, password: string) => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Utility function to check if running in browser
    const isBrowser = () => typeof window !== "undefined"

    // Check if cookies are enabled
    useEffect(() => {
        if (isBrowser() && !areCookiesEnabled()) {
            toast({
                title: "Cookie bị vô hiệu hóa",
                description: "Vui lòng bật cookie trong trình duyệt để sử dụng đầy đủ tính năng của trang web.",
                variant: "destructive",
            })
        }
    }, [])

    // Function to check authentication status
    const checkAuth = useCallback(async (): Promise<boolean> => {
        if (!isBrowser()) {
            return false
        }

        const token = getCookie("auth_token")

        if (!token) {
            setIsAuthenticated(false)
            return false
        }
        setIsAuthenticated(true)

        try {
            const response = await api.get("/api/user/profile")
            setIsAuthenticated(true)
            setUser(response.data.data)
            return true
        } catch (error) {
            // Token is invalid or expired
            deleteCookie("auth_token")
            setIsAuthenticated(false)
            return false
        }
    }, [])

    // Check if user is authenticated on mount
    useEffect(() => {
        const initialAuthCheck = async () => {
            await checkAuth()
            setIsLoading(false)
        }

        initialAuthCheck()
    }, [checkAuth])

    // Computed property for authentication status
    // Redirect based on auth state
    useEffect(() => {
        if (!isLoading && isBrowser()) {
            // Redirect authenticated users away from auth pages
            if (isAuthenticated && (pathname?.includes("/auth/login") || pathname?.includes("/auth/register"))) {
                // Get the redirect path from URL or use home page
                const params = new URLSearchParams(window.location.search)
                const redirectPath = params.get("redirect") || "/"
                router.push(redirectPath)
            }

            // Redirect unauthenticated users away from protected pages
            const protectedRoutes = ["/profile", "/orders", "/checkout"]
            if (!isAuthenticated && protectedRoutes.some((route) => pathname?.startsWith(route))) {
                // Store the current path for redirect after login
                router.push(`/auth/login?redirect=${encodeURIComponent(pathname || "/")}`)
            }

            // Redirect non-admin users away from admin pages
            if (!user?.roles.includes("ADMIN") && pathname?.startsWith("/admin")) {
                router.push("/")
                toast({
                    title: "Truy cập bị từ chối",
                    description: "Bạn không có quyền truy cập trang quản trị.",
                    variant: "destructive",
                })
            }
        }
    }, [isAuthenticated, user, isLoading, pathname, router])

    // Login function
    const login = async (email: string, password: string, redirectPath?: string, rememberMe = false) => {
        setIsLoading(true)
        try {
            const response = await api.post("/api/auth/login", { email, password })
            const { data } = response.data

            // Set cookie with token - use longer expiration if "remember me" is checked
            const cookieOptions = {
                days: rememberMe ? 30 : 1,
                secure: window.location.protocol === "https:",
                sameSite: "lax" as const,
            }

            setCookie("auth_token", data, cookieOptions)
            setIsAuthenticated(true)

            toast({
                title: "Đăng nhập thành công",
                description: `Chào mừng trở lại !`,
            })

            // Redirect to the specified path or home page
            router.push(redirectPath || "/")
        } catch (error) {
            // Error is handled by axios interceptor
        } finally {
            setIsLoading(false)
        }
    }

    // Register function
    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await api.post("/api/auth/register", { name, email, password })
            const { data } = response.data

            // Set cookie with token
            setCookie("auth_token", data, {
                days: 1,
                secure: window.location.protocol === "https:",
                sameSite: "lax" as const,
            })

            setIsAuthenticated(true)

            toast({
                title: "Đăng ký thành công",
                description: "Tài khoản của bạn đã được tạo thành công.",
            })

            router.push("/")
        } catch (error) {
            // Error is handled by axios interceptor
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        deleteCookie("auth_token")
        setUser(null)
        setIsAuthenticated(false)

        toast({
            title: "Đăng xuất thành công",
            description: "Bạn đã đăng xuất khỏi tài khoản.",
        })

        router.push("/")
    }

    // Forgot password function
    const forgotPassword = async (email: string) => {
        setIsLoading(true)
        try {
            await api.post("/api/auth/forgot-password", { email })

            toast({
                title: "Yêu cầu đặt lại mật khẩu đã được gửi",
                description: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
            })

            router.push("/auth/login")
        } catch (error) {
            // Error is handled by axios interceptor
        } finally {
            setIsLoading(false)
        }
    }

    // Reset password function
    const resetPassword = async (token: string, password: string) => {
        setIsLoading(true)
        try {
            await api.post("/api/auth/reset-password", { token, password })

            toast({
                title: "Mật khẩu đã được đặt lại",
                description: "Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.",
            })

            router.push("/auth/login")
        } catch (error) {
            // Error is handled by axios interceptor
        } finally {
            setIsLoading(false)
        }
    }

    const value = {
        user,
        isLoading,
        isAuthenticated,
        checkAuth,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
