import { Star } from "lucide-react"
import type { Review } from "@/lib/constants"

interface ProductReviewsProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{rating}.0</div>
          <div className="flex justify-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{reviewCount} đánh giá</div>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <div className="text-sm w-2">{star}</div>
              <Star className="w-3 h-3 text-yellow-400" />
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${star === rating ? 70 : star > rating ? 0 : 30 / star}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground w-8">
                {star === rating ? "70%" : star > rating ? "0%" : `${Math.floor(30 / star)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Đánh giá từ khách hàng</h3>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{review.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                {review.verified && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Đã mua hàng</div>
                )}
              </div>
              <p className="text-sm mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
