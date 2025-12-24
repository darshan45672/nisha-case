"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotoGalleryProps {
  photos: string[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [api, setApi] = useState<CarouselApi>()

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index))
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  return (
    <>
      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {photos.map((photo, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-3 basis-2/3 md:basis-1/2">
                <button
                  onClick={() => openLightbox(index)}
                  className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted group cursor-pointer"
                >
                  {!loadedImages.has(index) && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onLoad={() => handleImageLoad(index)}
                    sizes="(max-width: 768px) 66vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-screen-lg w-full p-0 gap-0 bg-black/95 border-0">
          <DialogTitle className="sr-only">Photo Gallery</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {selectedImage !== null && (
            <div className="relative w-full h-[80vh] flex items-center justify-center p-8">
              <Carousel
                opts={{
                  startIndex: selectedImage,
                  loop: true,
                }}
                className="w-full h-full"
              >
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <Image
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === selectedImage}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 text-white border-white/50 hover:bg-white/20 hover:text-white" />
                <CarouselNext className="right-4 text-white border-white/50 hover:bg-white/20 hover:text-white" />
              </Carousel>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                {selectedImage + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
