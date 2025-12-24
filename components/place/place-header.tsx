"use client"

import { X, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlaceHeaderProps {
  name: string
  category: string
  onClose?: () => void
}

export function PlaceHeader({ name, category, onClose }: PlaceHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b">
      <div className="flex items-start justify-between px-6 pt-4 pb-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-foreground mb-1 truncate">
            {name}
          </h1>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Save"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-700" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
