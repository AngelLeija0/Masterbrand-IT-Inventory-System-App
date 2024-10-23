<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-10">
      <q-toolbar class="q-ma-sm q-mx-md flex justify-between">
        <img src="../assets/masterbrand-logo.webp" style="max-height: 30px; max-width: 70%" />
        <div v-if="!isMobile">
          <q-btn :icon="quantityNotifications ? 'notifications' : 'notifications_none'" round class="q-mx-md" flat
            style="border-radius: 20px;" @click="getAllNotifications()">
            <q-badge v-if="quantityNotifications" color="red" floating>
              {{ quantityNotifications }}
            </q-badge>
            <q-menu style="width: 400px; overflow-y: auto;">
              <div class="q-px-lg q-py-md text-h6" style="border-bottom: 1px solid rgb(239, 239, 239);">Notificaciones
              </div>
              <q-list v-for="(notification, i) in notifications" :key="i + 1">
                <q-item class="q-pa-lg flex justify-center items-center" clickable
                  @click="markNotification(notification._id)" style="border-bottom: 1px solid rgb(239, 239, 239);">
                  <q-icon :name="notification.icon" size="36px"
                    :style="{ color: defineImportanceColor(notification.importance) }" />
                  <div class="q-mx-md">
                    <q-item-label
                      :style="{ fontWeight: 500, fontSize: '15px', color: defineImportanceColor(notification.importance) }">{{
                        notification.name }}</q-item-label>
                    <div class="full-width q-pt-xs text-grey-14" style="font-size: 11px;">{{
                      formatDate(notification.created_at)
                    }}</div>
                    <div class="full-width q-pt-sm" style="font-size: 13px;">{{ notification.description }}</div>
                  </div>
                  <q-btn icon="close" size="12px" flat round dense />
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <LogoutButton class="q-mr-lg" :label="getNameUserStore()" @click="logout()" />
        </div>
        <div v-if="isMobile" class="q-mr-md">
          <div>
            <q-btn class="q-mx-xs" icon="menu" size="13px" flat rounded @click="menuState = true" />
          </div>
          <q-dialog v-model="menuState" class="menu-bar" position="left" transition-show="slide-right"
            transition-hide="slide-left" maximized>
            <div class="bg-grey-10">
              <div class="flex justify-between q-ma-sm">
                <q-btn :icon="quantityNotifications ? 'notifications' : 'notifications_none'" round class="q-mx-lg"
                  style="border-radius: 20px; color: white;" @click="getAllNotifications()">
                  <q-badge v-if="quantityNotifications" color="red" floating>
                    {{ quantityNotifications }}
                  </q-badge>
                  <q-menu style="width: 400px; max-height: 72vh; overflow-y: auto;">
                    <div class="q-px-lg q-py-md text-h6" style="border-bottom: 1px solid rgb(239, 239, 239);">
                      Notificaciones
                    </div>
                    <q-list v-for="(notification, i) in notifications" :key="i + 1">
                      <q-item class="q-pa-lg flex justify-center items-center" clickable
                        @click="markNotification(notification._id)" style="border-bottom: 1px solid rgb(239, 239, 239);">
                        <q-icon :name="notification.icon" size="36px"
                          :style="{ color: defineImportanceColor(notification.importance) }" />
                        <div class="q-mx-md">
                          <q-item-label
                            :style="{ fontWeight: 500, fontSize: '15px', color: defineImportanceColor(notification.importance) }">{{
                              notification.name }}</q-item-label>
                          <div class="full-width q-pt-xs text-grey-14" style="font-size: 11px;">{{
                            formatDate(notification.created_at)
                          }}</div>
                          <div class="full-width q-pt-sm" style="font-size: 13px;">{{ notification.description }}</div>
                        </div>
                        <q-btn icon="close" size="12px" flat round dense />
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn icon="close" size="14px" class="q-pa-sm" color="white" flat round @click="menuState = false" />
              </div>
              <q-list class="q-px-lg q-py-sm">
                <NavbarButton label="Inicio" icon="home" toPage="home-page" />
              </q-list>
              <q-list v-if="typeUser != 'superadmin'" class="q-px-lg q-py-sm">
                <NavbarButton label="Inventario" icon="inventory" toPage="assets-page" />
              </q-list>
              <q-list v-if="typeUser != 'superadmin'" class="q-px-lg q-py-sm">
                <NavbarButton label="Toners" icon="inventory" toPage="toners-page" />
              </q-list>
              <q-list v-if="typeUser == 'superadmin'" class="q-px-lg q-py-sm">
                <NavbarButton label="Categorias" icon="bookmark" toPage="categories-page" />
              </q-list>
              <q-list v-if="typeUser == 'superadmin'" class="q-px-lg q-py-sm">
                <NavbarButton label="Ubicaciones" icon="place" toPage="locations-page" />
              </q-list>
              <q-list v-if="typeUser != 'superadmin'" class="q-px-lg q-py-sm">
                <NavbarButton label="Archivos" icon="place" toPage="files-page" />
              </q-list>
              <q-list v-if="typeUser != 'superadmin'" class="q-px-lg q-py-sm">
                <NavbarButtonDropdown label="Herramientas" icon="hardware" flat />
              </q-list>
              <q-list class="q-px-lg q-py-sm flex justify-center" style="margin-top: 42vh;">
                <q-btn label="Cerrar sesion" icon="logout" size="0.9rem" color="grey-4" class="q-mx-xs q-px-lg" flat
                  style="text-transform: none" @click="logout()" />
              </q-list>
            </div>
          </q-dialog>
        </div>
      </q-toolbar>
      <q-toolbar v-if="!isMobile" class="justify-center q-px-md" inset>
        <q-btn-group flat>
          <NavbarButton label="Inicio" toPage="home-page" />
          <NavbarButton v-if="typeUser != 'superadmin'" label="Inventario" toPage="assets-page" />
          <NavbarButton v-if="typeUser != 'superadmin'" label="Toners" toPage="toners-page" />
          <NavbarButton v-if="typeUser != 'superadmin'" label="Archivos" toPage="files-page" />
          <NavbarButton v-if="typeUser == 'superadmin'" label="Categorias" toPage="categories-page" />
          <NavbarButton v-if="typeUser == 'superadmin'" label="Ubicaciones" toPage="locations-page" />
          <NavbarButtonDropdown v-if="typeUser != 'superadmin'" label="Herramientas" />
        </q-btn-group>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-10" style="height: 100vh;">
      <router-view @updateNotifications="handleEventUpdateNotifications"
        :class="isMobile ? 'bg-white q-mb-md q-mx-xs' : 'bg-white q-mb-md q-mx-md'"
        style="min-height: 98%; height: 98%; border-radius: 15px;" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { date } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from "../stores/user-store"
