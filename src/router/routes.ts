import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('src/layouts/UiBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiBuilder.vue') }
    ]
  },
]

export default routes
