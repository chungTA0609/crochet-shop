"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Plus, X, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { Category, Product } from "@/lib/constants"



export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [product, setProduct] = useState<Product | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData] = useState<Partial<Product>>({})
    const [newColor, setNewColor] = useState({ name: "", hex: "#ec4899" })
    const [newSize, setNewSize] = useState("")

    const productId = Number(params.id)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/api/categories")
                setCategories(response.data || [])
            } catch (err) {
                console.error("Failed to fetch categories:", err)
                // Don't set error state here as it's not critical
            }
        }

        fetchCategories()
    }, [])

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return

            setIsLoading(true)
            setError("")

            try {
                const response = await api.get(`/api/products/${productId}`)
                const productData = response.data

                if (productData) {
                    setProduct(productData)
                    setFormData({
                        name: productData.name,
                        price: productData.price,
                        image: productData.image,
                        images: productData.images || [],
                        category: productData.category,
                        description: productData.description || "",
                        longDescription: productData.longDescription || "",
                        colors: productData.colors || [],
                        sizes: productData.sizes || [],
                        specifications: productData.specifications || {},
                        dimensions: productData.dimensions || {},
                    })
                } else {
                    setError("Product not found")
                    toast({
                        title: "Sản phẩm không tồn tại",
                        description: "Không tìm thấy thông tin sản phẩm với ID đã cung cấp.",
                        variant: "destructive",
                    })
                }
            } catch (err) {
                setError("Failed to fetch product")
                toast({
                    title: "Lỗi khi tải sản phẩm",
                    description: "Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [productId])

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === "price") {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value),
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle specifications change
    const handleSpecificationChange = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [key]: value,
            },
        }))
    }

    // Handle dimensions change
    const handleDimensionChange = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            dimensions: {
                ...prev.dimensions,
                [key]: value,
            },
        }))
    }

    // Add new color
    const handleAddColor = () => {
        if (newColor.name.trim() === "") {
            toast({
                title: "Tên màu không được để trống",
                description: "Vui lòng nhập tên màu.",
                variant: "destructive",
            })
            return
        }

        setFormData((prev) => ({
            ...prev,
            colors: [...(prev.colors || []), { ...newColor, id: Date.now() }],
        }))

        setNewColor({ name: "", hex: "#ec4899" })
    }

    // Remove color
    const handleRemoveColor = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors?.filter((_, i) => i !== index),
        }))
    }

    // Add new size
    const handleAddSize = () => {
        if (newSize.trim() === "") {
            toast({
                title: "Kích thước không được để trống",
                description: "Vui lòng nhập kích thước.",
                variant: "destructive",
            })
            return
        }

        setFormData((prev) => ({
            ...prev,
            sizes: [...(prev.sizes || []), newSize],
        }))

        setNewSize("")
    }

    // Remove size
    const handleRemoveSize = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            sizes: prev.sizes?.filter((_, i) => i !== index),
        }))
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!product) return

        // Validate form data
        if (!formData.name || !formData.price || !formData.category) {
            toast({
                title: "Thông tin không đầy đủ",
                description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
                variant: "destructive",
            })
            return
        }

        setIsSaving(true)

        try {
            // Update product via API
            await api.put(`/api/products/${productId}`, formData)

            toast({
                title: "Cập nhật thành công",
                description: "Thông tin sản phẩm đã được cập nhật.",
            })

            router.push("/admin/products")
        } catch (err) {
            toast({
                title: "Cập nhật thất bại",
                description: "Đã xảy ra lỗi khi cập nhật thông tin sản phẩm. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Handle retry
    const handleRetry = () => {
        window.location.reload()
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Đang tải thông tin sản phẩm...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Không thể tải thông tin sản phẩm</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={handleRetry}>Thử lại</Button>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
                    <p className="text-muted-foreground mb-4">Sản phẩm không tồn tại hoặc đã bị xóa</p>
                    <Button asChild>
                        <Link href="/admin/products">Quay lại danh sách sản phẩm</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" asChild className="mr-2">
                        <Link href="/admin/products">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                            <CardDescription>Chỉnh sửa thông tin cơ bản của sản phẩm</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </Label>
                                <Input id="name" name="name" value={formData.name || ""} onChange={handleInputChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Giá <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Danh mục <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Hình ảnh chính</Label>
                                <Input id="image" name="image" value={formData.image || ""} onChange={handleInputChange} />
                                {formData.image && (
                                    <div className="relative w-20 h-20 mt-2 border rounded-md overflow-hidden">
                                        <Image src={formData.image || "/placeholder.svg"} alt="Product" fill className="object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả ngắn</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleInputChange}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="longDescription">Mô tả chi tiết</Label>
                                <Textarea
                                    id="longDescription"
                                    name="longDescription"
                                    value={formData.longDescription || ""}
                                    onChange={handleInputChange}
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <div className="space-y-6">
                        {/* Colors */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Màu sắc</CardTitle>
                                <CardDescription>Quản lý các màu sắc có sẵn cho sản phẩm</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors?.map((color, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }}></div>
                                            <span className="text-sm">{color.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveColor(index)}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="colorName">Tên màu</Label>
                                        <Input
                                            id="colorName"
                                            value={newColor.name}
                                            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                            placeholder="Nhập tên màu"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="colorHex">Mã màu</Label>
                                        <Input
                                            id="colorHex"
                                            type="color"
                                            value={newColor.hex}
                                            onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                                            className="w-16 h-10 p-1"
                                        />
                                    </div>
                                    <Button type="button" onClick={handleAddColor} className="mb-0.5">
                                        <Plus className="h-4 w-4 mr-1" /> Thêm
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sizes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kích thước</CardTitle>
                                <CardDescription>Quản lý các kích thước có sẵn cho sản phẩm</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {formData.sizes?.map((size, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                            <span className="text-sm uppercase">{size}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSize(index)}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="size">Kích thước</Label>
                                        <Input
                                            id="size"
                                            value={newSize}
                                            onChange={(e) => setNewSize(e.target.value)}
                                            placeholder="Nhập kích thước (vd: s, m, l, xl)"
                                        />
                                    </div>
                                    <Button type="button" onClick={handleAddSize} className="mb-0.5">
                                        <Plus className="h-4 w-4 mr-1" /> Thêm
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông số kỹ thuật</CardTitle>
                                <CardDescription>Thông tin chi tiết về sản phẩm</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(formData.specifications || {}).map(([key, value], index) => (
                                    <div key={index} className="grid grid-cols-2 gap-4">
                                        <Input
                                            value={key}
                                            onChange={(e) => {
                                                const newSpecs = { ...formData.specifications } as Record<string, string>
                                                const oldValue = newSpecs[key]
                                                delete newSpecs[key]
                                                newSpecs[e.target.value] = oldValue
                                                setFormData({ ...formData, specifications: newSpecs })
                                            }}
                                            placeholder="Tên thông số"
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                value={value}
                                                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                placeholder="Giá trị"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newSpecs = { ...formData.specifications } as Record<string, string>
                                                    delete newSpecs[key]
                                                    setFormData({ ...formData, specifications: newSpecs })
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newSpecs = { ...formData.specifications } as Record<string, string>
                                        newSpecs[`Thông số ${Object.keys(newSpecs).length + 1}`] = ""
                                        setFormData({ ...formData, specifications: newSpecs })
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Thêm thông số
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Dimensions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kích thước sản phẩm</CardTitle>
                                <CardDescription>Thông tin về kích thước sản phẩm</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(formData.dimensions || {}).map(([key, value], index) => (
                                    <div key={index} className="grid grid-cols-2 gap-4">
                                        <Input
                                            value={key}
                                            onChange={(e) => {
                                                const newDims = { ...formData.dimensions } as Record<string, string>
                                                const oldValue = newDims[key]
                                                delete newDims[key]
                                                newDims[e.target.value] = oldValue
                                                setFormData({ ...formData, dimensions: newDims })
                                            }}
                                            placeholder="Tên kích thước"
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                value={value}
                                                onChange={(e) => handleDimensionChange(key, e.target.value)}
                                                placeholder="Giá trị"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    const newDims = { ...formData.dimensions } as Record<string, string>
                                                    delete newDims[key]
                                                    setFormData({ ...formData, dimensions: newDims })
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const newDims = { ...formData.dimensions } as Record<string, string>
                                        newDims[`Kích thước ${Object.keys(newDims).length + 1}`] = ""
                                        setFormData({ ...formData, dimensions: newDims })
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Thêm kích thước
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Hủy</Link>
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Lưu thay đổi
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
