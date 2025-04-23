"use client"

import { useState } from "react"
import Link from "next/link"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Search, Plus, Edit, Trash, MapPin } from "lucide-react"

export default function ShippingPage() {
    const { shippingZones, deleteShippingZone } = useAdmin()
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [zoneToDelete, setZoneToDelete] = useState<string | null>(null)

    // Filter shipping zones based on search term
    const filteredZones = shippingZones.filter(
        (zone) =>
            zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            zone.regions.some((region) => region.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    // Handle shipping zone deletion
    const handleDeleteClick = (zoneId: string) => {
        setZoneToDelete(zoneId)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (zoneToDelete) {
            const success = deleteShippingZone(zoneToDelete)
            if (success) {
                toast({
                    title: "Xóa khu vực vận chuyển thành công",
                    description: "Khu vực vận chuyển đã được xóa khỏi hệ thống.",
                })
            } else {
                toast({
                    title: "Xóa khu vực vận chuyển thất bại",
                    description: "Đã xảy ra lỗi khi xóa khu vực vận chuyển. Vui lòng thử lại sau.",
                    variant: "destructive",
                })
            }
            setDeleteDialogOpen(false)
            setZoneToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý vận chuyển</h1>
                <Button asChild>
                    <Link href="/admin/shipping/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm khu vực vận chuyển
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Khu vực vận chuyển</CardTitle>
                    <CardDescription>Quản lý các khu vực vận chuyển và phương thức vận chuyển</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm khu vực..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {filteredZones.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Không tìm thấy khu vực vận chuyển nào</div>
                        ) : (
                            filteredZones.map((zone) => (
                                <AccordionItem key={zone.id} value={zone.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                                            <span>{zone.name}</span>
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                ({zone.regions.length} khu vực, {zone.methods.length} phương thức)
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4 p-2">
                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Khu vực áp dụng:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {zone.regions.map((region, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100"
                                                        >
                                                            {region}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Phương thức vận chuyển:</h4>
                                                <div className="rounded-md border">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Tên</TableHead>
                                                                <TableHead>Mô tả</TableHead>
                                                                <TableHead>Phí vận chuyển</TableHead>
                                                                <TableHead>Thời gian giao hàng</TableHead>
                                                                <TableHead>Trạng thái</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {zone.methods.map((method) => (
                                                                <TableRow key={method.id}>
                                                                    <TableCell className="font-medium">{method.name}</TableCell>
                                                                    <TableCell>{method.description || "Không có mô tả"}</TableCell>
                                                                    <TableCell>{formatCurrency(method.price)}</TableCell>
                                                                    <TableCell>{method.estimatedDeliveryDays}</TableCell>
                                                                    <TableCell>
                                                                        <span
                                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${method.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                                                }`}
                                                                        >
                                                                            {method.isActive ? "Hoạt động" : "Không hoạt động"}
                                                                        </span>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/shipping/${zone.id}`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Chỉnh sửa
                                                    </Link>
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(zone.id)}>
                                                    <Trash className="h-4 w-4 mr-2" />
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        )}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa khu vực vận chuyển</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa khu vực vận chuyển này? Hành động này không thể hoàn tác.
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
