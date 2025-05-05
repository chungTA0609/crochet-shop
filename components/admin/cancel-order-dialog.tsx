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
import { toast } from "@/components/ui/use-toast"

interface CancelOrderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderNumber: string
    onConfirm: (reason: string) => void
}

export function CancelOrderDialog({ open, onOpenChange, orderNumber, onConfirm }: CancelOrderDialogProps) {
    const [cancelReason, setCancelReason] = useState("")

    const handleConfirm = () => {
        if (!cancelReason.trim()) {
            toast({
                title: "Vui lòng nhập lý do hủy đơn",
                description: "Bạn cần nhập lý do hủy đơn hàng để tiếp tục.",
                variant: "destructive",
            })
            return
        }

        onConfirm(cancelReason)
        setCancelReason("") // Reset the reason after confirmation
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hủy đơn hàng</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn hủy đơn hàng #{orderNumber}? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lý do hủy đơn</label>
                        <Textarea
                            placeholder="Nhập lý do hủy đơn hàng"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Quay lại
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Hủy đơn hàng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
