"use client"
import { useState } from "react"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { Search, Filter, Grid3X3, List } from "lucide-react"
import { patterns, patternCategories } from "@/lib/constants"
import { PatternCardExtended } from "@/components/pattern-card-extended"
import { PatternListItem } from "@/components/pattern-list-item"
import { Pagination } from "@/components/pagination"

export default function ChartPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")

  const breadcrumbItems = [{ label: "Trang chủ", href: "/" }, { label: "Chart Mẫu Phí" }]

  // Filter patterns based on active tab and selected category
  const filterPatterns = () => {
    let filtered = [...patterns]

    // Filter by tab
    if (activeTab === "popular") {
      filtered = filtered.sort((a, b) => b.likes - a.likes)
    } else if (activeTab === "new") {
      // Assuming the first items are the newest
      filtered = filtered.slice().reverse()
    }

    // Filter by category (this is a mock implementation since we don't have category in the pattern data)
    if (selectedCategory !== "Tất cả") {
      // In a real app, you would filter by category here
    }

    return filtered
  }

  const filteredPatterns = filterPatterns()
  const patternsPerPage = 8
  const totalPages = Math.ceil(filteredPatterns.length / patternsPerPage)

  // Get current patterns
  const indexOfLastPattern = currentPage * patternsPerPage
  const indexOfFirstPattern = indexOfLastPattern - patternsPerPage
  const currentPatterns = filteredPatterns.slice(indexOfFirstPattern, indexOfLastPattern)

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when changing category
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        {/* <div className="relative h-[300px] w-full">
          <Image src="/images/chart-hero.jpg" alt="Chart Mẫu Phí" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Chart Mẫu Phí</h1>
            <p className="text-sm md:text-base">Hướng dẫn - Chart Móc Len Phí</p>
          </div>
        </div> */}

        <div className="container mx-auto p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

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

            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
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
            {patternCategories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className={`rounded-full px-4 py-1 cursor-pointer hover:bg-pink-50 ${selectedCategory === category.name ? "bg-pink-100 border-pink-500 text-pink-500" : ""
                  }`}
                onClick={() => handleCategoryChange(category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>

          {/* Patterns View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {currentPatterns.map((pattern) => (
                <PatternCardExtended key={pattern.id} pattern={pattern} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-12">
              {currentPatterns.map((pattern) => (
                <PatternListItem key={pattern.id} pattern={pattern} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mb-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
