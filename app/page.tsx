"use client"

import { useState, useEffect } from "react"
import { Search, Menu, MapPin, Layers, Navigation2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PlaceDetailsPanel } from "@/components/place/place-details-panel"
import { locations, PlaceData } from "@/lib/place-data"

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData>(locations[0])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Open panel on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPanelOpen(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handlePlaceSelect = (place: PlaceData) => {
    setSelectedPlace(place)
    setSearchValue(place.name)
    setSearchOpen(false)
    setIsPanelOpen(true)
  }

  const filteredLocations = searchValue
    ? locations.filter((loc) =>
        loc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        loc.category.toLowerCase().includes(searchValue.toLowerCase()) ||
        loc.neighborhood.toLowerCase().includes(searchValue.toLowerCase())
      )
    : locations

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#e5e3df]">
      {/* Top Search Bar */}
      <div className="absolute top-3 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:right-auto z-30 md:w-full md:max-w-2xl md:px-0">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={searchOpen}
              className="w-full justify-start bg-white rounded-xl shadow-lg hover:shadow-2xl border-0 h-auto py-2.5 px-3 text-left font-normal"
            >
              <Menu 
                className="h-5 w-5 mr-2 flex-shrink-0 text-gray-700 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(true)
                }}
              />
              <Search className="h-5 w-5 text-gray-500 flex-shrink-0 mr-2" />
              <span className="flex-1 truncate text-sm">
                {searchValue || "Search Google Maps"}
              </span>
              {searchValue && (
                <X
                  className="h-4 w-4 text-gray-500 flex-shrink-0 cursor-pointer hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearchValue("")
                  }}
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-1.5rem)] md:w-[600px] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search places..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>No places found.</CommandEmpty>
                <CommandGroup heading="San Francisco Locations">
                  {filteredLocations.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={location.name}
                      onSelect={() => handlePlaceSelect(location)}
                      className="flex items-start gap-3 py-3"
                    >
                      <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{location.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {location.category} · {location.neighborhood}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-sm font-medium">{location.rating}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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

          {/* All Location Markers */}
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => handlePlaceSelect(location)}
              className={`absolute -translate-x-1/2 -translate-y-full transition-all ${
                selectedPlace.id === location.id ? 'z-20 scale-110' : 'z-10 hover:scale-105'
              }`}
              style={{
                top: `${location.coordinates.y}%`,
                left: `${location.coordinates.x}%`,
              }}
              aria-label={`Select ${location.name}`}
            >
              <div className="relative">
                <div className={`relative ${selectedPlace.id === location.id ? 'animate-bounce' : ''}`}>
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-30 scale-150 ${
                    selectedPlace.id === location.id ? 'bg-red-600' : 'bg-blue-600'
                  }`} />
                  <MapPin 
                    className={`relative h-8 w-8 drop-shadow-2xl ${
                      selectedPlace.id === location.id 
                        ? 'text-red-600 fill-red-600' 
                        : 'text-blue-600 fill-blue-600'
                    }`}
                    strokeWidth={1.5}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-black/30 rounded-full blur-sm" />
              </div>
            </button>
          ))}
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
                  {selectedPlace.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{selectedPlace.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{selectedPlace.category}</span>
                  <span>·</span>
                  <span className={selectedPlace.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {selectedPlace.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Place Details Panel */}
      <PlaceDetailsPanel
        place={selectedPlace}
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
      />
    </div>
  )
}
