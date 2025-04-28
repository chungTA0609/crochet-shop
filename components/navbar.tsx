"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Search, Heart, User, Menu, Package, Settings, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartCount, wishlistCount } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/shop", label: "Sản phẩm" },
    { href: "/chart", label: "Mẫu móc" },
  ]
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
                <Link href="/orders" className="text-lg font-medium">
                  Đơn hàng
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
          <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
            <Link href="/wishlist" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          {!!isAuthenticated}

          <Button variant="ghost" size="icon" aria-label="Cart" asChild>
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Image
                    src={user?.avatar || "/images/avatar.png"}
                    alt={user?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* User Info */}
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Links */}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer w-full">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Đơn hàng</span>
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Quản trị</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Đăng nhập
              </Button>
            </Link>
          )}

          <button className="md:hidden p-2" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>

        </div>
      </div>
    </header>
  )
}
