import { Star } from "lucide-react"

interface ProductRatingProps {
  rating: number
  reviews: number
}

export function ProductRating({ rating, reviews }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({reviews} đánh giá)</span>
    </div>
  )
}
