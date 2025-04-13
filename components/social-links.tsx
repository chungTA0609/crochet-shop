import Image from "next/image"
import Link from "next/link"

export function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <Link href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500 p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-green-500 flex items-center justify-center">
            <Image src="/images/avatar.png" alt="Zalo" width={60} height={60} className="rounded-full" />
          </div>
        </div>
        <span className="mt-2 text-sm font-medium">Zalo</span>
      </Link>

      <Link
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
            <Image src="/images/avatar.png" alt="Facebook" width={60} height={60} className="rounded-full" />
          </div>
        </div>
        <span className="mt-2 text-sm font-medium">Facebook</span>
      </Link>

      <Link
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-pink-500 p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center">
            <Image src="/images/avatar.png" alt="Instagram" width={60} height={60} className="rounded-full" />
          </div>
        </div>
        <span className="mt-2 text-sm font-medium">Instagram</span>
      </Link>

      <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
            <Image src="/images/avatar.png" alt="TikTok" width={60} height={60} className="rounded-full" />
          </div>
        </div>
        <span className="mt-2 text-sm font-medium">TikTok</span>
      </Link>
    </div>
  )
}
