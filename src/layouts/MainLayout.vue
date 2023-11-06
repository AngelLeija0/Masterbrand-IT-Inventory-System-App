<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-10">
      <q-toolbar class="q-ma-sm q-ml-md flex justify-between">
        <img src="../assets/masterbrand-logo.webp" style="max-height: 30px; max-width: 70%" />
        <div v-if="isMobile" class="q-mr-md">
          <q-btn class="q-mx-xs" icon="menu" size="13px" flat rounded @click="menuState = true" />
          <q-dialog v-model="menuState" class="menu-bar" position="left" transition-show="slide-right"
            transition-hide="slide-left" maximized>
            <div class="bg-grey-10">
              <div class="flex justify-end">
                <q-btn icon="close" size="14px" class="q-pa-md" color="white" flat round @click="menuState = false" />
              </div>
              <q-list class="q-pa-sm">
                <NavbarButton label="Inicio" icon="home" toPage="home-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButton label="Inventario" icon="inventory" toPage="assets-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButton label="Categorias" icon="bookmark" toPage="categories-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButton label="Ubicaciones" icon="place" toPage="locations-page" />
              </q-list>
              <q-list class="q-pa-sm">
                <NavbarButtonDropdown label="Herramientas" icon="hardware" flat />
              </q-list>
              <q-list class="q-pa-sm" style="margin-top: 42vh;">
                <q-btn label="Cerrar sesion" icon="logout" size="0.9rem" color="grey-4" class="q-mx-xs q-px-lg" flat
                  style="text-transform: none" />
              </q-list>
            </div>
          </q-dialog>
        </div>
      </q-toolbar>
      <q-toolbar v-if="!isMobile" class="justify-center" inset>
        <q-btn-group>
          <NavbarButton label="Inicio" toPage="home-page" />
          <NavbarButton label="Inventario" toPage="assets-page" />
          <NavbarButton label="Categorias" toPage="categories-page" />
          <NavbarButton label="Ubicaciones" toPage="locations-page" />
          <NavbarButtonDropdown label="Herramientas" />
        </q-btn-group>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-10" style="height: 100vh;">
      <router-view class="bg-white q-ml-md q-mr-md q-mb-md" style="min-height: 98%; border-radius: 15px;" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import NavbarButton from 'src/components/NavbarButton.vue'
import NavbarButtonDropdown from 'src/components/NavbarButtonDropdown.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    NavbarButton,
    NavbarButtonDropdown
  },
  setup() {
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

    const menuState = ref(false)

    const route = useRoute()

    window.addEventListener('resize', () => {
      isMobile.value = isUsingMobile()
    })

    watch(
      () => route.name,
      newValue => {
        menuState.value = false
      }
    )

    return {
      isMobile,
      menuState
    }
  }
})
</script>

<style>
html, body {
  overflow: hidden;
}

.q-dialog__backdrop {
  backdrop-filter: blur(1px);
}
</style>
