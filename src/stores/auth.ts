import { defineStore } from 'pinia'

interface AuthUser {
  userId: number
  isLoggedIn: boolean
  username: string
  email: string
  role: 'user' | 'admin'
}

const savedUser =
  localStorage.getItem('mangaverse_auth')

export const useAuthStore = defineStore('auth', {
  state: (): AuthUser => {
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)

        return {
          userId: Number(parsed.userId ?? 0),
          isLoggedIn: Boolean(
            parsed.isLoggedIn,
          ),
          username: String(
            parsed.username ?? '',
          ),
          email: String(
            parsed.email ?? '',
          ),
          role:
            parsed.role === 'admin'
              ? 'admin'
              : 'user',
        }
      } catch {
        localStorage.removeItem(
          'mangaverse_auth',
        )
      }
    }

    return {
      userId: 0,
      isLoggedIn: false,
      username: '',
      email: '',
      role: 'user',
    }
  },

  getters: {
    isAdmin: (state) => {
      return state.role === 'admin'
    },
  },

  actions: {
    login(
      userId: number,
      username: string,
      email: string,
      role: 'user' | 'admin' = 'user',
    ) {
      this.userId = userId
      this.isLoggedIn = true
      this.username = username
      this.email = email
      this.role = role

      localStorage.setItem(
        'mangaverse_auth',
        JSON.stringify({
          userId: this.userId,
          isLoggedIn: this.isLoggedIn,
          username: this.username,
          email: this.email,
          role: this.role,
        }),
      )
    },

    logout() {
      this.userId = 0
      this.isLoggedIn = false
      this.username = ''
      this.email = ''
      this.role = 'user'

      localStorage.removeItem(
        'mangaverse_auth',
      )
    },
  },
})