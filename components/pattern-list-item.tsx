import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Pattern } from "@/lib/constants"

interface PatternListItemProps {
  pattern: Pattern
}

export function PatternListItem({ pattern }: PatternListItemProps) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden group flex hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
        <Image
          src={pattern.image || "/placeholder.svg"}
          alt={pattern.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 128px, 128px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <Link href={`/pattern/${pattern.id}`}>
              <h3 className="font-medium text-base hover:text-pink-500 transition-colors">{pattern.name}</h3>
            </Link>
            <Badge variant="secondary" className="bg-white/80 flex items-center">
              <Heart className={`h-3 w-3 mr-1 ${pattern.liked ? "fill-pink-500 text-pink-500" : ""}`} />
              {pattern.likes}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full overflow-hidden">
              <Image src="/images/avatar.png" alt={pattern.author} width={20} height={20} className="object-cover" />
            </div>
            <span className="text-xs text-muted-foreground">{pattern.author}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-pink-500 font-semibold">{pattern.price.toLocaleString("vi-VN")}₫</p>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 transition-all duration-300"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  )
}
