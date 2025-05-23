import {createRouter, createWebHashHistory} from 'vue-router'
import type {RouteRecordRaw} from 'vue-router' // Explicit import
import {useAuthStore} from '../stores/auth'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Overview',
        component: () => import('../views/Overview.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/mediaplans/:mediaplanId',
        name: 'MediaplanDetail',
        component: () => import('../views/MediaplanDetail.vue'),
        props: true,
    },
    {
        path: '/mediaplans/:mediaplanId/projects/:projectId',
        name: 'ProjectDetail',
        component: () => import('../views/ProjectDetail.vue'), // Pfad zur neuen Komponente prüfen
        props: true, // Übergibt mediaplanId und projectId als Props
        //meta: { requiresAuth: true } // Annahme: Detail erfordert Login
    },
    {
        path: '/mediaplans/:mediaplanId/projects/:projectId/campaigns/:campaignId/lineitems', // Pfad anpassen nach Bedarf
        name: 'LineitemDetail',
        component: () => import('../views/CampaignDetail.vue'), // Pfad zur neuen Komponente
        props: true, // Übergibt mediaplanId, projectId und campaignId als Props
        //meta: { requiresAuth: true } // Annahme: Detail erfordert Login
    },
    // Additional routes here
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