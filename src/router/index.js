import { createRouter, createWebHistory } from 'vue-router'
// import Home from '.././views/Home.vue'
// import Login from '../views/auth/Login.vue'
import SignUp from '../views/auth/SignUp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/signup', component: SignUp }],
})

export default router
