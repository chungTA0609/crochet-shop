export type UserRole = "ADMIN" | "CUSTOMER" | "USER" | "MANAGER"

export interface User {
    id: string
    name: string
    email: string
    firstName: string
    lastName: string
    roles: UserRole[]
    avatar?: string
    phone?: string
    address?: string
    createdAt?: string
    lastLogin?: string
    isVerified?: boolean
    permissions?: string[]
}

export interface UserProfile extends User {
    bio?: string
    website?: string
    socialLinks?: {
        facebook?: string
        instagram?: string
        twitter?: string
    }
    preferences?: {
        newsletter: boolean
        marketing: boolean
        notifications: boolean
    }
}

export const getRoleColor = (role: UserRole): string => {
    switch (role) {
        case "ADMIN":
            return "bg-red-100 text-red-800 border-red-200"
        case "MANAGER":
            return "bg-purple-100 text-purple-800 border-purple-200"
        case "CUSTOMER":
            return "bg-green-100 text-green-800 border-green-200"
        case "USER":
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

export const getRoleDescription = (role: UserRole): string => {
    switch (role) {
        case "ADMIN":
            return "Quản trị viên có toàn quyền truy cập và quản lý hệ thống."
        case "MANAGER":
            return "Quản lý có thể quản lý sản phẩm, đơn hàng và người dùng."
        case "CUSTOMER":
            return "Khách hàng có thể mua hàng và quản lý tài khoản cá nhân."
        case "USER":
        default:
            return "Người dùng có thể xem sản phẩm và quản lý tài khoản cá nhân."
    }
}

export const getRolePermissions = (role: UserRole): string[] => {
    const permissions: Record<UserRole, string[]> = {
        ADMIN: [
            "Quản lý người dùng",
            "Quản lý sản phẩm",
            "Quản lý đơn hàng",
            "Quản lý danh mục",
            "Quản lý khuyến mãi",
            "Xem báo cáo và thống kê",
            "Cấu hình hệ thống",
            "Quản lý thanh toán",
            "Quản lý vận chuyển",
        ],
        MANAGER: [
            "Quản lý sản phẩm",
            "Quản lý đơn hàng",
            "Quản lý danh mục",
            "Quản lý khuyến mãi",
            "Xem báo cáo và thống kê",
        ],
        CUSTOMER: ["Mua hàng", "Quản lý tài khoản cá nhân", "Xem lịch sử đơn hàng", "Đánh giá sản phẩm"],
        USER: ["Xem sản phẩm", "Quản lý tài khoản cá nhân"],
    }

    return permissions[role] || permissions.USER
}
