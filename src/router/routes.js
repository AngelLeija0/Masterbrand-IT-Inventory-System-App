import { useUserStore } from 'src/stores/user-store'

function verifyLogin (to, from, next) {
  const userStore = useUserStore()
  if (!userStore.getUser) {
    return next({ name: 'login-page' })
  }

  if (userStore.getUser.type === "superadmin" && to.path !== "/admins"){
    return next({ name: 'admins-page' })
  }

  next()
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'home-page',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: [verifyLogin]
      },
      {
        path: '/admins',
        name: 'admins-page',
        component: () => import('pages/AdminsPage.vue'),
        beforeEnter: [verifyLogin]
      },
      {
        path: 'inventario',
        name: 'assets-page',
        component: () => import('pages/AssetsPage.vue'),
        beforeEnter: [verifyLogin]
      },
      {
        path: 'inventario/:id',
        name: 'asset-details-page',
        component: () => import('pages/AssetDetailsPage.vue'),
        beforeEnter: [verifyLogin]
      },
      {
        path: 'categorias',
        name: 'categories-page',
        component: () => import('pages/CategoriesPage.vue'),
        beforeEnter: [verifyLogin]
      },
      {
        path: 'ubicaciones',
        name: 'locations-page',
        component: () => import('pages/LocationsPage.vue'),
        beforeEnter: [verifyLogin]
      },
      {
        path: 'tarjetas',
        name: 'cards-page',
        component: () => import('pages/CardsPage.vue'),
        beforeEnter: [verifyLogin]
      }
    ]
  },
  {
    path: '/login',
    name: 'login-page',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
