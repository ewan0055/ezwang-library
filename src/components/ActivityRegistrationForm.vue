<script setup>
import { ref } from 'vue'
import { events } from '../data/gfmData'

const props = defineProps({
  selectedEventId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['registration-complete'])

const form = ref({
  fullName: '',
  email: '',
  eventId: props.selectedEventId ? String(props.selectedEventId) : '',
})

const errors = ref({})
const submittedRegistration = ref(null)

function validateForm() {
  const newErrors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (form.value.fullName.trim().length < 2) {
    newErrors.fullName = 'Please enter your full name (at least 2 characters).'
  }

  if (!emailPattern.test(form.value.email.trim())) {
    newErrors.email = 'Please enter a valid email address.'
  }

  if (!form.value.eventId) {
    newErrors.eventId = 'Please select an activity.'
  }

  errors.value = newErrors

  return Object.keys(newErrors).length === 0
}

function submitForm() {
  if (!validateForm()) {
    return
  }

  const selectedEvent = events.find(
    (event) => event.id === Number(form.value.eventId),
  )

  const registration = {
    fullName: form.value.fullName.trim(),
    email: form.value.email.trim(),
    eventTitle: selectedEvent.title,
  }

  // Beyond Week 5 / A1.2 B.2: persist registrations after browser refresh.
  const savedRegistrations = JSON.parse(
    localStorage.getItem('gfmRegistrations') || '[]',
  )
  savedRegistrations.push(registration)
  localStorage.setItem('gfmRegistrations', JSON.stringify(savedRegistrations))

  submittedRegistration.value = registration

  form.value = {
    fullName: '',
    email: '',
    eventId: '',
  }

  errors.value = {}
  emit('registration-complete')
}
</script>

<template>
  <section class="row justify-content-center">
    <div class="col-12 col-lg-8">
      <p class="text-success fw-semibold mb-1">JOIN AN ACTIVITY</p>
      <h1>Register your interest</h1>
      <p class="text-muted mb-4">
        Complete this form and Green Futures Melbourne will contact you with
        event details.
      </p>

      <div
        v-if="submittedRegistration"
        class="alert alert-success"
        role="status"
      >
        Thank you, {{ submittedRegistration.fullName }}. Your interest in
        “{{ submittedRegistration.eventTitle }}” has been saved.
      </div>

      <form class="card shadow-sm" @submit.prevent="submitForm" novalidate>
        <div class="card-body p-4">
          <div class="mb-3">
            <label for="full-name" class="form-label">Full name</label>
            <input
              id="full-name"
              v-model="form.fullName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.fullName }"
              autocomplete="name"
            >
            <div v-if="errors.fullName" class="invalid-feedback">
              {{ errors.fullName }}
            </div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              autocomplete="email"
            >
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>

          <div class="mb-4">
            <label for="activity" class="form-label">Choose an activity</label>
            <select
              id="activity"
              v-model="form.eventId"
              class="form-select"
              :class="{ 'is-invalid': errors.eventId }"
            >
              <option value="">Please choose an activity</option>
              <option
                v-for="event in events"
                :key="event.id"
                :value="event.id"
              >
                {{ event.title }} — {{ event.date }}
              </option>
            </select>
            <div v-if="errors.eventId" class="invalid-feedback">
              {{ errors.eventId }}
            </div>
          </div>

          <button type="submit" class="btn btn-success">
            Save registration
          </button>
        </div>
      </form>
    </div>
  </section>
</template>