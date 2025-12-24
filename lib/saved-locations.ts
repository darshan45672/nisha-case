import { PlaceData } from "./place-data"

const SAVED_LOCATIONS_KEY = "saved-locations"

export interface SavedLocation {
  id: string
  name: string
  category: string
  address: string
  savedAt: string
}

// Get all saved locations
export const getSavedLocations = (): SavedLocation[] => {
  if (typeof window === "undefined") return []
  
  try {
    const stored = sessionStorage.getItem(SAVED_LOCATIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading saved locations:", error)
    return []
  }
}

// Check if a location is saved
export const isLocationSaved = (placeId: string): boolean => {
  const saved = getSavedLocations()
  return saved.some(location => location.id === placeId)
}

// Save a location
export const saveLocation = (place: PlaceData): boolean => {
  if (typeof window === "undefined") return false
  
  try {
    const saved = getSavedLocations()
    
    // Check if already saved
    if (saved.some(location => location.id === place.id)) {
      return false
    }
    
    const newSaved: SavedLocation = {
      id: place.id,
      name: place.name,
      category: place.category,
      address: place.address,
      savedAt: new Date().toISOString(),
    }
    
    saved.unshift(newSaved)
    sessionStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(saved))
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new Event('savedLocationsChanged'))
    
    return true
  } catch (error) {
    console.error("Error saving location:", error)
    return false
  }
}

// Remove a saved location
export const removeSavedLocation = (placeId: string): boolean => {
  if (typeof window === "undefined") return false
  
  try {
    const saved = getSavedLocations()
    const filtered = saved.filter(location => location.id !== placeId)
    
    if (filtered.length === saved.length) {
      return false // Not found
    }
    
    sessionStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(filtered))
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new Event('savedLocationsChanged'))
    
    return true
  } catch (error) {
    console.error("Error removing saved location:", error)
    return false
  }
}

// Toggle saved status
export const toggleSavedLocation = (place: PlaceData): boolean => {
  if (isLocationSaved(place.id)) {
    removeSavedLocation(place.id)
    return false
  } else {
    saveLocation(place)
    return true
  }
}
