<script setup>
import { ref } from 'vue'
import { resources } from '../data/gfmData'

const selectedCategory = ref('All')

const categories = ['All', 'Wellbeing', 'Learning', 'Action']
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
        v-for="resource in resources"
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

            <p class="small text-muted mt-auto mb-0">
              {{ resource.duration }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>