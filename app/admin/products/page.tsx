"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Pagination } from "@/components/pagination"
import { Search, Plus, MoreHorizontal, Edit, Trash, Eye, Loader2 } from "lucide-react"

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const pageSize = 10 // Number of items per page

    // Fetch products from API
    const fetchProducts = async (page = currentPage) => {
        try {
            setLoading(true)
            setError("")

            const response = await api.post("/api/products/get-list", {
                keyword: searchTerm,
                sortBy: "",
                sortDirection: "asc",
                page: page,
                size: pageSize,
            })

            setProducts(response.data.data.content || [])
            setTotalItems(response.data.data.totalElements || 0)
            setTotalPages(response.data.data.totalPages || 1)
            setCurrentPage(page)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch products")
            console.error("Error fetching products:", err)
        } finally {
            setLoading(false)
        }
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchProducts(page)
    }

    // Initial fetch
    useEffect(() => {
        fetchProducts(1)
    }, [])

    // Fetch when search term changes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(1) // Reset to first page on search
        }, 500) // Debounce search

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Handle product deletion
    const handleDeleteClick = (productId: number) => {
        setProductToDelete(productId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (productToDelete !== null) {
            try {
                setIsDeleting(true)

                // Call API to delete product
                await api.delete(`/api/products/${productToDelete}`)

                // Remove from local state
                setProducts(products.filter((product) => product.id !== productToDelete))

                // Refresh the current page if it's now empty (except for the first page)
                if (products.length === 1 && currentPage > 1) {
                    fetchProducts(currentPage - 1)
                } else {
                    // Refresh current page to update counts
                    fetchProducts(currentPage)
                }

                toast({
                    title: "Xóa sản phẩm thành công",
                    description: "Sản phẩm đã được xóa khỏi hệ thống.",
                })
            } catch (err: any) {
                toast({
                    title: "Xóa sản phẩm thất bại",
                    description: err.response?.data?.message || "Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            } finally {
                setIsDeleting(false)
                setDeleteDialogOpen(false)
                setProductToDelete(null)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách sản phẩm</CardTitle>
                    <CardDescription>Quản lý tất cả sản phẩm trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Lỗi khi tải dữ liệu</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                    <div className="mt-4">
                                        <Button size="sm" onClick={() => fetchProducts(currentPage)}>
                                            Thử lại
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Tồn kho</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                                <span>Đang tải dữ liệu...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {searchTerm ? "Không tìm thấy sản phẩm nào phù hợp" : "Chưa có sản phẩm nào"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                                        <Image
                                                            src={product.image || "/placeholder.svg"}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                                                    {product.category}
                                                </span>
                                            </TableCell>
                                            <TableCell>{formatCurrency(product.price)}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(product as any).stock > 10
                                                        ? "bg-green-100 text-green-800"
                                                        : (product as any).stock > 0
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {(product as any).stock !== undefined
                                                        ? (product as any).stock > 0
                                                            ? `${(product as any).stock} sản phẩm`
                                                            : "Hết hàng"
                                                        : "Không giới hạn"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Mở menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/product/${product.id}`} target="_blank">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem sản phẩm
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/products/${product.id}`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Chỉnh sửa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(product.id)}>
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!loading && products.length > 0 && (
                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-sm text-muted-foreground">
                                    Hiển thị {(currentPage - 1) * pageSize + 1} đến {Math.min(currentPage * pageSize, totalItems)} trong
                                    số {totalItems} sản phẩm
                                </p>
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xóa"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
