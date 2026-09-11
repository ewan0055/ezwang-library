export function canAccessCoordinatorDashboard(user) {
  return user?.role === 'coordinator'
}