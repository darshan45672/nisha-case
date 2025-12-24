"use client"

import { useState } from "react"
import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera } from "lucide-react"

interface PhotoGalleryProps {
  photos: string[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index))
  }

  return (
    <div className="py-4">
      <div className="px-4 mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Photos
        </h3>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 px-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-100"
            >
              {!loadedImages.has(index) && (
                <Skeleton className="absolute inset-0 w-full h-full" />
              )}
              <Image
                src={photo}
                alt={`Place photo ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                onLoad={() => handleImageLoad(index)}
                sizes="(max-width: 640px) 128px, 160px"
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
