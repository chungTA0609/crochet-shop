import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Pattern } from "@/lib/constants"

interface PatternCardExtendedProps {
  pattern: Pattern
}

export function PatternCardExtended({ pattern }: PatternCardExtendedProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={pattern.image || "/placeholder.svg"}
          alt={pattern.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/80">
            <Heart className={`h-3 w-3 mr-1 ${pattern.liked ? "fill-pink-500 text-pink-500" : ""}`} />
            {pattern.likes}
          </Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="bg-pink-500 hover:bg-pink-600 rounded-full">Xem chi tiết</Button>
        </div>
      </div>
      <div className="p-3">
        <Link href={`/pattern/${pattern.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-pink-500 transition-colors mb-1">
            {pattern.name}
          </h3>
        </Link>
        <p className="text-pink-500 font-semibold text-sm">{pattern.price.toLocaleString("vi-VN")}₫</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <Image src="/images/avatar.png" alt={pattern.author} width={20} height={20} className="object-cover" />
          </div>
          <span className="text-xs text-muted-foreground">{pattern.author}</span>
        </div>
      </div>
    </div>
  )
}
