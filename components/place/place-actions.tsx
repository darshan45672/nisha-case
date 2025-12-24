"use client"

import { useState, useEffect } from "react"
import { Navigation, Phone, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PlaceData } from "@/lib/place-data"
import { isLocationSaved, toggleSavedLocation } from "@/lib/saved-locations"

interface PlaceActionsProps {
  place: PlaceData
  onGetDirections?: () => void
}

export function PlaceActions({ place, onGetDirections }: PlaceActionsProps) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setIsSaved(isLocationSaved(place.id))
  }, [place.id])

  const handleCall = () => {
    if (place.phone) {
      window.location.href = `tel:${place.phone}`
      toast.success("Opening phone dialer...")
    } else {
      toast.error("Phone number not available")
    }
  }

  const handleSave = () => {
    const saved = toggleSavedLocation(place)
    setIsSaved(saved)
    
    if (saved) {
      toast.success("Location saved!", {
        description: `${place.name} has been added to your saved places.`,
      })
    } else {
      toast.info("Location removed", {
        description: `${place.name} has been removed from saved places.`,
      })
    }
  }

  const handleShare = () => {
    const message = `Check out ${place.name}!\n${place.address}\n${place.website || ''}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
    toast.success("Opening WhatsApp...")
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        type="button"
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
        onClick={() => {
          if (onGetDirections) {
            onGetDirections()
          }
        }}
      >
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <Navigation className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Directions</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
        onClick={handleCall}
      >
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-sm">
          <Phone className="h-4 w-4 text-secondary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Call</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
        onClick={handleSave}
      >
        <div className={`h-10 w-10 rounded-full ${isSaved ? 'bg-primary' : 'bg-secondary'} flex items-center justify-center shadow-sm`}>
          <Bookmark className={`h-4 w-4 ${isSaved ? 'text-primary-foreground fill-current' : 'text-secondary-foreground'}`} />
        </div>
        <span className="text-xs font-medium text-foreground">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      </Button>

      <Button
        variant="ghost"
        onClick={handleShare}
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
      >
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-sm">
          <Share2 className="h-4 w-4 text-secondary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Share</span>
      </Button>
    </div>
  )
}
