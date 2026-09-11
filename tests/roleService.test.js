import test from 'node:test'
import assert from 'node:assert/strict'
import { canAccessCoordinatorDashboard } from '../src/services/roleService.js'

test('Coordinator can access the dashboard', () => {
  assert.equal(
    canAccessCoordinatorDashboard({ role: 'coordinator' }),
    true,
  )
})

test('Member cannot access the dashboard', () => {
  assert.equal(
    canAccessCoordinatorDashboard({ role: 'member' }),
    false,
  )
})

test('Unauthenticated visitor cannot access the dashboard', () => {
  assert.equal(canAccessCoordinatorDashboard(null), false)
})