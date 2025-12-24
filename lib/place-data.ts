export interface TimingDay {
  day: string
  hours: string
  isToday?: boolean
}

export interface PlaceData {
  name: string
  category: string
  rating: number
  totalReviews: number
  priceLevel: string
  address: string
  neighborhood: string
  phone: string
  website: string
  isOpen: boolean
  openingTime: string
  timings: TimingDay[]
  photos: string[]
  description?: string
}

export const placeData: PlaceData = {
  name: "Blue Bottle Coffee",
  category: "Coffee shop",
  rating: 4.4,
  totalReviews: 1247,
  priceLevel: "$$",
  address: "66 Mint St, San Francisco, CA 94103",
  neighborhood: "SoMa",
  phone: "(510) 653-3394",
  website: "bluebottlecoffee.com",
  isOpen: true,
  openingTime: "Closes 6 PM",
  timings: [
    { day: "Monday", hours: "7 AM–6 PM" },
    { day: "Tuesday", hours: "7 AM–6 PM", isToday: true },
    { day: "Wednesday", hours: "7 AM–6 PM" },
    { day: "Thursday", hours: "7 AM–6 PM" },
    { day: "Friday", hours: "7 AM–6 PM" },
    { day: "Saturday", hours: "8 AM–7 PM" },
    { day: "Sunday", hours: "8 AM–7 PM" },
  ],
  photos: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop",
  ],
  description: "Specialty coffee roaster with a minimalist aesthetic serving espresso drinks & pastries.",
}
