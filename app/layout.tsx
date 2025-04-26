import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"
import { CheckoutProvider } from "@/contexts/checkout-context"
import { OrderProvider } from "@/contexts/order-context"
import { AdminProvider } from "@/contexts/admin-context"
import { ReviewProvider } from "@/contexts/review-context"
import { ApiProvider } from "@/contexts/api-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tiểu Phương Crochet - Handmade Crochet Shop",
  description: "Cửa hàng đồ móc len handmade chất lượng cao",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ApiProvider>
            <AuthProvider>
              <CartProvider>
                <CheckoutProvider>
                  <OrderProvider>
                    <AdminProvider>
                      <ReviewProvider>
                        {children}
                        <Toaster />
                      </ReviewProvider>
                    </AdminProvider>
                  </OrderProvider>
                </CheckoutProvider>
              </CartProvider>
            </AuthProvider>
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
