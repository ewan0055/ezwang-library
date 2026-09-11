<script setup>
defineProps({
  currentView: {
    type: String,
    required: true,
  },
  currentUser: {
    type: Object,
    default: null,
  },
})

defineEmits(['change-view'])
</script>

<template>
  <nav
    class="navbar navbar-expand-md navbar-dark bg-success px-3"
    aria-label="Main navigation"
  >
    <a
      class="navbar-brand fw-bold"
      href="#"
      @click.prevent="$emit('change-view', 'resources')"
    >
      Green Futures Melbourne
    </a>

    <div class="navbar-nav ms-md-auto flex-row align-items-center gap-2">
      <button
        class="btn btn-sm"
        :class="currentView === 'resources' ? 'btn-light' : 'btn-outline-light'"
        @click="$emit('change-view', 'resources')"
      >
        Resources
      </button>

      <button
        class="btn btn-sm"
        :class="currentView === 'events' ? 'btn-light' : 'btn-outline-light'"
        @click="$emit('change-view', 'events')"
      >
        Events
      </button>

      <button
        class="btn btn-sm"
        :class="currentView === 'join' ? 'btn-light' : 'btn-outline-light'"
        @click="$emit('change-view', 'join')"
      >
        Join an activity
      </button>

      <button
        v-if="!currentUser"
        class="btn btn-sm"
        :class="currentView === 'account' ? 'btn-light' : 'btn-outline-light'"
        @click="$emit('change-view', 'account')"
      >
        Login
      </button>

      <span v-else class="navbar-text small text-white">
        Hi, {{ currentUser.name }}
      </span>
    </div>
  </nav>
</template>