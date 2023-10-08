import { createRouter, createWebHashHistory } from "vue-router";
import i18n from "@/locales/index";
import Layout from "@/layout";

export const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Layout,
  //   redirect: '/home',
  //   meta: { navbar: true, title: i18n.global.t('Navbar._home') },
  //   children: [
  //     {
  //       path: 'home',
  //       name: 'Home',
  //       component: () => import('@/views/home/index'),
  //       meta: { }
  //     }
  //   ]
  // },
  {
    path: '/',
    name: 'Design',
    redirect: '/design',
    component: Layout,
    meta: { navbar: true, title: i18n.global.t('Navbar._design') },
    children: [
      {
        path: 'design',
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
    meta: { navbar: true, title: i18n.global.t('Navbar._build') },
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
            meta: { sidebar: true, title: i18n.global.t('BuildNavBar._record'), icon: 'record', activeMenu: '/build', secondActiveMenu: '/build/record/list' }
          },
          {
            path: '/build/quick/start',
            name: 'QuickBuild',
            component: () => import('@/views/build/components/QuickBuild'),
            meta: { sidebar: true, title: i18n.global.t('BuildNavBar._quick'), icon: 'quick-build', activeMenu: '/build', secondActiveMenu: '/build/quick/start' }
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
    meta: { navbar: true, title: i18n.global.t('Navbar._setting') },
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
            meta: { sidebar: true, title: i18n.global.t('SettingNavBar._variable'), icon: 'setting-variable', activeMenu: '/setting', secondActiveMenu: '/setting/variable' }
          },
          {
            path: '/setting/notice',
            name: 'Notice',
            component: () => import('@/views/setting/notice/index'),
            meta: { sidebar: true, title: i18n.global.t('SettingNavBar._notice'), icon: 'setting-notice', activeMenu: '/setting', secondActiveMenu: '/setting/notice' }
          },
          {
            path: '/setting/project',
            name: 'Project',
            component: () => import('@/views/setting/project/index'),
            meta: { sidebar: true, title: i18n.global.t('SettingNavBar._project'), icon: 'setting-project', activeMenu: '/setting', secondActiveMenu: '/setting/project' }
          }
        ]
      },
    ]
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Layout,
    meta: { navbar: true, title: i18n.global.t('Navbar._statistics') },
    children: [
      {
        path: 'index',
        name: 'Statistics',
        component: () => import('@/views/statistics/index'),
        meta: { }
      }
    ]
  },
  {
    path: '/login',
    meta: { navbar: false },
    component: () => import('@/views/user/login/index'),
  },
  {
    path: '/register',
    meta: { navbar: false },
    component: () => import('@/views/user/register/index')
  },
  {
    path: '/reset',
    meta: { navbar: false },
    component: () => import('@/views/user/reset/index')
  },
  {
    path: '/404',
    meta: { navbar: false },
    component: () => import('@/views/error/404'),
  },
  {
    path: '/401',
    meta: { navbar: false },
    component: () => import('@/views/error/401'),
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
