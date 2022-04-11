import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//These are the different resources available to our Vue app
const routes = [
	{
		path: "/",
		name: "start",
		component: () => import("../views/PagesView.vue")
	},
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
	{
    path: '/pages',
    name: 'pages',
    component: () => import("../views/PagesView.vue")
  },
	{
		path: "/pages/:id",
		name: "deity",
		component: () => import("../views/DeityView.vue")
	},
	{
		path: "/createpage",
		name: "createpage",
		component: () => import("../views/CreateView.vue")
	},
	{
		path: "/modifypage/:id",
		name: "modifypage",
		component: () => import("../views/ModifyView.vue")
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
