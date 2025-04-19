"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/constants"

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

interface WishlistItem extends Product {}

interface CartContextType {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void
  removeFromCart: (productId: number) => void
  updateCartItemQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  cartTotal: number
  cartCount: number
  wishlistCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Load cart and wishlist from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    const storedWishlist = localStorage.getItem("wishlist")

    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }

    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))

    // Calculate cart total and count
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    setCartTotal(total)
    setCartCount(count)
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    setWishlistCount(wishlistItems.length)
  }, [wishlistItems])

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCartItems((prevItems) => {
      // Check if the item with the same ID, color, and size is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedColor === color && item.selectedSize === size,
      )

      if (existingItemIndex !== -1) {
        // Update quantity if the item is already in the cart
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item to the cart
        return [...prevItems, { ...product, quantity, selectedColor: color, selectedSize: size }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems((prevItems) => [...prevItems, product])
    }
  }

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
