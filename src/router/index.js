import {createRouter, createWebHashHistory} from 'vue-router'
import i18n from '@/locales/index'

import Layout from '@/layout'

export const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        meta: { navbar: true, title: i18n.global.t('Navbar._home') },
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/home/index'),
                meta: { title: 'Home', icon: 'home' }
            }
        ]
    },
    {
        path: '/design',
        component: Layout,
        meta: { navbar: true, title: i18n.global.t('Navbar._design') },
        children: [
            {
                path: 'index',
                name: 'Design',
                component: () => import('@/views/design/index'),
                meta: { title: 'Design', icon: 'design' }
            }
        ]
    },
    {
        path: '/build',
        component: Layout,
        meta: { navbar: true, title: i18n.global.t('Navbar._build') },
        children: [
            {
                path: 'index',
                name: 'Plan',
                component: () => import('@/views/build/index'),
                meta: { title: 'Plan', icon: 'build' }
            }
        ]
    },
    {
        path: '/analyze',
        component: Layout,
        meta: { navbar: true, title: i18n.global.t('Navbar._analyze') },
        children: [
            {
                path: 'index',
                name: 'Analyze',
                component: () => import('@/views/analyze/index'),
                meta: { title: 'Analyze', icon: 'analyze' }
            }
        ]
    },
    {
        path: '/login',
        meta: { navbar: false },
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        meta: { navbar: false },
        component: () => import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/404',
        meta: { navbar: false },
        component: () => import('@/views/error/404'),
        hidden: true
    },
    {
        path: '/401',
        meta: { navbar: false },
        component: () => import('@/views/error/401'),
        hidden: true
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export function resetRouter() {
    router.matcher = createRouter.matcher
    router.options.routes = []
}

export default router
