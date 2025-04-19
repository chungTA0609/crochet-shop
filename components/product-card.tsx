"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/constants"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, isInWishlist } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToWishlist(product)
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full h-8 w-8 ${isInWishlist(product.id) ? "bg-pink-100 text-pink-500" : ""}`}
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-pink-500" : ""}`} />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full h-8 w-8" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/product/${product.id}`}>
            <Button className="bg-pink-500 hover:bg-pink-600 rounded-full">Xem chi tiết</Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-pink-500 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-pink-500 font-semibold mt-2">{formatCurrency(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 transition-all duration-300"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  )
}
