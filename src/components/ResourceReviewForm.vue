<script setup>
import { ref } from 'vue'
import { createReviewService } from '../services/reviewService.js'

const props = defineProps({
  resourceId: {
    type: Number,
    required: true,
  },
  currentUser: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['review-submitted'])

const reviewService = createReviewService(localStorage)
const rating = ref(0)
const comment = ref('')
const errorMessage = ref('')
const successMessage = ref('')

function chooseRating(value) {
  rating.value = value
  errorMessage.value = ''
}

function submitReview() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!props.currentUser) {
    errorMessage.value = 'Please log in before submitting a review.'
    return
  }

  if (rating.value === 0) {
    errorMessage.value = 'Please choose a rating from 1 to 5.'
    return
  }

  if (comment.value.trim().length < 5) {
    errorMessage.value = 'Please write at least 5 characters of feedback.'
    return
  }

  try {
    reviewService.submitReview({
      resourceId: props.resourceId,
      authorId: props.currentUser.id,
      authorName: props.currentUser.name,
      rating: rating.value,
      comment: comment.value,
    })

    successMessage.value = 'Your review has been saved.'
    rating.value = 0
    comment.value = ''
    emit('review-submitted')
  } catch (caughtError) {
    errorMessage.value = caughtError.message
  }
}
</script>

<template>
  <section class="border-top mt-3 pt-3">
    <p class="fw-semibold mb-2">Rate this resource</p>

    <p v-if="!currentUser" class="small text-muted mb-0">
      Log in to leave a rating and review.
    </p>

    <form v-else @submit.prevent="submitReview">
      <div class="mb-2">
        <button
          v-for="score in 5"
          :key="score"
          class="btn btn-sm px-1"
          :class="score <= rating ? 'text-warning' : 'text-secondary'"
          type="button"
          @click="chooseRating(score)"
        >
          {{ score <= rating ? '★' : '☆' }}
        </button>
      </div>

      <textarea
        v-model="comment"
        class="form-control form-control-sm mb-2"
        rows="2"
        maxlength="280"
        placeholder="What was useful about this resource?"
      />

      <div v-if="errorMessage" class="small text-danger mb-2">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="small text-success mb-2">
        {{ successMessage }}
      </div>

      <button class="btn btn-sm btn-success" type="submit">
        Save rating
      </button>
    </form>
  </section>
</template>