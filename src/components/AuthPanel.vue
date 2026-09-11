<script setup>
import { ref } from 'vue'
import { createAuthService } from '../services/authService.js'

const emit = defineEmits(['authenticated'])

const auth = createAuthService(localStorage)

const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

function switchMode(newMode) {
  mode.value = newMode
  errorMessage.value = ''
  successMessage.value = ''
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function submitForm() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Password must contain at least 8 characters.'
    return
  }

  if (mode.value === 'register') {
    if (name.value.trim().length < 2) {
      errorMessage.value = 'Please enter your name.'
      return
    }

    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match.'
      return
    }
  }

  try {
    await auth.seedCoordinator()

    let user

    if (mode.value === 'register') {
      await auth.register({
        name: name.value,
        email: email.value,
        password: password.value,
      })

      user = await auth.login(email.value, password.value)
      successMessage.value = 'Your Member account has been created.'
    } else {
      user = await auth.login(email.value, password.value)
      successMessage.value = `Welcome back, ${user.name}.`
    }

    emit('authenticated', user)
    password.value = ''
    confirmPassword.value = ''
  } catch (caughtError) {
    errorMessage.value = caughtError.message
  }
}
</script>

<template>
  <section class="container py-4">
    <div class="card shadow-sm mx-auto auth-card">
      <div class="card-body p-4">
        <p class="text-success fw-bold text-uppercase mb-1">Account access</p>
        <h1 class="h3 mb-3">
          {{ mode === 'login' ? 'Sign in' : 'Create an account' }}
        </h1>

        <div class="btn-group w-100 mb-4" aria-label="Authentication mode">
          <button
            class="btn"
            :class="mode === 'login' ? 'btn-success' : 'btn-outline-success'"
            type="button"
            @click="switchMode('login')"
          >
            Login
          </button>
          <button
            class="btn"
            :class="mode === 'register' ? 'btn-success' : 'btn-outline-success'"
            type="button"
            @click="switchMode('register')"
          >
            Register
          </button>
        </div>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="alert alert-success" role="status">
          {{ successMessage }}
        </div>

        <form @submit.prevent="submitForm">
          <div v-if="mode === 'register'" class="mb-3">
            <label for="account-name" class="form-label">Name</label>
            <input
              id="account-name"
              v-model.trim="name"
              class="form-control"
              type="text"
              autocomplete="name"
            />
          </div>

          <div class="mb-3">
            <label for="account-email" class="form-label">Email address</label>
            <input
              id="account-email"
              v-model.trim="email"
              class="form-control"
              type="email"
              autocomplete="email"
            />
          </div>

          <div class="mb-3">
            <label for="account-password" class="form-label">Password</label>
            <input
              id="account-password"
              v-model="password"
              class="form-control"
              type="password"
              autocomplete="current-password"
            />
            <div class="form-text">Use at least 8 characters.</div>
          </div>

          <div v-if="mode === 'register'" class="mb-4">
            <label for="confirm-password" class="form-label">
              Confirm password
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              class="form-control"
              type="password"
              autocomplete="new-password"
            />
          </div>

          <button class="btn btn-success w-100" type="submit">
            {{ mode === 'login' ? 'Login' : 'Create Member account' }}
          </button>
        </form>

        <details class="mt-4 text-muted small">
          <summary>Coordinator demo account</summary>
          <p class="mb-0 mt-2">
            coordinator@greenfutures.org.au<br />
            Green2026!
          </p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-card {
  max-width: 520px;
}
</style>