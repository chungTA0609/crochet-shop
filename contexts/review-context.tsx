"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

// Types
export type ReviewImage = {
    id: string
    url: string
}

export type Review = {
    id: string
    productId: number
    userId: string
    userName: string
    rating: number
    comment: string
    images: ReviewImage[]
    date: Date
    status: "pending" | "approved" | "rejected"
    verified: boolean
    helpful: number
    notHelpful: number
    reply?: {
        text: string
        date: Date
    }
}

// Context type
type ReviewContextType = {
    reviews: Review[]
    pendingReviews: Review[]
    getProductReviews: (productId: number) => Review[]
    getApprovedProductReviews: (productId: number) => Review[]
    getUserReviews: (userId: string) => Review[]
    getReview: (reviewId: string) => Review | undefined
    addReview: (review: Omit<Review, "id" | "date" | "status" | "helpful" | "notHelpful">) => Review
    updateReview: (reviewId: string, reviewData: Partial<Review>) => boolean
    deleteReview: (reviewId: string) => boolean
    approveReview: (reviewId: string) => boolean
    rejectReview: (reviewId: string) => boolean
    replyToReview: (reviewId: string, text: string) => boolean
    markHelpful: (reviewId: string) => boolean
    markNotHelpful: (reviewId: string) => boolean
    getAverageRating: (productId: number) => number
    getRatingDistribution: (productId: number) => Record<number, number>
}

// Create context
const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

// Sample data
const sampleReviews: Review[] = [
    {
        id: "review1",
        productId: 1,
        userId: "user2",
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Sản phẩm rất đáng yêu, chất lượng tốt và đúng như mô tả. Tôi rất hài lòng với sản phẩm này!",
        images: [],
        date: new Date("2025-04-12"),
        status: "approved",
        verified: true,
        helpful: 3,
        notHelpful: 0,
    },
    {
        id: "review2",
        productId: 1,
        userId: "user3",
        userName: "Trần Thị B",
        rating: 4,
        comment: "Móc khóa xinh xắn, màu sắc tươi sáng. Tuy nhiên hơi nhỏ so với mong đợi của tôi.",
        images: [
            {
                id: "img1",
                url: "/images/product-1.jpg",
            },
        ],
        date: new Date("2025-04-05"),
        status: "approved",
        verified: true,
        helpful: 1,
        notHelpful: 0,
    },
    {
        id: "review3",
        productId: 1,
        userId: "user4",
        userName: "Lê Văn C",
        rating: 5,
        comment: "Tôi mua làm quà tặng cho bạn và bạn rất thích. Sẽ ủng hộ shop nhiều hơn nữa!",
        images: [],
        date: new Date("2025-03-28"),
        status: "approved",
        verified: false,
        helpful: 2,
        notHelpful: 1,
    },
    {
        id: "review4",
        productId: 2,
        userId: "user2",
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Móc khóa hình thỏ rất dễ thương, làm rất tỉ mỉ và chắc chắn.",
        images: [],
        date: new Date("2025-04-10"),
        status: "approved",
        verified: true,
        helpful: 4,
        notHelpful: 0,
    },
    {
        id: "review5",
        productId: 3,
        userId: "user3",
        userName: "Trần Thị B",
        rating: 3,
        comment: "Thú bông chuột nhỏ dễ thương nhưng đường chỉ không được chắc chắn lắm.",
        images: [],
        date: new Date("2025-04-08"),
        status: "approved",
        verified: true,
        helpful: 1,
        notHelpful: 2,
    },
    {
        id: "review6",
        productId: 5,
        userId: "user4",
        userName: "Lê Văn C",
        rating: 4,
        comment: "Thú bông vịt vàng rất đáng yêu, con tôi rất thích.",
        images: [
            {
                id: "img2",
                url: "/images/product-5.jpg",
            },
        ],
        date: new Date("2025-04-15"),
        status: "pending",
        verified: false,
        helpful: 0,
        notHelpful: 0,
    },
]

