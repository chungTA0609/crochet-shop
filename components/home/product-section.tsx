"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/constants"
import { Pagination } from "@/components/pagination"

export function ProductSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8
  const totalPages = Math.ceil(products.length / productsPerPage)

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to products section when page changes
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="products-section" className="container mx-auto p-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold">Sản Phẩm</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Những sản phẩm thủ công được làm từ sợi cotton, sợi len và các loại sợi khác một cách tỉ mỉ.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
    </section>
  )
}
