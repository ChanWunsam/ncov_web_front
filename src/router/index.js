import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { 
  getCookie
} from "@/util/util.js";


Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/login.vue')
  }, {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/register.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  var token = getCookie('token')
  // console.log(token);
  if (to.name == 'home') { //校验token
    if (!token || token == 0) {
      if (from.name != 'login') {
        router.push({
          name: "login"
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router