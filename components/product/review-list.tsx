"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Star, ThumbsUp, ThumbsDown, MessageSquare, ChevronDown, ChevronUp, X } from "lucide-react"
import { useReview } from "@/contexts/review-context"
import { toast } from "@/components/ui/use-toast"

interface ReviewListProps {
    productId: number
    limit?: number
}

export function ReviewList({ productId, limit }: ReviewListProps) {
    const { getApprovedProductReviews, getRatingDistribution, getAverageRating, markHelpful, markNotHelpful } =
        useReview()
    const [showAll, setShowAll] = useState(false)
    const [expandedImages, setExpandedImages] = useState<string | null>(null)
    const [helpfulClicks, setHelpfulClicks] = useState<Record<string, "helpful" | "notHelpful" | null>>({})

    const reviews = getApprovedProductReviews(productId)
    const ratingDistribution = getRatingDistribution(productId)
    const averageRating = getAverageRating(productId)

    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort((a, b) => b.date.getTime() - a.date.getTime())

    // Limit the number of reviews shown if limit is provided and showAll is false
    const displayedReviews = showAll || !limit ? sortedReviews : sortedReviews.slice(0, limit)

    // Calculate the percentage for each rating
    const calculatePercentage = (rating: number) => {
        if (reviews.length === 0) return 0
        return (ratingDistribution[rating] / reviews.length) * 100
    }

    // Format date
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    // Handle helpful/not helpful clicks
    const handleHelpfulClick = (reviewId: string, type: "helpful" | "notHelpful") => {
        // Check if user has already clicked on this review
        if (helpfulClicks[reviewId]) {
            toast({
                title: "Bạn đã đánh giá phản hồi này rồi",
                description: "Bạn chỉ có thể đánh giá một lần cho mỗi phản hồi.",
            })
            return
        }

        // Update the review
        const success = type === "helpful" ? markHelpful(reviewId) : markNotHelpful(reviewId)

        if (success) {
            // Update local state to prevent multiple clicks
            setHelpfulClicks((prev) => ({
                ...prev,
                [reviewId]: type,
            }))

            toast({
                title: "Cảm ơn bạn đã đánh giá",
                description: "Phản hồi của bạn đã được ghi nhận.",
            })
        }
    }

    // Toggle expanded images
    const toggleExpandedImages = (imageId: string) => {
        setExpandedImages(expandedImages === imageId ? null : imageId)
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="text-center md:text-left">
                    <div className="text-5xl font-bold">{averageRating}</div>
                    <div className="flex justify-center md:justify-start mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-5 w-5 ${star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{reviews.length} đánh giá</div>
                </div>

                <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                            <div className="flex items-center">
                                <span className="text-sm w-2">{rating}</span>
                                <Star className="h-4 w-4 text-yellow-400 ml-1" />
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{ width: `${calculatePercentage(rating)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-muted-foreground w-12">{ratingDistribution[rating]} đánh giá</div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Reviews List */}
            <div className="space-y-6">
                {displayedReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-medium">{review.userName}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                                </div>
                            </div>
                            {review.verified && (
                                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Đã mua hàng</div>
                            )}
                        </div>

                        <p className="mt-3">{review.comment}</p>

                        {/* Review Images */}
                        {review.images.length > 0 && (
                            <div className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                    {review.images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="relative w-16 h-16 border rounded-md overflow-hidden cursor-pointer"
                                            onClick={() => toggleExpandedImages(image.id)}
                                        >
                                            <Image src={image.url || "/placeholder.svg"} alt="Review" fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>

                                {/* Expanded Image */}
                                {expandedImages && (
                                    <div
                                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                                        onClick={() => setExpandedImages(null)}
                                    >
                                        <div className="relative max-w-3xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
                                            <Image
                                                src={review.images.find((img) => img.id === expandedImages)?.url || ""}
                                                alt="Review"
                                                width={800}
                                                height={600}
                                                className="object-contain max-h-[80vh] mx-auto"
                                            />
                                            <button
                                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                                                onClick={() => setExpandedImages(null)}
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Shop Reply */}
                        {review.reply && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-pink-500" />
                                    <span className="font-medium text-sm">Phản hồi từ shop</span>
                                    <span className="text-xs text-muted-foreground">{formatDate(review.reply.date)}</span>
                                </div>
                                <p className="text-sm mt-1">{review.reply.text}</p>
                            </div>
                        )}

                        {/* Helpful Buttons */}
                        <div className="flex items-center gap-4 mt-3">
                            <button
                                className={`flex items-center gap-1 text-xs ${helpfulClicks[review.id] === "helpful" ? "text-green-600" : "text-muted-foreground"
                                    }`}
                                onClick={() => handleHelpfulClick(review.id, "helpful")}
                            >
                                <ThumbsUp className="h-3 w-3" />
                                <span>Hữu ích ({review.helpful})</span>
                            </button>
                            <button
                                className={`flex items-center gap-1 text-xs ${helpfulClicks[review.id] === "notHelpful" ? "text-red-600" : "text-muted-foreground"
                                    }`}
                                onClick={() => handleHelpfulClick(review.id, "notHelpful")}
                            >
                                <ThumbsDown className="h-3 w-3" />
                                <span>Không hữu ích ({review.notHelpful})</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show More Button */}
            {limit && reviews.length > limit && (
                <div className="text-center">
                    <Button variant="outline" onClick={() => setShowAll(!showAll)} className="mt-4">
                        {showAll ? (
                            <>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Hiển thị ít hơn
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Xem tất cả {reviews.length} đánh giá
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
