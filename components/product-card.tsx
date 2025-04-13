import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-pink-500 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-pink-500 font-semibold mt-2">{formatCurrency(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="w-full rounded-full">
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  )
}
