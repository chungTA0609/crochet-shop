import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface PatternCardProps {
  pattern: {
    id: number
    name: string
    price: number
    image: string
    likes: number
  }
}

export function PatternCard({ pattern }: PatternCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={pattern.image || "/placeholder.svg"}
          alt={pattern.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <CardContent className="p-4">
        <Link href={`/pattern/${pattern.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-pink-500 transition-colors">{pattern.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <p className="text-pink-500 font-semibold">{formatCurrency(pattern.price)}</p>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
            <span>{pattern.likes}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="w-full rounded-full">
          Mua ngay
        </Button>
      </CardFooter>
    </Card>
  )
}
