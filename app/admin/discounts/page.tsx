"use client"

import { useState } from "react"
import Link from "next/link"
import { useAdmin, type PromoCode } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { Search, Plus, MoreHorizontal, Edit, Trash, Check, X } from "lucide-react"

export default function DiscountsPage() {
    const { promoCodes, updatePromoCode, deletePromoCode } = useAdmin()
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [promoToDelete, setPromoToDelete] = useState<string | null>(null)

    // Filter promo codes based on search term
    const filteredPromoCodes = promoCodes.filter(
        (promo) =>
            promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (promo.type === "percentage" && `${promo.value}%`.includes(searchTerm)) ||
            (promo.type === "fixed" && formatCurrency(promo.value).includes(searchTerm)),
    )

    // Handle promo code deletion
    const handleDeleteClick = (promoId: string) => {
        setPromoToDelete(promoId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (promoToDelete) {
            const success = deletePromoCode(promoToDelete)
            if (success) {
                toast({
                    title: "Xóa mã giảm giá thành công",
                    description: "Mã giảm giá đã được xóa khỏi hệ thống.",
                })
            } else {
                toast({
                    title: "Xóa mã giảm giá thất bại",
                    description: "Đã xảy ra lỗi khi xóa mã giảm giá. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
            setDeleteDialogOpen(false)
            setPromoToDelete(null)
        }
    }

    // Handle promo code status toggle
    const handleStatusToggle = (promo: PromoCode) => {
        const success = updatePromoCode(promo.id, { isActive: !promo.isActive })
        if (success) {
            toast({
                title: `Mã giảm giá đã ${promo.isActive ? "tắt" : "bật"}`,
                description: `Mã giảm giá ${promo.code} đã được ${promo.isActive ? "tắt" : "bật"}.`,
            })
        } else {
            toast({
                title: "Cập nhật trạng thái thất bại",
                description: "Đã xảy ra lỗi khi cập nhật trạng thái mã giảm giá. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    // Format promo code value
    const formatPromoValue = (promo: PromoCode) => {
        if (promo.type === "percentage") {
            return `${promo.value}%`
        } else if (promo.type === "fixed") {
            return formatCurrency(promo.value)
        } else {
            return "Miễn phí vận chuyển"
        }
    }

    // Format promo code type
    const formatPromoType = (type: string) => {
        switch (type) {
            case "percentage":
                return "Phần trăm"
            case "fixed":
                return "Số tiền cố định"
            case "free_shipping":
                return "Miễn phí vận chuyển"
            default:
                return type
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
                <Button asChild>
                    <Link href="/admin/discounts/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm mã giảm giá
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách mã giảm giá</CardTitle>
                    <CardDescription>Quản lý tất cả mã giảm giá trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm mã giảm giá..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã giảm giá</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Giá trị</TableHead>
                                    <TableHead>Đơn hàng tối thiểu</TableHead>
                                    <TableHead>Thời hạn</TableHead>
                                    <TableHead>Đã sử dụng</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPromoCodes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            Không tìm thấy mã giảm giá nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPromoCodes.map((promo) => (
                                        <TableRow key={promo.id}>
                                            <TableCell className="font-medium">{promo.code}</TableCell>
                                            <TableCell>{formatPromoType(promo.type)}</TableCell>
                                            <TableCell>{formatPromoValue(promo)}</TableCell>
                                            <TableCell>
                                                {promo.minimumOrderAmount ? formatCurrency(promo.minimumOrderAmount) : "Không giới hạn"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>Từ: {promo.startDate.toLocaleDateString("vi-VN")}</div>
                                                    <div>Đến: {promo.endDate.toLocaleDateString("vi-VN")}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {promo.usageCount}/{promo.maxUsage || "∞"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        checked={promo.isActive}
                                                        onCheckedChange={() => handleStatusToggle(promo)}
                                                        aria-label="Toggle status"
                                                    />
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${promo.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {promo.isActive ? "Hoạt động" : "Không hoạt động"}
                                                    </span>
                                                </div>
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
                                                            <Link href={`/admin/discounts/${promo.id}`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Chỉnh sửa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(promo.id)}>
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleStatusToggle(promo)}>
                                                            {promo.isActive ? (
                                                                <>
                                                                    <X className="h-4 w-4 mr-2" />
                                                                    Tắt mã giảm giá
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Check className="h-4 w-4 mr-2" />
                                                                    Bật mã giảm giá
                                                                </>
                                                            )}
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
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa mã giảm giá</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa mã giảm giá này? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
