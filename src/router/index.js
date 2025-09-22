import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '@/views/auth/SignUp.vue'
import SignIn from '@/views/auth/SignIn.vue'
import Communities from '@/views/community/List.vue'
import CommunityCreate from '@/views/community/CommunityCreate.vue'
import Test from '@/views/TestView.vue'
import UserActivity from '@/views/user/Activity.vue'
import UserProfile from '@/views/user/ProfileUpdate.vue'
import { useAuthStore } from '@/stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/signup', component: SignUp, meta: { requiresAuth: false } },
    { path: '/signin', component: SignIn, meta: { requiresAuth: false } },
    { path: '/communities', component: Communities, meta: { requiresAuth: true } },
    { path: '/community/create', component: CommunityCreate, meta: { requiresAuth: true } },
    { path: '/test', component: Test, meta: { requiresAuth: true } },
    { path: '/users/activity', component: UserActivity, meta: { requiresAuth: true } },
    { path: '/users/profile', component: UserProfile, meta: { requiresAuth: true } },

    { path: '/', redirect: '/signin' },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 앱 시작 시 스토어 초기화
  if (!authStore.sessionChecked && from.name === undefined) {
    authStore.init()
  }

  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      next('/signin')
      return
    }
  }

  if (to.path === '/signin' || to.path === '/signup') {
    const isAuthenticated = await authStore.checkAuth()
    if (isAuthenticated) {
      next('/communities')
      return
    }
  }

  next()
})

export default router
