"use client"

import { useState, useEffect } from "react"
import  Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, SlidersHorizontal } from "lucide-react"
import { productCategories, colors } from "@/lib/constants"
import { Pagination } from "@/components/pagination"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import api from "@/lib/axios"

export default function ShopPage() {
  const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Cửa hàng" }]

  // State for products and pagination
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  // Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    categoryId: null,
    minPrice: 0,
    maxPrice: 500000,
    brand: "",
    minRating: 0,
    sortBy: "newest",
    sortDirection: "desc",
    page: 1,
    size: 6,
  })

  // Fetch products from API using axios
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.post("/api/products/get-list", {
        keyword: filters.keyword,
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        brand: filters.brand,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
        page: filters.page,
        size: filters.size,
      })

      setProducts(response.data.content || [])
      setTotalPages(response.data.totalPages)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products")
      setLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setFilters((prev) => ({ ...prev, page: pageNumber }))
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle search input
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setFilters((prev) => ({ ...prev, keyword: e.target.value, page: 1 }))
    }
  }

  // Handle category filter
  const handleCategoryChange = (categoryId, checked) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: checked ? categoryId : null,
      page: 1,
    }))
  }

  // Handle price range filter
  const handlePriceChange = (values) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
      page: 1,
    }))
  }

  // Handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value
    let sortBy, sortDirection

    switch (value) {
      case "newest":
        sortBy = "createdAt"
        sortDirection = "desc"
        break
      case "price_asc":
        sortBy = "price"
        sortDirection = "asc"
        break
      case "price_desc":
        sortBy = "price"
        sortDirection = "desc"
        break
      case "popular":
        sortBy = "popularity"
        sortDirection = "desc"
        break
      default:
        sortBy = "createdAt"
        sortDirection = "desc"
    }

    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortDirection,
      page: 1,
    }))
  }

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [filters])

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
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.categoryId === category.id}
                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                          />
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
                      <Slider
                        defaultValue={[filters.minPrice, filters.maxPrice]}
                        min={0}
                        max={500000}
                        step={10000}
                        onValueCommit={handlePriceChange}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{filters.minPrice}đ</span>
                      <span>{filters.maxPrice}đ</span>
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
                    <Input
                      placeholder="Tìm kiếm sản phẩm..."
                      className="pl-9"
                      defaultValue={filters.keyword}
                      onKeyDown={handleSearch}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Sắp xếp theo:</span>
                    <select
                      className="border rounded-md text-sm p-2 bg-transparent"
                      onChange={handleSortChange}
                      value={
                        filters.sortBy === "createdAt" && filters.sortDirection === "desc"
                          ? "newest"
                          : filters.sortBy === "price" && filters.sortDirection === "asc"
                            ? "price_asc"
                            : filters.sortBy === "price" && filters.sortDirection === "desc"
                              ? "price_desc"
                              : filters.sortBy === "popularity"
                                ? "popular"
                                : "newest"
                      }
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="price_asc">Giá: Thấp đến cao</option>
                      <option value="price_desc">Giá: Cao đến thấp</option>
                      <option value="popular">Phổ biến nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-8">
                  <p>Đã xảy ra lỗi: {error}</p>
                  <button
                    onClick={fetchProducts}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Thử lại
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center p-8">
                  <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && products.length > 0 && (
                <div className="mt-12">
                  <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
