import { Review } from "./place-data"

const REVIEWS_STORAGE_KEY = "place-reviews-by-location"
const HELPFUL_STORAGE_KEY = "helpful-reviews"
const CURRENT_USER_KEY = "current-user"

export interface ReviewsByPlace {
  [placeId: string]: Review[]
}

// Get or create current user
export const getCurrentUser = (): string => {
  if (typeof window === "undefined") return "Anonymous User"
  
  try {
    let currentUser = sessionStorage.getItem(CURRENT_USER_KEY)
    if (!currentUser) {
      // Generate a random user identifier
      currentUser = `User${Math.random().toString(36).substring(2, 9)}`
      sessionStorage.setItem(CURRENT_USER_KEY, currentUser)
    }
    return currentUser
  } catch (error) {
    console.error("Error getting current user:", error)
    return "Anonymous User"
  }
}

// Set current user (for manual override)
export const setCurrentUser = (username: string): void => {
  if (typeof window === "undefined") return
  
  try {
    sessionStorage.setItem(CURRENT_USER_KEY, username)
  } catch (error) {
    console.error("Error setting current user:", error)
  }
}

// Get reviews for a specific place
export const getReviewsForPlace = (placeId: string): Review[] => {
  if (typeof window === "undefined") return []
  
  try {
    const stored = sessionStorage.getItem(REVIEWS_STORAGE_KEY)
    if (!stored) return []
    
    const allReviews: ReviewsByPlace = JSON.parse(stored)
    return allReviews[placeId] || []
  } catch (error) {
    console.error("Error loading reviews:", error)
    return []
  }
}

// Save reviews for a specific place
export const saveReviewsForPlace = (placeId: string, reviews: Review[]): void => {
  if (typeof window === "undefined") return
  
  try {
    const stored = sessionStorage.getItem(REVIEWS_STORAGE_KEY)
    const allReviews: ReviewsByPlace = stored ? JSON.parse(stored) : {}
    
    allReviews[placeId] = reviews
    sessionStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews))
  } catch (error) {
    console.error("Error saving reviews:", error)
  }
}

// Get helpful reviews
export const getHelpfulReviews = (): Set<string> => {
  if (typeof window === "undefined") return new Set()
  
  try {
    const stored = sessionStorage.getItem(HELPFUL_STORAGE_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch (error) {
    console.error("Error loading helpful reviews:", error)
    return new Set()
  }
}

// Save helpful reviews
export const saveHelpfulReviews = (helpfulReviews: Set<string>): void => {
  if (typeof window === "undefined") return
  
  try {
    sessionStorage.setItem(HELPFUL_STORAGE_KEY, JSON.stringify(Array.from(helpfulReviews)))
  } catch (error) {
    console.error("Error saving helpful reviews:", error)
  }
}

// Initialize default reviews for a place (only if none exist)
export const initializeDefaultReviews = (placeId: string): void => {
  const existingReviews = getReviewsForPlace(placeId)
  
  if (existingReviews.length === 0) {
    const defaultReviews: Review[] = [
      {
        id: `${placeId}-1`,
        author: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        text: "Amazing experience! Highly recommend this place.",
        helpful: 12,
      },
      {
        id: `${placeId}-2`,
        author: "Michael T.",
        rating: 4,
        date: "1 month ago",
        text: "Great quality but can get quite busy. Recommend going during off-peak hours.",
        helpful: 8,
      },
    ]
    
    saveReviewsForPlace(placeId, defaultReviews)
  }
}
