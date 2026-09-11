import test from 'node:test'
import assert from 'node:assert/strict'
import { createAuthService } from '../src/services/authService.js'

function createMemoryStorage() {
  const values = new Map()

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },

    setItem(key, value) {
      values.set(key, String(value))
    },

    removeItem(key) {
      values.delete(key)
    },
  }
}

test('register stores a Member account without plaintext password', async () => {
  const storage = createMemoryStorage()
  const auth = createAuthService(storage)

  const user = await auth.register({
    name: 'Enze Wang',
    email: 'enze@example.com',
    password: 'Green2026!',
  })

  assert.equal(user.role, 'member')
  assert.doesNotMatch(storage.getItem('gfmUsers'), /Green2026!/)
})

test('seeded Coordinator can log in', async () => {
  const auth = createAuthService(createMemoryStorage())

  await auth.seedCoordinator()

  const coordinator = await auth.login(
    'coordinator@greenfutures.org.au',
    'Green2026!',
  )

  assert.equal(coordinator.role, 'coordinator')
})

test('login saves a safe session for the authenticated user', async () => {
  const storage = createMemoryStorage()
  const auth = createAuthService(storage)

  await auth.seedCoordinator()

  const user = await auth.login(
    'coordinator@greenfutures.org.au',
    'Green2026!',
  )

  assert.deepEqual(auth.getSession(), user)
  assert.doesNotMatch(storage.getItem('gfmCurrentUser'), /Green2026!/)
})