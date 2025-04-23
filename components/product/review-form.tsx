"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, Upload, X } from "lucide-react"
import { useReview, type ReviewImage } from "@/contexts/review-context"
import { toast } from "@/components/ui/use-toast"

interface ReviewFormProps {
    productId: number
    userId: string
    userName: string
    verified: boolean
    onSuccess?: () => void
}

export function ReviewForm({ productId, userId, userName, verified, onSuccess }: ReviewFormProps) {
    const { addReview } = useReview()
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState("")
    const [images, setImages] = useState<ReviewImage[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // In a real app, you would upload these files to a server
        // For now, we'll just create local URLs
        const newImages: ReviewImage[] = []

        for (let i = 0; i < files.length; i++) {
            if (images.length + newImages.length >= 5) {
                toast({
                    title: "Giới hạn hình ảnh",
                    description: "Bạn chỉ có thể tải lên tối đa 5 hình ảnh.",
                    variant: "destructive",
                })
                break
            }

            const file = files[i]
            // In a real app, this would be the URL returned from your server
            // For demo purposes, we're using a placeholder
            newImages.push({
                id: `img${Date.now()}-${i}`,
                url: "/images/product-1.jpg", // Placeholder image
            })
        }

        setImages([...images, ...newImages])
    }

    // Remove an image
    const handleRemoveImage = (imageId: string) => {
        setImages(images.filter((img) => img.id !== imageId))
    }

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (rating === 0) {
            toast({
                title: "Vui lòng chọn số sao",
                description: "Bạn cần chọn số sao đánh giá cho sản phẩm.",
                variant: "destructive",
            })
            return
        }

        if (!comment.trim()) {
            toast({
                title: "Vui lòng nhập nội dung đánh giá",
                description: "Bạn cần nhập nội dung đánh giá cho sản phẩm.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        // Add review
        try {
            addReview({
                productId,
                userId,
                userName,
                rating,
                comment,
                images,
                verified,
            })

            // Reset form
            setRating(0)
            setComment("")
            setImages([])

            // Call success callback if provided
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            toast({
                title: "Đã xảy ra lỗi",
                description: "Không thể gửi đánh giá. Vui lòng thử lại sau.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="rating" className="block mb-2">
                    Đánh giá của bạn <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="text-2xl focus:outline-none"
                        >
                            <Star
                                className={`h-8 w-8 ${star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating} sao` : "Chưa đánh giá"}</span>
                </div>
            </div>

            <div>
                <Label htmlFor="comment" className="block mb-2">
                    Nhận xét của bạn <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    rows={4}
                />
            </div>

            <div>
                <Label htmlFor="images" className="block mb-2">
                    Hình ảnh (tối đa 5 ảnh)
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((image) => (
                        <div key={image.id} className="relative w-20 h-20 border rounded-md overflow-hidden group">
                            <Image src={image.url || "/placeholder.svg"} alt="Review" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(image.id)}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {images.length < 5 && (
                        <label className="w-20 h-20 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Tải lên</span>
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
        </form>
    )
}
