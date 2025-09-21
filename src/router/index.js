import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '@/views/auth/SignUp.vue'
import SignIn from '@/views/auth/SignIn.vue'
import Communities from '@/views/community/CommunityList.vue'
import Test from '@/views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/signup', component: SignUp },
    { path: '/signin', component: SignIn },
    { path: '/communities', component: Communities },
    { path: '/test', component: Test },
  ],
})

export default router
