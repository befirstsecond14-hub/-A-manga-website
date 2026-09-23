import { defineStore } from 'pinia'

interface AuthUser {
  isLoggedIn: boolean
  username: string
  email: string
  role: 'user' | 'admin'
}

const savedUser = localStorage.getItem('mangaverse_auth')

export const useAuthStore = defineStore('auth', {
  state: (): AuthUser => {
    if (savedUser) {
      try {
        return JSON.parse(savedUser)
      } catch {
        localStorage.removeItem('mangaverse_auth')
      }
    }

    return {
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
      username: string,
      email: string,
      role: 'user' | 'admin' = 'user',
    ) {
      this.isLoggedIn = true
      this.username = username
      this.email = email
      this.role = role

      // บันทึกสถานะ Login
      localStorage.setItem(
        'mangaverse_auth',
        JSON.stringify({
          isLoggedIn: this.isLoggedIn,
          username: this.username,
          email: this.email,
          role: this.role,
        }),
      )
    },

    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.email = ''
      this.role = 'user'

      // ลบสถานะ Login
      localStorage.removeItem('mangaverse_auth')
    },
  },
})