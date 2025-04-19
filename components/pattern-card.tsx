import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Pattern } from "@/lib/constants"

interface PatternCardProps {
  pattern: Pattern
}

export function PatternCard({ pattern }: PatternCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={pattern.image || "/placeholder.svg"}
          alt={pattern.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="bg-pink-500 hover:bg-pink-600 rounded-full">Xem chi tiết</Button>
        </div>
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
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 transition-all duration-300"
        >
          Mua ngay
        </Button>
      </CardFooter>
    </Card>
  )
}
