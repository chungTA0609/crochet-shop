"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import api, { setAuthToken } from "@/lib/axios"
import { toast } from "@/components/ui/use-toast"

// Define user type
export interface User {
    id: string
    email: string
    name: string
    role: "admin" | "customer"
    avatar?: string
}

// Define auth context type
interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
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

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("auth_token")

            if (token) {
                setAuthToken(token)
                try {
                    const response = await api.get("/api/auth/me")
                    setUser(response.data.user)
                } catch (error) {
                    // Token is invalid or expired
                    setAuthToken(null)
                }
            }

            setIsLoading(false)
        }

        checkAuth()
    }, [])

    // Redirect based on auth state
    useEffect(() => {
        if (!isLoading) {
            // Redirect authenticated users away from auth pages
            if (user && (pathname?.includes("/auth/login") || pathname?.includes("/auth/register"))) {
                router.push("/")
            }

            // Redirect unauthenticated users away from protected pages
            const protectedRoutes = ["/profile", "/orders", "/checkout"]
            if (!user && protectedRoutes.some((route) => pathname?.startsWith(route))) {
                router.push("/auth/login")
            }

            // Redirect non-admin users away from admin pages
            if (user?.role !== "admin" && pathname?.startsWith("/admin")) {
                router.push("/")
                toast({
                    title: "Truy cập bị từ chối",
                    description: "Bạn không có quyền truy cập trang quản trị.",
                    variant: "destructive",
                })
            }
        }
    }, [user, isLoading, pathname, router])

    // Login function
    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await api.post("/api/auth/login", { email, password })
            const { token, user } = response.data

            setAuthToken(token)
            setUser(user)

            toast({
                title: "Đăng nhập thành công",
                description: `Chào mừng trở lại, ${user.name}!`,
            })

            router.push("/")
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
            const { token, user } = response.data

            setAuthToken(token)
            setUser(user)

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
        setAuthToken(null)
        setUser(null)

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
        isAuthenticated: !!user,
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
