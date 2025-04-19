import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSlider } from "@/components/hero-slider"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductSection } from "@/components/home/product-section"
import { PatternSection } from "@/components/home/pattern-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSlider />

        {/* Products Section */}
        <ProductSection />

        {/* Pattern Charts Section */}
        <PatternSection />

        {/* Social Media Section */}
        <section className="container mx-auto p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Theo Dõi Mình Trên Mạng Xã Hội Nhé!</h2>
            <p className="text-muted-foreground text-sm mt-2">Tham gia cộng đồng để cập nhật các mẫu mới nhất</p>
          </div>

          <SocialLinks />
        </section>

        {/* Newsletter Section */}
        <section className="bg-pink-50 p-12">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">Nơi Chia Sẻ Những Điều Thú Vị!</h2>
              <p className="text-muted-foreground text-sm mt-2">Đăng ký để nhận thông tin mới nhất</p>
            </div>

            <div className="max-w-md mx-auto flex gap-2">
              <Input placeholder="Email của bạn" className="rounded-full" />
              <Button className="rounded-full bg-pink-500 hover:bg-pink-600">Đăng ký</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
