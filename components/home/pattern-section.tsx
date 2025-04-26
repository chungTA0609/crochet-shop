"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PatternCard } from "@/components/pattern-card"
import { homePagePatterns } from "@/lib/constants"
import { Pagination } from "../pagination"

export function PatternSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const patternsPerPage = 8
  const totalPages = Math.ceil(homePagePatterns.length / patternsPerPage)

  // Get current patterns
  const indexOfLastPattern = currentPage * patternsPerPage
  const indexOfFirstPattern = indexOfLastPattern - patternsPerPage
  const currentPatterns = homePagePatterns.slice(indexOfFirstPattern, indexOfLastPattern)

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to patterns section when page changes
    document.getElementById("patterns-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="patterns-section" className="bg-gray-50 p-12">
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
          {currentPatterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="rounded-full">
            Xem thêm <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
