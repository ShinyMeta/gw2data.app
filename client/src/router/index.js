import Vue from 'vue'
import VueRouter from 'vue-router'
import AccountStateCompare from '@/views/AccountStateCompare.vue'

import store from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/accountStateCompare',
    name: 'AccountStateCompare',
    component: AccountStateCompare,
    meta: {requiresAuth: true},
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
    path: '/passwordReset/:userId/:token',
    name: 'Password Reset',
    component: () => import('@/views/PasswordReset.vue'),
  },
  {
    path: '/accountSettings',
    name: 'Account Settings',
    component: () => import('@/views/AccountSettings.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: '/saveNewDataRecord',
    name: 'Save New Data Record',
    component: () => import('@/views/SaveNewDataRecord.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: '/myDataRecords',
    name: 'My Data Records',
    component: () => import('@/views/MyDataRecords.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: '/DataRecordDetail/:record_id',
    name: 'Data Record Detail',
    component: () => import('@/views/DataRecordDetail.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: '/myTags',
    name: 'My Tags',
    component: () => import('@/views/MyTags.vue'),
    meta: {requiresAuth: true},
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // console.log(store.state)
    if (store.state.activeUser.user.username === null) {
      return store.dispatch('getUserFromSession')
      .then(() => {
        if (store.state.activeUser.user.username) {
          //also get apikeys
          return store.dispatch('getApiKeysFromUser')
            .then(next)
        }
      })
      .catch((err) => {
        //if user isn't set here, redirect to /login
        console.error(err)
        next("Login")
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
