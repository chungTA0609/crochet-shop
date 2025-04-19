"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/contexts/cart-context"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  onMoveToWishlist: (item: CartItemType) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove, onMoveToWishlist }: CartItemProps) {
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
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                {item.selectedColor && (
                  <p>
                    Màu sắc: <span className="capitalize">{item.selectedColor}</span>
                  </p>
                )}
                {item.selectedSize && (
                  <p>
                    Kích thước: <span className="uppercase">{item.selectedSize}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <p className="font-semibold text-pink-500">{formatCurrency(item.price)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-4">
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-10 text-center">{item.quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 rounded-full" onClick={() => onMoveToWishlist(item)}>
                <Heart className="h-3 w-3 mr-1" /> Lưu
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" /> Xóa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
