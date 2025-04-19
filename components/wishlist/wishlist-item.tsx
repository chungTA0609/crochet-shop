"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/constants"

interface WishlistItemProps {
  item: Product
  onAddToCart: (item: Product) => void
  onRemove: (id: number) => void
}

export function WishlistItem({ item, onAddToCart, onRemove }: WishlistItemProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <Link href={`/product/${item.id}`}>
                <h3 className="font-medium hover:text-pink-500 transition-colors">{item.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <p className="font-semibold text-pink-500">{formatCurrency(item.price)}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-4">
            <div className="flex gap-2">
              <Button className="rounded-full bg-pink-500 hover:bg-pink-600" onClick={() => onAddToCart(item)}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Thêm vào giỏ
              </Button>
              <Button
                variant="outline"
                className="rounded-full text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Xóa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
