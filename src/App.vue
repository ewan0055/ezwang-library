<script setup>
// ===== Previous Week 3 component: retained, but not displayed now =====
import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'

// ===== Green Futures Melbourne A1.2 components =====
import { ref } from 'vue'
import GfmNavigation from './components/GfmNavigation.vue'
import ResourceHub from './components/ResourceHub.vue'
import EventList from './components/EventList.vue'
import ActivityRegistrationForm from './components/ActivityRegistrationForm.vue'

const currentView = ref('resources')
const selectedEventId = ref(null)

function changeView(viewName) {
  currentView.value = viewName
}

function joinEvent(eventId) {
  selectedEventId.value = eventId
  currentView.value = 'join'
}

function clearSelectedEvent() {
  selectedEventId.value = null
}
</script>

<template>
  <!-- ===== Previous Week 3 page: retained as a comment ===== -->
  <!--
  <main>
    <LibraryRegistrationForm />
  </main>
  -->

  <!-- ===== Green Futures Melbourne A1.2 application ===== -->
  <GfmNavigation
    :current-view="currentView"
    @change-view="changeView"
  />

  <header class="bg-light border-bottom">
    <div class="container py-4">
      <p class="mb-0 text-muted">
        Local climate learning, wellbeing support, and practical community action.
      </p>
    </div>
  </header>

  <main class="container py-5">
    <ResourceHub v-if="currentView === 'resources'" />

    <EventList
      v-else-if="currentView === 'events'"
      @join-event="joinEvent"
    />

    <ActivityRegistrationForm
      v-else-if="currentView === 'join'"
      :selected-event-id="selectedEventId"
      @registration-complete="clearSelectedEvent"
    />
  </main>

  <footer class="border-top py-4">
    <div class="container small text-muted">
      Green Futures Melbourne 
    </div>
  </footer>
</template>

<style scoped>
/* Previous Week 3 styling retained; it remains compatible with the new page. */
main {
  padding: 20px;
}
</style>