"use client"

import { Star, ThumbsUp, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const sampleReviews = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    text: "Amazing coffee and great atmosphere! The baristas are incredibly knowledgeable and the pour-over is exceptional.",
    helpful: 12,
  },
  {
    id: 2,
    author: "Michael T.",
    rating: 4,
    date: "1 month ago",
    text: "Quality coffee but can get quite busy. Recommend going during off-peak hours.",
    helpful: 8,
  },
]

export function PlaceReviews() {
  return (
    <div>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
          <Button variant="link" className="text-blue-600 text-sm p-0 h-auto">
            See all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {sampleReviews.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {review.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {review.author}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed ml-11">
                {review.text}
              </p>
              <div className="flex items-center gap-4 ml-11">
                <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{review.helpful}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
