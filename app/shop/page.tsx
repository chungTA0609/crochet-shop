import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal } from "lucide-react"

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Cửa Hàng</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <div className="w-full md:w-64 space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Bộ lọc
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Danh mục</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox id={`category-${category.id}`} />
                          <Label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Giá (VNĐ)</h4>
                    <div className="pt-4 pb-2">
                      <Slider defaultValue={[0, 500000]} min={0} max={500000} step={10000} />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>0đ</span>
                      <span>500.000đ</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Màu sắc</h4>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          className={`w-6 h-6 rounded-full cursor-pointer border hover:scale-110 transition-transform`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1">
              <div className="bg-white p-4 rounded-lg border mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm sản phẩm..." className="pl-9" />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp theo:</span>
                    <select className="border rounded-md text-sm p-2 bg-transparent">
                      <option>Mới nhất</option>
                      <option>Giá: Thấp đến cao</option>
                      <option>Giá: Cao đến thấp</option>
                      <option>Phổ biến nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center mt-12">
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
                    &gt;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

const categories = [
  { id: 1, name: "Móc khóa" },
  { id: 2, name: "Thú bông" },
  { id: 3, name: "Hoa" },
  { id: 4, name: "Quà tặng" },
  { id: 5, name: "Phụ kiện" },
]

const colors = [
  { id: 1, name: "Đỏ", hex: "#ef4444" },
  { id: 2, name: "Cam", hex: "#f97316" },
  { id: 3, name: "Vàng", hex: "#eab308" },
  { id: 4, name: "Xanh lá", hex: "#22c55e" },
  { id: 5, name: "Xanh dương", hex: "#3b82f6" },
  { id: 6, name: "Tím", hex: "#a855f7" },
  { id: 7, name: "Hồng", hex: "#ec4899" },
  { id: 8, name: "Trắng", hex: "#ffffff" },
  { id: 9, name: "Đen", hex: "#000000" },
]

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
  {
    id: 9,
    name: "Móc khóa hình gấu trúc",
    price: 250000,
    image: "/images/product-1.jpg",
    category: "Móc khóa",
  },
]
