"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, Filter, Grid3X3, List } from "lucide-react"

export default function ChartPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[300px] w-full">
          <Image src="/images/chart-hero.jpg" alt="Chart Mẫu Phí" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Chart Mẫu Phí</h1>
            <p className="text-sm md:text-base">Hướng dẫn - Chart Móc Len Phí</p>
          </div>
        </div>

        <div className="container mx-auto py-8">
          {/* Description */}
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              Chúng mình sẽ hướng dẫn bạn cách móc những sản phẩm đáng yêu nhất. Để mua chart, bạn cần đăng ký tài khoản
              và thanh toán qua các phương thức thanh toán mà shop cung cấp. Sau khi thanh toán thành công, bạn sẽ nhận
              được chart qua email hoặc tài khoản của bạn.
            </p>
          </div>

          {/* Filter and Search */}
          <div className="bg-white p-4 rounded-lg border mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm chart..." className="pl-9" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Lọc</span>
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "grid" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${viewMode === "list" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="w-full flex flex-wrap h-auto bg-transparent border-b justify-start overflow-x-auto">
                <TabsTrigger
                  value="all"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Phổ biến nhất
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
                >
                  Mới nhất
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="rounded-full px-4 py-1 cursor-pointer hover:bg-pink-50"
              >
                {category.name}
              </Badge>
            ))}
          </div>

          {/* Patterns View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {patterns.map((pattern) => (
                <PatternCardExtended key={pattern.id} pattern={pattern} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-12">
              {patterns.map((pattern) => (
                <PatternListItem key={pattern.id} pattern={pattern} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="default" size="icon" className="bg-pink-500 hover:bg-pink-600">
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <Button variant="outline" size="icon">
                4
              </Button>
              <Button variant="outline" size="icon">
                5
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function PatternCardExtended({ pattern }: { pattern: Pattern }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={pattern.image || "/placeholder.svg"}
          alt={pattern.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/80">
            <Heart className={`h-3 w-3 mr-1 ${pattern.liked ? "fill-pink-500 text-pink-500" : ""}`} />
            {pattern.likes}
          </Badge>
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

function PatternListItem({ pattern }: { pattern: Pattern }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden group flex">
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src={pattern.image || "/placeholder.svg"}
          alt={pattern.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 128px, 128px"
        />
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
          <Button size="sm" variant="outline" className="rounded-full">
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  )
}

interface Pattern {
  id: number
  name: string
  price: number
  image: string
  likes: number
  liked: boolean
  author: string
}

const categories = [
  { id: 1, name: "Tất cả" },
  { id: 2, name: "Động vật" },
  { id: 3, name: "Hoa và cây" },
  { id: 4, name: "Thú nhồi bông" },
  { id: 5, name: "Móc khóa" },
  { id: 6, name: "Phụ kiện" },
  { id: 7, name: "Quần áo" },
  { id: 8, name: "Túi xách" },
  { id: 9, name: "Đồ trang trí" },
  { id: 10, name: "Khác" },
]

const patterns = [
  {
    id: 1,
    name: "Chart móc trái tim nhỏ xinh",
    price: 50000,
    image: "/images/chart-1.jpg",
    likes: 15,
    liked: true,
    author: "Tiểu Phương",
  },
  {
    id: 2,
    name: "Chart móc hoa đào nhỏ xinh",
    price: 30000,
    image: "/images/chart-2.jpg",
    likes: 23,
    liked: false,
    author: "Tiểu Phương",
  },
  {
    id: 3,
    name: "Chart móc túi đựng điện thoại",
    price: 40000,
    image: "/images/chart-3.jpg",
    likes: 18,
    liked: true,
    author: "Tiểu Phương",
  },
  {
    id: 4,
    name: "Chart móc trái tim nhỏ",
    price: 25000,
    image: "/images/chart-4.jpg",
    likes: 32,
    liked: false,
    author: "Tiểu Phương",
  },
  {
    id: 5,
    name: "Chart móc thú bông vịt",
    price: 50000,
    image: "/images/chart-5.jpg",
    likes: 27,
    liked: true,
    author: "Tiểu Phương",
  },
  {
    id: 6,
    name: "Chart móc thú bông thỏ",
    price: 50000,
    image: "/images/chart-6.jpg",
    likes: 19,
    liked: false,
    author: "Tiểu Phương",
  },
  {
    id: 7,
    name: "Chart móc thú bông mèo",
    price: 50000,
    image: "/images/chart-7.jpg",
    likes: 24,
    liked: true,
    author: "Tiểu Phương",
  },
  {
    id: 8,
    name: "Chart móc thú bông cừu",
    price: 50000,
    image: "/images/chart-8.jpg",
    likes: 31,
    liked: false,
    author: "Tiểu Phương",
  },
  {
    id: 9,
    name: "Chart móc hoa hồng xinh xắn",
    price: 35000,
    image: "/images/chart-9.jpg",
    likes: 42,
    liked: true,
    author: "Tiểu Phương",
  },
  {
    id: 10,
    name: "Chart móc gấu trúc nhỏ",
    price: 45000,
    image: "/images/chart-10.jpg",
    likes: 38,
    liked: false,
    author: "Tiểu Phương",
  },
  {
    id: 11,
    name: "Chart móc túi xách mini",
    price: 60000,
    image: "/images/chart-11.jpg",
    likes: 29,
    liked: true,
    author: "Tiểu Phương",
  },
  {
    id: 12,
    name: "Chart móc hoa tulip",
    price: 40000,
    image: "/images/chart-12.jpg",
    likes: 33,
    liked: false,
    author: "Tiểu Phương",
  },
]
