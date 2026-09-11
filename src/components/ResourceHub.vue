<script setup>
import { computed, ref } from 'vue'
import { resources } from '../data/gfmData'
import { createReviewService } from '../services/reviewService.js'
import ResourceReviewForm from './ResourceReviewForm.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
})

const selectedCategory = ref('All')
const refreshKey = ref(0)
const reviewService = createReviewService(localStorage)

const categories = ['All', 'Wellbeing', 'Learning', 'Action']

const resourcesWithRatings = computed(() => {
  refreshKey.value

  return resources.map((resource) => {
    const reviews = reviewService.getReviewsForResource(resource.id)

    return {
      ...resource,
      reviewCount: reviews.length,
      averageRating: reviewService.getAverageRating(resource.id),
    }
  })
})

function refreshRatings() {
  refreshKey.value += 1
}
</script>

<template>
  <section>
    <div class="mb-4">
      <p class="text-success fw-semibold mb-1">RESOURCE HUB</p>
      <h1>Find climate support at your pace</h1>
      <p class="text-muted">
        Short, practical resources for learning, wellbeing, and local action.
      </p>
    </div>

    <div class="mb-4">
      <label for="resource-category" class="form-label fw-semibold">
        Filter resources by category
      </label>

      <select
        id="resource-category"
        v-model="selectedCategory"
        class="form-select"
      >
        <option v-for="category in categories" :key="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div class="row g-4">
      <div
        v-for="resource in resourcesWithRatings"
        :key="resource.id"
        v-show="
          selectedCategory === 'All' ||
          resource.category === selectedCategory
        "
        class="col-12 col-md-6 col-xl-4"
      >
        <article class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <span class="badge text-bg-success align-self-start mb-3">
              {{ resource.category }}
            </span>

            <h2 class="h5 card-title">{{ resource.title }}</h2>

            <p class="card-text text-muted">
              {{ resource.description }}
            </p>

            <p class="small text-muted mb-2">
              {{ resource.duration }}
            </p>

            <p
              v-if="resource.reviewCount > 0"
              class="small mb-0"
              aria-label="Average resource rating"
            >
              <span class="text-warning" aria-hidden="true">★</span>
              <strong>{{ resource.averageRating.toFixed(1) }} / 5</strong>
              · {{ resource.reviewCount }}
              {{ resource.reviewCount === 1 ? 'review' : 'reviews' }}
            </p>

            <p v-else class="small text-muted mb-0">
              No ratings yet
            </p>

            <ResourceReviewForm
              :resource-id="resource.id"
              :current-user="props.currentUser"
              @review-submitted="refreshRatings"
            />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>