"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Pencil, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ReviewForm } from "./review-form"
import { Review } from "@/lib/place-data"
import {
  getCurrentUser,
  getReviewsForPlace,
  saveReviewsForPlace,
  getHelpfulReviews,
  saveHelpfulReviews,
  initializeDefaultReviews,
} from "@/lib/review-storage"

interface PlaceReviewsProps {
  placeId: string
}

export function PlaceReviews({ placeId }: PlaceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())
  const [currentUser, setCurrentUser] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from session storage on mount
  useEffect(() => {
    initializeDefaultReviews(placeId)
    setReviews(getReviewsForPlace(placeId))
    setHelpfulReviews(getHelpfulReviews())
    setCurrentUser(getCurrentUser())
    setIsLoaded(true)
  }, [placeId])

  // Save reviews to session storage whenever they change
  useEffect(() => {
    if (!isLoaded) return
    saveReviewsForPlace(placeId, reviews)
  }, [reviews, isLoaded, placeId])

  // Save helpful reviews to session storage whenever they change
  useEffect(() => {
    if (!isLoaded) return
    saveHelpfulReviews(helpfulReviews)
  }, [helpfulReviews, isLoaded])

  // Create new review
  const handleAddReview = (reviewData: Omit<Review, "id" | "date" | "helpful">) => {
    const newReview: Review = {
      ...reviewData,
      id: `${placeId}-${Date.now()}`,
      author: currentUser,
      date: "Just now",
      helpful: 0,
    }
    setReviews([newReview, ...reviews])
  }

  // Update existing review
  const handleUpdateReview = (reviewData: Omit<Review, "id" | "date" | "helpful">) => {
    if (!editingReview) return
    
    setReviews(reviews.map(review => 
      review.id === editingReview.id
        ? { ...review, ...reviewData, date: "Updated just now" }
        : review
    ))
    setEditingReview(null)
  }

  // Delete review
  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId))
    setDeletingReviewId(null)
  }

  // Toggle helpful
  const handleToggleHelpful = (reviewId: string) => {
    const newHelpfulReviews = new Set(helpfulReviews)
    const wasHelpful = helpfulReviews.has(reviewId)
    
    if (wasHelpful) {
      newHelpfulReviews.delete(reviewId)
    } else {
      newHelpfulReviews.add(reviewId)
    }
    
    setHelpfulReviews(newHelpfulReviews)
    
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + (wasHelpful ? -1 : 1) }
        : review
    ))
  }

  return (
    <div className="space-y-4">
      {/* Current User Info */}
      <div className="text-xs text-muted-foreground mb-2">
        Reviewing as: <span className="font-medium text-foreground">{currentUser}</span>
      </div>
      
      {/* Add Review Button */}
      <ReviewForm onSubmit={handleAddReview} currentUser={currentUser} />

      {/* Reviews List */}
      <div className="space-y-4 mt-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {review.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
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
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
                {/* Action Buttons - Only show for current user's reviews */}
                {review.author === currentUser && (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setEditingReview(review)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeletingReviewId(review.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed ml-12">
                {review.text}
              </p>
              
              <div className="flex items-center gap-4 ml-12">
                <button
                  onClick={() => handleToggleHelpful(review.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    helpfulReviews.has(review.id)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ThumbsUp
                    className={`h-3.5 w-3.5 ${
                      helpfulReviews.has(review.id) ? "fill-primary" : ""
                    }`}
                  />
                  <span>{review.helpful}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Review Dialog */}
      {editingReview && (
        <ReviewForm
          editingReview={editingReview}
          onSubmit={handleUpdateReview}
          onClose={() => setEditingReview(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deletingReviewId !== null}
        onOpenChange={(open) => !open && setDeletingReviewId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingReviewId && handleDeleteReview(deletingReviewId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
