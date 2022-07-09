import {createRouter, createWebHashHistory} from 'vue-router'

import Layout from '@/layout'

export const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        meta: { navbar: true, title: '首页' },
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
        meta: { navbar: true, title: '用例设计' },
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
        path: '/plan',
        component: Layout,
        meta: { navbar: true, title: '测试计划' },
        children: [
            {
                path: 'index',
                name: 'Plan',
                component: () => import('@/views/plan/index'),
                meta: { title: 'Plan', icon: 'plan' }
            }
        ]
    },
    {
        path: '/analyze',
        component: Layout,
        meta: { navbar: true, title: '数据分析' },
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
