"use client"

import { useState } from "react"
import { useApi } from "@/contexts/api-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/use-toast"

// Example product type
interface ProductApiResponse {
    id: number
    name: string
    price: number
    category: string
    // other fields...
}

export function ProductApiExample() {
    const api = useApi()
    const [products, setProducts] = useState<ProductApiResponse[]>([])

    // Example function to fetch products
    const fetchProducts = async () => {
        try {
            // In a real app, this would be a real API endpoint
            const data = await api.get<ProductApiResponse[]>("/api/products")
            setProducts(data)
            toast({
                title: "Sản phẩm đã được tải",
                description: `Đã tải ${data.length} sản phẩm.`,
            })
        } catch (error) {
            // Error is already handled by the axios interceptor
            console.error("Error fetching products:", error)
        }
    }

    // Example function to create a product
    const createProduct = async () => {
        try {
            // Example product data
            const newProduct = {
                name: "Sản phẩm mới",
                price: 150000,
                category: "Móc khóa",
                description: "Mô tả sản phẩm mới",
            }

            // In a real app, this would be a real API endpoint
            const data = await api.post<ProductApiResponse>("/api/products", newProduct)

            // Update products list
            setProducts((prev) => [...prev, data])

            toast({
                title: "Sản phẩm đã được tạo",
                description: `Sản phẩm "${data.name}" đã được tạo thành công.`,
            })
        } catch (error) {
            // Error is already handled by the axios interceptor
            console.error("Error creating product:", error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ví dụ sử dụng API</CardTitle>
                <CardDescription>Minh họa cách sử dụng API context với axios interceptors</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <Button onClick={fetchProducts} disabled={api.isLoading("get:/api/products")}>
                            {api.isLoading("get:/api/products") ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Đang tải...
                                </>
                            ) : (
                                "Tải sản phẩm"
                            )}
                        </Button>
                        <Button onClick={createProduct} disabled={api.isLoading("post:/api/products")}>
                            {api.isLoading("post:/api/products") ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Đang tạo...
                                </>
                            ) : (
                                "Tạo sản phẩm mới"
                            )}
                        </Button>
                    </div>

                    {products.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Danh sách sản phẩm:</h3>
                            <ul className="space-y-2">
                                {products.map((product) => (
                                    <li key={product.id} className="p-2 border rounded">
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Giá: {product.price.toLocaleString("vi-VN")}đ | Danh mục: {product.category}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
                Lưu ý: Đây chỉ là ví dụ minh họa. Trong môi trường thực tế, các API endpoint sẽ được thay thế bằng các endpoint
                thực.
            </CardFooter>
        </Card>
    )
}
