"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Review } from "@/lib/place-data"

interface ReviewFormProps {
  onSubmit: (review: Omit<Review, "id" | "date" | "helpful">) => void
  editingReview?: Review
  onClose?: () => void
  currentUser?: string
}

export function ReviewForm({ onSubmit, editingReview, onClose, currentUser }: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(editingReview?.rating || 0)
  const [text, setText] = useState(editingReview?.text || "")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || !text.trim()) {
      return
    }

    onSubmit({
      author: currentUser || "Anonymous User",
      rating,
      text: text.trim(),
    })

    // Reset form
    setRating(0)
    setText("")
    setOpen(false)
    
    if (onClose) {
      onClose()
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when dialog closes
      if (!editingReview) {
        setRating(0)
        setText("")
      }
      if (onClose) {
        onClose()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">
          {editingReview ? "Edit Review" : "Write a Review"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingReview ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with others. Your feedback helps the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Show current user */}
            <div className="grid gap-2">
              <Label>Posting as</Label>
              <div className="text-sm font-medium text-primary">
                {currentUser || "Anonymous User"}
              </div>
            </div>

            {/* Star Rating */}
            <div className="grid gap-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-transparent text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating} {rating === 1 ? "star" : "stars"}
                  </span>
                )}
              </div>
              {rating === 0 && (
                <p className="text-xs text-muted-foreground">
                  Click to rate your experience
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="grid gap-2">
              <Label htmlFor="review-text">Your Review</Label>
              <Textarea
                id="review-text"
                placeholder="Share details about your experience..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[120px] resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {text.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || !text.trim()}
            >
              {editingReview ? "Update Review" : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
