"use client"

import { Navigation, Phone, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlaceActionsProps {
  onGetDirections?: () => void
}

export function PlaceActions({ onGetDirections }: PlaceActionsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
        onClick={onGetDirections}
      >
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <Navigation className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Directions</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
      >
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-sm">
          <Phone className="h-4 w-4 text-secondary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Call</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-accent"
      >
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shadow-sm">
          <Bookmark className="h-4 w-4 text-secondary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Save</span>
      </Button>

      <Button
        variant="ghost"
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
