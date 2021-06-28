import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },

  // Application flow builder
  {
    path: '/page_flow_builder/:id',
    component: () => import('layouts/PageFlowBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PageFlowBuilder.vue') }
    ]
  },


/*
  // Route to create forms
  {
    path: '/page_builder',
    component: () => import('layouts/PageBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageBuilder.vue') }
    ]
  },

  // TODO: Currently only used for debugging forms
  {
    path: '/ui_form',
    component: () => import('layouts/UiFormLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiForm.vue') }
    ]
  },

  {
    path: '/ui_builder',
    component: () => import('src/layouts/UiBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiBuilder.vue') }
    ]
  },

  // Application flow builder
  {
    path: '/page_flow_builder/:id',
    component: () => import('layouts/PageFlowBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PageFlowBuilder.vue') }
    ]
  },
*/
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
