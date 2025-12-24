"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function PlaceDetailsSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Rating Skeleton */}
        <div className="px-4 py-3 border-b">
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Photos Skeleton */}
        <div className="py-4 border-b">
          <div className="px-4 mb-3">
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex gap-2 px-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Address Skeleton */}
        <div className="px-4 py-4 border-b space-y-3">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded" />
        </div>

        {/* Timings Skeleton */}
        <div className="px-4 py-4 border-b">
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
