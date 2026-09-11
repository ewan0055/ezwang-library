import test from 'node:test'
import assert from 'node:assert/strict'
import { createReviewService } from '../src/services/reviewService.js'

function createMemoryStorage() {
  const values = new Map()

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
    removeItem(key) {
      values.delete(key)
    },
  }
}

test('calculates an average rating from multiple member reviews', () => {
  const reviews = createReviewService(createMemoryStorage())

  reviews.submitReview({
    resourceId: 1,
    authorId: 'member-1',
    authorName: 'Enze Wang',
    rating: 4,
    comment: 'Clear and useful.',
  })

  reviews.submitReview({
    resourceId: 1,
    authorId: 'member-2',
    authorName: 'Alex Chen',
    rating: 5,
    comment: 'Easy to understand.',
  })

  assert.equal(reviews.getAverageRating(1), 4.5)
  assert.equal(reviews.getReviewsForResource(1).length, 2)
})

test('updates the existing review when the same member rates a resource again', () => {
  const reviews = createReviewService(createMemoryStorage())

  reviews.submitReview({
    resourceId: 1,
    authorId: 'member-1',
    authorName: 'Enze Wang',
    rating: 2,
    comment: 'My first rating.',
  })

  reviews.submitReview({
    resourceId: 1,
    authorId: 'member-1',
    authorName: 'Enze Wang',
    rating: 5,
    comment: 'My updated rating.',
  })

  assert.equal(reviews.getReviewsForResource(1).length, 1)
  assert.equal(reviews.getAverageRating(1), 5)
})

test('rejects a rating outside the allowed one-to-five range', () => {
  const reviews = createReviewService(createMemoryStorage())

  assert.throws(
    () =>
      reviews.submitReview({
        resourceId: 1,
        authorId: 'member-1',
        authorName: 'Enze Wang',
        rating: 6,
        comment: 'This rating is invalid.',
      }),
    /Rating must be an integer between 1 and 5/,
  )
})

test('rejects review comments containing HTML tags', () => {
  const reviews = createReviewService(createMemoryStorage())

  assert.throws(
    () =>
      reviews.submitReview({
        resourceId: 1,
        authorId: 'member-1',
        authorName: 'Enze Wang',
        rating: 5,
        comment: '<script>alert("xss")</script>',
      }),
    /Review comments cannot contain HTML tags/,
  )
})

test('returns all saved reviews for coordinator reporting', () => {
  const reviews = createReviewService(createMemoryStorage())

  reviews.submitReview({
    resourceId: 1,
    authorId: 'member-1',
    authorName: 'Enze Wang',
    rating: 4,
    comment: 'Clear and useful.',
  })

  reviews.submitReview({
    resourceId: 2,
    authorId: 'member-2',
    authorName: 'Alex Chen',
    rating: 5,
    comment: 'Easy to understand.',
  })

  assert.equal(reviews.getAllReviews().length, 2)
})