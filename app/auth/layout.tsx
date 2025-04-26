import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Brand/Logo */}
            <div className="bg-pink-50 md:w-1/2 flex flex-col justify-center items-center p-8">
                <Link href="/" className="mb-8">
                    <Image src="/images/logo.png" alt="Tiểu Phương Crochet" width={150} height={150} className="mx-auto" />
                </Link>
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold text-pink-700 mb-4">Tiểu Phương Crochet</h1>
                    <p className="text-gray-600 mb-6">
                        Chào mừng đến với cửa hàng đồ móc thủ công của chúng tôi. Đăng nhập để khám phá các sản phẩm độc đáo và mẫu
                        móc mới nhất.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-pink-700">Sản phẩm thủ công</h3>
                            <p className="text-sm text-gray-500">Các sản phẩm móc thủ công chất lượng cao</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-pink-700">Mẫu móc độc quyền</h3>
                            <p className="text-sm text-gray-500">Các mẫu móc độc quyền từ nhà thiết kế</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Auth Form */}
            <div className="md:w-1/2 flex justify-center items-center p-8">
                <div className="w-full max-w-md">{children}</div>
            </div>

            <Toaster />
        </div>
    )
}
