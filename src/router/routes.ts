import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },

  {
    path: '/page_builder',
    component: () => import('layouts/PageBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageBuilder.vue') }
    ]
  },

  {
    path: '/ui_builder',
    component: () => import('layouts/UiBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiBuilder.vue') }
    ]
  },

  {
    path: '/ui_form',
    component: () => import('layouts/UiFormLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiBuilder.vue') }
    ]
  },

  {
    path: '/router/:id',
    component: () => import('layouts/RouterLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RouterBuilder.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
