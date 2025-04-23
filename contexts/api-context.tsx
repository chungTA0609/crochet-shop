"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import api from "@/lib/axios"
import type { AxiosResponse } from "axios"

// Define context types
type ApiContextType = {
    loading: Record<string, boolean>
    get: <T>(url: string, config?: any) => Promise<T>
    post: <T>(url: string, data?: any, config?: any) => Promise<T>
    put: <T>(url: string, data?: any, config?: any) => Promise<T>
    patch: <T>(url: string, data?: any, config?: any) => Promise<T>
    delete: <T>(url: string, config?: any) => Promise<T>
    isLoading: (key: string) => boolean
}

// Create context
const ApiContext = createContext<ApiContextType | undefined>(undefined)

// Provider component
export function ApiProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState<Record<string, boolean>>({})

    // Helper to set loading state for a specific request
    const setLoadingState = (key: string, isLoading: boolean) => {
        setLoading((prev) => ({
            ...prev,
            [key]: isLoading,
        }))
    }

    // Check if a specific request is loading
    const isLoading = useCallback(
        (key: string) => {
            return loading[key] || false
        },
        [loading],
    )

    // Generic request handler with loading state
    const request = useCallback(async <T,>(method: string, url: string, data?: any, config?: any): Promise<T> => {
        const loadingKey = `${method}:${url}`
        setLoadingState(loadingKey, true)

        try {
            let response: AxiosResponse

            switch (method.toLowerCase()) {
                case "get":
                    response = await api.get(url, config)
                    break
                case "post":
                    response = await api.post(url, data, config)
                    break
                case "put":
                    response = await api.put(url, data, config)
                    break
                case "patch":
                    response = await api.patch(url, data, config)
                    break
                case "delete":
                    response = await api.delete(url, config)
                    break
                default:
                    throw new Error(`Unsupported method: ${method}`)
            }

            return response.data
        } catch (error) {
            // Error is already handled by the axios interceptor
            throw error
        } finally {
            setLoadingState(loadingKey, false)
        }
    }, [])

    // Wrapper methods for different HTTP methods
    const get = useCallback(<T,>(url: string, config?: any) => request<T>("get", url, null, config), [request])
    const post = useCallback(
        <T,>(url: string, data?: any, config?: any) => request<T>("post", url, data, config),
        [request],
    )
    const put = useCallback(
        <T,>(url: string, data?: any, config?: any) => request<T>("put", url, data, config),
        [request],
    )
    const patch = useCallback(
        <T,>(url: string, data?: any, config?: any) => request<T>("patch", url, data, config),
        [request],
    )
    const del = useCallback(<T,>(url: string, config?: any) => request<T>("delete", url, null, config), [request])

    return (
        <ApiContext.Provider
            value={{
                loading,
                get,
                post,
                put,
                patch,
                delete: del,
                isLoading,
            }}
        >
            {children}
        </ApiContext.Provider>
    )
}

// Custom hook to use the API context
export function useApi() {
    const context = useContext(ApiContext)
    if (context === undefined) {
        throw new Error("useApi must be used within an ApiProvider")
    }
    return context
}
