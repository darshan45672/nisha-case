"use client"

import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaceHeader } from "./place-header"
import { PlaceRating } from "./place-rating"
import { PlaceActions } from "./place-actions"
import { PlaceTimings } from "./place-timings"
import { PhotoGallery } from "./photo-gallery"
import { PlaceAddress } from "./place-address"
import { PlaceReviews } from "./place-reviews"
import { PlaceData } from "@/lib/place-data"
import { Clock, MapPin, Star, Image as ImageIcon, Navigation } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface PlaceDetailsPanelProps {
  place: PlaceData
  open: boolean
  onOpenChange: (open: boolean) => void
  showDirections?: boolean
  onStopDirections?: () => void
  onGetDirections?: () => void
}

function PlaceContent({ 
  place, 
  showDirections, 
  onStopDirections, 
  onGetDirections 
}: { 
  place: PlaceData
  showDirections?: boolean
  onStopDirections?: () => void
  onGetDirections?: () => void
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PlaceHeader
        name={place.name}
        category={place.category}
      />
      <div className="flex-1 overflow-y-auto pb-6 px-4">
        {/* Navigation Alert */}
        {showDirections && (
          <Alert className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <Navigation className="h-4 w-4 text-blue-600" />
            <AlertDescription className="ml-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Navigation active to {place.name}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                  onClick={onStopDirections}
                >
                  Stop
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Rating & Actions Card */}
        <Card className="border-0 shadow-none">
          <CardContent className="pt-4 px-0 space-y-4">
            <PlaceRating
              rating={place.rating}
              totalReviews={place.totalReviews}
              priceLevel={place.priceLevel}
            />
            <PlaceActions place={place} onGetDirections={onGetDirections} />
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">
              <ImageIcon className="h-3.5 w-3.5 mr-1" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs">
              <Star className="h-3.5 w-3.5 mr-1" />
              Reviews
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <PlaceAddress
                  address={place.address}
                  neighborhood={place.neighborhood}
                  phone={place.phone}
                  website={place.website}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlaceTimings
                  isOpen={place.isOpen}
                  openingTime={place.openingTime}
                  timings={place.timings}
                />
              </CardContent>
            </Card>

            {place.description && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {place.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Photo Gallery</CardTitle>
                <CardDescription>
                  {place.photos.length} photos available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhotoGallery photos={place.photos} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Customer Reviews</CardTitle>
                <CardDescription>
                  Reviews for {place.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlaceReviews placeId={place.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export function PlaceDetailsPanel({
  place,
  open,
  onOpenChange,
  showDirections,
  onStopDirections,
  onGetDirections,
}: PlaceDetailsPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-[420px] md:max-w-[440px] p-0 flex flex-col"
        >
          <SheetTitle className="sr-only">{place.name}</SheetTitle>
          <PlaceContent 
            place={place} 
            showDirections={showDirections}
            onStopDirections={onStopDirections}
            onGetDirections={onGetDirections}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent className="max-h-[92vh] flex flex-col">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-2 mt-3" />
        <DrawerTitle className="sr-only">{place.name}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {place.category} in {place.neighborhood}
        </DrawerDescription>
        <PlaceContent 
          place={place} 
          showDirections={showDirections}
          onStopDirections={onStopDirections}
          onGetDirections={onGetDirections}
        />
      </DrawerContent>
    </Drawer>
  )
}
