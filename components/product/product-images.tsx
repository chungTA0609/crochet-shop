"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductImagesProps {
  images: string[]
  name: string
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="relative aspect-square border rounded-lg overflow-hidden">
        <Image src={images[activeImage] || "/placeholder.svg"} alt={name} fill className="object-cover" priority />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 ${
              activeImage === index ? "ring-2 ring-pink-500" : ""
            }`}
            onClick={() => setActiveImage(index)}
          >
            <Image src={image || "/placeholder.svg"} alt={`${name} - Ảnh ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
