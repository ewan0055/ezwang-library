<script setup>
import { computed } from 'vue'
import { canAccessCoordinatorDashboard } from '../services/roleService.js'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
})

const hasDashboardAccess = computed(() =>
  canAccessCoordinatorDashboard(props.currentUser),
)
</script>

<template>
  <section class="py-2">
    <div v-if="hasDashboardAccess">
      <p class="text-success fw-bold text-uppercase mb-1">
        Coordinator area
      </p>
      <h1 class="mb-3">Community activity dashboard</h1>
      <p class="text-muted mb-4">
        This protected page is available only to Green Futures Coordinators.
      </p>

      <div class="row g-3">
        <div class="col-md-6">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <h2 class="h5">Resource reviews</h2>
              <p class="mb-0 text-muted">
                Resource ratings and comments will appear here after members
                submit reviews.
              </p>
            </div>
          </article>
        </div>

        <div class="col-md-6">
          <article class="card h-100 shadow-sm">
            <div class="card-body">
              <h2 class="h5">Access level</h2>
              <p class="mb-0">
                You are signed in as:
                <strong>{{ currentUser.name }}</strong>
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning" role="alert">
      This page is restricted to Coordinator accounts.
    </div>
  </section>
</template>