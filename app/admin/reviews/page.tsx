"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Image from "next/image"
import { useReview } from "@/contexts/review-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Search, Star, CheckCircle, XCircle, MessageSquare } from "lucide-react"

export default function AdminReviewsPage() {
    const { reviews, approveReview, rejectReview, replyToReview } = useReview()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
    const [replyDialogOpen, setReplyDialogOpen] = useState(false)
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
    const [replyText, setReplyText] = useState("")

    // Filter reviews based on search term and status
    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || review.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Sort reviews by date (newest first)
    const sortedReviews = [...filteredReviews].sort((a, b) => b.date.getTime() - a.date.getTime())

    // Format date
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    // Handle review approval
    const handleApproveReview = (reviewId: string) => {
        const success = approveReview(reviewId)
        if (success) {
            toast({
                title: "Đánh giá đã được phê duyệt",
                description: "Đánh giá này sẽ được hiển thị công khai.",
            })
        } else {
            toast({
                title: "Không thể phê duyệt đánh giá",
                description: "Đã xảy ra lỗi khi phê duyệt đánh giá. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    // Handle review rejection
    const handleRejectReview = (reviewId: string) => {
        const success = rejectReview(reviewId)
        if (success) {
            toast({
                title: "Đánh giá đã bị từ chối",
                description: "Đánh giá này sẽ không được hiển thị công khai.",
            })
        } else {
            toast({
                title: "Không thể từ chối đánh giá",
                description: "Đã xảy ra lỗi khi từ chối đánh giá. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    // Open reply dialog
    const handleOpenReplyDialog = (reviewId: string) => {
        setSelectedReviewId(reviewId)
        setReplyText("")
        setReplyDialogOpen(true)
    }

    // Handle reply submission
    const handleSubmitReply = () => {
        if (!selectedReviewId) return

        if (!replyText.trim()) {
            toast({
                title: "Nội dung phản hồi trống",
                description: "Vui lòng nhập nội dung phản hồi.",
                variant: "destructive",
            })
            return
        }

        const success = replyToReview(selectedReviewId, replyText)
        if (success) {
            toast({
                title: "Đã gửi phản hồi",
                description: "Phản hồi của bạn đã được gửi thành công.",
            })
            setReplyDialogOpen(false)
            setSelectedReviewId(null)
            setReplyText("")
        } else {
            toast({
                title: "Không thể gửi phản hồi",
                description: "Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách đánh giá</CardTitle>
                    <CardDescription>Quản lý tất cả đánh giá sản phẩm</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm đánh giá..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Tabs
                            defaultValue="all"
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as "all" | "pending" | "approved" | "rejected")}
                            className="w-full md:w-auto"
                        >
                            <TabsList className="grid grid-cols-4 h-auto">
                                <TabsTrigger value="all">Tất cả</TabsTrigger>
                                <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
                                <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
                                <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>Đánh giá</TableHead>
                                    <TableHead>Nội dung</TableHead>
                                    <TableHead>Ngày đánh giá</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedReviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Không tìm thấy đánh giá nào
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedReviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell>
                                                <div className="font-medium">{review.userName}</div>
                                                {review.verified && (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                                        Đã mua hàng
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="relative w-8 h-8 rounded overflow-hidden">
                                                        <Image
                                                            src={`/images/product-${review.productId}.jpg`}
                                                            alt="Product"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm">ID: {review.productId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs truncate">{review.comment}</div>
                                                {review.images.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {review.images.map((image, index) => (
                                                            <div key={image.id} className="relative w-6 h-6 rounded overflow-hidden">
                                                                <Image
                                                                    src={image.url || "/placeholder.svg"}
                                                                    alt={`Image ${index + 1}`}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {review.reply && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                                                        <MessageSquare className="h-3 w-3" />
                                                        <span>Đã phản hồi</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{formatDate(review.date)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        review.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : review.status === "approved"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                    }
                                                >
                                                    {review.status === "pending"
                                                        ? "Chờ duyệt"
                                                        : review.status === "approved"
                                                            ? "Đã duyệt"
                                                            : "Đã từ chối"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {review.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                onClick={() => handleApproveReview(review.id)}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Duyệt
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => handleRejectReview(review.id)}
                                                            >
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                Từ chối
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() => handleOpenReplyDialog(review.id)}
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        {review.reply ? "Sửa phản hồi" : "Phản hồi"}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Reply Dialog */}
            <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Phản hồi đánh giá</DialogTitle>
                        <DialogDescription>
                            Phản hồi của bạn sẽ được hiển thị công khai dưới đánh giá của khách hàng.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reply">Nội dung phản hồi</Label>
                            <Textarea
                                id="reply"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Nhập nội dung phản hồi..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmitReply}>Gửi phản hồi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
