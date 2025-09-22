import { defineStore } from 'pinia'
import { checkSession } from '@/api/auth.js'

const AUTH_STORAGE_KEY = 'csolved_auth'
const AUTH_CHANNEL = 'csolved_auth_channel'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    sessionChecked: false,
    broadcastChannel: null
  }),

  actions: {
    // 초기화 (앱 시작 시 호출)
    init() {
      this.loadFromStorage()
      this.setupBroadcastChannel()
    },

    // localStorage에서 인증 상태 불러오기
    loadFromStorage() {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          this.isAuthenticated = data.isAuthenticated || false
          this.user = data.user || null
          this.sessionChecked = data.sessionChecked || false
        } catch (error) {
          console.error('Failed to parse auth data from localStorage:', error)
          this.clearStorage()
        }
      }
    },

    // localStorage에 인증 상태 저장
    saveToStorage() {
      const data = {
        isAuthenticated: this.isAuthenticated,
        user: this.user,
        sessionChecked: this.sessionChecked
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    },

    // localStorage 초기화
    clearStorage() {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    },

    // BroadcastChannel 설정 (탭 간 동기화)
    setupBroadcastChannel() {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel(AUTH_CHANNEL)
        this.broadcastChannel.onmessage = (event) => {
          const { type, data } = event.data
          if (type === 'AUTH_UPDATE') {
            this.isAuthenticated = data.isAuthenticated
            this.user = data.user
            this.sessionChecked = data.sessionChecked
          }
        }
      }
    },

    // 다른 탭들에게 인증 상태 변경 알림
    broadcastAuthUpdate() {
      if (this.broadcastChannel) {
        try {
          this.broadcastChannel.postMessage({
            type: 'AUTH_UPDATE',
            data: {
              isAuthenticated: this.isAuthenticated,
              user: this.user ? JSON.parse(JSON.stringify(this.user)) : null,
              sessionChecked: this.sessionChecked
            }
          })
        } catch (error) {
          console.warn('BroadcastChannel postMessage failed:', error)
        }
      }
    },

    // 서버에서 세션 확인 (한 번만 호출)
    async checkAuth() {
      if (this.sessionChecked) {
        return this.isAuthenticated
      }

      try {
        const result = await checkSession()

        if (result.success) {
          this.isAuthenticated = true
          this.user = result.data
        } else {
          this.isAuthenticated = false
          this.user = null
        }

        this.sessionChecked = true
        this.saveToStorage()
        this.broadcastAuthUpdate()

        return this.isAuthenticated
      } catch (error) {
        console.error('Session check failed:', error)
        this.isAuthenticated = false
        this.user = null
        this.sessionChecked = true
        this.saveToStorage()
        this.broadcastAuthUpdate()
        return false
      }
    },

    // 로그인 성공 시 호출
    login(userData) {
      this.isAuthenticated = true
      this.user = userData
      this.sessionChecked = true
      this.saveToStorage()
      this.broadcastAuthUpdate()
    },

    // 로그아웃 시 호출
    logout() {
      this.isAuthenticated = false
      this.user = null
      this.sessionChecked = false
      this.clearStorage()
      this.broadcastAuthUpdate()
    },

    // 세션 무효화 (서버에서 401 응답 받았을 때)
    invalidateSession() {
      this.isAuthenticated = false
      this.user = null
      this.sessionChecked = false
      this.saveToStorage()
      this.broadcastAuthUpdate()
    }
  },

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && state.sessionChecked
  }
})