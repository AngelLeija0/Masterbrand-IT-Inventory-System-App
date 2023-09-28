const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home-page',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'inventario',
        name: 'assets-page',
        component: () => import('pages/AssetsPage.vue')
      },
      {
        path: 'inventario/:id',
        name: 'asset-details-page',
        component: () => import('pages/AssetDetailsPage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes