"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UpdateOrderStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderNumber: string
    currentStatus: string
    onConfirm: (newStatus: string, note: string) => void
}

export function UpdateOrderStatusDialog({
    open,
    onOpenChange,
    orderNumber,
    currentStatus,
    onConfirm,
}: UpdateOrderStatusDialogProps) {
    const [newStatus, setNewStatus] = useState(currentStatus)
    const [statusNote, setStatusNote] = useState("")

    const handleConfirm = () => {
        onConfirm(newStatus, statusNote)
        setStatusNote("") // Reset the note after confirmation
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                    <DialogDescription>Cập nhật trạng thái cho đơn hàng #{orderNumber}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trạng thái mới</label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                <SelectItem value="paid">Đã thanh toán</SelectItem>
                                <SelectItem value="processing">Đang xử lý</SelectItem>
                                <SelectItem value="shipped">Đang giao hàng</SelectItem>
                                <SelectItem value="delivered">Đã giao hàng</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
                        <Textarea
                            placeholder="Nhập ghi chú cho trạng thái mới"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirm}>Cập nhật</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
