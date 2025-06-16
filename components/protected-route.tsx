"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
    children: React.ReactNode
    adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
            } else if (adminOnly &&  user?.roles.includes("admin")) {
                router.push("/")
            }
        }
    }, [isAuthenticated, isLoading, router, adminOnly, user])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!isAuthenticated || (adminOnly && user?.roles.includes("admin"))) {
        return null
    }

    return <>{children}</>
}
