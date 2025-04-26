"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal } from "lucide-react"
import { products, productCategories, colors } from "@/lib/constants"
import { Pagination } from "@/components/pagination"

export default function ShopPage() {
  const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Cửa hàng" }]

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const productsPerPage = 6
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

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
                      {productCategories.map((category) => (
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
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
