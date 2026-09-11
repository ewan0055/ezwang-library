<script setup>
import { computed } from 'vue'
import { resources } from '../data/gfmData'
import { canAccessCoordinatorDashboard } from '../services/roleService.js'
import { createReviewService } from '../services/reviewService.js'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
})

const reviewService = createReviewService(localStorage)

const hasDashboardAccess = computed(() =>
  canAccessCoordinatorDashboard(props.currentUser),
)

const allReviews = computed(() => reviewService.getAllReviews())

const overallAverage = computed(() => {
  if (allReviews.value.length === 0) {
    return 0
  }

  const total = allReviews.value.reduce(
    (sum, review) => sum + review.rating,
    0,
  )

  return total / allReviews.value.length
})

const resourceSummaries = computed(() =>
  resources.map((resource) => {
    const reviews = allReviews.value.filter(
      (review) => review.resourceId === resource.id,
    )

    const averageRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length

    return {
      ...resource,
      reviewCount: reviews.length,
      averageRating,
    }
  }),
)

function resourceTitle(resourceId) {
  return (
    resources.find((resource) => resource.id === resourceId)?.title ??
    'Unknown resource'
  )
}
</script>

<template>
  <section class="py-2">
    <div v-if="hasDashboardAccess">
      <p class="text-success fw-bold text-uppercase mb-1">
        Coordinator area
      </p>
      <h1 class="mb-3">Community activity dashboard</h1>
      <p class="text-muted mb-4">
        Review data is visible only to Coordinator accounts.
      </p>

      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <p class="text-muted mb-1">Total resource reviews</p>
              <p class="display-6 mb-0">{{ allReviews.length }}</p>
            </div>
          </article>
        </div>

        <div class="col-md-6">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <p class="text-muted mb-1">Overall average rating</p>
              <p class="display-6 mb-0">
                {{ overallAverage.toFixed(1) }} / 5
              </p>
            </div>
          </article>
        </div>
      </div>

      <article class="card shadow-sm mb-4">
        <div class="card-body">
          <h2 class="h4 mb-3">Ratings by resource</h2>

          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Resource</th>
                  <th scope="col">Average rating</th>
                  <th scope="col">Reviews</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="resource in resourceSummaries" :key="resource.id">
                  <td>{{ resource.title }}</td>
                  <td>
                    <span v-if="resource.reviewCount > 0">
                      ★ {{ resource.averageRating.toFixed(1) }} / 5
                    </span>
                    <span v-else class="text-muted">No ratings yet</span>
                  </td>
                  <td>{{ resource.reviewCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article class="card shadow-sm">
        <div class="card-body">
          <h2 class="h4 mb-3">Submitted reviews</h2>

          <p v-if="allReviews.length === 0" class="text-muted mb-0">
            No reviews have been submitted yet.
          </p>

          <div
            v-for="review in [...allReviews].reverse()"
            :key="`${review.authorId}-${review.resourceId}`"
            class="border-top pt-3 mt-3"
          >
            <p class="fw-semibold mb-1">
              {{ resourceTitle(review.resourceId) }}
              <span class="text-warning">★ {{ review.rating }} / 5</span>
            </p>
            <p class="small text-muted mb-1">
              By {{ review.authorName }}
            </p>

            <!-- Vue interpolation escapes text, so untrusted comments are not rendered as HTML. -->
            <p class="mb-0">{{ review.comment }}</p>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="alert alert-warning" role="alert">
      This page is restricted to Coordinator accounts.
    </div>
  </section>
</template>