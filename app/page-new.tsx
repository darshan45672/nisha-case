"use client"

import { useState, useEffect } from "react"
import { Search, Menu, MapPin, Layers, Navigation2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PlaceDetailsPanel } from "@/components/place/place-details-panel"
import { placeData } from "@/lib/place-data"

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("Blue Bottle Coffee")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Open panel on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPanelOpen(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#e5e3df]">
      {/* Top Search Bar */}
      <div className="absolute top-3 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:right-auto z-30 md:w-full md:max-w-2xl md:px-0">
        <div className={`bg-white rounded-xl shadow-lg transition-all ${
          isSearchFocused ? 'shadow-2xl' : ''
        }`}>
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Search className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Search Google Maps"
                className="border-0 p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 flex-shrink-0 hover:bg-gray-100 rounded-full"
                onClick={() => setSearchValue("")}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Menu Sidebar */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[350px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <Navigation2 className="mr-2 h-4 w-4" />
                Directions
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <MapPin className="mr-2 h-4 w-4" />
                Saved Places
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <Layers className="mr-2 h-4 w-4" />
                Your Timeline
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Map Container */}
      <div className="relative flex-1 w-full h-full">
        {/* Enhanced Map with realistic design */}
        <div className="absolute inset-0 bg-[#e5e3df]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Main roads */}
              <pattern id="main-roads" width="200" height="200" patternUnits="userSpaceOnUse">
                <rect width="200" height="200" fill="#f2f0ed" />
                {/* Horizontal main road */}
                <rect x="0" y="96" width="200" height="8" fill="#fff" />
                <line x1="0" y1="100" x2="200" y2="100" stroke="#f7c945" strokeWidth="1" strokeDasharray="10,10" />
                {/* Vertical main road */}
                <rect x="96" y="0" width="8" height="200" fill="#fff" />
                <line x1="100" y1="0" x2="100" y2="200" stroke="#f7c945" strokeWidth="1" strokeDasharray="10,10" />
              </pattern>
              
              {/* Smaller streets */}
              <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="transparent" />
                <rect x="0" y="38" width="80" height="4" fill="#fff" opacity="0.8" />
                <rect x="38" y="0" width="4" height="80" fill="#fff" opacity="0.8" />
              </pattern>
              
              {/* Buildings */}
              <pattern id="buildings" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="transparent" />
                <rect x="5" y="5" width="30" height="30" fill="#d4d2ce" opacity="0.4" />
                <rect x="45" y="5" width="30" height="30" fill="#d4d2ce" opacity="0.4" />
                <rect x="5" y="45" width="30" height="30" fill="#d4d2ce" opacity="0.4" />
                <rect x="45" y="45" width="30" height="30" fill="#d4d2ce" opacity="0.4" />
              </pattern>
              
              {/* Parks */}
              <pattern id="parks" width="300" height="300" patternUnits="userSpaceOnUse">
                <rect width="300" height="300" fill="transparent" />
                <ellipse cx="150" cy="150" rx="60" ry="60" fill="#c8ddb5" opacity="0.5" />
              </pattern>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#main-roads)" />
            <rect width="100%" height="100%" fill="url(#streets)" />
            <rect width="100%" height="100%" fill="url(#buildings)" />
            <rect width="100%" height="100%" fill="url(#parks)" />
          </svg>

          {/* Place Marker - More accurate positioning */}
          <div className="absolute top-[45%] left-1/2 md:left-[60%] -translate-x-1/2 -translate-y-full z-10">
            <div className="relative">
              <div className="relative animate-bounce">
                <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-30 scale-150" />
                <MapPin className="relative h-10 w-10 md:h-12 md:w-12 text-red-600 fill-red-600 drop-shadow-2xl" strokeWidth={1.5} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 md:w-8 h-1.5 md:h-2 bg-black/30 rounded-full blur-sm" />
            </div>
          </div>
        </div>

        {/* Map Controls - Bottom Right */}
        <div className="absolute bottom-20 md:bottom-6 right-3 md:right-6 flex flex-col gap-2 z-20">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-50"
          >
            <Layers className="h-5 w-5 text-gray-700" />
          </Button>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:h-11 md:w-11 rounded-none border-b hover:bg-gray-100"
            >
              <span className="text-xl font-semibold text-gray-700">+</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 md:h-11 md:w-11 rounded-none hover:bg-gray-100"
            >
              <span className="text-xl font-semibold text-gray-700">−</span>
            </Button>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-50"
          >
            <Navigation2 className="h-5 w-5 text-blue-600" />
          </Button>
        </div>

        {/* Place Info Card - Mobile Only */}
        <div className="absolute bottom-3 left-3 right-3 md:hidden z-20">
          <button
            onClick={() => setIsPanelOpen(true)}
            className="w-full bg-white rounded-2xl shadow-2xl p-4 hover:shadow-3xl transition-all active:scale-[0.98]"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-gray-900 mb-1 truncate text-base">
                  {placeData.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{placeData.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{placeData.category}</span>
                  <span>·</span>
                  <span className="text-green-600 font-medium">Open</span>
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
