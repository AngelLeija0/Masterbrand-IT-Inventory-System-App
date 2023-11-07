const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login-page',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: '/',
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
      {
        path: 'categorias',
        name: 'categories-page',
        component: () => import('pages/CategoriesPage.vue')
      },
      {
        path: 'ubicaciones',
        name: 'locations-page',
        component: () => import('pages/LocationsPage.vue')
      },
      {
        path: 'tarjetas',
        name: 'cards-page',
        component: () => import('pages/CardsPage.vue')
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
