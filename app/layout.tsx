import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/cart-context"
import { CheckoutProvider } from "@/contexts/checkout-context"
import { OrderProvider } from "@/contexts/order-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tiểu Phương Crochet - Handmade Crochet Shop",
  description: "Shop bán đồ móc len thủ công, chart móc len và phụ kiện handmade",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <CheckoutProvider>
              <OrderProvider>
                {children}
                <Toaster />
              </OrderProvider>
            </CheckoutProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
