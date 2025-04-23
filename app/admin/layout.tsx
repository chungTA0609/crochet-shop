"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    Tags,
    Truck,
    MessageSquare,
    Settings,
    LogOut,
    Code,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`)
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/users", label: "Người dùng", icon: Users },
        { href: "/admin/products", label: "Sản phẩm", icon: ShoppingBag },
        { href: "/admin/orders", label: "Đơn hàng", icon: Package },
        { href: "/admin/reviews", label: "Đánh giá", icon: MessageSquare },
        { href: "/admin/discounts", label: "Mã giảm giá", icon: Tags },
        { href: "/admin/shipping", label: "Vận chuyển", icon: Truck },
        { href: "/admin/api-example", label: "API Example", icon: Code },
        { href: "/admin/settings", label: "Cài đặt", icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:block">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-xl">Admin Panel</span>
                    </Link>
                </div>
                <nav className="px-3 py-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Button
                                    asChild
                                    variant={isActive(item.href) ? "default" : "ghost"}
                                    className={`w-full justify-start ${isActive(item.href) ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="px-3 py-2 mt-auto">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b h-16 flex items-center px-6">
                    <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
