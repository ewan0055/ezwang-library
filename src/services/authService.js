const USERS_KEY = 'gfmUsers'
const SESSION_KEY = 'gfmCurrentUser'
function readUsers(storage) {
  const savedUsers = storage.getItem(USERS_KEY)
  return savedUsers ? JSON.parse(savedUsers) : []
}

function saveUsers(storage, users) {
  storage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function normaliseEmail(email) {
  return email.trim().toLowerCase()
}

// Beyond Week 5: Web Crypto hashes passwords so they are not stored as plaintext.
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${password}:${salt}`)
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function createAuthService(storage) {
  async function createUser({ name, email, password, role }) {
    const salt = globalThis.crypto.randomUUID()
    const passwordHash = await hashPassword(password, salt)

    return {
      id: globalThis.crypto.randomUUID(),
      name: name.trim(),
      email: normaliseEmail(email),
      role,
      salt,
      passwordHash,
    }
  }

  return {
    async register({ name, email, password }) {
      const users = readUsers(storage)
      const cleanEmail = normaliseEmail(email)

      if (users.some((user) => user.email === cleanEmail)) {
        throw new Error('An account already exists for this email address.')
      }

      const newUser = await createUser({
        name,
        email: cleanEmail,
        password,
        role: 'member',
      })

      users.push(newUser)
      saveUsers(storage, users)

      return publicUser(newUser)
    },

    async seedCoordinator() {
      const users = readUsers(storage)
      const coordinatorEmail = 'coordinator@greenfutures.org.au'

      if (!users.some((user) => user.email === coordinatorEmail)) {
        const coordinator = await createUser({
          name: 'Green Futures Coordinator',
          email: coordinatorEmail,
          password: 'Green2026!',
          role: 'coordinator',
        })

        users.push(coordinator)
        saveUsers(storage, users)
      }
    },

    async login(email, password) {
      const users = readUsers(storage)
      const user = users.find(
        (savedUser) => savedUser.email === normaliseEmail(email),
      )

      if (!user) {
        throw new Error('Invalid email or password.')
      }

      const enteredPasswordHash = await hashPassword(password, user.salt)

      if (enteredPasswordHash !== user.passwordHash) {
        throw new Error('Invalid email or password.')
      }

      const sessionUser = publicUser(user)
      storage.setItem(SESSION_KEY, JSON.stringify(sessionUser))

      return sessionUser
    },
    getSession() {
    const savedSession = storage.getItem(SESSION_KEY)
    return savedSession ? JSON.parse(savedSession) : null
},
}
}