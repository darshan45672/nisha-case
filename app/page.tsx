"use client"

import { useState, useEffect } from "react"
import { Search, Menu, MapPin, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlaceDetailsPanel } from "@/components/place/place-details-panel"
import { placeData } from "@/lib/place-data"

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsPanelOpen(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Top Search Bar - Google Maps Style */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <div className="bg-white rounded-lg shadow-lg flex items-center gap-3 px-4 py-3 hover:shadow-xl transition-shadow">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex-1 flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Google Maps"
              className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-500"
              readOnly
              value="Blue Bottle Coffee"
            />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 w-full h-full">
        {/* Map Placeholder - Enhanced with street-like patterns */}
        <div className="absolute inset-0 bg-[#f0ebe5]">
          {/* Street Grid Pattern */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Main street grid */}
              <pattern id="streets" width="120" height="120" patternUnits="userSpaceOnUse">
                <rect width="120" height="120" fill="#e8e3dc" />
                {/* Horizontal streets */}
                <rect x="0" y="58" width="120" height="4" fill="#ffffff" />
                {/* Vertical streets */}
                <rect x="58" y="0" width="4" height="120" fill="#ffffff" />
                {/* Small blocks */}
                <rect x="10" y="10" width="38" height="38" fill="#f5f2ee" />
                <rect x="72" y="10" width="38" height="38" fill="#f5f2ee" />
                <rect x="10" y="72" width="38" height="38" fill="#f5f2ee" />
                <rect x="72" y="72" width="38" height="38" fill="#f5f2ee" />
              </pattern>
              {/* Park areas */}
              <pattern id="parks" width="200" height="200" patternUnits="userSpaceOnUse">
                <rect width="200" height="200" fill="transparent" />
                <circle cx="100" cy="100" r="30" fill="#d4e7d4" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streets)" />
            <rect width="100%" height="100%" fill="url(#parks)" />
          </svg>

          {/* Place Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <div className="relative animate-bounce">
              <div className="relative">
                <MapPin className="h-12 w-12 text-red-600 fill-red-600 drop-shadow-2xl" strokeWidth={1.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-md" />
            </div>
          </div>
        </div>

        {/* Map Controls - Bottom Right */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-lg hover:shadow-xl"
          >
            <Layers className="h-5 w-5" />
          </Button>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none border-b"
            >
              <span className="text-lg font-semibold">+</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none"
            >
              <span className="text-lg font-semibold">−</span>
            </Button>
          </div>
        </div>

        {/* Place Marker Info Card - Mobile Only */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden z-10 w-[calc(100%-2rem)]">
          <button
            onClick={() => setIsPanelOpen(true)}
            className="w-full bg-white rounded-lg shadow-xl p-4 hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {placeData.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    ⭐ {placeData.rating}
                  </span>
                  <span>·</span>
                  <span>{placeData.category}</span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Place Details Panel */}
      <PlaceDetailsPanel
        place={placeData}
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
      />
    </div>
  )
}

