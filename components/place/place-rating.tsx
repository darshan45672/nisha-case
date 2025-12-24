"use client"

import { Star, DollarSign } from "lucide-react"

interface PlaceRatingProps {
  rating: number
  totalReviews: number
  priceLevel: string
}

export function PlaceRating({ rating, totalReviews, priceLevel }: PlaceRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex items-center gap-1">
        <span className="text-xl font-medium text-gray-900">{rating}</span>
        <div className="flex items-center gap-0.5 ml-1">
          {[...Array(fullStars)].map((_, i) => (
            <Star
              key={`full-${i}`}
              className="h-4 w-4 fill-yellow-500 text-yellow-500"
            />
          ))}
          {hasHalfStar && (
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" style={{
              clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
            }} />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star
              key={`empty-${i}`}
              className="h-4 w-4 text-gray-300"
            />
          ))}
        </div>
      </div>
      <span className="text-sm text-gray-600">
        ({totalReviews.toLocaleString()})
      </span>
      <span className="text-gray-300">·</span>
      <span className="text-sm text-gray-900 font-medium">{priceLevel}</span>
    </div>
  )
}
