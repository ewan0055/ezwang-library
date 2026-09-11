<script setup>
// ===== Previous Week 3 component: retained, but not displayed now =====
import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'

// ===== Green Futures Melbourne A1.2 components =====
import { ref } from 'vue'
import GfmNavigation from './components/GfmNavigation.vue'
import ResourceHub from './components/ResourceHub.vue'
import EventList from './components/EventList.vue'
import ActivityRegistrationForm from './components/ActivityRegistrationForm.vue'

// ===== A1.3 authentication components =====
import AuthPanel from './components/AuthPanel.vue'
import { createAuthService } from './services/authService.js'
import CoordinatorDashboard from './components/CoordinatorDashboard.vue'
const auth = createAuthService(localStorage)

const currentView = ref('resources')
const selectedEventId = ref(null)
const currentUser = ref(auth.getSession())

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

function handleAuthenticated(user) {
  currentUser.value = user
  currentView.value = 'resources'
}

function handleLogout() {
  auth.logout()
  currentUser.value = null
  currentView.value = 'resources'
}
</script>

<template>
  <!-- ===== Previous Week 3 page: retained as a comment ===== -->
  <!--
  <main>
    <LibraryRegistrationForm />
  </main>
  -->

  <GfmNavigation
    :current-view="currentView"
    :current-user="currentUser"
    @change-view="changeView"
    @logout="handleLogout"
  />

  <header class="bg-light border-bottom">
    <div
      class="container py-4 d-flex flex-column flex-md-row justify-content-between gap-2"
    >
      <p class="mb-0 text-muted">
        Local climate learning, wellbeing support, and practical community action.
      </p>

      <p v-if="currentUser" class="mb-0">
        Signed in as <strong>{{ currentUser.name }}</strong>
        <span class="badge text-bg-success ms-1 text-capitalize">
          {{ currentUser.role }}
        </span>
      </p>
    </div>
  </header>

  <main class="container py-5">
    <ResourceHub
    v-if="currentView === 'resources'"
    :current-user="currentUser"
    />

    <EventList
      v-else-if="currentView === 'events'"
      @join-event="joinEvent"
    />

    <ActivityRegistrationForm
      v-else-if="currentView === 'join'"
      :selected-event-id="selectedEventId"
      @registration-complete="clearSelectedEvent"
    />

    <CoordinatorDashboard
      v-else-if="currentView === 'dashboard'"
      :current-user="currentUser"
    />

    <AuthPanel
      v-else-if="currentView === 'account'"
      @authenticated="handleAuthenticated"
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