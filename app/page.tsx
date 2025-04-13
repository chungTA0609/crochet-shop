import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/product-card"
import { PatternCard } from "@/components/pattern-card"
import { SocialLinks } from "@/components/social-links"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { HeroSlider } from "@/components/hero-slider"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />

        {/* Products Section */}
        <section className="container mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Sản Phẩm</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Những sản phẩm thủ công được làm từ sợi cotton, sợi len và các loại sợi khác một cách tỉ mỉ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" className="rounded-full">
              Xem thêm <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </section>

        {/* Pattern Charts Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">Chart Mẫu Phí</h2>
              <p className="text-muted-foreground text-sm mt-2">Tự may đồ bằng cách trả lời</p>
            </div>

            <div className="bg-gray-800 text-white p-6 rounded-lg mb-8">
              <h3 className="text-lg font-medium mb-2">Kiếm tiền bằng cách trả lời</h3>
              <p className="text-sm text-gray-300">
                Trả lời các câu hỏi để kiếm tiền mua chart. Mỗi câu trả lời đúng sẽ được cộng vào tài khoản.
              </p>
              <Button variant="outline" className="mt-4 text-white border-white hover:bg-white/10">
                Bắt đầu ngay
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {patterns.map((pattern) => (
                <PatternCard key={pattern.id} pattern={pattern} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline" className="rounded-full">
                Xem thêm <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="container mx-auto py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Theo Dõi Mình Trên Mạng Xã Hội Nhé!</h2>
            <p className="text-muted-foreground text-sm mt-2">Tham gia cộng đồng để cập nhật các mẫu mới nhất</p>
          </div>

          <SocialLinks />
        </section>

        {/* Newsletter Section */}
        <section className="bg-pink-50 py-12">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">Nơi Chia Sẻ Những Điều Thú Vị!</h2>
              <p className="text-muted-foreground text-sm mt-2">Đăng ký để nhận thông tin mới nhất</p>
            </div>

            <div className="max-w-md mx-auto flex gap-2">
              <Input placeholder="Email của bạn" className="rounded-full" />
              <Button className="rounded-full bg-pink-500 hover:bg-pink-600">Đăng ký</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const products = [
  {
    id: 1,
    name: "Móc khóa hình gấu nhỏ xinh",
    price: 250000,
    image: "/images/product-1.jpg",
    category: "Móc khóa",
  },
  {
    id: 2,
    name: "Móc khóa hình thỏ",
    price: 250000,
    image: "/images/product-2.jpg",
    category: "Móc khóa",
  },
  {
    id: 3,
    name: "Thú bông chuột nhỏ",
    price: 350000,
    image: "/images/product-3.jpg",
    category: "Thú bông",
  },
  {
    id: 4,
    name: "Móc khóa hình mèo",
    price: 250000,
    image: "/images/product-4.jpg",
    category: "Móc khóa",
  },
  {
    id: 5,
    name: "Thú bông vịt vàng",
    price: 350000,
    image: "/images/product-5.jpg",
    category: "Thú bông",
  },
  {
    id: 6,
    name: "Hộp quà nhỏ xinh",
    price: 200000,
    image: "/images/product-6.jpg",
    category: "Quà tặng",
  },
  {
    id: 7,
    name: "Thú bông cá xanh",
    price: 350000,
    image: "/images/product-7.jpg",
    category: "Thú bông",
  },
  {
    id: 8,
    name: "Hoa hồng len đỏ",
    price: 150000,
    image: "/images/product-8.jpg",
    category: "Hoa",
  },
]

const patterns = [
  {
    id: 1,
    name: "Chart móc thú bông gấu",
    price: 50000,
    image: "/images/pattern-1.jpg",
    likes: 15,
  },
  {
    id: 2,
    name: "Chart móc hoa đào nhỏ xinh",
    price: 30000,
    image: "/images/pattern-2.jpg",
    likes: 23,
  },
  {
    id: 3,
    name: "Chart móc túi đựng điện thoại",
    price: 40000,
    image: "/images/pattern-3.jpg",
    likes: 18,
  },
  {
    id: 4,
    name: "Chart móc trái tim nhỏ",
    price: 25000,
    image: "/images/pattern-4.jpg",
    likes: 32,
  },
  {
    id: 5,
    name: "Chart móc thú bông vịt",
    price: 50000,
    image: "/images/pattern-5.jpg",
    likes: 27,
  },
  {
    id: 6,
    name: "Chart móc thú bông thỏ",
    price: 50000,
    image: "/images/pattern-6.jpg",
    likes: 19,
  },
  {
    id: 7,
    name: "Chart móc thú bông mèo",
    price: 50000,
    image: "/images/pattern-7.jpg",
    likes: 24,
  },
  {
    id: 8,
    name: "Chart móc thú bông cừu",
    price: 50000,
    image: "/images/pattern-8.jpg",
    likes: 31,
  },
]
