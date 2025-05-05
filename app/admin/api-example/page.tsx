"use client"

import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductApiExample } from "@/components/product/product-api-example"

export default function ApiExamplePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="container mx-auto p-8">
                    <h1 className="text-2xl font-bold mb-8">Ví dụ sử dụng API với Axios Interceptors</h1>

                    <div className="grid grid-cols-1 gap-8">
                        <ProductApiExample />

                        <div className="bg-white p-6 rounded-lg border">
                            <h2 className="text-lg font-medium mb-4">Giải thích về Axios Interceptors</h2>
                            <div className="prose max-w-none">
                                <p>
                                    Axios Interceptors cho phép chúng ta can thiệp vào quá trình gửi request và nhận response trước khi
                                    chúng được xử lý. Điều này rất hữu ích cho các tác vụ như:
                                </p>
                                <ul>
                                    <li>Thêm token xác thực vào header của mỗi request</li>
                                    <li>Xử lý lỗi một cách nhất quán trên toàn bộ ứng dụng</li>
                                    <li>Hiển thị trạng thái loading khi request đang được xử lý</li>
                                    <li>Làm mới token khi hết hạn</li>
                                    <li>Ghi log request và response</li>
                                </ul>
                                <p>Trong ví dụ này, chúng ta đã triển khai:</p>
                                <ol>
                                    <li>Request Interceptor để thêm token xác thực và timestamp</li>
                                    <li>Response Interceptor để xử lý lỗi và hiển thị thông báo</li>
                                    <li>Context API để quản lý trạng thái loading và cung cấp các phương thức API</li>
                                </ol>
                                <p>
                                    Khi sử dụng ApiContext, các component không cần phải xử lý lỗi hoặc quản lý trạng thái loading một
                                    cách thủ công, giúp code trở nên gọn gàng và dễ bảo trì hơn.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