// Provider component
export function ReviewProvider({ children }: { children: ReactNode }) {
    const [reviews, setReviews] = useState<Review[]>([])

    // Initialize data on first render
    useEffect(() => {
        // Try to get reviews from localStorage
        const storedReviews = localStorage.getItem("reviews")

        if (storedReviews) {
            try {
                const parsedReviews = JSON.parse(storedReviews, (key, value) => {
                    if (key === "date") {
                        return new Date(value)
                    }
                    if (key === "reply" && value && value.date) {
                        return {
                            ...value,
                            date: new Date(value.date),
                        }
                    }
                    return value
                })
                setReviews(parsedReviews)
            } catch (error) {
                console.error("Failed to parse reviews from localStorage:", error)
                setReviews(sampleReviews)
            }
        } else {
            setReviews(sampleReviews)
        }
    }, [])

    // Save reviews to localStorage whenever they change
    useEffect(() => {
        if (reviews.length > 0) {
            localStorage.setItem("reviews", JSON.stringify(reviews))
        }
    }, [reviews])

    // Get all pending reviews
    const pendingReviews = reviews.filter((review) => review.status === "pending")

    // Get all reviews for a product
    const getProductReviews = (productId: number): Review[] => {
        return reviews.filter((review) => review.productId === productId)
    }

    // Get approved reviews for a product
    const getApprovedProductReviews = (productId: number): Review[] => {
        return reviews.filter((review) => review.productId === productId && review.status === "approved")
    }

    // Get all reviews by a user
    const getUserReviews = (userId: string): Review[] => {
        return reviews.filter((review) => review.userId === userId)
    }

    // Get a specific review
    const getReview = (reviewId: string): Review | undefined => {
        return reviews.find((review) => review.id === reviewId)
    }

    // Add a new review
    const addReview = (reviewData: Omit<Review, "id" | "date" | "status" | "helpful" | "notHelpful">): Review => {
        const newReview: Review = {
            id: `review${reviews.length + 1}`,
            date: new Date(),
            status: "pending",
            helpful: 0,
            notHelpful: 0,
            ...reviewData,
        }

        setReviews((prevReviews) => [...prevReviews, newReview])

        toast({
            title: "Đánh giá đã được gửi",
            description: "Cảm ơn bạn đã đánh giá sản phẩm. Đánh giá của bạn đang chờ phê duyệt.",
        })

        return newReview
    }

    // Update a review
    const updateReview = (reviewId: string, reviewData: Partial<Review>): boolean => {
        const reviewIndex = reviews.findIndex((review) => review.id === reviewId)

        if (reviewIndex === -1) {
            return false
        }

        const updatedReviews = [...reviews]
        updatedReviews[reviewIndex] = { ...updatedReviews[reviewIndex], ...reviewData }

        setReviews(updatedReviews)
        return true
    }

    // Delete a review
    const deleteReview = (reviewId: string): boolean => {
        const reviewIndex = reviews.findIndex((review) => review.id === reviewId)

        if (reviewIndex === -1) {
            return false
        }

        const updatedReviews = reviews.filter((review) => review.id !== reviewId)
        setReviews(updatedReviews)
        return true
    }

    // Approve a review
    const approveReview = (reviewId: string): boolean => {
        return updateReview(reviewId, { status: "approved" })
    }

    // Reject a review
    const rejectReview = (reviewId: string): boolean => {
        return updateReview(reviewId, { status: "rejected" })
    }

    // Reply to a review
    const replyToReview = (reviewId: string, text: string): boolean => {
        if (!text.trim()) {
            return false
        }

        return updateReview(reviewId, {
            reply: {
                text,
                date: new Date(),
            },
        })
    }

    // Mark a review as helpful
    const markHelpful = (reviewId: string): boolean => {
        const review = getReview(reviewId)
        if (!review) {
            return false
        }

        return updateReview(reviewId, { helpful: review.helpful + 1 })
    }

    // Mark a review as not helpful
    const markNotHelpful = (reviewId: string): boolean => {
        const review = getReview(reviewId)
        if (!review) {
            return false
        }

        return updateReview(reviewId, { notHelpful: review.notHelpful + 1 })
    }

    // Get average rating for a product
    const getAverageRating = (productId: number): number => {
        const productReviews = getApprovedProductReviews(productId)
        if (productReviews.length === 0) {
            return 0
        }

        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0)
        return Math.round((totalRating / productReviews.length) * 10) / 10
    }

    // Get rating distribution for a product
    const getRatingDistribution = (productId: number): Record<number, number> => {
        const productReviews = getApprovedProductReviews(productId)
        const distribution: Record<number, number> = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        }

        productReviews.forEach((review) => {
            distribution[review.rating]++
        })

        return distribution
    }

    return (
        <ReviewContext.Provider
            value={{
                reviews,
                pendingReviews,
                getProductReviews,
                getApprovedProductReviews,
                getUserReviews,
                getReview,
                addReview,
                updateReview,
                deleteReview,
                approveReview,
                rejectReview,
                replyToReview,
                markHelpful,
                markNotHelpful,
                getAverageRating,
                getRatingDistribution,
            }}
        >
            {children}
        </ReviewContext.Provider>
    )
}

// Custom hook to use the review context
export function useReview() {
    const context = useContext(ReviewContext)
    if (context === undefined) {
        throw new Error("useReview must be used within a ReviewProvider")
    }
    return context
}
