"use client"

import { useState, useEffect } from "react"
import { MapPin, Trash2, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { getSavedLocations, removeSavedLocation, SavedLocation } from "@/lib/saved-locations"
import { toast } from "sonner"

interface SavedLocationsListProps {
  onSelectLocation?: (locationId: string) => void
}

export function SavedLocationsList({ onSelectLocation }: SavedLocationsListProps) {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])

  const loadSavedLocations = () => {
    setSavedLocations(getSavedLocations())
  }

  useEffect(() => {
    loadSavedLocations()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadSavedLocations()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-page updates
    window.addEventListener('savedLocationsChanged', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('savedLocationsChanged', handleStorageChange)
    }
  }, [])

  const handleRemove = (locationId: string, locationName: string) => {
    if (removeSavedLocation(locationId)) {
      loadSavedLocations()
      toast.info("Location removed", {
        description: `${locationName} has been removed from saved places.`,
      })
      // Dispatch custom event for same-page updates
      window.dispatchEvent(new Event('savedLocationsChanged'))
    }
  }

  const handleViewLocation = (locationId: string) => {
    if (onSelectLocation) {
      onSelectLocation(locationId)
    }
  }

  if (savedLocations.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">
          No saved locations yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Save your favorite places to access them quickly
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-3 p-4">
        {savedLocations.map((location) => (
          <Card key={location.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {location.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {location.category}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {location.address}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Saved {new Date(location.savedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex flex-col gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => handleViewLocation(location.id)}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleRemove(location.id, location.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
