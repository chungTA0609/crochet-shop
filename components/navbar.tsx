"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, Heart, Menu, X, User, LogOut, Package, Settings } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems, wishlistItems } = useCart()
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Tiểu Phương Crochet" width={40} height={40} className="mr-2" />
            <span className="text-xl font-bold text-pink-600 hidden sm:inline">Tiểu Phương Crochet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-gray-600 hover:text-pink-600 transition-colors",
                  isActive(link.href) && "text-pink-600 font-medium",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2">
              <Heart className="h-6 w-6 text-gray-600 hover:text-pink-600 transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-pink-600 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
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
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
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

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={toggleMenu} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
              {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block text-gray-600 hover:text-pink-600 transition-colors",
                      isActive(link.href) && "text-pink-600 font-medium",
                    )}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!isAuthenticated && (
                <>
                  <li className="pt-4 border-t">
                    <Link
                      href="/auth/login"
                      className="block text-gray-600 hover:text-pink-600 transition-colors"
                      onClick={closeMenu}
                    >
                      Đăng nhập
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/register"
                      className="block text-gray-600 hover:text-pink-600 transition-colors"
                      onClick={closeMenu}
                    >
                      Đăng ký
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
