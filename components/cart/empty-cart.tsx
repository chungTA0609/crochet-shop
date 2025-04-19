import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
      </div>
      <h2 className="text-xl font-medium mb-2">Giỏ hàng của bạn đang trống</h2>
      <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán</p>
      <Button asChild className="bg-pink-500 hover:bg-pink-600 rounded-full">
        <Link href="/shop">Tiếp tục mua sắm</Link>
      </Button>
    </div>
  )
}
