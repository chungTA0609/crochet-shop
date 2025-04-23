"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types
export type User = {
    id: string
    name: string
    email: string
    phone: string
    role: "admin" | "customer"
    createdAt: Date
    lastLogin?: Date
    status: "active" | "inactive" | "blocked"
    orders?: string[] // Order IDs
    address?: {
        street: string
        city: string
        province: string
        postalCode: string
    }
}

// Context type
type UserContextType = {
    users: User[]
    getUser: (id: string) => User | undefined
    createUser: (user: Omit<User, "id" | "createdAt">) => User
    updateUser: (id: string, userData: Partial<User>) => boolean
    deleteUser: (id: string) => boolean
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Sample data
const sampleUsers: User[] = [
    {
        id: "user1",
        name: "Admin User",
        email: "admin@example.com",
        phone: "0901234567",
        role: "admin",
        createdAt: new Date("2025-01-01"),
        lastLogin: new Date("2025-04-20"),
        status: "active",
        address: {
            street: "123 Admin Street",
            city: "Admin City",
            province: "Admin Province",
            postalCode: "10000",
        },
    },
    {
        id: "user2",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0909876543",
        role: "customer",
        createdAt: new Date("2025-02-15"),
        lastLogin: new Date("2025-04-18"),
        status: "active",
        orders: ["ord1", "ord2"],
        address: {
            street: "123 Đường Lê Lợi, Phường Bến Nghé",
            city: "Quận 1",
            province: "TP Hồ Chí Minh",
            postalCode: "700000",
        },
    },
    {
        id: "user3",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0901122334",
        role: "customer",
        createdAt: new Date("2025-03-10"),
        lastLogin: new Date("2025-04-15"),
        status: "active",
        orders: ["ord3"],
        address: {
            street: "456 Đường Nguyễn Huệ",
            city: "Quận 3",
            province: "TP Hồ Chí Minh",
            postalCode: "700000",
        },
    },
    {
        id: "user4",
        name: "Lê Văn C",
        email: "levanc@example.com",
        phone: "0907788990",
        role: "customer",
        createdAt: new Date("2025-03-20"),
        status: "inactive",
        address: {
            street: "789 Đường Hai Bà Trưng",
            city: "Quận 3",
            province: "TP Hồ Chí Minh",
            postalCode: "700000",
        },
    },
]

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[]>(sampleUsers)

    // User Management
    const getUser = (id: string): User | undefined => {
        return users.find((user) => user.id === id)
    }

    const createUser = (userData: Omit<User, "id" | "createdAt">): User => {
        const newUser: User = {
            id: `user${users.length + 1}`,
            createdAt: new Date(),
            ...userData,
        }

        setUsers((prevUsers) => [...prevUsers, newUser])
        return newUser
    }

    const updateUser = (id: string, userData: Partial<User>): boolean => {
        const userIndex = users.findIndex((user) => user.id === id)

        if (userIndex === -1) {
            return false
        }

        const updatedUsers = [...users]
        updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...userData }

        setUsers(updatedUsers)
        return true
    }

    const deleteUser = (id: string): boolean => {
        const userIndex = users.findIndex((user) => user.id === id)

        if (userIndex === -1) {
            return false
        }

        const updatedUsers = users.filter((user) => user.id !== id)
        setUsers(updatedUsers)
        return true
    }

    return (
        <UserContext.Provider
            value={{
                users,
                getUser,
                createUser,
                updateUser,
                deleteUser,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

// Custom hook to use the user context
export function useUserAdmin() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUserAdmin must be used within a UserProvider")
    }
    return context
}
