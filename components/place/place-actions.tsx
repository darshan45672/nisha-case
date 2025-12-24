"use client"

import { Navigation, Phone, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PlaceActions() {
  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-4 bg-gray-50/50">
      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-white"
      >
        <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
          <Navigation className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-medium text-gray-700">Directions</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-white"
      >
        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
          <Phone className="h-4 w-4 text-gray-700" />
        </div>
        <span className="text-xs font-medium text-gray-700">Call</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-white"
      >
        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
          <Bookmark className="h-4 w-4 text-gray-700" />
        </div>
        <span className="text-xs font-medium text-gray-700">Save</span>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto py-3 gap-1.5 hover:bg-white"
      >
        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
          <Share2 className="h-4 w-4 text-gray-700" />
        </div>
        <span className="text-xs font-medium text-gray-700">Share</span>
      </Button>
    </div>
  )
}
