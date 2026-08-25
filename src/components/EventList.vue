<script setup>
import { events } from '../data/gfmData'

defineEmits(['join-event'])
</script>

<template>
  <section>
    <div class="mb-4">
      <p class="text-success fw-semibold mb-1">LOCAL EVENTS</p>
      <h1>Take climate action together</h1>
      <p class="text-muted">
        Join friendly local activities and meet people taking practical climate action.
      </p>
    </div>

    <div class="row g-4">
      <div
        v-for="event in events"
        :key="event.id"
        class="col-12 col-md-6 col-xl-4"
      >
        <article class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h5 card-title">{{ event.title }}</h2>

            <ul class="list-unstyled text-muted mb-4">
              <li><strong>Date:</strong> {{ event.date }}</li>
              <li><strong>Location:</strong> {{ event.suburb }}</li>
              <li><strong>Duration:</strong> {{ event.duration }}</li>
              <li><strong>Places available:</strong> {{ event.places }}</li>
            </ul>

            <button
              class="btn btn-success mt-auto"
              @click="$emit('join-event', event.id)"
            >
              Register interest
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>