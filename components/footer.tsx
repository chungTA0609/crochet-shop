import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto p-12">
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo.png" alt="Tiểu Phương Crochet" width={80} height={80} className="rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="font-medium mb-4">Liên kết</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-pink-500 transition-colors">
                Trang chủ
              </Link>
              <Link href="/shop" className="text-sm text-muted-foreground hover:text-pink-500 transition-colors">
                Cửa hàng
              </Link>
              <Link href="/chart" className="text-sm text-muted-foreground hover:text-pink-500 transition-colors">
                Chart móc len
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-pink-500 transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          <div className="text-center">
            <h3 className="font-medium mb-4">Liên hệ</h3>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>tieuphuong@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+84 123 456 789</span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h3 className="font-medium mb-4">Theo dõi</h3>
            <div className="flex justify-center md:justify-end gap-4">
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground border-t pt-8">
          <p>© {new Date().getFullYear()} Tiểu Phương Crochet. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
