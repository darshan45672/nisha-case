"use client"

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { PlaceHeader } from "./place-header"
import { PlaceRating } from "./place-rating"
import { PlaceActions } from "./place-actions"
import { PlaceTimings } from "./place-timings"
import { PhotoGallery } from "./photo-gallery"
import { PlaceAddress } from "./place-address"
import { PlaceReviews } from "./place-reviews"
import { PlaceData } from "@/lib/place-data"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PlaceDetailsPanelProps {
  place: PlaceData
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PlaceContent({ place }: { place: PlaceData }) {
  return (
    <div className="flex flex-col h-full">
      <PlaceHeader
        name={place.name}
        category={place.category}
      />
      <ScrollArea className="flex-1">
        <div className="pb-6">
          <PlaceRating
            rating={place.rating}
            totalReviews={place.totalReviews}
            priceLevel={place.priceLevel}
          />
          <Separator />
          <PlaceActions />
          <Separator />
          <PhotoGallery photos={place.photos} />
          <Separator />
          <PlaceAddress
            address={place.address}
            neighborhood={place.neighborhood}
            phone={place.phone}
            website={place.website}
          />
          <Separator />
          <PlaceTimings
            isOpen={place.isOpen}
            openingTime={place.openingTime}
            timings={place.timings}
          />
          <Separator />
          <PlaceReviews />
          {place.description && (
            <>
              <Separator />
              <div className="px-4 py-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {place.description}
                </p>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function PlaceDetailsPanel({
  place,
  open,
  onOpenChange,
}: PlaceDetailsPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-[440px] p-0 flex flex-col"
        >
          <SheetTitle className="sr-only">{place.name}</SheetTitle>
          <PlaceContent place={place} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4 mt-4" />
        <PlaceContent place={place} />
      </DrawerContent>
    </Drawer>
  )
}
