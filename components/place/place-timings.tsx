"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TimingDay } from "@/lib/place-data"
import { cn } from "@/lib/utils"

interface PlaceTimingsProps {
  isOpen: boolean
  openingTime: string
  timings: TimingDay[]
}

export function PlaceTimings({ isOpen, openingTime, timings }: PlaceTimingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const todayTiming = timings.find((t) => t.isToday)

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <Clock className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={isOpen ? "default" : "secondary"}
              className={cn(
                "font-medium text-xs px-2 py-0.5",
                isOpen
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              {isOpen ? "Open" : "Closed"}
            </Badge>
            <span className="text-sm text-gray-600">{openingTime}</span>
          </div>
          {!isExpanded && todayTiming && (
            <p className="text-sm text-gray-900">{todayTiming.hours}</p>
          )}
          {isExpanded && (
            <div className="mt-3 space-y-2">
              {timings.map((timing) => (
                <div
                  key={timing.day}
                  className={cn(
                    "flex justify-between text-sm",
                    timing.isToday ? "font-medium text-gray-900" : "text-gray-600"
                  )}
                >
                  <span>{timing.day}</span>
                  <span>{timing.hours}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
      </button>
    </div>
  )
}
