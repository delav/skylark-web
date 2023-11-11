import { createRouter, createWebHashHistory } from "vue-router";
import i18n from "@/locales/index";
import Layout from "@/layout";

export const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/design',
    meta: { navbar: false }
  },
  {
    path: '/design',
    name: 'Design',
    component: Layout,
    meta: { navbar: true, title: 'Navbar._design' },
    children: [
      {
        path: '',
        name: 'Design',
        component: () => import('@/views/design/index'),
        meta: { }
      }
    ]
  },
  {
    path: '/build',
    name: 'Build',
    component: Layout,
    meta: { navbar: true, title: 'Navbar._build' },
    children: [
      {
        path: '',
        redirect: '/build/plan/list',
        component: () => import('@/views/build/index'),
        children: [
          {
            path: '/build/plan/list',
            name: 'PlanList',
            component: () => import('@/views/build/plan/PlanList'),
            meta: { sidebar: true, title: i18n.global.t('BuildNavBar._plan'), icon: 'plan', activeMenu: '/build', secondActiveMenu: '/build/plan/list' }
          },
          {
            path: '/build/record/list',
            name: 'RecordList',
            component: () => import('@/views/build/record/RecordList'),
            meta: { sidebar: true, title: 'BuildNavBar._record', icon: 'record', activeMenu: '/build', secondActiveMenu: '/build/record/list' }
          },
          {
            path: '/build/quick/start',
            name: 'QuickBuild',
            component: () => import('@/views/build/components/QuickBuild'),
            meta: { sidebar: true, title: 'BuildNavBar._quick', icon: 'quick-build', activeMenu: '/build', secondActiveMenu: '/build/quick/start' }
          },
          {
            path: '/build/plan/detail/:id',
            name: 'PlanDetail',
            component: () => import('@/views/build/plan/PlanDetail'),
            meta: { activeMenu: '/build', secondActiveMenu: '/build/plan/detail' }
          },
          {
            path: '/build/record/detail/:id',
            name: 'RecordDetail',
            component: () => import('@/views/build/record/RecordDetail'),
            meta: { activeMenu: '/build', secondActiveMenu: '/build/record/detail' }
          },
        ]
      },
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Layout,
    meta: { navbar: true, title: 'Navbar._setting' },
    children: [
      {
        path: '',
        redirect: '/setting/variable',
        component: () => import('@/views/setting/index'),
        children: [
          {
            path: '/setting/variable',
            name: 'Variable',
            component: () => import('@/views/setting/variable/index'),
            meta: { sidebar: true, title: 'SettingNavBar._variable', icon: 'setting-variable', activeMenu: '/setting', secondActiveMenu: '/setting/variable' }
          },
          {
            path: '/setting/notice',
            name: 'Notice',
            component: () => import('@/views/setting/notice/index'),
            meta: { sidebar: true, title: 'SettingNavBar._notice', icon: 'setting-notice', activeMenu: '/setting', secondActiveMenu: '/setting/notice' }
          },
          {
            path: '/setting/keyword',
            name: 'Keyword',
            component: () => import('@/views/setting/keyword/index'),
            meta: { sidebar: true, title: 'SettingNavBar._keyword', icon: 'setting-component', activeMenu: '/setting', secondActiveMenu: '/setting/keyword' }
          },
          {
            path: '/setting/access',
            name: 'Access',
            component: () => import('@/views/setting/access/index'),
            meta: { sidebar: true, title: 'SettingNavBar._access', icon: 'setting-access', activeMenu: '/setting', secondActiveMenu: '/setting/access' }
          },
        ]
      },
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    redirect: '/statistics/overview',
    component: Layout,
    meta: { navbar: true, title: 'Navbar._statistics' },
    children: [
      {
        path: '/statistics/overview',
        name: 'Overview',
        component: () => import('@/views/statistics/index'),
        meta: { activeMenu: '/statistics' }
      }
    ]
  },
  {
    path: '/login',
    meta: { navbar: false },
    component: () => import('@/views/user/login/index'),
    hidden: true
  },
  {
    path: '/register',
    meta: { navbar: false },
    component: () => import('@/views/user/register/index'),
    hidden: true
  },
  {
    path: '/reset',
    meta: { navbar: false },
    component: () => import('@/views/user/reset/index'),
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
