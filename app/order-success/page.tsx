"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag, Home, FileText, Eye } from "lucide-react"
import { useOrder, type Order } from "@/contexts/order-context"
import { formatCurrency } from "@/lib/utils"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getOrderById, generateInvoice } = useOrder() // Moved useOrder hook call here

  const orderId = searchParams.get("orderId")
  const orderDbId = searchParams.get("orderDbId")

  const [order, setOrder] = useState<Order | null>(null)

  // Get order details if orderDbId is provided
  useEffect(() => {
    if (orderDbId) {
      const orderDetails = getOrderById(orderDbId)
      if (orderDetails) {
        setOrder(orderDetails)
      }
    }
  }, [orderDbId, getOrderById])

  // Redirect to home if no order ID is provided
  useEffect(() => {
    if (!orderId) {
      router.push("/")
    }
  }, [orderId, router])

  if (!orderId) {
    return null
  }

  // Handle invoice download
  const handleDownloadInvoice = () => {
    if (order) {
      // Generate and download the invoice
      generateInvoice(order)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-2xl mx-auto p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-6">
              Cảm ơn bạn đã mua hàng. Đơn hàng #{orderId} của bạn đã được xác nhận.
            </p>

            {order && (
              <div className="bg-white border rounded-lg p-6 mb-8 text-left">
                <h2 className="font-medium text-lg mb-4">Thông tin đơn hàng</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Mã đơn hàng:</p>
                      <p className="font-medium">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày đặt hàng:</p>
                      <p className="font-medium">{order.date.toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái:</p>
                      <p className="font-medium">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.status === "shipped"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : order.status === "delivered"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                            }`}
                        >
                          {order.status === "pending"
                            ? "Chờ xác nhận"
                            : order.status === "paid"
                              ? "Đã thanh toán"
                              : order.status === "processing"
                                ? "Đang xử lý"
                                : order.status === "shipped"
                                  ? "Đang giao hàng"
                                  : order.status === "delivered"
                                    ? "Đã giao hàng"
                                    : order.status === "completed"
                                      ? "Hoàn thành"
                                      : "Đã hủy"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng tiền:</p>
                      <p className="font-medium text-pink-500">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Phương thức thanh toán:</p>
                    <p className="font-medium">
                      {order.paymentMethod === "credit-card"
                        ? "Thẻ tín dụng / Thẻ ghi nợ"
                        : order.paymentMethod === "paypal"
                          ? "PayPal"
                          : "Thanh toán khi nhận hàng (COD)"}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Địa chỉ giao hàng:</p>
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-sm">{order.shippingAddress.phone}</p>
                    <p className="text-sm">
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.province}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Button asChild variant="outline" className="flex items-center justify-center">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Trang chủ
                </Link>
              </Button>
              <Button asChild className="bg-pink-500 hover:bg-pink-600 flex items-center justify-center">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>

            {order && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center justify-center" onClick={handleDownloadInvoice}>
                  <FileText className="mr-2 h-4 w-4" />
                  Tải hóa đơn
                </Button>
                <Button asChild variant="secondary" className="flex items-center justify-center">
                  <Link href={`/orders/${order.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết đơn hàng
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