import { useNotificationStore } from "../stores/notification-store"
import { api } from 'src/boot/axios'

import NavbarButton from 'src/components/NavbarButton.vue'
import NavbarButtonDropdown from 'src/components/NavbarButtonDropdown.vue'
import LogoutButton from 'src/components/LogoutButton.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    NavbarButton,
    NavbarButtonDropdown,
    LogoutButton,
  },
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()

    const userStore = useUserStore()
    const typeUser = userStore.getUser.type

    const isMobile = ref(isUsingMobile())

    function isUsingMobile() {
      const validation1 =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      const validation2 = window.innerWidth < 768
      const finalValidation = validation1 || validation2
      return finalValidation
    }

    window.addEventListener('resize', () => {
      isMobile.value = isUsingMobile()
    })

    const menuState = ref(false)

    const notificationStore = useNotificationStore()
    const quantityNotifications = ref(0)

    const notifications = ref([])

    getAllNotifications()
    function getAllNotifications() {
      if (notificationStore.getNotification) {
        notificationStore.clearNotification()
      }
      const user = userStore.getUser
      api
        .get(`./notifications/unreaded/${user.id}`)
        .then((res) => {
          const data = res.data
          notificationStore.setNotification(data)
          notifications.value = data
          quantityNotifications.value = data.length
        })
        .catch((err) => {
          console.log(err)
        })
    }

    onMounted(() => {
      window.localStorage.setItem("welcome-message", true)
    })

    return {
      isMobile,
      menuState,
      userStore,
      router,
      route,
      getAllNotifications,
      notifications,
      quantityNotifications,
      notificationStore,
      typeUser,
    }
  },
  methods: {
    handleEventUpdateNotifications() {
      setTimeout(() => {
        if (this.notificationStore.getNotification) {
          this.notificationStore.clearNotification()
        }
        const user = this.userStore.getUser
        api
          .get(`./notifications/unreaded/${user.id}`)
          .then((res) => {
            const data = res.data
            this.notificationStore.setNotification(data)
            this.notifications = data
            this.quantityNotifications = data.length
          })
          .catch((err) => {
            console.log(err)
          })
      }, 1000)
    },
    getNameUserStore() {
      return this.userStore.getUser.username ? this.userStore.getUser.username : 'Undefinido'
    },
    logout() {
      this.userStore.clearUser
      this.$q.notify({
        spinner: true,
        message: 'Cerrando sesion',
        timeout: 500,
        onDismiss: () => this.router.push({ name: 'login-page' })
      })
      window.localStorage.clear("welcome-message")
    },
    defineImportanceColor(importance) {
      if (importance === "high") {
        return "red"
      }
      if (importance === "medium") {
        return "#F2C037"
      }
      if (importance === "normal") {
        return "black" // Secondary: #26A69A
      }
      return "black"
    },
    markNotification(id) {
      api
        .post(`./notifications/mark/${id}`, {
          administrator: this.userStore.getUser.id
        })
        .then((res) => {
          const data = res.data
          if (data.message === "Correctly done") {
            this.getAllNotifications()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    formatDate(dateToFormat) {
      return date.formatDate(dateToFormat, 'DD/MMMM/YYYY - HH:mm', {
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      })
    }
  }
});
</script>

<style>
html,
body {
  overflow: hidden;
}

.q-dialog__backdrop {
  backdrop-filter: blur(1px);
}

.q-menu {
  max-height: 72vh !important;
}
</style>
