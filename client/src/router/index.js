import Vue from 'vue'
import VueRouter from 'vue-router'
import AccountStateCompare from '@/views/AccountStateCompare.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'AccountStateCompare',
    component: AccountStateCompare
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/HomeLogin.vue')
  },
  {
    path: '/accountSettings',
    name: 'Account Settings',
    component: () => import('@/views/AccountSettings.vue')
  },
  {
    path: '/saveNewDataRecord',
    name: 'Save New Data Record',
    component: () => import('@/views/SaveNewDataRecord.vue')
  },
  {
    path: '/myDataRecords',
    name: 'My Data Records',
    component: () => import('@/views/MyDataRecords.vue')
  },
  {
    path: '/DataRecordDetail/:record_id',
    name: 'Data Record Detail',
    component: () => import('@/views/DataRecordDetail.vue')
  },

  {
    path: '*',
    name: '404 Route Not Found',
    component: () => import('@/views/NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
