"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, Heart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Trang chủ
                </Link>
                <Link href="/shop" className="text-lg font-medium">
                  Cửa hàng
                </Link>
                <Link href="/chart" className="text-lg font-medium">
                  Chart móc len
                </Link>
                <Link href="/blog" className="text-lg font-medium">
                  Blog
                </Link>
                <Link href="/about" className="text-lg font-medium">
                  Giới thiệu
                </Link>
                <Link href="/contact" className="text-lg font-medium">
                  Liên hệ
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="ml-4 md:ml-0 flex items-center">
            <Image src="/images/logo.png" alt="Tiểu Phương Crochet" width={50} height={50} className="rounded-full" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Trang chủ
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Cửa hàng
          </Link>
          <Link href="/chart" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Chart móc len
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Giới thiệu
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-pink-500 transition-colors">
            Liên hệ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" className="hidden sm:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button size="sm" className="hidden sm:flex rounded-full bg-pink-500 hover:bg-pink-600">
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  )
}
