import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function EmptyWishlist() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Heart className="h-16 w-16 text-gray-300" />
      </div>
      <h2 className="text-xl font-medium mb-2">Danh sách yêu thích của bạn đang trống</h2>
      <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm vào danh sách yêu thích để xem sau</p>
      <Button asChild className="bg-pink-500 hover:bg-pink-600 rounded-full">
        <Link href="/shop">Tiếp tục mua sắm</Link>
      </Button>
    </div>
  )
}
