const REVIEWS_KEY = 'gfmReviews'

function readReviews(storage) {
  const savedReviews = storage.getItem(REVIEWS_KEY)
  return savedReviews ? JSON.parse(savedReviews) : []
}

function saveReviews(storage, reviews) {
  storage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

export function createReviewService(storage) {
  return {
    submitReview({ resourceId, authorId, authorName, rating, comment }) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be an integer between 1 and 5.')
    }
    const cleanComment = comment.trim()

    // Basic XSS defence: reject attempted HTML tags before storing user input.
    if (/[<>]/.test(cleanComment)) {
    throw new Error('Review comments cannot contain HTML tags.')
    }
    const reviews = readReviews(storage)

    const review = {
        resourceId,
        authorId,
        authorName,
        rating,
        comment: cleanComment,
        createdAt: new Date().toISOString(),
    }

    const existingIndex = reviews.findIndex(
        (savedReview) =>
        savedReview.resourceId === resourceId &&
        savedReview.authorId === authorId,
    )

    if (existingIndex >= 0) {
        reviews[existingIndex] = review
    } else {
        reviews.push(review)
    }

    saveReviews(storage, reviews)

    return review
    },

    getReviewsForResource(resourceId) {
      return readReviews(storage).filter(
        (review) => review.resourceId === resourceId,
      )
    },
    
    getAllReviews() {
    return readReviews(storage)
    },

    getAverageRating(resourceId) {
      const reviews = this.getReviewsForResource(resourceId)

      if (reviews.length === 0) {
        return 0
      }

      const total = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      )

      return total / reviews.length
    },
  }
}