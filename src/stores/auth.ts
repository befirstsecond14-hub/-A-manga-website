import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  }),

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
    },

    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.email = ''
      this.role = 'user'
    },
  },
})