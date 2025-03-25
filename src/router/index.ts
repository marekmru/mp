import {createRouter, createWebHashHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router' // Expliziter Import
import {useAuthStore} from '../stores/auth'
import Overview from "./Overview.vue";
import Login from "./Login.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Overview',
        component: Overview,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/mediaplans/:id',
        name: 'MediaplanDetail',
        component: () => import('../views/MediaplanDetail.vue'),
        props: true,
    },
    {
        path: '/mediaplans/:id/edit',
        name: 'MediaplanEdit',
        component: () => import('../views/MediaplanEdit.vue'),
        props: true,
    },
    // Weitere Routen hier
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
})
router.beforeEach((to, from, next) => {
/*    const authStore = useAuthStore()
    console.log('Navigation Guard:', to.name, authStore.isAuthenticated)
    if (to.name !== 'Login' && !authStore.isAuthenticated) {
        next({name: 'Login'})
    } else {
        next()
    }*/
    next()
})
export default router