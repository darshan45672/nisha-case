"use client"

import { useState, useEffect } from "react"
import { Search, Menu, MapPin, Layers, Navigation2, X, Map, Satellite, Star, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PlaceDetailsPanel } from "@/components/place/place-details-panel"
import { locations, PlaceData } from "@/lib/place-data"

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData>(locations[0])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [mapType, setMapType] = useState("default")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showTraffic, setShowTraffic] = useState(false)
  const [showTransit, setShowTransit] = useState(false)
  const [userLocation, setUserLocation] = useState({ x: 30, y: 70 }) // Mock user location
  const [showDirections, setShowDirections] = useState(false)
  const [routePath, setRoutePath] = useState<{x: number, y: number}[]>([])
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Open panel on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPanelOpen(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Mock live location tracking - simulate slight movement
  useEffect(() => {
    const interval = setInterval(() => {
      setUserLocation(prev => ({
        x: prev.x + (Math.random() - 0.5) * 0.3, // Small random movement
        y: prev.y + (Math.random() - 0.5) * 0.3
      }))
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleResetNorth = () => {
    // Reset map orientation to north
    setZoomLevel(1)
  }

  const handleGetDirections = (destination: PlaceData) => {
    // Calculate realistic path following street grid
    const path: {x: number, y: number}[] = []
    
    const start = { x: userLocation.x, y: userLocation.y }
    const end = { x: destination.coordinates.x, y: destination.coordinates.y }
    
    // Add starting point
    path.push(start)
    
    // Calculate intermediate waypoints following street grid
    // Use Manhattan distance approach - move horizontally then vertically (or vice versa)
    const dx = end.x - start.x
    const dy = end.y - start.y
    
    // Determine which direction to go first based on distance
    const goHorizontalFirst = Math.abs(dx) > Math.abs(dy)
    
    if (goHorizontalFirst) {
      // Move horizontally first, then vertically
      // Add turns at street intersections (every ~10 units)
      const horizontalSteps = Math.ceil(Math.abs(dx) / 10)
      const verticalSteps = Math.ceil(Math.abs(dy) / 10)
      
      // Horizontal movement with small steps for smooth animation
      for (let i = 1; i <= horizontalSteps; i++) {
        const t = i / horizontalSteps
        path.push({
          x: start.x + dx * t,
          y: start.y
        })
      }
      
      // Turn point
      path.push({
        x: end.x,
        y: start.y
      })
      
      // Vertical movement
      for (let i = 1; i <= verticalSteps; i++) {
        const t = i / verticalSteps
        path.push({
          x: end.x,
          y: start.y + dy * t
        })
      }
    } else {
      // Move vertically first, then horizontally
      const verticalSteps = Math.ceil(Math.abs(dy) / 10)
      const horizontalSteps = Math.ceil(Math.abs(dx) / 10)
      
      // Vertical movement
      for (let i = 1; i <= verticalSteps; i++) {
        const t = i / verticalSteps
        path.push({
          x: start.x,
          y: start.y + dy * t
        })
      }
      
      // Turn point
      path.push({
        x: start.x,
        y: end.y
      })
      
      // Horizontal movement
      for (let i = 1; i <= horizontalSteps; i++) {
        const t = i / horizontalSteps
        path.push({
          x: start.x + dx * t,
          y: end.y
        })
      }
    }
    
    // Add final destination
    path.push(end)
    
    setRoutePath(path)
    setShowDirections(true)
    // Only close panel on desktop to view route, keep open on mobile
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsPanelOpen(false)
    }
  }

  // Drag handlers for map panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - mapOffset.x,
      y: e.clientY - mapOffset.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }
    setMapOffset(newOffset)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - mapOffset.x,
      y: touch.clientY - mapOffset.y
    })
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    e.preventDefault()
    const touch = e.touches[0]
    const newOffset = {
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    }
    setMapOffset(newOffset)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#e5e3df] touch-none">
      {/* Live Location Badge - Top Left */}
      {showDirections && (
        <div className="absolute top-16 md:top-20 left-3 z-30 max-w-[calc(100vw-6rem)]">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-xs md:text-sm truncate">
            <Navigation className="h-3 w-3 mr-1 animate-pulse flex-shrink-0" />
            <span className="truncate">Navigating to {selectedPlace.name}</span>
          </Badge>
        </div>
      )}
      
      {/* Top Search Bar */}
      <div className="absolute top-3 left-3 right-3 md:left-1/2 md:-translate-x-1/2 md:right-auto z-30 md:w-full md:max-w-2xl md:px-0 pointer-events-auto">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <div className="flex w-full bg-white rounded-xl shadow-lg hover:shadow-2xl border-0 py-2.5 px-3 max-h-12">
            <Menu 
              className="h-5 w-5 mr-2 flex-shrink-0 text-gray-700 cursor-pointer" 
              onClick={() => setIsMenuOpen(true)}
            />
            <PopoverTrigger asChild>
              <button className="flex items-center flex-1 text-left">
                <Search className="h-5 w-5 text-gray-500 flex-shrink-0 mr-2" />
                <span className="flex-1 truncate text-sm">
                  {searchValue || "Search Google Maps"}
                </span>
              </button>
            </PopoverTrigger>
            {searchValue && (
              <X
                className="h-4 w-4 text-gray-500 flex-shrink-0 cursor-pointer hover:text-gray-700"
                onClick={() => setSearchValue("")}
              />
            )}
          </div>
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
      <div className="relative flex-1 w-full h-full overflow-hidden touch-none">
        {/* Enhanced Map with realistic design */}
        <div 
          className="absolute inset-0 bg-[#e5e3df] transition-transform duration-300 select-none"
          style={{ 
            transform: `scale(${zoomLevel}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
            transformOrigin: 'center center',
            width: '100%',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Main roads */}
              <pattern id="main-roads" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill={mapType === "satellite" ? "#2d3436" : "#f2f0ed"} />
                {/* Horizontal main road */}
                <rect x="0" y="9.6" width="20" height="0.8" fill={mapType === "satellite" ? "#4a5568" : "#fff"} />
                <line x1="0" y1="10" x2="20" y2="10" stroke="#f7c945" strokeWidth="0.1" strokeDasharray="1,1" />
                {/* Vertical main road */}
                <rect x="9.6" y="0" width="0.8" height="20" fill={mapType === "satellite" ? "#4a5568" : "#fff"} />
                <line x1="10" y1="0" x2="10" y2="20" stroke="#f7c945" strokeWidth="0.1" strokeDasharray="1,1" />
              </pattern>
              
              {/* Smaller streets */}
              <pattern id="streets" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="transparent" />
                <rect x="0" y="3.8" width="8" height="0.4" fill={mapType === "satellite" ? "#4a5568" : "#fff"} opacity="0.8" />
                <rect x="3.8" y="0" width="0.4" height="8" fill={mapType === "satellite" ? "#4a5568" : "#fff"} opacity="0.8" />
                {showTraffic && (
                  <>
                    <line x1="0" y1="4" x2="8" y2="4" stroke="#ef4444" strokeWidth="0.2" opacity="0.6" />
                    <line x1="4" y1="0" x2="4" y2="8" stroke="#22c55e" strokeWidth="0.2" opacity="0.6" />
                  </>
                )}
              </pattern>
              
              {/* Buildings */}
              <pattern id="buildings" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="transparent" />
                <rect x="0.5" y="0.5" width="3" height="3" fill={mapType === "satellite" ? "#1a202c" : "#d4d2ce"} opacity="0.4" />
                <rect x="4.5" y="0.5" width="3" height="3" fill={mapType === "satellite" ? "#1a202c" : "#d4d2ce"} opacity="0.4" />
                <rect x="0.5" y="4.5" width="3" height="3" fill={mapType === "satellite" ? "#1a202c" : "#d4d2ce"} opacity="0.4" />
                <rect x="4.5" y="4.5" width="3" height="3" fill={mapType === "satellite" ? "#1a202c" : "#d4d2ce"} opacity="0.4" />
              </pattern>
              
              {/* Parks */}
              <pattern id="parks" width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill="transparent" />
                <ellipse cx="15" cy="15" rx="6" ry="6" fill="#c8ddb5" opacity="0.5" />
              </pattern>

              {/* Transit lines */}
              {showTransit && (
                <pattern id="transit" width="40" height="40" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="20" x2="40" y2="20" stroke="#3b82f6" strokeWidth="0.3" strokeDasharray="0.5,0.5" opacity="0.7" />
                  <line x1="20" y1="0" x2="20" y2="40" stroke="#8b5cf6" strokeWidth="0.3" strokeDasharray="0.5,0.5" opacity="0.7" />
                </pattern>
              )}
            </defs>
            
            <rect width="100%" height="100%" fill="url(#main-roads)" />
            <rect width="100%" height="100%" fill="url(#streets)" />
            <rect width="100%" height="100%" fill="url(#buildings)" />
            <rect width="100%" height="100%" fill="url(#parks)" />
            {showTransit && <rect width="100%" height="100%" fill="url(#transit)" />}
            
            {/* Street Names */}
            <text x="20" y="15" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.4" fontWeight="500" opacity="0.8">Market Street</text>
            <text x="50" y="30" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.4" fontWeight="500" opacity="0.8">Mission Street</text>
            <text x="75" y="45" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.4" fontWeight="500" opacity="0.8">Valencia Street</text>
            <text x="30" y="60" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.4" fontWeight="500" opacity="0.8">Folsom Street</text>
            <text x="60" y="75" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.4" fontWeight="500" opacity="0.8">Howard Street</text>
            <text x="15" y="85" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.2" fontWeight="500" opacity="0.7">Golden Gate Park</text>
            <text x="85" y="20" fill={mapType === "satellite" ? "#fff" : "#666"} fontSize="1.2" fontWeight="500" opacity="0.7">Fisherman's Wharf</text>
            
            {/* Direction Path */}
            {showDirections && routePath.length > 0 && (
              <>
                {/* Main route line */}
                <polyline
                  points={routePath.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#4285f4"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
                {/* Animated dashed overlay */}
                <polyline
                  points={routePath.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="0.3"
                  strokeLinecap="round"
                  strokeDasharray="1,1"
                  opacity="0.9"
                  className="animate-dash"
                />
              </>
            )}
          </svg>

          {/* User's Live Location Marker */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
            style={{
              top: `${userLocation.y}%`,
              left: `${userLocation.x}%`,
            }}
          >
            <div className="relative">
              {/* Pulsing circle animation */}
              <div className="absolute inset-0 -m-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full opacity-20 animate-ping" />
              </div>
              {/* Main location dot */}
              <div className="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg">
                <div className="absolute inset-0.5 bg-white rounded-full" />
              </div>
              {/* Accuracy circle */}
              <div className="absolute -inset-4 border-2 border-blue-400 rounded-full opacity-30" />
            </div>
          </div>

          {/* All Location Markers */}
          {locations.map((location) => {
            const markerButton = (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlaceSelect(location)
                }}
                className={`absolute -translate-x-1/2 -translate-y-full transition-all touch-manipulation ${
                  selectedPlace.id === location.id ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                }`}
                style={{
                  top: `${location.coordinates.y}%`,
                  left: `${location.coordinates.x}%`,
                }}
                aria-label={`Select ${location.name}`}
              >`
                <div className="relative">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-30 scale-150 ${
                      selectedPlace.id === location.id ? 'bg-red-600' : 'bg-blue-600'
                    }`} />
                    <MapPin 
                      className={`relative h-7 w-7 md:h-8 md:w-8 drop-shadow-2xl ${
                        selectedPlace.id === location.id 
                          ? 'text-red-600 fill-red-600' 
                          : 'text-blue-600 fill-blue-600'
                      }`}
                      strokeWidth={1.5}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 md:w-6 md:h-1.5 bg-black/30 rounded-full blur-sm" />
                  
                  {/* Location Label */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap px-1.5 py-0.5 md:px-2 rounded text-[10px] md:text-xs font-medium shadow-sm ${
                    selectedPlace.id === location.id 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}>
                    {location.name}
                  </div>
                </div>
              </button>
            )

            return (
              <div key={location.id}>
                {/* Desktop: With HoverCard */}
                <div className="hidden md:block">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      {markerButton}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="top" align="center">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-base mb-1">{location.name}</h4>
                          <p className="text-sm text-muted-foreground">{location.category} · {location.neighborhood}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-sm">{location.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({location.totalReviews} reviews)</span>
                        </div>
                        
                        <div className="text-sm">
                          <p className={location.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {location.isOpen ? "Open now" : "Closed"}
                          </p>
                          {location.timings && location.timings.length > 0 && (
                            <p className="text-muted-foreground text-xs mt-1">{location.timings[0].hours}</p>
                          )}
                        </div>
                        
                        {location.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{location.description}</p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePlaceSelect(location)
                            }}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleGetDirections(location)
                              handlePlaceSelect(location)
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                {/* Mobile: Without HoverCard */}
                <div className="block md:hidden">
                  {markerButton}
                </div>
              </div>
            )
          })}
        </div>

        {/* Map Controls - Bottom Right */}
        <div className="absolute bottom-28 md:bottom-6 right-3 md:right-6 flex flex-col gap-2 z-20">
          {/* Layers Menu */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-50"
                  >
                    <Layers className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Map layers</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Map Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={mapType} onValueChange={setMapType}>
                <DropdownMenuRadioItem value="default">
                  <Map className="h-4 w-4 mr-2" />
                  Default
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="satellite">
                  <Satellite className="h-4 w-4 mr-2" />
                  Satellite
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Overlays</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowTraffic(!showTraffic)}>
                <div className="flex items-center justify-between w-full">
                  <span>Traffic</span>
                  <div className={`w-4 h-4 rounded border ${showTraffic ? 'bg-primary border-primary' : 'border-input'}`}>
                    {showTraffic && <div className="text-primary-foreground text-xs">✓</div>}
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTransit(!showTransit)}>
                <div className="flex items-center justify-between w-full">
                  <span>Transit</span>
                  <div className={`w-4 h-4 rounded border ${showTransit ? 'bg-primary border-primary' : 'border-input'}`}>
                    {showTransit && <div className="text-primary-foreground text-xs">✓</div>}
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Zoom Controls */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:h-11 md:w-11 rounded-none border-b hover:bg-gray-100"
                  onClick={handleZoomIn}
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-700">+</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Zoom in</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:h-11 md:w-11 rounded-none hover:bg-gray-100"
                  onClick={handleZoomOut}
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-700">−</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Zoom out</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Compass/Reset North */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 md:h-11 md:w-11 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-gray-50"
                onClick={handleResetNorth}
              >
                <Navigation2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Reset orientation</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Place Info Card - Mobile Only */}
        <div className="absolute bottom-3 left-3 right-3 md:hidden z-20 pb-safe">
          <button
            onClick={() => setIsPanelOpen(true)}
            className="w-full bg-white rounded-2xl shadow-2xl p-4 hover:shadow-3xl transition-all active:scale-[0.98] backdrop-blur-sm"
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
        showDirections={showDirections}
        onStopDirections={() => {
          setShowDirections(false)
          setRoutePath([])
        }}
        onGetDirections={() => handleGetDirections(selectedPlace)}
      />
    </div>
    </TooltipProvider>
  )
}
