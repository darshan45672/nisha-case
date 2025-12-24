"use client"

import { MapPin, Navigation, Phone, Globe, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlaceAddressProps {
  address: string
  neighborhood: string
  phone: string
  website: string
}

export function PlaceAddress({ address, neighborhood, phone, website }: PlaceAddressProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Address */}
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{address}</p>
          <p className="text-xs text-gray-600 mt-0.5">{neighborhood}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => handleCopy(address)}
        >
          <Copy className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Directions Button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        size="lg"
      >
        <Navigation className="h-4 w-4 mr-2" />
        Directions
      </Button>

      {/* Phone */}
      <div className="flex items-center gap-3">
        <Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
        <a
          href={`tel:${phone}`}
          className="text-sm text-blue-600 hover:underline flex-1"
        >
          {phone}
        </a>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => handleCopy(phone)}
        >
          <Copy className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Website */}
      <div className="flex items-center gap-3">
        <Globe className="h-5 w-5 text-gray-600 flex-shrink-0" />
        <a
          href={`https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex-1 truncate"
        >
          {website}
        </a>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => handleCopy(website)}
        >
          <Copy className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  )
}
